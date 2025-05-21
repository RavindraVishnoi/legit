"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { SendHorizonal, Loader2, Plus, Mic } from 'lucide-react'; // Added Plus and Mic
import { useRef, useState } from 'react';
import { summarizeLegalDocument } from '@/ai/flows/summarize-legal-document';

const chatInputSchema = z.object({
  query: z.string().min(1, "Query cannot be empty.").max(2000, "Query is too long."),
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
    },
  });

  const onSubmit: SubmitHandler<ChatInputFormValues> = (data) => {
    if (data.query.trim()) {
      onSendMessage(data.query);
      form.reset();
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
    if (!file) return;
    setSelectedFile(file);
  };

  const handleSummarize = async (instructions: string) => {
    if (!selectedFile || !instructions.trim()) return;
    setIsSummarizing(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      onSendMessage('Summarizing document...');
      const result = await summarizeLegalDocument({ documentDataUri: base64, query: instructions });
      onSendMessage(result.summary);
      setSelectedFile(null);
      setIsSummarizing(false);
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full max-w-3xl mx-auto items-end gap-2 rounded-xl border border-border bg-card p-2.5 shadow-lg"
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground flex-shrink-0 h-9 w-9"
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || isSummarizing}
        >
          <Plus className="h-5 w-5" />
        </Button>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
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
          disabled={isLoading || !form.watch('query')?.trim() || isSummarizing}
          aria-label="Send legal query"
          className="flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-9 w-9"
        >
          {isLoading || isSummarizing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <SendHorizonal className="h-5 w-5" />
          )}
        </Button>
      </form>
      {selectedFile && (
        <div className="mt-2 flex flex-col gap-2 bg-muted p-3 rounded-lg">
          <span className="text-xs text-muted-foreground">Document: {selectedFile.name}</span>
          <Textarea
            placeholder="Enter instructions or questions for the summary..."
            className="text-sm"
            rows={2}
            disabled={isSummarizing}
            onBlur={e => handleSummarize(e.target.value)}
          />
          <Button
            onClick={() => {
              const textarea = document.querySelector('.summarizer-instructions') as HTMLTextAreaElement;
              if (textarea) handleSummarize(textarea.value);
            }}
            disabled={isSummarizing}
            className="w-full"
          >
            {isSummarizing ? 'Summarizing...' : 'Summarize'}
          </Button>
        </div>
      )}
    </Form>
  );
}
