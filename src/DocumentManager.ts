import type {Document, ImportDocument} from './types';

export default class DocumentManager {
    private _documents: Document[] = [];

    public add(...documents: ImportDocument[]) {
        const futureDocuments = this._documents.concat(
            ...documents.map((d): Document => {
                return {
                    ...d,
                    archived: false,
                    createdAt: new Date(),
                };
            }),
        );
        futureDocuments.reduce(
            (acc, d) => {
                const fqn = `${d.path}/${d.name}`;
                if (
                    acc.includes(fqn)
                    || this._documents.findIndex(
                        (v) =>
                            `${v.path}/${v.name}` == fqn) >= 0
                ) {
                    throw new Error('Duplicate file name/path');
                }
                return [...acc, fqn];
            },
            <string[]>[]);
        this._documents = futureDocuments;
    }

    public list(): Document[] {
        return [...this._documents];
    }

    public sort() {
        this._documents.sort(
            (a, b) =>
                `${a.path}/${a.name}`.localeCompare(`${b.path}/${b.name}`),
        );
    }

    public delete(docPathToDelete: string) {
        const documentToDelete = this._documents.findIndex(
            (doc: Document) =>
                `${doc.path}/${doc.name}` == docPathToDelete);
        if (documentToDelete == -1) {
            throw new Error('No such document');
        }
        this._documents = this._documents.filter(
            (_, index) =>
                index != documentToDelete);
    }

    public clear() {
        this._documents = [];
    }

    public search(term: string): Document | null {
        if (term.trim().length == 0) return null;
        return null;
    }


    public count(): number {
        return this._documents.length;
    }

    public duplicate(document: ImportDocument): Document[] {
        this._documents.push(<Document>document);
        return [...this._documents];
    }
    public archive(doc: Document): void {
        const isInList = this._documents.some((d) => d === doc);

        if (isInList && doc.archived) {
           throw new Error('Document already archived');
        }

        if(!isInList) {
            // document not in list
            throw new Error('Document not in list');
        } else {
            // document is in list
            doc.archived = true;
        }
    }  
}
