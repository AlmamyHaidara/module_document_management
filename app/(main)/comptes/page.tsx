'use client';
import React, { useState } from 'react';
import ClientExpendTable from '../uikit/table/ClientExpandTable';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClientService } from '@/demo/service/Client.service';
import { CompteService } from '@/demo/service/Compte.service';
import { Dialog } from 'primereact/dialog';
import DialogueCompte from '@/demo/components/DialogueCompte';
import { CompteClient, TypeDocument } from '@/types/types';
import CompteExpendTable from '../uikit/table/CompteExpandTable';

function CompteComponent() {
    const [visible, setVisible] = useState(false);
    const [compte, setCompte] = useState<CompteClient & TypeDocument[]>();
    const [matricule, setMatricule] = useState<string>("");
    const { createClient } = ClientService;

    const { isLoading, isError, data, error } = useQuery({ queryKey: ['compte'], queryFn: CompteService.findClientComptes });

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

    const findCompteById = async (matricule: string) => {
        setMatricule(matricule);
        setVisible(true);
    };

    return (
        <>
            <CompteExpendTable compte={data as any[]} findCompteByCode={findCompteById} />
            {
                visible &&
            <DialogueCompte visible={visible} setVisible={setVisible} matricule={matricule}  />
            }
        </>
    );
}

export default CompteComponent;
