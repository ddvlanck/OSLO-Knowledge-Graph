import {Processor} from "../lib/Processor";
const program = require('commander');
const readline = require('readline');
const fs = require('fs');
const config = require('../config.json');

program
    .version('0.1.0')
    .usage('converts vocabularies, application profiles or other documents to a JSON structure and adds it to Elasticsearch')
    .option('-t, --type <type>', 'type of the input data')
    .option('-f, --file <path>', 'URL of the JSON data')
    .option('-b, --bulk <path>', 'file containing all URLs that need to be inserted')
    .option('--update', 'update instead of create');

program.on('--help', () => {
    console.log('');
    console.log('This program is created for the Open Standards for Linked Organizations team.');
    console.log("It's used to add vocabularies, application profiles or other documents to our Elasticsearch engine");
    console.log("The program can be executed as follows:");
    console.log("node oslo-knowledge-graph.js -t <type>  -f <file>");
    console.log("\t<type> can be 'terminology' or 'application-profile'");
    console.log("\t<file> is the URL of the raw JSON file");
});

program.parse(process.argv);

if(process.argv.length === 0){
    console.error('Please provide a file to process along with what type of data it is');
    process.exit(1);
}

const type = program.type;
const url = program.file || null;
const bulkFile = program.bulk || null;
const update = program.update || false;

if(type !== 'ap' && type !== 'voc'){
    console.error('Type should be voc or ap');
    process.exit(1);
}


processInput(bulkFile ? bulkFile : url, type, bulkFile ? true: false, update);

async function processInput(filename: string, type: string, bulk: boolean, update: boolean){
    let files = new Array<string>();
    const indexType = type === 'voc' ? config.VOCABULARY_INDEX : config.APPLICATION_PROFILE_INDEX;


    if(bulk){
        const stream = fs.createReadStream(filename);
        const rl = readline.createInterface({
            input: stream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            files.push(line);
        }
    } else {
        files.push(filename);
    }
    new Processor(files, indexType)
}
