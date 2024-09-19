import { Client, CompteClient,Dossier,Piece,MetaDonnee, DocMetaPiece } from '@/types/types';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { generateID } from '../../utils/function';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll('demo[]') as unknown as File[] | null;

        console.log('------------------------', files);
        if (!files) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Chemin absolu où le fichier sera sauvegardé
        const uploadDir = path.join(process.cwd(), '/public/uploads');

        // Créer le répertoire des uploads s'il n'existe pas encore
        await fs.mkdir(uploadDir, { recursive: true });

        let filePaths = [];

        // Sauvegarder le fichier
        for (const file of files) {
            const fileName = generateID(6) + '-' + file.name; // Vous pouvez ajouter un identifiant unique au nom du fichier
            const absoluteFilePath = path.join(uploadDir, fileName);

            // Chemin relatif à partir du dossier 'public'
            const relativeFilePath = `/uploads/${fileName}`;

            // Enregistrer le fichier sur le disque
            const arrayBuffer = await file.arrayBuffer();
            await fs.writeFile(absoluteFilePath, new Uint8Array(arrayBuffer));

            // Ajouter le chemin relatif à la liste des fichiers
            filePaths.push({ code: "", path: relativeFilePath });
        }

        console.log('Données reçues:', filePaths);
        return NextResponse.json({ message: 'Fichier uploadé avec succès', filePaths }, {
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
