import { Client, CompteClient, Dossier, Piece, MetaDonnee, DocMetaPiece } from '@/types/types';
import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();
export async function GET() {
    const dossiers: DocMetaPiece[] = (await prisma.dossiers.findMany({
        include: {
            dossierInfos: true,

            // piece: true,
            dossiers_typesDocuments: {

                include: {
                    dossier: true,
                    type_document: {
                        select: {
                            id: true,
                            code: true,
                            nom_type: true,
                            compteClient:true,
                            piece:true

                        },



                    },

                }
            }
            //   MetaDonnees: true,
            //   Piece:true,
        }
    })) as unknown as DocMetaPiece[];

    console.log('o----------------------o: ', dossiers[0].dossiers_typesDocuments[0].type_document.compteClient.id);

    return Response.json(dossiers);
}
type DataSend = {
    compteClient: any;
    id: number;
    nom: string;
    description: string;
    code: string;
    typeDocument: {
        id: number;
        code: string;
        nom_type: string;
    };
    metadonnees: { id: number; cle: string; valeur: string }[];
    newValue: { [key: string]: { cle: string; value: string } }[];
    filePaths: {
        code: string;
        path: string;
    }[];
};
/**
 *  {
  id: 0,
  nom: 'Haidara1',
  description: '',
  code: 'ZCIUGN',
  typeDocument: { id: 2, code: 'PJT75S', nom_type: 'Relever bancaire1' },
  metadonnees: [
    { cle: 'ewds', valeur: '3ewdsc' },
    { cle: 'dhg', valeur: 'sfvreadf' },
    { cle: 'k', valeur: 'rr4edsx' },
    { cle: 'e', valeur: '65865656586' }
  ],
  filePaths: [
    {
      code: 'D4FHG7',
      path: '/home/almamy/Documents/Dev/NextJs/module_document_management/uploads/chevronDown.png'
    }
  ],
  compteClient: { id: 1, code: 'RCD5258998856', nom_type: 'RCD5258998856' }
}
 */
export async function POST(req: NextRequest) {
    try {
        const data: DataSend = await req.json();
        console.log('Données reçues:', data);
        const transactionResult = await prisma.$transaction(async (prisma) => {
            const dossier = await prisma.dossiers.create({
                data: {
                    code: data.code,
                    nom: data.nom,
                    // piece: {
                    //     create: data.filePaths.map((filePath) => ({
                    //         code: filePath.code,
                    //         path: filePath.path
                    //     })) as any
                    // },
                    dossierInfos: {
                        create: data.metadonnees.map((value, index) => ({
                            cle: value.cle,
                            value: value.valeur
                        }))
                    }
                },
                include: {
                    // typeDocument: true,
                    // piece: true,
                    dossierInfos: true
                }
            });

            await prisma.dossiersToTypesDocuments.create({
                data: {
                    dossiersId: dossier.id,
                    typesdocumentsId: data.typeDocument.id
                }
            });
            return dossier;
        });
        await prisma.typesDocuments.update({
            where: {
                id: data.typeDocument.id
            },
            data: {
                compte_id:data?.compteClient.id,
            }
        });

        return new Response(JSON.stringify({ success: 'création du dossier' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        console.error('Erreur lors de la création du dossier:', error);

        return new Response(JSON.stringify({ error: 'Erreur lors de la création du dossier' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}
