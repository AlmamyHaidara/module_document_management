import { Demo } from '@/types';

export const CompteService = {
    async findClientCompte(matricule: string) {
        console.log('matricule', matricule);
        // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
        const response = await fetch(`/api/compte/${matricule.toLowerCase()}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    },
    async findClientComptes() {
        // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
        const response = await fetch(`/api/compte/`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }
};
