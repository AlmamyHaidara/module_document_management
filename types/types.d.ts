export interface Client {
    id: number;
    nom: string;
    prenom: string;
    adresse?: string;
    telephone?: string;
    profession?: string;
    nature: Nature;
    CompteClients: CompteClient[];
}

export interface CompteClient {
    id: number;
    clientId: number;
    matricule: string;
    numero_compte: string;
    type_compte: string;
    date_ouverture: Date;
    agence: string;
    code_gestionnaire: string;
    client: Client;
    TypesDocuments: TypeDocument[];
}

export interface TypeDocument {
    id: number;
    code?: string;
    nomType: string;
    compteClientId: number;
    compteClient: CompteClient;
    dossiers: Dossier[];
}

export interface Dossier {
    id: number;
    code: string;
    description?: string;
    typeDocumentId: number;
    typeDocument: TypeDocument;
    metaDonnees: MetaDonnee[];
    pieces: Piece[];
}

export interface MetaDonnee {
    id: number;
    dossierId: number;
    cle: string;
    valeur?: string;
    dossier: Dossier;
}

export interface Piece {
    id: number;
    code?: string;
    nom?: string;
    dossierId: number;
    dateCreation?: Date;
    dossier: Dossier;
}

export enum Nature {
    Physique = 'Physique',
    Morale = 'Morale'
}

export interface DocMetaPiece{
    dossier:Dossier;
    metadonne:MetaDonnee[];
    piece:Piece[];
}
