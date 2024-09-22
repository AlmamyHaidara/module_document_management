"use server"
import prisma from '@/prisma/prismaClient';
import { PrismaClient } from '@prisma/client';
// import { InvalidateQueryFilters, useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';


// export const findTypeDocument= async()=>{
//     // const queryClient = useQueryClient();

//     const {  isError, data, error } = useQuery({ queryKey: ['typeDocument'], queryFn:  fetchTypeDocument });
//     if(isError){
//         console.log(error);

//         return null
//     }

//     return data
// }
export const fetchTypeDocument = async () => {
   const data =  await prisma.typesDocuments.findMany({
        include: {
            metadonnees: true,
            pieceName:true
        }
    });
    return data

}

export const fetchClientCompte = async () => {
   const data =  await prisma.compteClients.findMany({
        include: {
            client: true,

        }
    });
    return data

}

export const fetchClientCode = async ()=>{
    const data= await prisma.clients.findMany({
        select:{
            id:true,
            code:true
        }
    })
    console.log("--------------hfjdklk;l",data)
    return data
}

export const createOption = async (option:{name:string})=>{
    try{
const newOption = await prisma.typeCompte.create({
        data:option
    })
    return newOption;
    }catch(errors){
        console.log(errors)
    }

}

export const createPiece = async (option:{nom:string,code:string})=>{
    try{
const newPiece = await prisma.pieceName.create({
        data:option
    })

    console.log("ooooo",newPiece)
    return newPiece;
    }catch(errors){
        console.log(errors)
    }

}

export const connectPieceToTypeDocument = async (pieceId:number, docId:number)=>{
    console.log("Is update :) ", pieceId,docId)
    try{
const newPiece = await prisma.pieceName.update({
    where:{
        id:pieceId
    },
        data:{
            typesDocuments:{
                connect:{
                    id: docId
                }
            }
        }
    })
    return newPiece;
    }catch(errors){
        console.log(errors)
    }

}

export const fetchOption = async()=>{
    try {
        return await prisma.typeCompte.findMany()
    } catch (error) {
        console.error(error)
        return []
    }
}

export const fetchPiece = async()=>{
    try {
        return await prisma.pieceName.findMany({
            select:{
                id:true,
                code:true,
                nom:true
            }
        })
    } catch (error) {
        console.error(error)
        return []
    }
}

export const fetchDossier = async()=>{
    try {
        return await prisma.dossiers.findMany({
            select:{
                id:true,
                code:true,
                nom:true
            }
        })
    } catch (error) {
        console.error(error)
        return []
    }
}

export const attachPieceToDossier = async (pieceId:number, dossierId:number)=>{
    try {
       
        return await prisma.piece.update({
            where:{
                id:pieceId
            },
            data:{
                dossierId:dossierId
            },

        })
        
    } catch (error) {
        console.error(error)
        return {}
    }
}


export const deleteOption = async (id:number)=>{
    try {
        return await prisma.typeCompte.delete({
            where:{
                id:id
            }
        })
    } catch (error) {
        console.error(error)
    }
}

export const deletePiece = async (id:number)=>{
    console.log("pppppppppppppp,",id);
    
    try {
        return await prisma.pieceName.delete({
            where:{
                id:id
            }
        })
    } catch (error) {
        console.error(error)
        return false
    }
}


export const deletedPiece = async (id:number)=>{
    console.log("pppppppppppppp,",id);
    
    try {
        return await prisma.piece.deleteMany({
            where:{
                id:id
            }
        })
    } catch (error) {
        console.error(error)
        return false
    }
}

export const fetchTypeDocuments = async ()=>{
    try{
        const typesDoc =  await prisma.typesDocuments.findMany({
            select:{
                id:true,
                code:true,
                nom_type:true,
                pieceName:true
            }
        });

        console.log("pppppppppppkkkkkkkkkkk: ",typesDoc)
        return typesDoc
    }catch(error){
        console.error(error)

    }
}
