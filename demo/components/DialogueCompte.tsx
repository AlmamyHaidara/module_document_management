"use client"

import { CompteClient, TypeDocument } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { TreeTable } from 'primereact/treetable';
import React from 'react';
import { CompteService } from '../service/Compte.service';

type PropsType ={
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    matricule:string;

}
function DialogueCompte({ visible = false, setVisible,matricule }: PropsType) {
    // console.log(compte.TypesDocuments)
    const { isPending, isError, data, error } = useQuery({ queryKey: ['compte'], queryFn: ()=>CompteService.findClientCompte(matricule) });
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
    // const comptesClient = await CompteService.findClientCompte(matricule);
    if(data){
        console.log(data)
    }
    return (
        <>
            <Dialog
                header={`Le compte numéro: ${data.numero_compte} `}
                visible={visible}
                maximizable
                style={{ width: '50vw' }}
                onHide={() => {
                    if (!visible) return;
                    setVisible(false);
                }}
            >
                <div className="m-0 ">
                    <p>Matricule: {data.matricule} </p>
                    <p>Le code gèstionnaire: {data.code_gestionnaire} </p>
                    <p>Type de compte: {data.type_compte} </p>
                    <DataTable value={data.TypesDocuments} sortMode="multiple" tableStyle={{ minWidth: '50rem' }}>
                        <Column field="code" header="code" sortable style={{ width: '25%' }}></Column>
                        <Column field="nom_type" header="nom_type" sortable style={{ width: '25%' }}></Column>
                        <Column field="compte_client_id" header="Compte ID" sortable style={{ width: '25%' }}></Column>
                    </DataTable>

                </div>
            </Dialog>
        </>
    );
}

export default DialogueCompte;
