import { PrismaClient } from '@prisma/client';
import { create } from 'domain';
import { NextRequest, NextResponse } from 'next/server';
import { metadata } from '../../../layout';
import prisma from '@/prisma/prismaClient';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;

        if (!id) {
            return NextResponse.json({ error: 'Code du document requis' }, { status: 400 });
        }

        const document = await prisma.typesDocuments.findUnique({
            where: { id: Number(id) },
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

export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {
    const id = params.id;

    try {
        await prisma.clients.deleteMany({
            where: { id: Number(id) }
        });
        return NextResponse.json({ message: 'Document supprimé avec succès' }, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la suppression du document:', error);

        return NextResponse.json({ error: 'Erreur lors de la suppression du document' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const data = await req.json();
        const { id, ...Clients } = data;
        const {compte } = data;
        const compteId = compte.id
        delete compte.id
        compte.type_compte_id = compte.type_compte.id
        delete compte.client_id
        delete compte.type_compte
        const { client } = Clients;
        console.log("johikrk",compte);


        // delete client.comptes.id
        // Supprimez l'id du client pour éviter des erreurs
        if (client) {
            delete client.id;
        }

        // D'abord, mettez à jour les données du client
        await prisma.clients.update({
            where: {
                id: Number(params.id)
            },
            data: {
                adresse: client.adresse,
                nature: client.nature,
                nom: client.nom,
                prenom: client.prenom,
                profession: client.profession,
                telephone: client.telephone

            }
        });
            await prisma.compteClients.update({
                where: {
                    id: compteId
                },
                data: {
                    ...compte
                }
            });


        // Ensuite, mettez à jour les comptes (relation imbriquée)
        // if (comptes && comptes.length > 0) {
        //     // Supposons que vous ayez plusieurs comptes à mettre à jour
        //     for (const compte of comptes) {
        //         await prisma.compteClients.updateMany({
        //             where: { id: compte.id },
        //             data: {
        //                 matricule: compte.matricule,
        //                 numero_compte: compte.numero_compte,
        //                 agence: compte.agence,
        //                 code_gestionnaire: compte.code_gestionnaire,
        //                 type_compte_id: compte.type_compte_id,
        //                 updated_at: new Date(),
        //             },
        //         });
        //     }
        // }

        return NextResponse.json('Document mis à jour avec succès', { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du document:', error);
        return NextResponse.json({ error: 'Erreur lors de la mise à jour du document' }, { status: 500 });
    }
}
