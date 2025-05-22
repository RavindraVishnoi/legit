"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { SendHorizonal, Loader2, Plus, Mic } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRef, useState } from 'react';
import { summarizeLegalDocument } from '@/ai/flows/summarize-legal-document';

const chatInputSchema = z.object({
  query: z.string().min(1, "Query cannot be empty.").max(2000, "Query is too long."),
  summarizerInstructions: z.string().optional(),
});

type ChatInputFormValues = z.infer<typeof chatInputSchema>;

interface ChatInputProps {
  onSendMessage: (query: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const form = useForm<ChatInputFormValues>({
    resolver: zodResolver(chatInputSchema),
    defaultValues: {
      query: '',
      summarizerInstructions: '',
    },
  });

  const onSubmit: SubmitHandler<ChatInputFormValues> = (data) => {
    if (data.query.trim()) {
      onSendMessage(data.query);
      form.reset();
      setSelectedFile(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !isLoading) {
      event.preventDefault();
      if (form.getValues("query").trim()) {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      form.setValue("summarizerInstructions", "");
      return;
    }
    setSelectedFile(file);
  };

  const handleSummarize = async () => {
    const instructions = form.getValues("summarizerInstructions") || "";
    if (!selectedFile || !instructions.trim()) {
      if (!instructions.trim() && selectedFile) {
        form.setError("summarizerInstructions", { type: "manual", message: "Please provide instructions for the summary." });
      }
      return;
    }
    setIsSummarizing(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      onSendMessage('Summarizing document: ' + selectedFile.name);
      try {
        const result = await summarizeLegalDocument({ documentDataUri: base64, query: instructions });
        onSendMessage(result.summary);
      } catch (error) {
        console.error("Error during summarization:", error);
        onSendMessage("Sorry, I couldn't summarize the document. Please try again.");
      } finally {
        setSelectedFile(null);
        form.resetField("summarizerInstructions");
        form.resetField("query");
        setIsSummarizing(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.onerror = () => {
      console.error("Error reading file.");
      onSendMessage("Sorry, there was an error reading the file.");
      setIsSummarizing(false);
    }
    reader.readAsDataURL(selectedFile);
  };

  return (
    <TooltipProvider>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full max-w-3xl mx-auto items-end gap-2 rounded-xl border border-border bg-card p-2.5 shadow-lg"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground flex-shrink-0 h-9 w-9"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || isSummarizing}
                aria-label="Add document"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add document</p>
            </TooltipContent>
          </Tooltip>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={isSummarizing}
          />
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Ask LEGIT..."
                    rows={1}
                    className="min-h-[40px] max-h-[150px] resize-none border-0 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none p-2 text-base"
                    onKeyDown={handleKeyDown}
                    disabled={isLoading || isSummarizing}
                    aria-label="Ask LEGIT"
                  />
                </FormControl>
                <FormMessage className="pl-2" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !form.watch('query')?.trim() || isSummarizing || !!selectedFile}
            aria-label="Send legal query"
            className="flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-9 w-9"
          >
            {isLoading && !isSummarizing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <SendHorizonal className="h-5 w-5" />
            )}
          </Button>
        </form>
        {selectedFile && (
          <div className="mt-4 flex flex-col gap-3 bg-muted/50 p-4 rounded-lg border border-border shadow-sm w-full max-w-3xl mx-auto">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-foreground">
                Selected: <span className="text-primary">{selectedFile.name}</span>
              </p>
              <Button variant="ghost" size="sm" onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; form.resetField("summarizerInstructions"); }} disabled={isSummarizing}>
                Clear
              </Button>
            </div>
            <FormField
              control={form.control}
              name="summarizerInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter instructions or questions for the document (e.g., 'Summarize the key arguments', 'What are the main legal points concerning X?'). Press Enter in this box or click Summarize."
                      className="text-sm min-h-[60px] focus-visible:ring-1 focus-visible:ring-ring"
                      rows={3}
                      disabled={isSummarizing}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (form.getValues("summarizerInstructions")?.trim()) {
                            handleSummarize();
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              onClick={handleSummarize}
              disabled={isSummarizing || !form.watch("summarizerInstructions")?.trim()}
              className="w-full"
            >
              {isSummarizing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                'Summarize Document'
              )}
            </Button>
          </div>
        )}
      </Form>
    </TooltipProvider>
  );
}
