import prisma from '@/prisma/prismaClient';
import { Client, CompteClient, DocMetaPiece, TypeDocument } from '@/types/types';
import { PrismaClient } from '@prisma/client';

export async function GET(req: Request, { params }: { params: { code: string } }) {
    console.log('compte/api', req);
    const dossier: DocMetaPiece[] & TypeDocument[] = (await prisma.dossiers.findFirst({
        where: {

            code: params.code
        },
        // include: {
        //     MetaDonnees: true,
        //     Piece:true,
        //     typeDocument:true
        // }
    })) as unknown as DocMetaPiece[] & TypeDocument[];

    return Response.json(dossier);
}
