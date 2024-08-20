import React, { useState, useRef, useEffect } from "react";
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
import { DocumentService } from "@/demo/service/Document.service";
import { MetaDonneService } from "@/demo/service/MetaDonne.service";
import { generateID } from "../(main)/utils/function";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from "primereact/dropdown";

interface DocumentTableProps {
    documents: TypeDocument[];
    globalFilterValue: string;
    setGlobalFilterValue: (value: string) => void;
    onUpdateDocument: (document: TypeDocument) => void;
    onCreateDocument: (document: TypeDocument) => void;
    onDeleteDocument: (id: number) => void;
}

const DocumentTable = ({ documents, globalFilterValue, setGlobalFilterValue, onUpdateDocument, onCreateDocument, onDeleteDocument }: DocumentTableProps) => {
    const [documentDialog, setDocumentDialog] = useState(false);
    const [deleteDocumentDialog, setDeleteDocumentDialog] = useState(false);
    const [deleteDocumentsDialog, setDeleteDocumentsDialog] = useState(false);
    const [document, setDocument] = useState<TypeDocument | any>(null);
    const [selectedDocuments, setSelectedDocuments] = useState<TypeDocument[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fields, setFields] = useState([{ id: 0, cle: "", valeur: "" }]);
    const queryClient = useQueryClient();
    const router = useRouter()
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const typeDoc:{name:string}[]= ([{name:"text"},{name:"number"},{name:"email"},{name:"tel"},{name:"date"},{name:"file"}]);
    const [docType, setDocType] = useState<{name:string}>({name:""});

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
    };
    useEffect(()=>{
       console.log("-----------docType: ",docType)
    }, [docType]);
    const openNew = () => {
        setDocument({ id: 0, nom_type: "", metadonnees: [] });
        setFields([{ id: 0, cle: "", valeur: "" }]);
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

const onUpdateMeta = useMutation({
    mutationFn:(data:any)=> MetaDonneService.updateMetaDonnee(data.cle,data.data),
    onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:['document']})

    }
})
    const saveDocument = () => {
        try {
            setSubmitted(true);
            console.log("------------document",document)
        const existingFields = document?.metadonnees || [];
        const fieldsToUpdate = fields.filter(field => existingFields.some((existingField:any) => existingField.id === field.id));
        const fieldsToDelete = existingFields.filter((existingField:any) => !fields.some(field => field.id === existingField.id));
        const fieldsToAdd = fields.filter(field => !existingFields.some((existingField:any) => existingField.id === field.id));

        console.log("-----------existingFields: ",existingFields);
        console.log("-----------fieldsToUpdate: ",fieldsToUpdate);
        console.log("-----------fieldsToDelete: ",fieldsToDelete);
        console.log("-----------fieldsToAdd: ",fieldsToAdd);


        const updatedDocument:any = {
            ...document,
            metadonnees: [...fieldsToUpdate, ...fieldsToAdd],

        };

        if (document?.code) {
            fieldsToUpdate.forEach(field => {

                DocumentService.updateDocument(document.id,document)
                MetaDonneService.updateMetaDonnee(field.cle, { id:field.id,cle: field.cle, valeur: field.valeur })
                // onUpdateMeta.mutate({cle:field.cle, data:{ id:field.id,cle: field.cle, valeur: field.valeur }})
            });

            fieldsToDelete.forEach((field:{id:any}) => {
                console.log("ppppppppppppppppppppppppppppp");

                MetaDonneService.deleteMetaDonnee(field.id)

            });

            // fieldsToAdd.forEach(field => {
            //     MetaDonneService.addMetaDonnee(document?.id, field)

            // });

            onUpdateDocument(updatedDocument);
            toast.current?.show({ severity: 'success', summary: 'Document mis à jour', detail: 'Le document a été mis à jour avec succès', life: 3000 });
        } else {
            const newDocument:any = { ...updatedDocument, id: 0 };
            onCreateDocument(newDocument);
            toast.current?.show({ severity: 'success', summary: 'Document créé', detail: 'Le document a été créé avec succès', life: 3000 });
        }

        setDocumentDialog(false);
        setDocument(null);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la métadonnée:", error);
                         toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la mise à jour des métadonnées', life: 3000 });

        }finally{
            setRefresh(prev=>!prev)
        }

    };

    const editDocument = (document: TypeDocument) => {
        setDocument({ ...document });
        setFields(document.metadonnees || [{ id: 0, cle: "", valeur: "" }]);
        setDocumentDialog(true);
    };

    const confirmDeleteDocument = (document: TypeDocument) => {
        setDocument(document);
        setDeleteDocumentDialog(true);
    };

    const handleRemove = (index: number) => {
        const fieldToRemove = fields[index];
        setFields(fields.filter((_, i) => i !== index));
    };

    const deleteDocument = () => {
        if (document?.id) {
            onDeleteDocument(document.id);
            toast?.current?.show({ severity: 'success', summary: 'Document supprimé', detail: 'Le document a été supprimé avec succès', life: 3000 });
        } else {
            toast?.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Document non trouvé', life: 3000 });
        }
        setDeleteDocumentDialog(false);
        setDocument(null);
    };

    const confirmDeleteSelected = () => {
        setDeleteDocumentsDialog(true);
    };

    const deleteSelectedDocuments = () => {
        selectedDocuments?.forEach((doc:{id:number}) => onDeleteDocument(doc.id))
        setDeleteDocumentsDialog(false);
        setSelectedDocuments(null);
        toast.current?.show({ severity: 'success', summary: 'Documents supprimés', detail: 'Les documents sélectionnés ont été supprimés avec succès', life: 3000 });
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
                <Button label="Nouveau" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                {/* <Button label="Supprimer" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedDocuments || !selectedDocuments.length} /> */}
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Importer" className="mr-2 inline-block" />
                <Button label="Exporter" icon="pi pi-upload" severity="help" onClick={() => dt.current?.exportCSV()} />
            </>
        );
    };

    const documentDialogFooter = (
        <>
            <Button label="Annuler" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Enregistrer" icon="pi pi-check" text onClick={saveDocument} />
        </>
    );

    const deleteDocumentDialogFooter = (
        <>
            <Button label="Non" icon="pi pi-times" text onClick={hideDeleteDocumentDialog} />
            <Button label="Oui" icon="pi pi-check" text onClick={deleteDocument} />
        </>
    );

    const deleteDocumentsDialogFooter = (
        <>
            <Button label="Non" icon="pi pi-times" text onClick={hideDeleteDocumentsDialog} />
            <Button label="Oui" icon="pi pi-check" text onClick={deleteSelectedDocuments} />
        </>
    );

    const header = (
        <div className="flex justify-content-between">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Recherche par mots-clés" />
            </span>
        </div>
    );
    const formatDate = (date:Date) => {
        return `Le ${new Intl.DateTimeFormat('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
        }).format(new Date(date))}`
    };
    const countMedonne=(metaDatas:any) =>{
        console.log(metaDatas.metadonnees.length);

    }
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />
                    <DataTable ref={dt} value={documents} responsiveLayout="scroll" dataKey="id" header={header}>
                        <Column field="id" header="ID" sortable />
                        <Column field="code" header="Code" sortable />
                        <Column field="nom_type" header="Nom" sortable  />
                        <Column field="metadonnee" header="Nombre de champ" sortable body={(metaDatas) => metaDatas.metadonnees.length}  />
                        <Column field="created_at" header="Date creation" sortable body={(rowData) => formatDate(rowData.created_at)}  />
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }} />
                    </DataTable>

                    <Dialog visible={documentDialog} style={{ width: '450px' }} header="Détails du document" modal className="p-fluid" footer={documentDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nom_type">Nom</label>
                            <InputText id="nom_type" value={document?.nom_type || ''} onChange={(e) => setDocument({ ...document, nom_type: e.target.value })} required className={classNames({ 'p-invalid': submitted && !document?.nom_type })} />
                            {submitted && !document?.nom_type && <small className="p-invalid">Le nom est requis.</small>}
                        </div>

                        <h5>Champs dynamiques</h5>
                        {fields.map((field, index) => (
                            <div className="field" key={field.id}>
                                <div className="p-fluid grid">
                                    <div className="field col-5">
                                        <InputText value={field.cle} onChange={(e) => {
                                            const newFields = [...fields];
                                            newFields[index].cle = e.target.value;
                                            setFields(newFields);
                                        }} placeholder="Nom du champ" />
                                    </div>
                                    <div className="field col-5">
                                        {/* <InputText value={field.valeur} onChange={(e) => {
                                            const newFields = [...fields];
                                            newFields[index].valeur = e.target.value;
                                            setFields(newFields);
                                        }} placeholder="Valeur" /> */}
  <Dropdown
    value={{name:field.valeur}}
    options={typeDoc}
    onChange={(e) => {
        const newFields = [...fields];
        newFields[index].valeur = e.target.value.name;
        console.log("pp",newFields[index]);

        setFields(newFields);
    }}
    optionLabel="name"
    placeholder="Sélectionnez un type de document"
/>

                                    </div>
                                    <div className="field col-2">
                                        <Button icon="pi pi-minus" className="p-button-danger" onClick={() => handleRemove(index)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="field" >
                                <div className="p-fluid grid">
                                    <div className="field col-5">
                                      {/*   <InputText value={field.cle} onChange={(e) => {
                                            const newFields = [...fields];
                                            newFields[index].cle = e.target.value;
                                            setFields(newFields);
                                        }} placeholder="Nom du champ" />*/}
                                    </div>
                                    <div className="field col-5">
                                        {/* <InputText value={field.valeur} onChange={(e) => {
                                            const newFields = [...fields];
                                            newFields[index].valeur = e.target.value;
                                            setFields(newFields);
                                        }} placeholder="Valeur" /> */}
                                    </div>
                                    <div className="field col-2">
                                    <Button icon="pi pi-plus" onClick={() => setFields([...fields, { id:0 , cle: "", valeur: "" }])} tooltip="Ajouter des nouveaux champs" tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }} />

                                    <Tooltip target=".logo" mouseTrack mouseTrackLeft={10} />
                                    </div>
                                </div>
                            </div>

                    </Dialog>

                    <Dialog visible={deleteDocumentDialog} style={{ width: '450px' }} header="Confirmer" modal footer={deleteDocumentDialogFooter} onHide={hideDeleteDocumentDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" />
                            {document && <span>Êtes-vous sûr de vouloir supprimer <b>{document.nom_type}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteDocumentsDialog} style={{ width: '450px' }} header="Confirmer" modal footer={deleteDocumentsDialogFooter} onHide={hideDeleteDocumentsDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" />
                            {selectedDocuments && <span>Êtes-vous sûr de vouloir supprimer les documents sélectionnés?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default DocumentTable;
