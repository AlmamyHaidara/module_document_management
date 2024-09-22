import { PrismaClient } from '@prisma/client';
import { create } from 'domain';
import { NextRequest, NextResponse } from 'next/server';
import { metadata } from '../../../../layout';
import prisma from '@/prisma/prismaClient';


export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
    try {
        const code = params.code;

        if (!code) {
            return NextResponse.json({ error: 'Code du document requis' }, { status: 400 });
        }

        const document = await prisma.typesDocuments.findUnique({
            where: { code: code },
            include: {
                metadonnees: true // Inclure les métadonnées associées
            }
        });

        if (!document) {
            return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 });
        }

        return NextResponse.json(document, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la récupération du document:', error);

        return NextResponse.json({ error: 'Erreur lors de la récupération du document' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { code: string } }) {
    const code = params.code;

    try {
        await prisma.$transaction(async (prisma) => {
            await prisma.typesDocuments.deleteMany({
                where: { code: code }
            });
            return NextResponse.json({ message: 'Document supprimé avec succès' }, { status: 200 });
        });
    } catch (error) {
        console.error('Erreur lors de la suppression du document:', error);

        return NextResponse.json({ error: 'Erreur lors de la suppression du document' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();
        console.log('ddddd', data);

        const { id } = data;

        console.log('------------------------------------');
        console.log('Metadodnneees: ', id, data);
        await prisma.$transaction(async (prisma) => {
           const res= await Promise.all(
                [data].map(async (field: any) => {
                    await prisma.metaDonnees.upsert({
                        where: { id: field.id },
                        update: {
                            cle: field.cle,
                            valeur: field.valeur,
                            // typesDocID:field.documentId || field.typeDocument.id,
                            typeDocument: {
                                disconnect: {
                                    id: field.documentId || field.typeDocument.id
                                },
                                connect: {
                                    id: field.documentId || field.typeDocument.id
                                }
                            }
                            // typeDocument:{
                            //     connect: {
                            //         id:field.documentId || field.typeDocument.id
                            //     }
                            //     // update:{
                            //     //     nom_type:metadonnees[0].typeDocument.nom_type
                            //     // }
                            // }
                        },
                        create: {
                            cle: field.cle,
                            valeur: field.valeur,

                            typeDocument: {
                                connect: {
                                    id: Number(id)
                                }
                            }
                        }
                    });
                    
                })
            )
            return res
        });
        return NextResponse.json('Document mise a jour avec succes', { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du document:', error);

        return NextResponse.json({ error: 'Erreur lors de la mise à jour du document' }, { status: 500 });
    }
}
