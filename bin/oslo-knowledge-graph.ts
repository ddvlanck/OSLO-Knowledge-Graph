import {VocabularyObject} from "../lib/Elasticsearch/VocabularyObject";
import {ApplicationProfileObject} from "../lib/Elasticsearch/ApplicationProfileObject";
const program = require('commander');
const readline = require('readline');
const fs = require('fs');

program
    .version('0.1.0')
    .usage('converts vocabularies, application profiles or other documents to a JSON structure and adds it to Elasticsearch')
    .option('-t, --type <type>', 'type of the input data')
    .option('-f, --file <path>', 'URL of the JSON data')
    .option('-b, --bulk <path>', 'file containing all URLs that need to be inserted');

program.on('--help', () => {
    console.log('');
    console.log('This program is created for the Open Standards for Linked Organizations team.');
    console.log("It's used to add vocabularies, application profiles or other documents to our Elasticsearch engine");
    console.log("The program can be executed as follows:");
    console.log("node oslo-knowledge-graph.js -t <type>  -f <file>");
    console.log("\t<type> can be 'terminology' or 'application_profile'");
    console.log("\t<file> is the URL of the JSON file");
});

program.parse(process.argv);

if(process.argv.length === 0){
    console.error('Please provide a file to process along with what type of data it is');
    process.exit(1);
}

const type = program.type;
const url = program.file || null;
const bulkFile = program.bulk || null;

if(type !== 'terminology' && type !== 'application_profile'){
    console.error('Type should be terminology or application_profile');
    process.exit(1);
}

processBulkFile(bulkFile ? bulkFile : url, type, bulkFile ? true: false);

async function processBulkFile(filename: string, type: string, bulk: boolean){
    if(type === 'terminology'){

        if(bulk){
            const stream = fs.createReadStream(filename);
            const rl = readline.createInterface({
                input: stream,
                crlfDelay: Infinity
            });

            for await (const line of rl) {
                new VocabularyObject().createStoreObject(line);
            }
        } else {
            new VocabularyObject().createStoreObject(filename);
        }

    } else {
        if(bulk){
            const stream = fs.createReadStream(filename);
            const rl = readline.createInterface({
                input: stream,
                crlfDelay: Infinity
            });

            for await (const line of rl) {
                new VocabularyObject().createStoreObject(line);
            }
        } else {
            new ApplicationProfileObject().createStoreObject(filename);
        }
    }
}

//TODO: other documents
