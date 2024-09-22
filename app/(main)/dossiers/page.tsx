
'use client';
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClientService } from '@/demo/service/Client.service';
import { CompteService } from '@/demo/service/Compte.service';
import { Dialog } from 'primereact/dialog';
import DialogueCompte from '@/demo/components/DialogueCompte';
import { CompteClient, TypeDocument } from '@/types/types';
import DossierExpendTable from '../uikit/table/DossierExpandTable';
import { DossierService } from '@/demo/service/Dossier.service';
import DialogDossier from '@/demo/components/DialogDossier';

function DossierComponent() {
    const [visible, setVisible] = useState(false);
    const [code, setCode] = useState<CompteClient & TypeDocument[]>();
    const [matricule, setMatricule] = useState<string>("");
    const { findAllDossier } = DossierService;

    const { isPending, isError, data, error } = useQuery({ queryKey: ["dossiers"], queryFn: findAllDossier });

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

    const findDossier = async (dossierCode:string) => {
        setMatricule(dossierCode);
        setVisible(true);
    };

    return (
        <>
            <DossierExpendTable dossier={data} findDossierByCode={findDossier} />
            {
                visible &&
            <DialogDossier visible={visible} setVisible={setVisible} code={matricule}  />
            }
        </>
    );
}

export default DossierComponent;
