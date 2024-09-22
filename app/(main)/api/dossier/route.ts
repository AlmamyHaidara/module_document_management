import prisma from '@/prisma/prismaClient';
import { Client, CompteClient, Dossier, Piece, MetaDonnee, DocMetaPiece } from '@/types/types';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    const dossiers: DocMetaPiece[] = (await prisma.dossiers.findMany({
        include: {
            dossierInfos: true,

            // piece: true,
            dossiers_typesDocuments: {
                include: {
                    dossier: {
                        include:{
                            piece:true,

                            dossiers_typesDocuments:{
                                include:{
                                    type_document:true
                                }
                            }
                        }
                    },
                    type_document: {
                        include:{
                            pieceName:true,
                            compteClient:true,

                        }
                    }
                }
            }
            //   MetaDonnees: true,
            //   Piece:true,
        }
    })) as unknown as DocMetaPiece[];
    // console.log('o----------------------o: ', dossiers[0].dossiers_typesDocuments[0].type_document.compteClient.id);
    console.log('o----------------------o: ', dossiers[0].dossiers_typesDocuments);

    return NextResponse.json(dossiers);
}
type DataSend = {
    compteClient: any;
    id: number;
    nom: string;
    description: string;
    code: string;
    typeDocument: {
        id: number;
        code: string;
        nom_type: string;
    };
    metadonnees: { id: number; cle: string; valeur: string }[];
    newValue: { [key: string]: { cle: string; value: string } }[];
    filePaths: {
        code: string;
        path: string;
    }[];
};

export async function POST(req: NextRequest) {
    try {
        const data: DataSend = await req.json();
        console.log('Données reçues:', data);
        console.log('Données reçues44:', data.filePaths);

        const transactionResult = await prisma.$transaction(async (prisma) => {
            // Créer le dossier
            const dossier = await prisma.dossiers.create({
                data: {
                    code: data.code,
                    nom: data.nom,
                    piece: {
                        create: await Promise.all(
                            data.filePaths.map(async (filePath) => {
                                const existingPiece = await prisma.piece.findUnique({
                                    where: { code: filePath.code },
                                });

                                // Si la pièce existe déjà, ne pas l'ajouter
                                if (existingPiece) {
                                    console.log(`La pièce avec le code ${filePath.code} existe déjà`);
                                    return null; // Retourne null si déjà existant
                                }
                                // Sinon, créer la nouvelle pièce
                                return {
                                    code: filePath.code,
                                    path: filePath.path,
                                    date_creation: new Date(),
                                    created_at: new Date(),
                                    updated_at: new Date(),
                                };
                            })
                        ).then((pieces) => { console.log("_____________",pieces); return pieces.filter((piece): piece is any => piece !== null)}), // Filtrer les valeurs nulles

                    },
                    dossierInfos: {
                        create: data.metadonnees.map((value) => ({
                            cle: value.cle,
                            value: value.valeur,
                        })),
                    },
                },
                include: {
                    dossierInfos: true,
                    piece:true
                },
            });

            // Lier le dossier au type de document
            await prisma.dossiersToTypesDocuments.create({
                data: {
                    dossiersId: dossier.id,
                    typesdocumentsId: data.typeDocument.id,
                },
            });
            console.log("==============================")
            console.table(dossier.dossierInfos);

            return dossier; // Retourner le dossier créé
        });
        // Mise à jour du type de document
        await prisma.typesDocuments.update({
            where: {
                id: data.typeDocument.id,
            },
            data: {
                compte_id: data?.compteClient.id,

                // Mise à jour des pièces si nécessaire
                // piece: {
                //     updateMany: data.filePaths.map((item) => ({
                //         where: {
                //             code: item.code,
                //         },
                //         data: {
                //             path: item.path,
                //         },
                //     })),
                // },
            },
        });

        return NextResponse.json(JSON.stringify({ success: 'création du dossier', dossier: transactionResult }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error('Erreur lors de la création du dossier:', error);

        return NextResponse.json(JSON.stringify({ error: 'Erreur lors de la création du dossier' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}

