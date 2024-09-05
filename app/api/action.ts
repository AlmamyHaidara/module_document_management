"use server"
import { PrismaClient } from '@prisma/client';
// import { InvalidateQueryFilters, useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';


const prisma = new PrismaClient()
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
            metadonnees: true
        }
    });
    console.log("ewds",data);
    return data

}

export const fetchClientCompte = async () => {
   const data =  await prisma.compteClients.findMany({
        include: {
            client: true
        }
    });
    console.log("ewds",data);
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
const newPiece = await prisma.piece.create({
        data:option
    })
    return newPiece;
    }catch(errors){
        console.log(errors)
    }

}

export const connectPieceToTypeDocument = async (pieceId:number, docId:number)=>{
    console.log("Is update :) ", pieceId,docId)
    try{
const newPiece = await prisma.piece.update({
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
        return await prisma.piece.findMany({
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
    try {
        return await prisma.piece.delete({
            where:{
                id:id
            }
        })
    } catch (error) {
        console.error(error)
    }
}

export const fetchTypeDocuments = async ()=>{
    try{
        const typesDoc =  await prisma.typesDocuments.findMany({
            select:{
                id:true,
                code:true,
                nom_type:true,
            }
        });

        console.log("pppppppppppkkkkkkkkkkk: ",typesDoc)
        return typesDoc
    }catch(error){
        console.error(error)

    }
}
