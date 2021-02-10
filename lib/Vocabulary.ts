import {VocabularyTerm} from "./Term";

export class Vocabulary  {

    static createDocument(data){
        const domain = data.metadata.uri;
        let terms = [];

        // Get classes, properties and external terms from the vocabulary
        for(let object of data.classes){
            terms.push(new VocabularyTerm({
                prefLabel: object.name['nl'],
                id: object.uri,
                definition: object.description['nl'],
                context: domain
            }));
        }

        for(let object of data.properties){
            terms.push(new VocabularyTerm({
                prefLabel: object.name['nl'],
                id: object.uri,
                definition: object.description['nl'],
                context: domain
            }));
        }

        for(let object of data.external_terms){
            terms.push(new VocabularyTerm({
                prefLabel: object.name['nl'],
                id: object.uri,
                definition: object.description['nl'],
                context: domain
            }));
        }

        return terms;
    }




}
