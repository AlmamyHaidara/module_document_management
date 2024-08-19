import React,{useEffect} from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Toast } from 'primereact/toast';
import { documentSchema } from '@/types/zod/zod.sechma';
import { InvalidateQueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';
import {  CompteClient, TypeDocument } from '@/types/types';
import CompteTable from '@/app/components/CompteTable';
import { CompteService } from '@/demo/service/Compte.service';

export type FieldItem = {
    id:number,
    cle: string,
    valeur: string
}

interface PropsType {
    compte: CompteClient[];
    findCompteByCode: (code: string) => Promise<void>;
}


const CompteExpendTable = ({ compte, findCompteByCode }: PropsType) => {
    const { control, handleSubmit, setValue, formState: { errors }, reset, getValues } = useForm({
        resolver: zodResolver(documentSchema),
        defaultValues: {
            nom: "",
            code: "",
            fields: [{ id:0, cle: "text", valeur: "" }],
        },
    });

    const queryCompte = useQueryClient();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "fields",
    });

    const toast = React.useRef<Toast>(null);
    const [productDialog, setProductDialog] = React.useState(false);
    const [isUpdateMode, setIsUpdateMode] = React.useState(false);
    const [selectedDocument, setSelectedDocument] = React.useState<TypeDocument | null>(null);

    useEffect(()=>{
        console.log("-----------------------CompteClient:",compte)
    },[])
    const openNew = () => {
        setProductDialog(true);
        setIsUpdateMode(false);
        reset({
            nom: "",
            code: "",
            fields: [{ cle: "text", valeur: "" }],
        });
    };

    // const openUpdate = (doc: TypeDocument) => {
    const openUpdate = (doc: any) => {
        setProductDialog(true);
        setIsUpdateMode(true);
        setSelectedDocument(doc);
        reset({
            nom: doc.nom,
            code: doc.code,
            fields: doc.fields || [{ id:0,cle: "text", valeur: "" }],
        });
    };

    const hideDialog = () => {
        setProductDialog(false);
        reset();
    };

    const createMutation = useMutation({
        mutationFn: (clt: Omit<CompteClient, "id">) => CompteService.createCompte(clt as CompteClient),
        onSuccess: (clt) => {
            toast.current?.show({ severity: 'success', summary: 'CompteClient Created', detail: 'Le compte a été créé avec succès', life: 3000 });
            queryCompte.invalidateQueries(["compte"] as InvalidateQueryFilters);
            setProductDialog(false);
        },
        onError: (error) => {
            toast.current?.show({ severity: 'error', summary: 'Creation Failed', detail: 'La création du compte a échoué', life: 3000 });
            console.log("onError", error);
        }
    });
    const updateMutation = useMutation({
        mutationFn: (cpt: CompteClient) => {
            if (!cpt.id) {
                throw new Error("CompteClient code is required");
            }
            return CompteService.updateCompte(cpt.matricule, cpt);
        },
        onSuccess: (cpt) => {
            queryCompte.invalidateQueries({ queryKey: ["compte"] });
            toast.current?.show({ severity: 'success', summary: 'CompteClient Updated', detail: 'Le compte a été mis à jour avec succès', life: 3000 });
        },
        onError: (error) => {
            toast.current?.show({ severity: 'error', summary: 'Update Failed', detail: 'La mise à jour du compte a échoué', life: 3000 });
            console.log("onUpdateError", error);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => CompteService.deleteCompte(id),
        onSuccess: () => {
            queryCompte.invalidateQueries({queryKey:["compte"]});
            toast.current?.show({ severity: 'success', summary: 'CompteClient Deleted', detail: 'Le compte a été supprimé avec succès', life: 3000 });
        },
        onError: (error) => {
            console.log("onDeleteError", error);
            toast.current?.show({ severity: 'error', summary: 'Deletion Failed', detail: 'La suppression du compte a échoué', life: 3000 });
        }
    });

    const handleCreateCompte = (newCompteClient: CompteClient) => {
        createMutation.mutate(newCompteClient);
    };

    const handleUpdateCompte = (updatedCompteClient: CompteClient) => {
        updateMutation.mutate(updatedCompteClient);
    };

    const handleDeleteCompte = (id: number) => {
        deleteMutation.mutate(id);
    };




    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    {/* <ToolbarComponent onNewClick={openNew} /> */}
                    <CompteTable
                        comptes={compte}
                        globalFilterValue=""
                        setGlobalFilterValue={() => { }}
                        onCreateCompte={handleCreateCompte}
                        onUpdateCompte={handleUpdateCompte}
                        onDeleteCompte={handleDeleteCompte}
                        // onRowEditClick={openUpdate}  // Passez la fonction pour l'édition
                    />
                </div>
            </div>
        </div>
    );
};

export default CompteExpendTable;
