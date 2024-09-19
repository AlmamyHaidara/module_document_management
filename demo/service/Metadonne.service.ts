
export const MetaDonneServices = {

    async createDocument(document: any) {
        const response = await fetch(`/api/document/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(document)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return {};
    },
    async addMetaDonnee(documentId: string, newField: any) {

        console.log("[[[[[[[[[[[", documentId, newField,{ documentId, ...newField });
        const response = await fetch(`/api/metadonnee`, {
            method: 'POST',
            body: JSON.stringify({ documentId, ...newField }),
        });
        console.log("response",response);

        if (!response.ok) {
            throw new Error('Failed to add new metadonnee');
        }
        return {};
    },
    async findDocumentByCode(code: string) {
        console.log('code', code);
        const response = await fetch(`/api/document/${code.toLowerCase()}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return {};
    },

    async findAllMetadonne() {
        const response = await fetch(`/api/metadonnee/`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return {};
    },

    async updateDocument(id: number, doc: any) {
        console.log("eddws",id,doc);

         // Remplacez DocumentType par any si DocumentType n'est pas défini
        const response = await fetch(`/api/metadonnee/doc/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(doc)
        });

        if (!response.ok) {
            console.log("---------------DocumentUpdate: ",id)
            throw new Error('Network response was not ok');
        }

        console.log("-----------UpdateDocument: ", response);
        return {};
    },

    async deleteMetaDonnee(id: number) {

        console.log("-----------DocumentApi: ", id);
        const response = await fetch(`/api/metadonnee/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log("-----------DocumentApi: ", response);
        return {};
    },
    async updateMetaDonnee(id: string, updatedData: any) {
        const response = await fetch(`/api/metadonnee/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) {
            throw new Error('Failed to update metadonnee');
        }
        return {};
    },
    // async deleteMetaDonnee(id: number) {
    //     console.log("-------deleteMetaDonne: ",id);


    //     const response = await fetch(`/api/metadonnee/${id}`, {
    //         method: 'DELETE',
    //     });
    //     if (!response.ok) {
    //         throw new Error('Failed to delete metadonnee');
    //     }
    //     return {};
    // }


};

