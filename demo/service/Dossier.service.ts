
export const DossierService = {

    async createDossier(dossier: any) {
        const response = await fetch(`/api/dossier/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dossier)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return {};
    },


    async findDossierByCode(code: string) {
        console.log('code', code);
        // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
        const response = await fetch(`/api/dossier/${code.toLowerCase()}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return {};
    },
    async findAllDossier() {
        // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
        const response = await fetch(`/api/dossier/`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return {};
    },

    async updateDossier(id: any, dossier: any) {
        // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
        const response = await fetch(`/api/dossier/${id}`,{
            method:"PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dossier)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return {};
    },
    async deleteDossier(id: number) {

        console.log("-----------DocumentApi: ", id);
        const response = await fetch(`/api/dossier/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log("-----------DocumentApi: ", response);
        return {};
    },



};
