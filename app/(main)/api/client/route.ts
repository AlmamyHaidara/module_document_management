import { Client, CompteClient } from "@/types/types"
import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server";


const prisma = new PrismaClient()


export async function POST(req: NextRequest) {
  try {
      const data: any = await req.json();

     const client = await prisma.clients.create({
      data:data
     })

      return new Response(JSON.stringify({ data: client }), {
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

    const clients = await prisma.clients.findMany()


      return NextResponse.json(clients, { status: 200 });

  } catch (error) {
      console.error('Erreur lors de la récupération du document:', error);

      return NextResponse.json({ error: 'Erreur lors de la récupération du document' }, { status: 500 });
  }
}


