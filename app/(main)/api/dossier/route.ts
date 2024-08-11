import { Client, CompteClient,Dossier,Piece,MetaDonnee, DocMetaPiece } from '@/types/types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function GET() {
    const dossiers: DocMetaPiece[] = (await prisma.dossiers.findMany({
    include: {
            MetaDonnees: true,
            Piece:true,
        }
    })) as unknown as  DocMetaPiece[];

    return Response.json(dossiers);
}
