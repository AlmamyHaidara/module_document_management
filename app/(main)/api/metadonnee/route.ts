import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/prisma/prismaClient';


export async function GET() {
    try{
    // const dossiers: any[] = (await prisma.typesDocuments.findMany({
    const dossiers: any[] = (await prisma.metaDonnees.findMany({
        include:{
            // metadonnees:true
            typeDocument:true,
        }
    })) as unknown as any[];
// {
//         include:{
//             metadonnees:true
//         }

//     }
    console.log("--------------------serverDossier: ",dossiers)
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
        const data = await req.json();

        console.log("Received data:", data);

        // Ajout d'une nouvelle métadonnée
        const newMetaDonnee = await prisma.metaDonnees.create({
            data: {
                cle: data.cle,
                valeur: data.valeur,
                // typesDocID: data.documentId,
                typeDocument:{
                    connect:{
                        id:data.documentId
                    }
                }
            },
        });

        // Revalidation du cache pour la page /documents
        revalidatePath('/documents');

        return NextResponse.json({
            message: 'Métadonnée ajoutée avec succès',
            data: newMetaDonnee,
        }, { status: 201 });

    } catch (error:any) {
        console.error('Erreur lors de l\'ajout de la métadonnée:', error);

        return NextResponse.json({
            error: 'Erreur lors de l\'ajout de la métadonnée',
            details: error.message,
        }, { status: 500 });
    }
}
