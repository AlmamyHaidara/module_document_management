import prisma from '@/prisma/prismaClient';
import { Client, CompteClient, CompteClients } from '@/types/types';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    const clients = (await prisma.compteClients.findMany({
    include: {
            client: true,
            type_compte:true,
            // type_document:true
        }
    }))

    return NextResponse.json(clients);
}


export async function POST(req:NextRequest) {
    const compteData:CompteClients = await req.json() as CompteClients

    console.log(compteData);
    const compte = await prisma.compteClients.create({
        data: {
            matricule: compteData.matricule,
            agence: compteData.agence,
            numero_compte: compteData.numero_compte,
            code_gestionnaire: compteData.code_gestionnaire,
            client: { connect: { id: compteData.client.id } }, // Using client_id from compteData
            type_compte: {
                connect: { id: compteData.type_compte.id } // Wrapping id in an object for correct type
            },
        },

    })

    return NextResponse.json(compteData);

}
