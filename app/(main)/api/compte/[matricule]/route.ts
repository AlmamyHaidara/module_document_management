import { Client, CompteClient } from '@/types/types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function GET(req: Request, { params }: { params: { matricule: 'mat123' } }) {
    console.log('compte/api', req);
    const clients: Client[] & CompteClient[] = (await prisma.compteClients.findFirst({
        where: {
            matricule: params.matricule
        },
        include: {
            TypesDocuments: true
        }
    })) as unknown as Client[] & CompteClient[];

    return Response.json(clients);
}
