# Legal Documents

This folder is intended to store PDF files related to legal cases. These files will be processed and used in the Retrieval-Augmented Generation (RAG) pipeline to provide context-aware responses in the chat application.

## Instructions
- Place all relevant legal case PDFs in this folder.
- Ensure the files are named appropriately for easy identification.

## Next Steps
1. Implement a script to extract text from these PDFs.
2. Generate embeddings for the extracted text using a pre-trained model.
3. Store the embeddings in a vector database for efficient retrieval.
4. Update the `legalQuery` function to include retrieval logic.
