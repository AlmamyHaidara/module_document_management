"use server"
import { PrismaClient } from '@prisma/client';
import { InvalidateQueryFilters, useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';


const prisma = new PrismaClient()
export const findTypeDocument= async()=>{
    // const queryClient = useQueryClient();

    const {  isError, data, error } = useQuery({ queryKey: ['typeDocument'], queryFn:  fetchTypeDocument });
    if(isError){
        console.log(error);

        return null
    }

    return data
}
export const fetchTypeDocument = async () => {
   const data =  await prisma.typesDocuments.findMany({
        include: {
            metadonnees: true
        }
    });
    console.log("ewds",data);
    return data

}
