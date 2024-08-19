import { Client, CompteClient,Dossier,Piece,MetaDonnee, DocMetaPiece } from '@/types/types';
import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();
export async function GET() {
    const dossiers: DocMetaPiece[] = (await prisma.dossiers.findMany({
    include: {
            // MetaDonnees: true,
            // Piece:true,
        }
    })) as unknown as  DocMetaPiece[];

    return Response.json(dossiers);
}
type DataSend =  {
  id: string,
  nom: string,
  description: string,
  code: string,
  typeDocument: {
    id: string,
    code: string,
    nom_type: string
  },
  metadonnees: { id: string, cle: string, valeur: string }[],
  newValue: {[key:string]:{ cle: string, value: string }}[],
  filePaths: {
    code:string,
    path:string
  }[]
}

export async function POST(req:NextRequest){
    try {
        const data: DataSend = await req.json();
        console.log('Données reçues:', data.newValue);

        const dossier = await prisma.dossiers.create({
          data: {
              code: data.code,
              description: data.description,
              nom: data.nom,
              typeDocument: {
                  create: {
                    code: data.typeDocument.code,
                      nom_type: data.typeDocument.nom_type,
                  }
              },
              piece: {
                  create: data.filePaths.map(filePath => ({
                      code: filePath.code,
                      path: filePath.path
                  })) as any,
              },
              dossierInfos: {
                  create: data.newValue.map(value => ({
                    cle: value.cle,
                    value: value.value
                })) as any

              }
          },
          include: {
              typeDocument: true,
              piece: true,
              dossierInfos: true,
          }
      });
        return new Response(JSON.stringify({ success: 'création du dossier' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error('Erreur lors de la création du dossier:', error);

        return new Response(JSON.stringify({ error: 'Erreur lors de la création du dossier' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}
