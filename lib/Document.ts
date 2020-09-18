export interface Document {
    createDocument(url: string);
    createDocuments(files: Array<string>, isUpdate: boolean);
}
