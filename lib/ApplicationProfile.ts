import {APTerm, ITerm, PropertyTerm} from "./Term";

export class ApplicationProfile {

    static createDocument(data) {
        const name = data.metadata.uri;
        const baseUri = data.metadata.navigation.self;
        let classes = []

        for (let object of data.classes) {
            let properties = new Array<ITerm>();

            for (let property of object.properties) {
                if (property.name['nl']) {
                    properties.push(new PropertyTerm({
                        prefLabel: property.name['nl'],
                        id: property.uri,
                        definition: property.description['nl'],
                        context: name,
                        fragmentIdentifier: `${baseUri}#${object.name['nl'].split(' ').join('%20')}%3A${property.name['nl'].split(' ').join('%20')}`
                    }))
                }

            }

            classes.push(new APTerm({
                prefLabel: object.name['nl'],
                id: object.uri,
                definition: object.description['nl'],
                classProperties: properties,
                context: name,
                fragmentIdentifier:`${baseUri}#${object.name['nl'].split(' ').join('%20')}`
            }))
        }
        return classes;
    }
}
