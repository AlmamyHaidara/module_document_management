import { Client, CompteClient, Dossier, Piece, MetaDonnee, DocMetaPiece } from '@/types/types';
import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();
export async function GET() {
    const dossiers: DocMetaPiece[] = (await prisma.typesDocuments.findMany({
        include: {

        }
    })) as unknown as DocMetaPiece[];

    return Response.json(dossiers);
}

export async function POST(req: NextRequest) {
    try {
        const data:any = await req.json();
        console.log('Données reçues:', data);

        const metadonne:{id:number }[] = []
        for (const field of data.fields) {
            const tt =  await prisma.metaDonnees.create({
                data:field,
            })
            metadonne.push({id:tt.id})
        }

        const newDossier = await prisma.typesDocuments.create({
            data: {
                code: data.code,
                nom_type: data.nom_type,
                metadonnees:{
                    connect: metadonne
                }
            },
        });
        console.log(newDossier);

        return new Response(JSON.stringify({data:{...newDossier,newDossier}}), {
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

