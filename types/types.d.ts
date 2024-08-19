export interface Client {
    id?: number;
    nom: string;
    prenom: string;
    email:string;
    adresse: string;
    telephone: string;
    profession: string;
    nature?: Nature;
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
    nom_type: string;
    compteClientId: string;
    compteClient: CompteClient?;
    dossiers: Dossier[]?;
    metadonnees:any[]?;
}

export interface DocumentTypeInfo {

        metadonnees: {
            id: number;
            cle: string;
            valeur: string;
            typesDocID: string | null;
            created_at: Date;
            updated_at: Date;
        }[],
        id: number;
        code: string;
        nom_type: string;
        created_at: Date;
        updated_at: Date;

    }
    export interface TypeDoc{
        id:number,
        code:string,
        nom_type:string
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
    cle: string;
    valeur: string;
    typesDocID: number;
    created_at: Date;
    updated_at: Date;
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
