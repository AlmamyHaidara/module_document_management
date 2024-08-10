import { Demo } from '@/types';

export const ClientService = {
   async createClient() {
        // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
        const response =  await fetch('/api/client')
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
    },
    async updateClient(){
        const response= await fetch("https://freetestapi.com/api/v1/products")
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
    },
    async deleteClient() {
        // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
        const response =  await fetch('https://freetestapi.com/api/v1/products')
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
    },

    async findClient() {
        // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
        const response =  await fetch('https://freetestapi.com/api/v1/products')
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
    }
};
