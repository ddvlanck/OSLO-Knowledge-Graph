import {IStoreObject} from "./IStoreObject";
import {APTerm, ITerm, PropertyTerm, TermType} from "./Term";
import * as fetch from 'node-fetch';
import {ElasticsearchDAO} from "./ElasticsearchDAO";


export class ApplicationProfileObject implements IStoreObject {

    private readonly classes: Array<ITerm>;
    private name: string;

    constructor() {
        this.classes = new Array<ITerm>();
    }

    async createStoreObject(url: string) {
        const data = await fetch(url).then(response => response.json());
        this.parseData(data);

        //send data to Elasticsearch
        const elasticClient = new ElasticsearchDAO();
        await elasticClient.pushData(this.classes, 'application_profiles', 'classes');
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
