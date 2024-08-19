import { Client, CompteClient } from '@/types/types';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();
export async function PUT(req: Request, { params }: { params: { matricule: string } }) {

    try{
        const {matricule} =params
        const data = await req.json()
        console.log("----------data:", data)
        console.log("----------data:", matricule)

       const newCompteClient =  await prisma.compteClients.update({
            where:{
                matricule:matricule,
                id:data.id
            },
            data: {
            agence: data.agence,
            client: { connect: { id: data.client.id } }, // Using client_id from compteData
            type_compte: {
                connect: { id: data.type_compte.id } // Wrapping id in an object for correct type
            },}
        })
        return new Response(JSON.stringify({ data: newCompteClient }), {
            headers: { 'Content-Type': 'application/json' },
            status: 201,
        });

    }catch(error){
        console.error('Erreur lors de la mise à jour du document:', error);

        return NextResponse.json({ error: 'Erreur lors de la mise à jour du document' }, { status: 500 });

    }
    }

    export async function DELETE(req:NextRequest,{ params }: { params: { matricule: {id:number} } }) {
        try{
            const {matricule} =params
            console.log("----------data:", Number(matricule))

            const existingCompteClient = await prisma.compteClients.findUnique({
                where: {
                    id: Number(matricule),
                },
            });

            if (!existingCompteClient) {
                return NextResponse.json({ error: 'Compte not found' }, { status: 404 });
            }

              await prisma.compteClients.delete({
                where: {
                    id: Number(matricule),
                },
            });

            return new Response("Compte suprimer avec success", {
                headers: { 'Content-Type': 'application/json' },
                status: 201,
            });

        }catch(error){
            console.error('Erreur lors de la mise à jour du document:', error);

            return NextResponse.json({ error: 'Erreur lors de la mise à jour du document' }, { status: 500 });

        }

    }
