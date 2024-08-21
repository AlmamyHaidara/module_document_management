import { Client, CompteClient } from "@/types/types"
import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server";
import { generateID } from "../../utils/function";


const prisma = new PrismaClient()


export async function POST(req: NextRequest) {
  try {
      const data: any = await req.json();
      const {client,compte} = data
console.log("-******************** DATA: ",data)
     const clientCreated = await prisma.clients.create({
      data:{
        code: generateID(6),
        nom: client.nom,
        prenom:client.prenom,
        adresse: client.adresse,
        nature: client.nature,
        profession:client.profession,
        telephone: client.telephone,
        comptes: {
          create:{
            agence: compte.agence,
            matricule: compte.matricule,
            numero_compte: compte.numero_compte,
            code_gestionnaire: compte.code_gestionnaire, // Added missing property

          },

        }
      }
     })


      return new Response(JSON.stringify({ data: clientCreated }), {
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

export async function GET() {
  try {

    const clients = await prisma.clients.findMany({
      include:{
        comptes:true,

      }
    })


console.log("ooooooooooooooooo,", clients);


      return NextResponse.json(clients, { status: 200 });

  } catch (error) {
      console.error('Erreur lors de la récupération du document:', error);

      return NextResponse.json({ error: 'Erreur lors de la récupération du document' }, { status: 500 });
  }
}


