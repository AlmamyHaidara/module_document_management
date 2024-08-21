import { PrismaClient } from '@prisma/client';
import { create } from 'domain';
import { NextRequest, NextResponse } from 'next/server';
import { metadata } from '../../../layout';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;

        if (!id) {
            return NextResponse.json({ error: 'Code du document requis' }, { status: 400 });
        }

        const document = await prisma.typesDocuments.findUnique({
            where: { id: Number(id) },
            include: {
                metadonnees: true,  // Inclure les métadonnées associées
            },
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
            where: { id: Number(id) },
        });
        return NextResponse.json({ message: 'Document supprimé avec succès' }, { status: 200 });

    } catch (error) {
        console.error('Erreur lors de la suppression du document:', error);

        return NextResponse.json({ error: 'Erreur lors de la suppression du document' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();
        console.log("ddddd", data);
        const { id, ...Clients } = data;
        // const client = await prisma.clients.update({  // Changed 'client' to 'clients'
        //     where: {
        //         id: id
        //     },
        //     data: Clients
        // });

        return NextResponse.json("Document mise a jour avec succes", { status: 200 });

    } catch (error) {
        console.error('Erreur lors de la mise à jour du document:', error);

        return NextResponse.json({ error: 'Erreur lors de la mise à jour du document' }, { status: 500 });
    }
}

