'use client';

import React, { createContext, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Toast } from 'primereact/toast';
import DocumentTable from '@/app/components/DocumentTable';
import ToolbarComponent from '@/app/components/ToolbarComponent';
import ProductDialog from '@/app/components/ProductDialog';
import { documentSchema } from '@/types/zod/zod.sechma';
import { InvalidateQueryFilters, useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { DocumentService } from '@/demo/service/Document.service';
import { DocumentTypeInfo, Dossier, TypeDoc, TypeDocument, MetaDonnee, CompteMatricule } from '@/types/types';
import DossierTable from '@/app/components/DossierTable';
import { fetchTypeDocument,fetchClientCompte } from '@/app/api/action';
import { metadata } from '../../layout';
import { DossierService } from '@/demo/service/Dossier.service';

export type FieldItem = {
    id: number,
    cle: string,
    valeur: string
}

export const DossierContext = createContext({})
interface PropsType {
    dossier: Dossier[];
    findDossierByCode: (code: string) => Promise<void>;
}

const DossierExpendTable = ({ dossier, findDossierByCode }: PropsType) => {
    const { control, handleSubmit, setValue, formState: { errors }, reset, getValues } = useForm({
        resolver: zodResolver(documentSchema),
        defaultValues: {
            code: "",
            nom: "",
            description: "",
            fields: [{ id: 0, cle: "text", valeur: "" }],
        },
    });

    const queryClient = useQueryClient();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "fields",
    });

    const toast = React.useRef<Toast>(null);
    const [productDialog, setProductDialog] = React.useState(false);
    const [isUpdateMode, setIsUpdateMode] = React.useState(false);
    const [selectedDossier, setSelectedDossier] = React.useState<Dossier | null>(null);
    const [typeDoc, setTypeDoc] = React.useState<TypeDoc[]>([]);
    const [compteMatricule, setCompteMatricule] = React.useState<CompteMatricule[]>([]);
    const [meta, setMeta] = React.useState<MetaDonnee[]>([]);
    const [fileField, setFileField] = React.useState<any[]>([]);

    const openNew = () => {
        setProductDialog(true);
        setIsUpdateMode(false);
        reset({
            nom: "",
            code: "",
            // metaDonnees: [{ cle: "text", valeur: "" }],
        });
    };

    const openUpdate = (doc: Dossier) => {
        // console.log("-----------doc")
        
        console.info(doc)

        updateMutation.mutate(doc)
        setProductDialog(true);
        setIsUpdateMode(true);
        setSelectedDossier(doc);
        reset({
            nom: doc.nom,
            code: doc.code,
            // metaDonnees: doc.metaDonnees,
        });
    };

    const hideDialog = () => {
        setProductDialog(false);
        reset();
    };

    const createMutation = useMutation({
        mutationFn: (doc: Omit<TypeDocument, "id">) => DossierService.createDossier(doc),
        onSuccess: () => {
            toast.current?.show({ severity: 'success', summary: 'Document Created', detail: 'Le document a été créé avec succès', life: 3000 });
            queryClient.invalidateQueries(["dossiers"] as InvalidateQueryFilters);
            setProductDialog(false);
        },
        onError: (error) => {
            toast.current?.show({ severity: 'error', summary: 'Creation Failed', detail: 'La création du document a échoué', life: 3000 });
            console.log("onError", error);
        }
    });

    const updateMutation = useMutation({
        mutationFn: (doc: any) => {
            if (!doc.id) {
                throw new Error("Document code is required");
            }
            return DossierService.updateDossier(doc.id, doc);
        },
        onSuccess: () => {
            toast.current?.show({ severity: 'success', summary: 'Document Updated', detail: 'Le document a été mis à jour avec succès', life: 3000 });
            queryClient.invalidateQueries({ queryKey: ["dossiers"] });
        },
        onError: (error) => {
            toast.current?.show({ severity: 'error', summary: 'Update Failed', detail: 'La mise à jour du document a échoué', life: 3000 });
            console.log("onUpdateError", error);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => DossierService.deleteDossier(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dossiers"] });
            toast.current?.show({ severity: 'success', summary: 'Document Deleted', detail: 'Le document a été supprimé avec succès', life: 3000 });
        },
        onError: (error) => {
            console.log("onDeleteError", error);
            toast.current?.show({ severity: 'error', summary: 'Deletion Failed', detail: 'La suppression du document a échoué', life: 3000 });
        }
    });

    const handleCreateDossier = (newDocument: TypeDocument) => {
        createMutation.mutate(newDocument);
    };

    const handleDeleteDossier = (id: number) => {
        deleteMutation.mutate(id);
    };

    const { isPending, isSuccess, isError, data, error } = useQuery({
        queryKey: ['typeDocument'],
        queryFn: async () => await fetchTypeDocument()
    });
        const { isSuccess:isSuccessFetch, data:compteClients } = useQuery({
        queryKey: ['compteClient'],
        queryFn: async () => await fetchClientCompte()
    });

    useEffect(() => {
        if (isSuccess && data) {
            // const typeDocu: TypeDoc[] = data.map((res: any) => ({
            //     id: res.id,
            //     code: res.code,
            //     nom_type: res.nom_type,
            // }));
            console.info(data);
            
            const typeDocu: TypeDoc[] = data.map((res: any) => ({
                id: res.id,
                code: res.code,
                nom_type: res.nom_type,
                piece:res.pieceName
            }));


            const metadata: MetaDonnee[] = data.flatMap((res: any) => res.metadonnees);
            const FileField: any[] = data.flatMap((res: any) => res.piece);
            setMeta(metadata);
            // console.log(metadata);
            setTypeDoc(typeDocu);
            setFileField(FileField);

        }
    }, [isSuccess, data]);
    useEffect(() => {
        if (isSuccessFetch && compteClients) {

            // console.log("------------SuccesscompteClients",compteClients);

            const clientCompte: CompteMatricule[] = compteClients.map((res: any) => ({
                id: res.id,
                code: res.matricule,
                nom_type: res.matricule,
            }));

            // console.log("------------SuccessClientCompte",clientCompte);
            setCompteMatricule(clientCompte)
            // const metadata: MetaDonnee[] = compteClients.flatMap((res: any) => res.metadonnees);
            // setMeta(metadata);
            // console.log(metadata);
            // setTypeDoc(typeDocu);
        }
    }, [isSuccessFetch, compteClients]);

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

    const dossierContext={setMeta:setMeta,meta:meta,fileField:fileField,typeDoc:typeDoc,compteMatricule:compteMatricule}

    return (
        <DossierContext.Provider value={{dossierContext}}>
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <DossierTable
                        dossiers={dossier}
                        globalFilterValue=""
                        setGlobalFilterValue={() => { }}
                        onCreateDossier={handleCreateDossier}
                        onUpdateDossier={openUpdate}
                        onDeleteDossier={handleDeleteDossier}
                        // typeDoc={typeDoc}
                        // meta={meta}
                        // setMeta={setMeta}

                    />
                </div>
            </div>
        </div>
        </DossierContext.Provider>
    );
};

export default DossierExpendTable;
