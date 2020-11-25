import {VocabularyTerm} from "./Term";

export class Vocabulary  {

    static createDocument(data){
        //const name = data.metadata.uri;
        let terms = [];
        // Get classes and properties from the vocabulary
        for(let object of data.classes){
            terms.push(new VocabularyTerm({
                prefLabel: object.name['nl'],
                id: object.uri,
                definition: object.description['nl'],
                context: data.metadata.uri
            }));
        }

        for(let object of data.properties){
            terms.push(new VocabularyTerm({
                prefLabel: object.name['nl'],
                id: object.uri,
                definition: object.description['nl'],
                context: data.metadata.uri
            }));
        }

        return terms;
    }




}
