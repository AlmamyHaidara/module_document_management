export const MetaDonneService = {


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

