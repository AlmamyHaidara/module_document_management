

export const DocumentService = {

    async createDocument(document:any){
        console.log("-----------DocumentApi: ", document.nom_type)
        const response = await fetch(`/api/document/`,{
            method:"POST",
            body: JSON.stringify(document)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }


        return response.json();
    },
    async findDocumentByCode(code: string) {
        console.log('code', code);
        // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
        const response = await fetch(`/api/document/${code.toLowerCase()}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    },
    async findAllDocument() {
        // return fetch('https://freetestapi.com/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
        const response = await fetch(`/api/document/`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log("-----------DocumentApi: ", response)
        return response.json();
    },

    async updateDocument(id: string, doc: DocumentType){
        const response = await fetch(`/api/document/${id}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log("-----------DocumentApi: ", response)
        return response.json();
    }
,
    async deleteDocument(id: string){
        const response = await fetch(`/api/document/${id}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log("-----------DocumentApi: ", response)
        return response.json();
    }
};
