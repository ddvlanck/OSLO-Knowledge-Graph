import {VocabularyTerm} from "./Term";
import {Document} from "./Document";

import * as fetch from 'node-fetch';
import {ElasticsearchDAO} from "./ElasticsearchDAO";

export class Vocabulary implements Document {

    private readonly terms: Array<VocabularyTerm>;
    private name: string;

    constructor() {
        this.terms = new Array<VocabularyTerm>();
    }

    async createDocuments(files: Array<string>, isUpdate: boolean) {
        for(let file of files){
            await this.createDocument(file);
            const elasticClient = new ElasticsearchDAO();
            if(isUpdate){
                this.updateElastic(elasticClient);
            } else {
                this.insertIntoElastic(elasticClient);
            }
        }
    }

    async createDocument(filename: string) {
        const data = await fetch(filename).then(response => response.json());
        this.parseData(data);

    }

    async insertIntoElastic(client: ElasticsearchDAO){
        await client.pushData(this.terms, 'terminology', 'vocabularies');
        console.log('[Vocabulary]: added terminology of ' + this.name + ' to Elasticsearch\n');
    }

    async updateElastic(client: ElasticsearchDAO){
        await client.updateVocabulary(this.terms);
        console.log('[Vocabulary]: updated terminology of ' + this.name + ' to Elasticsearch\n');
    }

    private parseData(data: any) {
        // Get the name of the vocabulary (URI)
        this.name = data.metadata.uri;

        // Get classes and properties from the vocabulary
        for(let object of data.classes){
            this.terms.push(new VocabularyTerm({
                prefLabel: object.name['nl'],
                URI: object.uri,
                definition: object.description['nl'],
                context: this.name
            }));
        }

        for(let object of data.properties){
            this.terms.push(new VocabularyTerm({
                prefLabel: object.name['nl'],
                URI: object.uri,
                definition: object.description['nl'],
                context: this.name
            }));
        }
    }




}
