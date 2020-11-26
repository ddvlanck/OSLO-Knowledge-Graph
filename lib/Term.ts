export interface ITermSettings {
    prefLabel: string,
    id: string,
    definition: string,
    context: string,
    classProperties?: Array<ITerm>
    fragmentIdentifier?: string
}

export enum TermType {
    VOCABULARY_TERM = 'VOCABULARY_TERM',
    APPLICATION_PROFILE_TERM = 'APPLICATION_PROFILE_TERM',
    PROPERTY = 'PROPERTY'
}

export interface ITerm {
    prefLabel: string
    id: string,
    definition: string,
    context: string
}

export class VocabularyTerm implements ITerm {
    id: string;
    definition: string;
    prefLabel: string;
    context: string;

    constructor(settings: ITermSettings) {
        this.prefLabel = settings.prefLabel;
        this.id = settings.id;
        this.definition = settings.definition;
        this.context = settings.context;
    }
}

export class APTerm implements ITerm {
    id: string;
    definition: string;
    prefLabel: string;
    context: string;

    fragmentIdentifier: string;

    classProperties: Array<ITerm>;

    constructor(settings: ITermSettings) {
        if(!settings.classProperties){
          console.error('[APTerm]: A properties array must be provided!') ;
          process.exit(1);
        }
        this.classProperties = settings.classProperties;
        this.context = settings.context;
        this.prefLabel = settings.prefLabel;
        this.id = settings.id;
        this.definition = settings.definition;
        this.fragmentIdentifier = settings.fragmentIdentifier;
    }
}

export class PropertyTerm implements ITerm {
    id: string;
    definition: string;
    prefLabel: string;
    context: string;

    fragmentIdentifier: string;

    constructor(settings: ITermSettings) {
        this.prefLabel = settings.prefLabel;
        this.id = settings.id;
        this.definition = settings.definition;
        this.context = settings.context;
        this.fragmentIdentifier = settings.fragmentIdentifier
    }
}
