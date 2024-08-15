import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Toast } from 'primereact/toast';
import DocumentTable from '@/app/components/DocumentTable';
import ToolbarComponent from '@/app/components/ToolbarComponent';
import ProductDialog from '@/app/components/ProductDialog';
import { documentSchema } from '@/types/zod/zod.sechma';
import { InvalidateQueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';
import { DocumentService } from '@/demo/service/Document.service';
import { TypeDocument } from '@/types/types';

export type FieldItem = {
    cle: string,
    valeur: string
}

interface PropsType {
    document: TypeDocument[];
    findDocumentByCode: (code: string) => Promise<void>;
}


const DocumentExpendTable = ({ document, findDocumentByCode }: PropsType) => {
    const { control, handleSubmit, setValue, formState: { errors }, reset, getValues } = useForm({
        resolver: zodResolver(documentSchema),
        defaultValues: {
            nom: "",
            code: "",
            fields: [{ cle: "text", valeur: "" }],
        },
    });

    const queryClient = useQueryClient();

    const { fields, append, remove } = useFieldArray({
        control,
        cle: "fields",
    });

    const toast = React.useRef<Toast>(null);
    const [productDialog, setProductDialog] = React.useState(false);
    const [isUpdateMode, setIsUpdateMode] = React.useState(false);
    const [selectedDocument, setSelectedDocument] = React.useState<TypeDocument | null>(null);

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
            fields: doc.fields || [{ cle: "text", valeur: "" }],
        });
    };

    const hideDialog = () => {
        setProductDialog(false);
        reset();
    };

    const createMutation = useMutation({
        mutationFn: (doc: Omit<TypeDocument, "id">) => DocumentService.createDocument(doc),
        onSuccess: (doc) => {
            toast.current?.show({ severity: 'success', summary: 'Document Created', detail: 'Le document a été créé avec succès', life: 3000 });
            queryClient.invalidateQueries(["document"] as InvalidateQueryFilters);
            setProductDialog(false);
        },
        onError: (error) => {
            toast.current?.show({ severity: 'error', summary: 'Creation Failed', detail: 'La création du document a échoué', life: 3000 });
            console.log("onError", error);
        }
    });

    const updateMutation = useMutation({
        mutationFn: (doc: TypeDocument) => DocumentService.updateDocument(doc.id, doc),
        onSuccess: (doc) => {
            toast.current?.show({ severity: 'success', summary: 'Document Updated', detail: 'Le document a été mis à jour avec succès', life: 3000 });
            queryClient.invalidateQueries(["document"]);
        },
        onError: (error) => {
            toast.current?.show({ severity: 'error', summary: 'Update Failed', detail: 'La mise à jour du document a échoué', life: 3000 });
            console.log("onUpdateError", error);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => DocumentService.deleteDocument(id),
        onSuccess: () => {
            toast.current?.show({ severity: 'success', summary: 'Document Deleted', detail: 'Le document a été supprimé avec succès', life: 3000 });
            queryClient.invalidateQueries(["document"]);
        },
        onError: (error) => {
            toast.current?.show({ severity: 'error', summary: 'Deletion Failed', detail: 'La suppression du document a échoué', life: 3000 });
            console.log("onDeleteError", error);
        }
    });

    const handleCreateDocument = (newDocument: TypeDocument) => {
        createMutation.mutate(newDocument);
    };

    const handleUpdateDocument = (updatedDocument: TypeDocument) => {
        updateMutation.mutate(updatedDocument);
    };

    const handleDeleteDocument = (id: string) => {
        deleteMutation.mutate(id);
    };

    const onSubmit = (data: any) => {
        if (isUpdateMode && selectedDocument) {
            handleUpdateDocument({ ...selectedDocument, ...data });
        } else {
            handleCreateDocument(data);
        }
        setProductDialog(false);
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <ToolbarComponent onNewClick={openNew} />
                    <DocumentTable
                        documents={document}
                        globalFilterValue=""
                        setGlobalFilterValue={() => { }}
                        onCreateDocument={handleCreateDocument}
                        onUpdateDocument={handleUpdateDocument}
                        onDeleteDocument={handleDeleteDocument}
                        onRowEditClick={openUpdate}  // Passez la fonction pour l'édition
                    />
                    <ProductDialog
                        visible={productDialog}
                        onHide={hideDialog}
                        onSave={handleSubmit(onSubmit)}
                        fields={fields}
                        addField={() => append({ cle: "text", valeur: "" })}
                        removeField={remove}
                        setFieldValue={(index, valeur) => setValue(`fields.${index}.valeur`, valeur)}
                        setFieldType={(index, cle) => setValue(`fields.${index}.cle`, cle)}
                        control={control}
                        errors={errors}
                        getValues={getValues}
                    />
                </div>
            </div>
        </div>
    );
};

export default DocumentExpendTable;
