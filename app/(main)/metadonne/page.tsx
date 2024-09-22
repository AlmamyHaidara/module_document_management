"use client";
import React, { useState,useEffect, Suspense } from 'react';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClientService } from '@/demo/service/Client.service';
import { CompteService } from '@/demo/service/Compte.service';
import { MetaDonneServices } from '@/demo/service/Metadonne.service';
import { Dialog } from 'primereact/dialog';
import DialogueCompte from '@/demo/components/DialogueCompte';
import { CompteClient, TypeDocument } from '@/types/types';
import DialogDossier from '@/demo/components/DialogDossier';
import { DocumentService } from '@/demo/service/Document.service';
import MetaDonnetExpendTable from '../uikit/table/MetaDonneExpandTable';

function DocumentComponent() {
    const [visible, setVisible] = useState(false);
    const [code, setCode] = useState<CompteClient & TypeDocument[]>();
    const [matricule, setMatricule] = useState<string>('');
    const { findAllMetadonne } = MetaDonneServices;

    const { isPending, isError, data, error } = useQuery({ queryKey: ['metadonne'], queryFn: findAllMetadonne });

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

    const findDocumentByCode = async (dossierCode: string) => {
        setMatricule(dossierCode);
        setVisible(true);
    };



    return (
        <div>
                <Suspense fallback={<>Loading...</>}>
            <MetaDonnetExpendTable document={data} findDocumentByCode={findDocumentByCode} />
                </Suspense>
            {visible && <DialogDossier visible={visible} setVisible={setVisible} code={matricule} />}
        </div>
    );
}

export default DocumentComponent;
