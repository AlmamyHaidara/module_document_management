import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';


const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    console.log("''''''''''''''''''',",id);

    try {
        const tt = await prisma.metaDonnees.deleteMany({
            where: { id: id },
        });

        console.log("''''''''''''''''''',",tt);
        return NextResponse.json({ message: 'Métadonnée supprimée avec succès' }, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la suppression de la métadonnée:', error);

        return NextResponse.json({ error: 'Erreur lors de la suppression de la métadonnée' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const cle = params.id;
    console.log("ooooooooooooo",cle);

    const data = await req.json();

    try {
        const metaDonnee = await prisma.metaDonnees.findFirst({
            select: { id: true },
            where: { cle: cle },
        });

        if (!metaDonnee) {
            return NextResponse.json({ error: 'Métadonnée non trouvée' }, { status: 404 });
        }

        const updatedMetaDonnee = await prisma.metaDonnees.update({
            where: { id: metaDonnee.id },
            data: {
                cle: data.cle,
                valeur: data.valeur,
            }
        });
        revalidatePath("/documents",'layout')

        return NextResponse.json({ message: 'Métadonnée mise à jour avec succès', data: updatedMetaDonnee }, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la métadonnée:', error);

        return NextResponse.json({ error: 'Erreur lors de la mise à jour de la métadonnée' }, { status: 500 });
    }
}
