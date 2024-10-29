
import { Client } from "@/types/types";
export const maxDuration = 60; 
export const ClientService = {
   async createClient(client: Client) {
        // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
        const response =  await fetch('/api/client', {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(client)
      })
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
   },

    async findClientCompte() {
        // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
        const response =  await fetch('/api/client')
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
    },
    async updateClient(id: number, clt: any) {
      console.log("eddws",id,clt);

       // Remplacez DocumentType par any si DocumentType n'est pas défini
      const response = await fetch(`/api/client/${id}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(clt)
      });

      if (!response.ok) {
          console.log("---------------ClientUpdate: ",id)
          throw new Error('Network response was not ok');
      }

      console.log("-----------UpdateDocument: ", response);
      return response.json();
    },

    async deleteClient(id: number) {

      console.log("-----------DocumentApi: ", id);
      const response = await fetch(`/api/client/${id}`, {
          method: "DELETE"
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      console.log("-----------DocumentApi: ", response);
      return response.json();
    },

    async findClient() {
        // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
        const response =  await fetch('/api/client/')
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log("ppppppfffffffffffff",response);

          return response.json();
    }

};

export async function findClient() {
    // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
    const response =  await fetch('/api/client/')
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    console.log("ppppppfffffffffffff",response);

      return response.json();
}
