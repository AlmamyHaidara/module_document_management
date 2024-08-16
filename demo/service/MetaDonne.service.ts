export const MetaDonneService = {

    async addMetaDonnee(documentId: string, newField: any) {

        console.log("[[[[[[[[[[[", documentId, newField);
        const response = await fetch(`/api/metadonnee`, {
            method: 'POST',
            body: JSON.stringify({ documentId, ...newField }),
        });
        console.log("response",response);

        if (!response.ok) {
            throw new Error('Failed to add new metadonnee');
        }
        return response.json();
    },
    async updateMetaDonnee(id: string, updatedData: any) {
        console.log("-----------updatedData",updatedData);

        const response = await fetch(`/api/metadonnee/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) {
            throw new Error('Failed to update metadonnee');
        }
        return response.json();
    },

    async deleteMetaDonnee(id: number) {
        console.log("-------deleteMetaDonne: ",id);


        const response = await fetch(`/api/metadonnee/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete metadonnee');
        }
        return response.json();
    }



};

