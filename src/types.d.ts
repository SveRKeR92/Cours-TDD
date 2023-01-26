export type ImportDocument = Omit<Document, 'archived' | 'createdAt'>

export interface Document {
    name: string;
    archived: boolean;
    createdAt: Date;
    path: string;
    signedBy: string | false;
}