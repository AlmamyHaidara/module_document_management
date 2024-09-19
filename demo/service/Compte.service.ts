import { CompteClient } from "@/types/types";
import { NextRequest, NextResponse } from 'next/server';


export const CompteService = {
    async createCompte(compte: CompteClient) {
        // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
        const response = await fetch('/api/compte', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(compte)
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return NextResponse.json({});
    },

    async findClientComptes() {
        // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
        const response = await fetch('/api/compte')
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return NextResponse.json({});
    },
    async updateCompte(matricule: string, compte: any) {
        console.log("eddws", matricule, compte);

        // Remplacez DocumentType par any si DocumentType n'est pas défini
        const response = await fetch(`/api/compte/${matricule}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(compte)
        });

        if (!response.ok) {
            console.log("---------------CompteUpdate: ", matricule)
            throw new Error('Network response was not ok');
        }

        console.log("-----------UpdateDocument: ", response);
        return NextResponse.json({});
    },

    async deleteCompte(id: number) {
try{
console.log("-----------DocumentApi: ", id);
        const response = await fetch(`/api/compte/${id}`, {
            method: "DELETE"
        }); console.log("-----------DocumentApi: ", response);
        return response.ok;
}catch(error){
    console.log("-----------ErrorLog: ", error);

    throw new Error('Network response was not ok');

}


        // if (!response.ok) {
        //     throw new Error('Network response was not ok');
        // }


    },

    async findCompte() {
        // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
        const response = await fetch('/api/compte')
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return NextResponse.json({});
    }
};
