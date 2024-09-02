import { PrismaClient } from '@prisma/client';
import { create } from 'domain';
import { NextRequest, NextResponse } from 'next/server';
import { metadata } from '../../../layout';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
    try {
        const code = params.code;

        if (!code) {
            return NextResponse.json({ error: 'Code du document requis' }, { status: 400 });
        }

        const document = await prisma.typesDocuments.findUnique({
            where: { code: code },
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


export async function DELETE(req: NextRequest, { params }: { params: { code: string } }) {
    const code = params.code;
    try {
        await prisma.$transaction(async(prisma)=>{
            // await prisma.typesDocuments.deleteMany({
            //     where: { id: Number(code) },

            // });
            await prisma.typesDocuments.delete({
                where: { id: Number(code) },
                include:{
                    metadonnees:true,
                    dossiers_typesDocuments:true
                }

            })
            // revalidatePath("/documents",'layout')
            
        })
        
        return  Response.json({ message: 'Document supprimé avec succès' }, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la suppression du document:', error);

        return NextResponse.json({ error: 'Erreur lors de la suppression du document' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();
        console.log("ddddd",data);

        const { id, metadonnees } = data;

        console.log("Metadonneees: ",  id, metadonnees )

        await prisma.typesDocuments.update({
            where:{
                id:id
            },
            data:{
                nom_type:data.nom_type
            }
        })
        // revalidatePath("/documents",'layout')
        return NextResponse.json("Document mise a jour avec succes", { status: 200 });

    } catch (error) {
        console.error('Erreur lors de la mise à jour du document:', error);

        return NextResponse.json({ error: 'Erreur lors de la mise à jour du document' }, { status: 500 });
    }
}
