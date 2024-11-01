import {  DocMetaPiece } from '@/types/types';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { generateID } from '../../utils/function';
import prisma from '@/prisma/prismaClient';

export async function GET() {
    try{
    const dossiers: DocMetaPiece[] = (await prisma.typesDocuments.findMany({
        include: {
            metadonnees:true,

        }
    })) as unknown as DocMetaPiece[];

    return NextResponse.json(dossiers, {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
    });
} catch (error) {
    console.error('Erreur lors de la récupération des dossiers:', error);

    return NextResponse.json(JSON.stringify({ error: 'Erreur lors de la récupération des dossiers' }), {
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

        return NextResponse.json(JSON.stringify({ data: newDossier }), {
            headers: { 'Content-Type': 'application/json' },
            status: 201,
        });

    } catch (error) {
        console.error('Erreur lors de la création du dossier:', error);

        return NextResponse.json(JSON.stringify({ error: 'Erreur lors de la création du dossier' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}



