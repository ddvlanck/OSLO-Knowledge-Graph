import {VocabularyTerm} from "./Term";
import {IStoreObject} from "./IStoreObject";

import * as fetch from 'node-fetch';
import {ElasticsearchDAO} from "./ElasticsearchDAO";

export interface IVocabularySettings {
    file: string
}

export class VocabularyObject implements IStoreObject {

    private terms: Array<VocabularyTerm>;
    private name: string;
    file: string;

    constructor(settings: IVocabularySettings) {
        this.terms = new Array<VocabularyTerm>();
        this.file = settings.file;
    }

    async createStoreObject() {
        const data = await fetch(this.file).then(response => response.json());
        this.parseData(data);

        //send data to Elasticsearch
        const elasticClient = new ElasticsearchDAO();
        elasticClient.pushData(this.terms, 'terminology', 'vocabularies');
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
