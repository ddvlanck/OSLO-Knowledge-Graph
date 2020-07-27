import {VocabularyTerm} from "./Term";
import {IStoreObject} from "./IStoreObject";
const Utils = require('../Utils.js');

import * as fetch from 'node-fetch';
import {ElasticsearchDAO} from "./ElasticsearchDAO";

export class VocabularyObject implements IStoreObject {

    private readonly terms: Array<VocabularyTerm>;
    private name: string;

    constructor() {
        this.terms = new Array<VocabularyTerm>();
    }

    async createStoreObject(filename: string) {
        const data = await fetch(filename).then(response => response.json());
        this.parseData(data);

        //send data to Elasticsearch
        const elasticClient = new ElasticsearchDAO();
        await elasticClient.pushData(this.terms, 'terminology', 'vocabularies');

        const log = '[' + Date() + '] - Added terminology of ' + this.name + ' to Elasticsearch\n';

        await Utils.appendToFile('../logfile.txt', log);

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
