'use client';
import React, { useState } from 'react';
import RowExpandTable from '../uikit/table/ClientExpandTable';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClientService } from '@/demo/service/Client.service';
import { CompteService } from '@/demo/service/Compte.service';
import { Dialog } from 'primereact/dialog';
import DialogueCompte from '@/demo/components/DialogueCompte';
import { CompteClient, TypeDocument } from '@/types/types';

function ClientsComponent() {
    const [visible, setVisible] = useState(false);
    const [compte, setCompte] = useState<CompteClient & TypeDocument[]>();
    const [matricule, setMatricule] = useState<string>("");
    const { createClient } = ClientService;

    const { isPending, isError, data, error } = useQuery({ queryKey: ['`client'], queryFn: createClient });

    if (isPending) {
        return (
            <div className="w-full h-full flex align-items-center justify-content-center">
                <span>Loading...</span>
            </div>
        );
    }

    if (isError) {
        return <span>Error: {error.message}</span>;
    }

    const findClientCompte = async (matricule: string) => {
        setMatricule(matricule);
        setVisible(true);
    };

    return (
        <>
            <RowExpandTable clients={data} findClientCompte={findClientCompte} />
            {
                visible &&
            <DialogueCompte visible={visible} setVisible={setVisible} matricule={matricule}  />
            }
        </>
    );
}

export default ClientsComponent;
