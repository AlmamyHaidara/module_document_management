"use client";
import React, { useState,useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClientService } from '@/demo/service/Client.service';
import { CompteService } from '@/demo/service/Compte.service';
import { Dialog } from 'primereact/dialog';
import DialogueCompte from '@/demo/components/DialogueCompte';
import { CompteClient, TypeDocument } from '@/types/types';
import DialogDossier from '@/demo/components/DialogDossier';
import DocumentExpendTable from '../uikit/table/DocumentExpandTable';
import { DocumentService } from '@/demo/service/Document.service';

function DocumentComponent() {
    const [visible, setVisible] = useState(false);
    const [code, setCode] = useState<CompteClient & TypeDocument[]>();
    const [matricule, setMatricule] = useState<string>('');
    const { findAllDocument } = DocumentService;

    const { isPending, isError, data, error } = useQuery({ queryKey: ['document'], queryFn: findAllDocument });

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
            <DocumentExpendTable document={data as any[]} findDocumentByCode={findDocumentByCode} />
            {visible && <DialogDossier visible={visible} setVisible={setVisible} code={matricule} />}
        </div>
    );
}

export default DocumentComponent;
