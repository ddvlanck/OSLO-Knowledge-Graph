export interface ITermSettings {
    prefLabel: string,
    id: string,
    definition: string,
    context: string,
    properties?: Array<ITerm>
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
    termType: TermType;
    context: string;

    constructor(settings: ITermSettings) {
        this.prefLabel = settings.prefLabel;
        this.id = settings.id;
        this.definition = settings.definition;
        this.termType = TermType.VOCABULARY_TERM;
        this.context = settings.context;
    }
}

export class APTerm implements ITerm {
    id: string;
    definition: string;
    prefLabel: string;
    termType: TermType;
    context: string;

    fragmentIdentifier: string;

    properties: Array<ITerm>;

    constructor(settings: ITermSettings) {
        if(!settings.properties){
          console.error('[APTerm]: A properties array must be provided!') ;
          process.exit(1);
        }
        this.properties = settings.properties;
        this.context = settings.context;
        this.prefLabel = settings.prefLabel;
        this.id = settings.id;
        this.definition = settings.definition;
        this.termType = TermType.APPLICATION_PROFILE_TERM;
        this.fragmentIdentifier = settings.fragmentIdentifier;
    }
}

export class PropertyTerm implements ITerm {
    id: string;
    definition: string;
    prefLabel: string;
    termType: TermType;
    context: string;

    fragmentIdentifier: string;

    constructor(settings: ITermSettings) {
        this.prefLabel = settings.prefLabel;
        this.id = settings.id;
        this.definition = settings.definition;
        this.context = settings.context;
        this.termType = TermType.PROPERTY;
        this.fragmentIdentifier = settings.fragmentIdentifier
    }
}
