
import { Client } from "@/types/types";
import { NextRequest, NextResponse } from 'next/server';

export const PieceService = {
   async createPiece(client: Client) {
        // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
        const response =  await fetch('/api/piece', {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(client)
      })
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return NextResponse.json({});
   },

//     async findClientCompte() {
//         // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
//         const response =  await fetch('/api/client')
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return NextResponse.json({});
//     },
//     async updateClient(id: number, clt: any) {
//       console.log("eddws",id,clt);

//        // Remplacez DocumentType par any si DocumentType n'est pas défini
//       const response = await fetch(`/api/client/${id}`, {
//           method: "PUT",
//           headers: {
//               "Content-Type": "application/json"
//           },
//           body: JSON.stringify(clt)
//       });

//       if (!response.ok) {
//           console.log("---------------ClientUpdate: ",id)
//           throw new Error('Network response was not ok');
//       }

//       console.log("-----------UpdateDocument: ", response);
//       return NextResponse.json({});
//     },

//     async deleteClient(id: number) {

//       console.log("-----------DocumentApi: ", id);
//       const response = await fetch(`/api/client/${id}`, {
//           method: "DELETE"
//       });

//       if (!response.ok) {
//           throw new Error('Network response was not ok');
//       }

//       console.log("-----------DocumentApi: ", response);
//       return NextResponse.json({});
//     },

    async findPiece() {
        // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
        const response =  await fetch('/api/piece/')
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log("ppppppfffffffffffff",response);

          return NextResponse.json({});
    }



// export async function findClient() {
//     // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
//     const response =  await fetch('/api/client/')
//     if (!response.ok) {
//         throw new Error('Network response was not ok');
//     }
//     console.log("ppppppfffffffffffff",response);

//       return NextResponse.json({});
// }
}
