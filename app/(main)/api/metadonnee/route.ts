import { Client, CompteClient, Dossier, Piece, MetaDonnee, DocMetaPiece } from '@/types/types';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';


const prisma = new PrismaClient();


export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        console.log("uuuuuuuuu",data);

        // Ajout d'une nouvelle métadonnée
        const newMetaDonnee = await prisma.metaDonnees.create({
            data: {
                cle: data.cle,
                valeur: data.valeur,
            }
        });
        revalidatePath("/documents",'layout')

        return NextResponse.json({ message: 'Métadonnée ajoutée avec succès', data: newMetaDonnee }, { status: 201 });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la métadonnée:', error);

        return NextResponse.json({ error: 'Erreur lors de l\'ajout de la métadonnée' }, { status: 500 });
    }
}
