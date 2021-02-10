import {Client} from '@elastic/elasticsearch';
const config = require('../config.json');
const hash = require('object-hash');

export class Elastic {

    private client: Client

    constructor() {
        this.client = this.getClient();
        this.checkElasticStatus()
    }

    async indexData(document, index) {
        const body = document.flatMap(object => [{index: { _index: index, _id: this.createhash(object)}}, object]);
        const {body: bulkResponse} = await this.client.bulk({refresh: true, body});

        if (bulkResponse.errors) {
            console.log(`[Elasticsearch]: some errors occurred while adding the data:`)
            const erroredDocuments = [];
            // The items array has the same order of the dataset we just indexed.
            // The presence of the `error` key indicates that the operation
            // that we did for the document has failed.
            bulkResponse.items.forEach((action, i) => {
                const operation = Object.keys(action)[0]
                if (action[operation].error) {
                    erroredDocuments.push({
                        // If the status is 429 it means that you can retry the document,
                        // otherwise it's very likely a mapping error, and you should
                        // fix the document before to try it again.
                        status: action[operation].status,
                        error: action[operation].error,
                        operation: body[i * 2],
                        document: body[i * 2 + 1]
                    })
                }
            })
            console.log(erroredDocuments)
        } else {
            console.log(`[Elasticsearch]: insert number of terms is: ${bulkResponse.items.length}`);
        }
    }

    async updateData(document, index){
        for(let object of document){
            await this.client.update({
                index: index,
                id: object.id,
                body: {
                    doc: object
                }
            });
        }
    }

    private getClient(): Client {
        return new Client({
            node: config.ELASTIC_ENDPOINT,
            auth: {
                username: `${config.USERNAME}`,
                password: `${config.PASSWORD}`
            },
            ssl: {
                rejectUnauthorized: false
            }
        });
    }

    private async checkElasticStatus() {
        await this.checkElasticsearchHealth();
        await this.checkIndicesHealth();
    }

    private checkElasticsearchHealth() {
        this.client.ping().then(() => {
            console.log(`[Elastic]: elasticsearch instance is up and running`)
        }).catch(() => {
            console.log(`[Elastic]: elasticsearch is down. Please make sure elasticsearch is running before using this program`);
            process.exit(1);
        })
    }

    private checkIndicesHealth() {
        this.checkIndexStatus(config.VOCABULARY_INDEX).then(response => {
            if(response.body === false){
                console.log(`[Elastic]: index ${config.VOCABULARY_INDEX} does not exist in this elasticsearch instance. The index will be created now.`)
                this.createIndex(config.VOCABULARY_INDEX);
            } else {
                console.log(`[Elastic]: index ${config.VOCABULARY_INDEX} exists and is healthy.`)
            }

        });
        this.checkIndexStatus(config.APPLICATION_PROFILE_INDEX).then(response => {
            if(response.body === false){
                console.log(`[Elastic]: index ${config.APPLICATION_PROFILE_INDEX} does not exist in this elasticsearch instance. The index will be created now.`)
                this.createIndex(config.APPLICATION_PROFILE_INDEX);
            } else {
                console.log(`[Elastic]: index ${config.APPLICATION_PROFILE_INDEX} exists and is healthy.`)
            }
        });
    }

    createIndex(index: string) {
        // Create index
        this.client.indices.create({
            index: index,
        }).then(() => {
            console.log(`[Elastic]: created index ${index} on elasticsearch instance`);
            const mapping = index === config.VOCABULARY_INDEX ? this.getVocabularyMapping() : this.getApplicationProfileMapping();
            if (mapping) {
                // Set mapping for index
                this.setMappingForIndex(index, mapping)
            }
        }).catch((err) => {
            console.log(`[Elastic]: failed to create index ${index}`)
            console.log(err);
        });
    }

    private setMappingForIndex(index: string, mapping) {
        this.client.indices.putMapping({
            index: index,
            body: mapping
        }).then(response => {
            console.log(response);
        }).catch(err => {
            console.log(err);
        })
    }

    private async checkIndexStatus(index: string) {
        return this.client.indices.exists({index: index})
    }

    /* Mapping functions */

    private getVocabularyMapping() {
        return {
            properties: {
                prefLabel: {"type": "text"},
                id: {"type": "text"},
                context: {"type": "text"},
                definition: {"type": "text"}
            }
        }
    }


    private getApplicationProfileMapping() {
        return {
            properties: {
                prefLabel: {"type": "text"},
                id: {"type": "text"},
                context: {"type": "text"},
                definition: {"type": "text"},
                fragmentIdentifier: {"type": "text"},
                classProperties : {
                    type: "nested",
                    properties : {
                        prefLabel: {"type": "text"},
                        id: {"type": "text"},
                        context: {"type": "text"},
                        definition: {"type": "text"},
                        fragmentIdentifier: {"type": "text"},
                    }
                }

            }
        }
    }

    private createhash(object){
        return hash(object);
    }


}
