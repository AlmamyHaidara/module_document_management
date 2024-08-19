'use client';
import React, { useState } from 'react';
import RowExpandTable from '../uikit/table/ClientExpandTable';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClientService } from '@/demo/service/Client.service';
import { CompteService } from '@/demo/service/Compte.service';
import { Dialog } from 'primereact/dialog';
import DialogueCompte from '@/demo/components/DialogueCompte';
import { CompteClient, TypeDocument } from '@/types/types';
import ComptExpendTable from '../uikit/table/CompteExpandTable';

function CompteComponent() {
    const [visible, setVisible] = useState(false);
    const [compte, setCompte] = useState<CompteClient & TypeDocument[]>();

    const { isPending, isError, data, error } = useQuery({ queryKey: ['`compte'], queryFn:CompteService.findClientComptes });
    if (isPending) {
        return (
            <div className="w-full h-full flex align-items-center justify-content-center">
                <span>Loading...</span>
            </div>
        );
        return <span className="loading loading-ball loading-lg"></span>;
    }

    if (isError) {
        return <span>Error: {error.message}</span>;
    }

    const findClientCompte = async (matricule: string) => {
        console.log(matricule);
        const comptesClient = await CompteService.findClientCompte(matricule);
        setCompte(comptesClient);
        setVisible(true);
        console.dir(comptesClient);
    };

    const findCompte = async () => {
        const comptesClientt = await CompteService.findClientComptes();

        console.log(comptesClientt);
    };

    return (
        <>
            <ComptExpendTable comptesClient={data} findCompte={findCompte} />
            {/* {
                visible &&
            <DialogueCompte visible={visible} setVisible={setVisible}  />
            } */}
        </>
    );
}

export default CompteComponent;
