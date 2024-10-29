import { Client, CompteClient } from "@/types/types"
import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server";
import { generateID } from "../../utils/function";
import prisma from "@/prisma/prismaClient";


export const maxDuration = 5; 
export async function POST(req: NextRequest) {
  try {
      const data: any = await req.json();
      const {client,compte} = data
console.log("-******************** DATA: ",data)

   const clientCreated = await prisma.$transaction(async (prisma)=>{
        return await prisma.clients.create({
         data:{
           code: generateID(6),
           intitule: client.intitule,
           adresse: client.adresse,
           nature: client.nature,
           profession:client.profession,
           telephone: client.telephone,
           comptes: {
             create:{
                 natCompte:Number(compte.natCompte),
                 cle:Number(compte.cle),
                 libelleNatCompte:compte.libelleNatCompte,
                 chapitre:Number(compte.chapitre),
                 numero_compte: compte.numero_compte,
                 created_at: compte.created_at,
                 agences:{
                   connect:{
                       ageCreat:Number(compte.agence.ageCreat)
                   }
                 },
               type_compte:{
                   connect:{
                       id:compte.type_compte.id
                   }
               }
             },

           }
         }
        })


    })

    return NextResponse.json(JSON.stringify({ data:clientCreated && []}), {
        headers: { 'Content-Type': 'application/json' },
        status: 201,
    });


  } catch (error) {
      console.error('Erreur lors de la création du dossier:', error);

      return NextResponse.json(JSON.stringify({ error: 'Erreur lors de la création du dossier' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 500,
      });
  }
}

export async function GET() {
  try {

    const clients = await prisma.clients.findMany({
      include:{
        comptes:{
            include:{
                type_compte:true,
                agences:true,
            }
        },


      }
    })


console.log("ooooooooooooooooo,", clients);


      return NextResponse.json(clients, { status: 200 });

  } catch (error) {
      console.error('Erreur lors de la récupération du document:', error);

      return NextResponse.json({ error: 'Erreur lors de la récupération du document' }, { status: 500 });
  }
}


