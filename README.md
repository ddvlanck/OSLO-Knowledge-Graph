# OSLO Knowledge Graph

The OSLO Toolchain generates a lot of useful information in the [OSLO-Generated repository](https://github.com/Informatievlaanderen/OSLO-Generated), such as reports of every standard (vocabulary or application profile) that was published through the OSLO Toolchain. This software package uses specific files (_html-nj.json_) from these reports to populate the Elasticsearch instance. This way, we make it possible for users to query our knowledge graph in an easy way.

Elasticsearch will run alongside our triplestore Virtuoso, that also enables users to query our knowledge graph, but knowledge of SPARQL, the query language to query triplestores, is required to do so. Elasticsearch exposes a REST API that supports JSON, a format that is well-known to the majority of developers, and is in that regard an easier option to query our knowledge graph.

## Files folder

The **files** folder in this repository holds multiple files that contain URLs to the raw JSON of the html-nj.json files for the different standards. Users can choose to use these files to populate Elasticsearch or pick just a couple of these URLs to isnert data in Elasticsearch

## Configuration

This program has a configuration file, called _config.json_ and contains the connection details to connect to Elasticsearch. In order to work, this configuration file must be filled out with the correct connection details. If you run an Elasticsearch instance locally via Docker, the value of the `ELASTIC_ENDPOINT` is simply **localhost:9200**, as 9200 is the default port that is exposed by Elasticsearch

## Usage

There are several ways the program can be used to insert, update or delete data in Elasticsearch and it is all executed from the CLI. First, users have to clone this repository and run `npm install` inside the folder followed by `npm run build`. This will install all necessary dependencies required to run this program and create a build. The various executing options are discussed below.

### Insert

In order to insert data in Elasticsearch, the users has 2 possibilities. The first allows a user to insert the data of 1 standard, while the other allows a users to insert data of multiple standards at once. In both cases, the user is required to provide the type of the standard: **terminology** or **application_profile**.

To insert data from a single standard, users have to execute the following command:
```nodejs
node bin/oslo-knowledge-graph.js -f "XXXXXXX" -t "YYYYYYY"
```
"XXXXXXX" should be replaced by the URL containing the raw JSON output of the html-nj.json file of that standard and "YYYYYYY" by one of the two values described above. To insert data of multiple URLs at once, users can choose a file from the files folder or create a text file (.txt) themselves. The command is as follows:
```
node bin/oslo-knowledge-graph.js -b "ZZZZZZZ" -t "YYYYYYY"
```
"ZZZZZZZ" should be replaced by the path of the file that contains the URLs of the raw JSON output.

### Update

Since standards in OSLO can be updated, it must also be possible to update the corresponding data in Elasticsearch. To execute an update, users can use the same methods as described above, but they pass the `--update` parameter to the program. For example, to update all standards that are in the vocabularies.txt file, users have to execute the following command:
```
node bin/oslo-knowledge-graph.js --update -b "ZZZZZZZ" -t "YYYYYYY"
```

### Delete

TODO

