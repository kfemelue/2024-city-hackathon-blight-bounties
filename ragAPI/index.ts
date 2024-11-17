import { JsonLoader, RAGApplicationBuilder } from '@llm-tools/embedjs';
import { Ollama, OllamaEmbeddings } from '@llm-tools/embedjs-ollama';
import { WebLoader } from '@llm-tools/embedjs-loader-web';
import { PdfLoader } from '@llm-tools/embedjs-loader-pdf';
import { CsvLoader } from '@llm-tools/embedjs-loader-csv';
import { MongoDb } from '@llm-tools/embedjs-mongodb';
import { SitemapLoader } from '@llm-tools/embedjs-loader-sitemap';


import express, { Request, Response} from "express";
import CORS from "cors";

import { MongoClient } from 'mongodb';

import dotenv from 'dotenv';

dotenv.config();

const dbuser = process.env.dbUsername;
const dbpwd = process.env.dbPwd;
const dbconn = process.env.dbConnection || "";

// console.log(`debug\n${dbuser}\n${dbpwd}\n${dbconn}`);

const app = express();

const port = 8080;

app.use(express.json());
app.use(CORS());

const ragApplication = await new RAGApplicationBuilder()
.setModel(new Ollama({ modelName: "llama3.2", baseUrl: 'http://localhost:11434' }))
.setEmbeddingModel(new OllamaEmbeddings({ model: 'nomic-embed-text', baseUrl: 'http://localhost:11434' }))
.setVectorDatabase(new MongoDb({
    connectionString: `mongodb+srv://${dbuser}:${dbpwd}@cluster0.zep0qmk.mongodb.net/BlightBounties`,
}))
.build();

const Loaders = { 
    'pdf': [PdfLoader, 'filePathOrUrl'],
    'web': [WebLoader, 'urlOrContent'],
    'csv': [CsvLoader, 'filePathOrUrl'],
    'sitemap': [SitemapLoader, 'url']
}
const contentName = {

}
// let pdf = await ragApplication.addLoader(new PdfLoader({ filePathOrUrl: 'https://bitcoin.org/bitcoin.pdf' }))
// let web = await ragApplication.addLoader(new WebLoader({ urlOrContent: 'https://bitcoin.org/bitcoin.pdf' }))
// let csv = await ragApplication.addLoader(new CsvLoader({ filePathOrUrl: './Service_Requests_since_2016_20241116.csv' }))

const greetings = "Hello via Bun!";

console.log(greetings);

app.get("/", async (req: Request, res: Response) => {
    res.send(greetings);
  });

app.post('/ask', async (req: Request, res: Response) => {
    console.log(req.body);
    req.body.sources.forEach(async (source: { type: string, link: string; }) => {
        if (source.type == 'pdf') {
            await ragApplication.addLoader(new PdfLoader({ filePathOrUrl: source.link }))
            
        } else if (source.type == 'web') {
            await ragApplication.addLoader(new WebLoader({ urlOrContent: source.link }))

        } else if (source.type == 'csv') {
            await ragApplication.addLoader(new CsvLoader({ filePathOrUrl: source.link }))
        } else if (source.type == 'json') {
            let client = new MongoClient(dbconn);
            await client.connect();
            console.log('Connected successfully to server');
            const db = client.db('BlightBounties');
            const collection = db.collection('blight');
            const results = await collection.aggregate([{$sort: { CREATION_DATE: -1 }}]).limit(20).toArray();
            await ragApplication.addLoader(new JsonLoader({object: results}));
            console.log('resource loaded: ');
            console.log(results);
        } else if (source.type == 'sitemap') {
            await ragApplication.addLoader(new SitemapLoader({url: source.link}));
        }
    });
    const result = await ragApplication.query(req.body.query);

    res.send(result);
})
  
  app.listen(port, () => {
    console.log(`Listening @ http://localhost:8080 ...`);
  });