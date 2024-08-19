"use client"

import { CompteClient, TypeDocument, Piece } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { TreeTable } from 'primereact/treetable';
import React from 'react';
import { DossierService } from '../service/Dossier.service';
import NavStep from './NavStep';

type PropsType ={
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    code:string;

}
function DialogDossier({ visible = false, setVisible,code }: PropsType) {
    // console.log(compte.TypesDocuments)
    const { isPending, isError, data, error } = useQuery({ queryKey: ['`dossier'], queryFn: ()=>DossierService.findDossierByCode(code) });
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
    console.log("ppp",data)
}
    return (
        <>
            <Dialog
                header={`Le dossier ${data.code} `}
                visible={visible}
                maximizable
                style={{ width: '50vw' }}
                onHide={() => {
                    if (!visible) return;
                    setVisible(false);
                }}
            >
                <div className="m-0 ">
                    <p><strong>Description: </strong><br/>{data.description} </p>


                    <p><strong>Les piece relier a ce dossier</strong></p>
                    <div>
                        <ul>
                    {
                        data.Piece.map((res:Piece)=>(
                            <li>
                                {res.nom}
                            </li>
                        ))
                    }

                        </ul>
                    </div>
                    <p><strong>Liste des meta donnee</strong></p>
                    <DataTable value={data.MetaDonnees} sortMode="multiple" tableStyle={{ minWidth: '50rem' }}>
                        <Column field="id" header="ID" sortable style={{ width: '25%' }}></Column>
                        <Column field="cle" header="Cle" sortable style={{ width: '25%' }}></Column>
                        <Column field="valeur" header="Valeur" sortable style={{ width: '25%' }}></Column>
                    </DataTable>


                </div>
            </Dialog>
        </>
    );
}

export default DialogDossier;
