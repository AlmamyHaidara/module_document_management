import { Client, CompteClient } from '@/types/types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function GET() {
    const clients: CompteClient[] = (await prisma.compteClients.findMany({
    include: {
            TypesDocuments: true
        }
    })) as unknown as  CompteClient[];

    return Response.json(clients);
}
