import {  DocMetaPiece } from '@/types/types';
import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';
import { generateID } from '../../utils/function';

const prisma = new PrismaClient();
export async function GET() {
    try{
    const dossiers: DocMetaPiece[] = (await prisma.typesDocuments.findMany({
        include: {
            metadonnees:true,

        }
    })) as unknown as DocMetaPiece[];

    return new Response(JSON.stringify(dossiers), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
    });
} catch (error) {
    console.error('Erreur lors de la récupération des dossiers:', error);

    return new Response(JSON.stringify({ error: 'Erreur lors de la récupération des dossiers' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
    });
}
}

export async function POST(req: NextRequest) {
    try {
        const data: any = await req.json();
        console.log('Données reçues:', data);


        const newDossier = await prisma.typesDocuments.create({
            data: {
                code: generateID(6),
                nom_type: data,
            },
        });


        console.log('Nouveau dossier créé:', newDossier);

        return new Response(JSON.stringify({ data: newDossier }), {
            headers: { 'Content-Type': 'application/json' },
            status: 201,
        });

    } catch (error) {
        console.error('Erreur lors de la création du dossier:', error);

        return new Response(JSON.stringify({ error: 'Erreur lors de la création du dossier' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}



