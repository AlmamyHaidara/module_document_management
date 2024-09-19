import React,{useEffect} from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Toast } from 'primereact/toast';
import DocumentTable from '@/app/components/DocumentTable';
import ToolbarComponent from '@/app/components/ToolbarComponent';
import ProductDialog from '@/app/components/ProductDialog';
import { documentSchema } from '@/types/zod/zod.sechma';
import { InvalidateQueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';
import { Client, TypeDocument } from '@/types/types';
import ClientTable from '@/app/components/ClientTable';
import { ClientService } from '@/demo/service/Client.service';
import PieceTable from '@/app/components/PieceTable';

export type FieldItem = {
    id:number,
    cle: string,
    valeur: string
}

interface PropsType {
    piece: any[];
    findCLientByCode: (code: string) => Promise<void>;
}


const PieceExpendTable = ({ piece, findCLientByCode }: PropsType) => {
    const { control, handleSubmit, setValue, formState: { errors }, reset, getValues } = useForm({
        resolver: zodResolver(documentSchema),
        defaultValues: {
            nom: "",
            code: "",
            fields: [{ id:0, cle: "text", valeur: "" }],
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
    const [selectedDocument, setSelectedDocument] = React.useState<TypeDocument | null>(null);

    useEffect(()=>{
        console.log("-----------------------Piece:",piece)
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
        mutationFn: (clt: Omit<Client, "id">) => ClientService.createClient(clt as Client),
        onSuccess: (clt) => {
            toast.current?.show({ severity: 'success', summary: 'Client Created', detail: 'Le piece a été créé avec succès', life: 3000 });
            queryClient.invalidateQueries(["piece"] as InvalidateQueryFilters);
            setProductDialog(false);
        },
        onError: (error) => {
            toast.current?.show({ severity: 'error', summary: 'Creation Failed', detail: 'La création du piece a échoué', life: 3000 });
            console.log("onError", error);
        }
    });
    const updateMutation = useMutation({

        mutationFn: (clt: Client) => {
            console.log("ppppppppppp",clt)
            if (!clt.piece.id) {
                throw new Error("Client code is required");
            }
            return ClientService.updateClient(clt.piece.id, clt);
        },
        onSuccess: (doc) => {
            toast.current?.show({ severity: 'success', summary: 'Client Updated', detail: 'Le piece a été mis à jour avec succès', life: 3000 });
            queryClient.invalidateQueries({ queryKey: ["piece"] });
        },
        onError: (error) => {
            toast.current?.show({ severity: 'error', summary: 'Update Failed', detail: 'La mise à jour du piece a échoué', life: 3000 });
            console.log("onUpdateError", error);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => ClientService.deleteClient(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:["piece"]});
            toast.current?.show({ severity: 'success', summary: 'Client Deleted', detail: 'Le piece a été supprimé avec succès', life: 3000 });
        },
        onError: (error) => {
            console.log("onDeleteError", error);
            toast.current?.show({ severity: 'error', summary: 'Deletion Failed', detail: 'La suppression du piece a échoué', life: 3000 });
        }
    });

    const handleCreateClient = (newClient: Client) => {
        createMutation.mutate(newClient);
    };

    const handleUpdateClient = (updatedDocument: Client) => {
        updateMutation.mutate(updatedDocument);
    };

    const handleDeleteClient = (id: number) => {
        deleteMutation.mutate(id);
    };




    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    {/* <ToolbarComponent onNewClick={openNew} /> */}
                    <PieceTable
                        clients={piece}
                        globalFilterValue=""
                        setGlobalFilterValue={() => { }}
                        onCreateClient={handleCreateClient}
                        onUpdateClient={handleUpdateClient}
                        onDeleteClient={handleDeleteClient}
                        // onRowEditClick={openUpdate}  // Passez la fonction pour l'édition
                    />
                </div>
            </div>
        </div>
    );
};

export default PieceExpendTable;