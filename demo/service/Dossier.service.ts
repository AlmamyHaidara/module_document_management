import { Demo } from '@/types';

export const DossierService = {
    async findDossierByCode(code: string) {
        console.log('code', code);
        // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
        const response = await fetch(`/api/dossier/${code.toLowerCase()}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    },
    async findAllDossier() {
        // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
        const response = await fetch(`/api/dossier/`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }
};
