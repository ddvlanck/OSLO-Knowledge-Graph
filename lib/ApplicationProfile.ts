import {Document} from "./Document";
import {APTerm, ITerm, PropertyTerm, TermType} from "./Term";
import * as fetch from 'node-fetch';
import {ElasticsearchDAO} from "./ElasticsearchDAO";


export class ApplicationProfile implements Document {

    private readonly classes: Array<ITerm>;
    private name: string;

    constructor() {
        this.classes = new Array<ITerm>();
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

    async createDocument(url: string) {
        const data = await fetch(url).then(response => response.json());
        this.parseData(data);
    }

    async insertIntoElastic(client: ElasticsearchDAO){
        await client.pushData(this.classes, 'application_profiles', 'classes');
        console.log('[ApplicationProfile]: added terminology of ' + this.name + ' to Elasticsearch\n');
    }

    async updateElastic(client: ElasticsearchDAO){
        await client.updateApplicationProfile(this.classes);
        console.log('[ApplicationProfile]: updated terminology of ' + this.name + ' to Elasticsearch\n');
    }

    private parseData(data: any) {
        this.name = data.metadata.uri;
        const baseURI = data.metadata.navigation.self;

        for (let object of data.classes) {
            let properties = new Array<ITerm>();

            for (let property of object.properties) {
                if (property.name['nl']) {
                    properties.push(new PropertyTerm({
                        prefLabel: property.name['nl'],
                        URI: property.uri,
                        definition: property.description['nl'],
                        context: this.name,
                        fragmentIdentifier: baseURI + '#' + object.name['nl'].split(' ').join('%20') + '%3A' + property.name['nl'].split(' ').join('%20')
                    }))
                }

            }

            this.classes.push(new APTerm({
                prefLabel: object.name['nl'],
                URI: object.uri,
                definition: object.description['nl'],
                properties: properties,
                context: this.name,
                fragmentIdentifier: baseURI + '#' + object.name['nl'].split(' ').join('%20')
            }))

        }
    }
}
