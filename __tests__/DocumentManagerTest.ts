import 'jest';
import DocumentManager from '../src/DocumentManager';
import type {Document, ImportDocument} from '../src/types';

const SAMPLES: ImportDocument[] = [
    {
        name: 'Releve_presence.docx',
        path: '/ecole',
        signedBy: false,
    },
    {
        name: 'Document_1.doc',
        path: '/',
        signedBy: false,
    },
    {
        name: 'Releve_presence_signe.docx',
        path: '/ecole',
        signedBy: 'Tim',
    },
];

describe('List/Add', () => {
    let documentManager = new DocumentManager();

    beforeEach(() => {
        documentManager = new DocumentManager();
    });

    it('should return [] if no documents', () => {
        expect(documentManager.list()).toStrictEqual([]);
    });

    it('should return the document if there is one document', () => {
        const doc: ImportDocument = {...SAMPLES[0]};
        documentManager.add(doc);
        expect(documentManager.list()).toMatchObject([doc]);
    });

    it('should throw an error if we add the same document multiple times', () => {
        documentManager.add(...SAMPLES);
        expect(() => documentManager.add(SAMPLES[0])).toThrowError();
    });
});

describe('Sort', () => {
    let documentManager = new DocumentManager();

    beforeEach(() => {
        documentManager = new DocumentManager();
    });

    it('should list no document when no documents', () => {
        documentManager.sort();
        expect(documentManager.list()).toStrictEqual([]);
    });

    it('should list the document when one document', () => {
        documentManager.add(SAMPLES[2]);
        documentManager.sort();
        expect(documentManager.list()).toMatchObject([SAMPLES[2]]);
    });

    it('should list the sorted documents when multiple documents', () => {
        documentManager.add(...SAMPLES);
        documentManager.sort();
        expect(documentManager.list()).toMatchObject([
            SAMPLES[1],
            SAMPLES[2],
            SAMPLES[0],
        ]);
    });

    it('should list always list the sorted documents after a sort', () => {
        documentManager.add(...SAMPLES);
        documentManager.sort();
        documentManager.sort();
        expect(documentManager.list()).toMatchObject([
            SAMPLES[1],
            SAMPLES[2],
            SAMPLES[0],
        ]);
    });
});

describe('Delete', () => {
    let documentManager = new DocumentManager();

    beforeEach(() => {
        documentManager = new DocumentManager();
    });

    it('should throw if no document match', () => {
        expect(() => documentManager.delete('/document.txt')).toThrowError();
    });

    it('should remove the document', () => {
        documentManager.add(...SAMPLES);
        documentManager.delete(`${SAMPLES[1].path}/${SAMPLES[1].name}`);
        expect(documentManager.list()).toMatchObject([
            SAMPLES[0],
            SAMPLES[2],
        ]);
    });
});

describe('Clear', () => {
    let documentManager = new DocumentManager();

    beforeEach(() => {
        documentManager = new DocumentManager();
    });

    it('should clear when empty', () => {
        documentManager.clear();
        expect(documentManager.list()).toStrictEqual([]);
    });

    it('should clear when not empty', () => {
        documentManager.add(...SAMPLES);
        documentManager.clear();
        expect(documentManager.list()).toStrictEqual([]);
    });
});

describe('Search', () => {
    let documentManager = new DocumentManager();

    beforeEach(() => {
        documentManager = new DocumentManager();
    });

    it('should return null when empty term', () => {
        expect(documentManager.search('')).toBeNull();
    });

    it('should return null when term is only whitespace', () => {
        expect(documentManager.search(' ')).toBeNull();
        expect(documentManager.search('\n')).toBeNull();
        expect(documentManager.search('\n ')).toBeNull();
        expect(documentManager.search('\t')).toBeNull();
        expect(documentManager.search(' \t \n')).toBeNull();
    });

});
describe('Archive', () => {
    let documentManager = new DocumentManager();
    let docToArchive : Document;
    beforeEach(() => {
        documentManager = new DocumentManager();
        docToArchive = {...SAMPLES[0], archived: true, createdAt: new Date(),
        };
    });
    it('should return an error if the document is not in the list', () => {
        expect(() => documentManager.archive(docToArchive)).toThrowError();
    });

    it('should return an error if the document is already archived', () => {
        documentManager.add(docToArchive);
        expect(() => documentManager.archive(docToArchive)).toThrowError(new Error('Document not in list'));
    });

    it('should archive the document', () => {
        const doc  = {...SAMPLES[0], archived: false, createdAt: new Date()};
        documentManager.add(doc);
        documentManager.archive(doc);
        console.log("prout");
        expect(1).toBe(1);
    }
    );

});

describe('Count', () => {
    let documentManager = new DocumentManager();

    beforeEach(() => {
        documentManager = new DocumentManager();
    });

    it('should return 0 when no documents', () => {
        expect(documentManager.count()).toBe(0);
    });

    it('should return 1 when 1 document added', () => {
        documentManager.add(SAMPLES[0]);
        expect(documentManager.count()).toBe(1);
    });

    it('should return the number of documents', () => {
        documentManager.add(...SAMPLES);
        expect(documentManager.count()).toBe(SAMPLES.length);
    });
});

describe('Duplicate',  () => {
    let documentManager = new DocumentManager();

    beforeEach(() => {
        documentManager = new DocumentManager();
    });

    it('should duplicate a document', () => {
        documentManager.add(...SAMPLES);
        expect(documentManager.duplicate(SAMPLES[0])).toMatchObject([...SAMPLES, SAMPLES[0]]);
    });
});