# OSLO Knowledge Graph

This software project reads the configuration files of the OSLO vocabularies and application profiles and pushes the data in the database. 

## Current situation

At the moment we are working on the support of Elasticsearch. Configuration files in JSON format are used as input to create JSON structures that are then pushed into Elasticsearch.

This is a manual process and we intend to automate this process along the way.

## Future work

Intention is to support triple stores such as Virtuoso. The JSON configuration files will then be used to generate **triples**. For that, we will need an efficient query language. SPARQL is a possible solution, but maybe we have to do some research if there are any other solutions.
