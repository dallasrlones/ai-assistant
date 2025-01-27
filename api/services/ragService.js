const { ChromaClient } = require('chromadb');
const { pipeline } = require('@xenova/transformers');

class RAGService {
    constructor() {
        this.client = new ChromaClient({ path: 'http://chromadb:8000' });
        this.embeddingPipeline = null;
        this.collectionName = 'knowledge_base';
    }

    async initialize() {
        console.log('Loading embedding model...');
        this.embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        console.log('Embedding model loaded!');
    }

    async getCollection() {
        return await this.client.getOrCreateCollection(this.collectionName);
    }

    async generateEmbedding(text) {
        if (!this.embeddingPipeline) {
            throw new Error('Embedding model not initialized. Call initialize() first.');
        }
        const embeddings = await this.embeddingPipeline(text, { pooling: 'mean', normalize: true });
        return embeddings.data;
    }

    async ingestDocuments(documents) {
        if (!Array.isArray(documents)) {
            throw new Error('Invalid input. Expected an array of documents.');
        }

        const collection = await this.getCollection();

        for (const doc of documents) {
            const embedding = await this.generateEmbedding(doc.content);
            await collection.add({
                ids: [doc.id],
                documents: [doc.content],
                metadatas: [{ content: doc.content }],
                embeddings: [embedding],
            });
        }

        return { success: true, message: 'Documents ingested successfully.' };
    }

    async retrieveRelevantDocuments(query, topK = 3) {
        if (!query) {
            throw new Error('Query is required.');
        }

        const collection = await this.getCollection();
        const queryEmbedding = await this.generateEmbedding(query);

        const results = await collection.query({
            query_embeddings: [queryEmbedding],
            n_results: topK,
        });

        return results.documents.flat();
    }

    async buildRagQuery(prompt) {
        if (!prompt) {
            throw new Error('Prompt is required.');
        }

        // Retrieve relevant documents
        const retrievedDocs = await this.retrieveRelevantDocuments(prompt);

        // Build RAG-enhanced prompt
        const ragPrompt = `Context:\n${retrievedDocs.join('\n')}\n\nQuestion: ${prompt}\nAnswer:`;

        return ragPrompt;
    }
}

module.exports = RAGService;
