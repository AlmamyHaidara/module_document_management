export const DocumentService = {

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

        return response.json();
    },

    async findDocumentByCode(code: string) {
        console.log('code', code);
        const response = await fetch(`/api/document/${code.toLowerCase()}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    },

    async findAllDocument() {
        const response = await fetch(`/api/document/`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    },

    async updateDocument(id: number, doc: any) {
        console.log("eddws",id,doc);

         // Remplacez DocumentType par any si DocumentType n'est pas défini
        const response = await fetch(`/api/document/${id}`, {
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
        return response.json();
    },

    async deleteDocument(id: number) {

        console.log("-----------DocumentApi: ", id);
        const response = await fetch(`/api/document/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log("-----------DocumentApi: ", response);
        return response.json();
    },
    async updateMetaDonnee(id: string, updatedData: any) {
        const response = await fetch(`/api/metadonnee/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) {
            throw new Error('Failed to update metadonnee');
        }
        return response.json();
    }


};

