import React, { useState, useRef } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { InputText } from 'primereact/inputtext';
import { classNames } from "primereact/utils";
import { TypeDocument } from "@/types/types";
import { v4 as uuidv4 } from 'uuid';

interface DocumentTableProps {
    documents: TypeDocument[];
    globalFilterValue: string;
    setGlobalFilterValue: (value: string) => void;
    onUpdateDocument: (document: TypeDocument) => void;
    onCreateDocument: (document: TypeDocument) => void;
    onDeleteDocument: (id: string) => void;
}

const DocumentTable = ({ documents, globalFilterValue, setGlobalFilterValue, onUpdateDocument, onCreateDocument, onDeleteDocument }: DocumentTableProps) => {
    const [documentDialog, setDocumentDialog] = useState(false);
    const [deleteDocumentDialog, setDeleteDocumentDialog] = useState(false);
    const [deleteDocumentsDialog, setDeleteDocumentsDialog] = useState(false);
    const [document, setDocument] = useState<TypeDocument | null>(null);
    const [selectedDocuments, setSelectedDocuments] = useState<TypeDocument[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            fields: [{ cle: "", valeur: "" }],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "fields",
    });

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
    };

    const openNew = () => {
        setDocument(null);
        reset({ fields: [{ cle: "", valeur: "" }] }); // Réinitialiser les champs dynamiques
        setSubmitted(false);
        setDocumentDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDocumentDialog(false);
    };

    const hideDeleteDocumentDialog = () => {
        setDeleteDocumentDialog(false);
    };

    const hideDeleteDocumentsDialog = () => {
        setDeleteDocumentsDialog(false);
    };

    const saveDocument = (data: any) => {
        setSubmitted(true);

        if (!document?.code || !document?.nom_type) {
            return;
        }

        const updatedDocument = { ...document, fields: data.fields };

        if (document.id) {
            // Mise à jour du document existant
            onUpdateDocument(updatedDocument);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Document Updated', life: 3000 });
        } else {
            // Créer un nouveau document
            const newDocument = { ...updatedDocument, id: uuidv4() };
            onCreateDocument(newDocument);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Document Created', life: 3000 });
        }
        setDocumentDialog(false);
        setDocument(null);
    };

    const editDocument = (document: TypeDocument) => {
        setDocument({ ...document });
        reset({ fields: document.fields || [{ cle: "", valeur: "" }] });
        setDocumentDialog(true);
    };

    const confirmDeleteDocument = (document: TypeDocument) => {
        setDocument(document);
        setDeleteDocumentDialog(true);
    };

    const deleteDocument = () => {
        if (document?.id) {
            onDeleteDocument(document.id);
            toast?.current?.show({ severity: 'success', summary: 'Successful', detail: 'Document Deleted', life: 3000 });
        }
        setDeleteDocumentDialog(false);
        setDocument(null);
    };

    const confirmDeleteSelected = () => {
        setDeleteDocumentsDialog(true);
    };

    const deleteSelectedDocuments = () => {
        selectedDocuments?.forEach((doc: TypeDocument) => onDeleteDocument(doc.id));
        setDeleteDocumentsDialog(false);
        setSelectedDocuments(null);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Documents Deleted', life: 3000 });
    };

    const actionBodyTemplate = (rowData: TypeDocument) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editDocument(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteDocument(rowData)} />
            </>
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <>
                <Button label="New" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedDocuments || !selectedDocuments.length} />
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={() => dt.current?.exportCSV()} />
            </>
        );
    };

    const documentDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={handleSubmit(saveDocument)} />
        </>
    );

    const deleteDocumentDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteDocumentDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteDocument} />
        </>
    );

    const deleteDocumentsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteDocumentsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedDocuments} />
        </>
    );

    const header = (
        <div className="flex justify-content-between">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
            </span>
        </div>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />
                    <DataTable ref={dt} value={documents} responsiveLayout="scroll" dataKey="id" header={header}>
                        <Column field="id" header="ID" sortable />
                        <Column field="code" header="Code" sortable />
                        <Column field="nom_type" header="Nom" sortable />
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }} />
                    </DataTable>

                    <Dialog visible={documentDialog} style={{ width: '450px' }} header="Document Details" modal className="p-fluid" footer={documentDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="code">Code</label>
                            <InputText id="code" value={document?.code || ''} onChange={(e) => setDocument({ ...document, code: e.target.value })} required autoFocus className={classNames({ 'p-invalid': submitted && !document?.code })} />
                            {submitted && !document?.code && <small className="p-invalid">Code is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="nom_type">Nom</label>
                            <InputText id="nom_type" value={document?.nom_type || ''} onChange={(e) => setDocument({ ...document, nom_type: e.target.value })} required className={classNames({ 'p-invalid': submitted && !document?.nom_type })} />
                            {submitted && !document?.nom_type && <small className="p-invalid">Nom is required.</small>}
                        </div>

                        <h5>Champs dynamiques</h5>
                        {fields.map((field, index) => (
                            <div className="field" key={field.id}>
                                <div className="p-fluid grid">
                                    <div className="field col-5">
                                        <Controller
                                            name={`fields.${index}.cle`}
                                            control={control}
                                            render={({ field }) => (
                                                <InputText {...field} placeholder="Nom du champ" />
                                            )}
                                        />
                                    </div>
                                    <div className="field col-5">
                                        <Controller
                                            name={`fields.${index}.valeur`}
                                            control={control}
                                            render={({ field }) => (
                                                <InputText {...field} placeholder="Valeur" />
                                            )}
                                        />
                                    </div>
                                    <div className="field col-2">
                                        <Button icon="pi pi-minus" className="p-button-danger" onClick={() => remove(index)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button icon="pi pi-plus" label="Ajouter un champ" className="p-button-success p-mt-2" onClick={() => append({ cle: "", valeur: "" })} />
                    </Dialog>

                    <Dialog visible={deleteDocumentDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDocumentDialogFooter} onHide={hideDeleteDocumentDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" />
                            {document && <span>Are you sure you want to delete <b>{document.nom_type}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteDocumentsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDocumentsDialogFooter} onHide={hideDeleteDocumentsDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" />
                            {selectedDocuments && <span>Are you sure you want to delete the selected documents?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default DocumentTable;
