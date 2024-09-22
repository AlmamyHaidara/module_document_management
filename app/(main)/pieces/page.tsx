'use client';
import React, {  useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DialogueCompte from '@/demo/components/DialogueCompte';
import { CompteClient, TypeDocument } from '@/types/types';
import { PieceService} from '@/demo/service/Piece.service';
import PieceExpendTable from '../uikit/table/PieceExpandTable';


function ClientsComponent() {
    const [visible, setVisible] = useState(false);
    const [matricule, setMatricule] = useState<string>("");
    const { isLoading, isError, data, error, isSuccess } = useQuery({ queryKey: ["piece"], queryFn: ()=> PieceService.findPiece() });


    if (isLoading) {

        return (
            <div className="w-full h-full flex align-items-center justify-content-center">
                <span>Loading...</span>
            </div>
        );
    }

    if (isError) {
        return <span>Error: {error.message}</span>;
    }
    
    if (isSuccess) {
        console.log("----------data: ",data)
    }



    const findClientById = async (matricule: string) => {
        setMatricule(matricule);
        setVisible(true);
    };

    return (
        <>
            <PieceExpendTable piece={data as any[]} findCLientByCode={findClientById} />

                {visible &&
            <DialogueCompte visible={visible} setVisible={setVisible} matricule={matricule}  />
}
        </>
    );
}

export default ClientsComponent;
