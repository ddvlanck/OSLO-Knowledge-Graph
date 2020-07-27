import {ITerm} from "./Term";
import * as elasticsearch from 'elasticsearch';
const config = require('../../config.json');

export class ElasticsearchDAO {

    async setupElasticsearch(){
        const client = this.connectToElasticsearch();
        const terminologyIndexExists = await this.checkIfIndexExists(client, 'terminology');
        const applicationProfileIndexExists = await this.checkIfIndexExists(client, 'application_profiles');

        if(!terminologyIndexExists){
            console.log('[ElasticsearchDAO]: terminology index does not exist on setup. Creating it. ');
            this.createIndex(client, 'terminology');
        }

        if(!applicationProfileIndexExists){
            console.log('[ElasticsearchDAO]: application_profiles index does not exist on setup. Creating it. ');
            this.createIndex(client, 'application_profiles');
        }
    }

    async pushData(data: Array<ITerm>, index: string, type: string) {
        const client = this.connectToElasticsearch();
        const indexExists = await this.checkIfIndexExists(client, index);

        if (!indexExists) {
            console.log('[ElasticsearchDAO]: ' + index + ' does not exist yet. Creating it.');
            this.createIndex(client, index);
        }

        this.pushDataInBulk(client, type, index, data);
    }

    private connectToElasticsearch(): elasticsearch.Client {
        const client = new elasticsearch.Client({
            host: config.ELASTIC_ENDPOINT
        });

        client.ping({
            requestTimeout: 30000
        }, function (error) {
            // At this point, elasticsearch is down, we need to check the service
            if (error) {
                // At this point, eastic search is down, please check your Elasticsearch service
                if (error) {
                    console.error('\x1b[31m%s\x1b[0m ', "Elasticsearch cluster is down");
                    process.exit(1);
                } else {
                    console.log('\x1b[32m%s\x1b[0m ', "Elasticsearch cluster/client is running");
                }
            }
        });

        return client;
    }

    private async checkIfIndexExists(client: elasticsearch.Client, index: string): Promise<boolean> {
        const exists = client.indices.exists({
            index: index
        });
        return exists;
    }

    private createIndex(client: elasticsearch.Client, name: string): void {
        client.indices.create({
            index: name
        }, function (error, response, status) {
            if (error) {
                console.log(error);
            } else {
                console.log("Created a new index: " + name, response);
            }
        });
    }

    private pushDataInBulk(client, type, index, data) {
        let bulk = [];

        // Loop through each URL and create and push two objects into the array in each loop
        // first object sends the index and type you will be saving the data as
        // second object is the data you want to index
        for (let term of data) {
            bulk.push({
                index: {
                    _index: index,
                    _type: type
                }
            });
            bulk.push(term);
        }

        // Perform bulk indexing of the data passed
        client.bulk({body: bulk}, function (err, response) {
            if (err) {
                console.log("Failed Bulk operation ", err)
            } else {
                console.log("Successfully imported ", data.length);
            }
        });
    }
}
