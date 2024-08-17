
import { Client, CompteClient,Dossier,Piece,MetaDonnee, DocMetaPiece } from '@/types/types';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { generateID } from '../../utils/function';


export async function POST(req:NextRequest){
    try {
        // const data: any = await req.json();
        const formData = await req.formData();
        const files = formData.getAll('demo[]') as unknown as File[] | null;

        console.log('------------------------',files);
        if (!files) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }


    // Chemin où le fichier sera sauvegardé
    const uploadDir = path.join(process.cwd(), 'uploads');

    // Créer le répertoire des uploads s'il n'existe pas encore
    await fs.mkdir(uploadDir, { recursive: true });

    let filePaths = []
    // Sauvegarder le fichier
    for (const file of files) {

        filePaths.push({code:generateID(6),path:path.join(uploadDir, file.name)});
        const arrayBuffer = await file.arrayBuffer();
        filePaths.map(async (filePath)=>{
            await fs.writeFile(filePath.path, new Uint8Array(arrayBuffer));

        })
    }

    console.log('Données reçues:', filePaths);
    return NextResponse.json({ message: 'Fichier uploade avec success', filePaths }, {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
    });

    } catch (error) {
        console.error('Erreur lors de la création du dossier:', error);

        return new Response(JSON.stringify({ error: 'Erreur lors de la création du dossier' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}
