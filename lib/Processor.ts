import {Elastic} from "./Elastic";
import {Vocabulary} from "./Vocabulary";
import {ApplicationProfile} from "./ApplicationProfile";
const config = require('../config.json');

const fetch = require('node-fetch')

export class Processor {

    private readonly files: Array<string>;
    private elastic: Elastic;
    private filesWithError: Array<string>;
    private isUpdate: boolean;

    constructor(files: Array<string>, type: string, isUpdate) {
        this.files = files;
        this.elastic = new Elastic();
        this.filesWithError = new Array<string>();
        this.isUpdate = isUpdate
        this.processFiles(type);
    }

    processFiles(type: string){
        for(let file of this.files){
            this.fetchData(file).then( response => {
                type === config.VOCABULARY_INDEX ? this.createVocabularyDocument(response) : this.createApplicationProfileDocument(response);
            }).catch( err => {
                console.log(err);
                this.filesWithError.push(file);
                console.log(`\x1b[31m%s\x1b[0m`, `[Processor]: ${file} will not be added to Elasticsearch due to the error above.`);
            })
        }
        //this.printSummary();
    }

    createVocabularyDocument(data){
        const document = Vocabulary.createDocument(data);
        this.isUpdate === true ? this.elastic.updateData(document, config.VOCABULARY_INDEX) : this.elastic.indexData(document, config.VOCABULARY_INDEX);
    }

    createApplicationProfileDocument(data){
        const document = ApplicationProfile.createDocument(data);
        this.isUpdate === true ? this.elastic.updateData(document, config.APPLICATION_PROFILE_INDEX) : this.elastic.indexData(document, config.APPLICATION_PROFILE_INDEX);
    }

    printSummary(){
        console.log(`These files were not processed due to an error:`);
        for(let file of this.filesWithError){
            console.log(`\t- ${file}`);
        }
    }

    async fetchData(url: string){
        return new Promise( (resolve, reject) => {
            fetch(url)
                .then( response => {
                    if(!response.ok){
                        throw new Error(`[Processor]: an error occurred while fetching ${url}. Please check if this is a valid file.`);
                    }
                    return response.json();
                })
                .then( data => resolve(data))
                .catch( err => reject(err));
        })
    }
}
