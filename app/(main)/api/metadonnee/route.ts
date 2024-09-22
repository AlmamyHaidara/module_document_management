import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/prisma/prismaClient';


export async function GET() {
    try{
    // const dossiers: any[] = (await prisma.typesDocuments.findMany({
    const dossiers: any[] = (await prisma.metaDonnees.findMany({
        include:{
            typeDocument:{
                select:{
                    id:true,
                    code:true,
                    nom_type:true,
                    metadonnees:true,
                    pieceName:{
                        select:{
                            id:true,
                            code:true,
                            nom:true,

                        }
                    }
                }
            },

        }
    })) as unknown as any[];

    //     include:{
    //         metadonnees:true,

    //     }

    // })) as unknown as any[];
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
       let newMetaDonnee
        console.log("Received data:5", data);
        await prisma.$transaction(async (prisma) =>{

            newMetaDonnee = await prisma.metaDonnees.create({
                data: {
                    cle: data.cle,
                    valeur: data.valeur,
                    // typesDocID: data.documentId,
                    typeDocument:{
                        connect:{
                            id: data.documentId,
                            
                        }
                    }

                },
            });

            // Revalidation du cache pour la page /documents
        })
        // revalidatePath('/documents');

        return NextResponse.json({
            message: 'Métadonnée ajoutée avec succès',
            data: newMetaDonnee,
        }, { status: 201 });
        // Ajout d'une nouvelle métadonnée

    } catch (error:any) {
        console.error('Erreur lors de l\'ajout de la métadonnée:', error);

        return NextResponse.json({
            error: 'Erreur lors de l\'ajout de la métadonnée',
            details: error.message,
        }, { status: 500 });
    }
}
