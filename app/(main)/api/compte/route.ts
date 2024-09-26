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
            cle:0,
            libelleNatCompte:"",
            natCompte:0,
            chapitre: 0,
            numero_compte: compteData.numero_compte,
            client: { connect: { id: compteData.client.id } }, // Using client_id from compteData
            agences:{
                connectOrCreate:{
                    where:{
                        id:0,
                        ageCreat:0,
                    },
                    create:{
                        libAgence:"",
                        ageCreat:0,
                    },
                }
            },
            type_compte: {
                connect: { id: compteData.type_compte.id } // Wrapping id in an object for correct type
            },
        },

    })

    return NextResponse.json(compteData);

}
