import { Client, CompteClient, DocMetaPiece, TypeDocument } from '@/types/types';
import { PrismaClient } from '@prisma/client';
import { create } from 'domain';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();
export async function GET(req: Request, { params }: { params: { code: string } }) {
    console.log('compte/api', req);
    const dossier: DocMetaPiece[] & TypeDocument[] = (await prisma.dossiers.findFirst({
        where: {

            code: params.code
        },

    })) as unknown as DocMetaPiece[] & TypeDocument[];

    return NextResponse.json(dossier);
}

export async function PUT(req: Request, { params }: { params: { code: string } }) {
    try {
        const data = await req.json();

        console.log('--------------------data: ', data);
        console.log('--------------dossier', params);

        console.log('compte/api', params);
        let dossier
        await prisma.$transaction(async (prisma)=>{
            dossier = await prisma.dossiers.update({
                where: {
                    id: Number(params.code),
                },
                data: {
                    nom: data.nom,
                    piece: {
                        upsert: data.filePaths.map((item: any) => ({
                            where: { id: item.id || 0 },
                            update: {
                                code: item.code,
                                path: item.path,
                            },
                            create: {
                                code: item.code,
                                path: item.path,
                                // dossierId: Number(params.code),
                                // dossier: { connect: { id: Number(params.code) } }, // Liaison correcte avec `Dossier`

                            },
                        })),
                    },
                    dossierInfos: {
                        updateMany: data.metadonnees.map((value: any) => ({
                            where: { cle: value.cle },
                            data: {
                                value: value.value,
                            },
                        })),
                    },
                },
            });

        })
        console.log(dossier);

        return NextResponse.json(dossier);
    } catch (error) {
        console.error('Erreur lors de la création du dossier:', error);

        return new Response(JSON.stringify({ error: 'Erreur lors de la création du dossier' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }

}

export async function DELETE(req:Request,{params}:{params:{code:string}}){
    try {

        await prisma.$transaction(async(prisma)=>{

            await prisma.dossiers.deleteMany({
                where:{
                    id: Number(params.code)
                }
            })
        })

        return NextResponse.json({
            message:"Le dossier a ete suprimer avec success"
        })
    } catch (error) {
        console.error('Erreur lors de la création du dossier:', error);

        return new Response(JSON.stringify({ error: 'Erreur lors de la création du dossier' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}
