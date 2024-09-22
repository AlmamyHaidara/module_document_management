'use client';
import React, {  useState } from 'react';
import ClientExpendTable from '../uikit/table/ClientExpandTable';
import { useQuery } from '@tanstack/react-query';
import DialogueCompte from '@/demo/components/DialogueCompte';
import { ClientService} from '@/demo/service/Client.service';

function ClientsComponent() {
    const [visible, setVisible] = useState(false);
    const [matricule, setMatricule] = useState<string>("");
    const { isLoading, isError, data, error, isSuccess } = useQuery({ queryKey: ["client"], queryFn: ()=> ClientService.findClient() });


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



    const findClientById = async (matricule: string) => {
        setMatricule(matricule);
        setVisible(true);
    };

    return (
        <>
            <ClientExpendTable client={data as any[]} findCLientByCode={findClientById} />

                {visible &&
            <DialogueCompte visible={visible} setVisible={setVisible} matricule={matricule}  />
}
        </>
    );
}

export default ClientsComponent;
