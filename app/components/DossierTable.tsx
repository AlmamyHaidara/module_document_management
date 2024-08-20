"use client";

import React, { useState, useRef, useEffect, useContext } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { InputText } from 'primereact/inputtext';
import { classNames } from "primereact/utils";
import { CompteMatricule, DocumentTypeInfo, Dossier, MetaDonnee, TypeDoc, TypeDocument } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import NavStep from '../../demo/components/NavStep';
import { InputTextarea } from "primereact/inputtextarea";
import DropDownComponent from "./DopDownComponent";
import DinamicForm from "@/demo/components/DinamicForm";
import { generateID } from "../(main)/utils/function";
import UploadMultipleFile from "./MultipleFileUploadedComponent";
import { DossierContext } from "../(main)/uikit/table/DossierExpandTable";

interface DossierTableProps {
    dossiers: Dossier[];
    globalFilterValue: string;
    setGlobalFilterValue: (value: string) => void;
    onUpdateDossier: (document: Dossier) => void;
    onCreateDossier: (document: TypeDocument) => void;
    onDeleteDossier: (id: number) => void;
}

type FieldValue = {
    cle: string;
    value: string;
};
type DossierContextType = { dossierContext: { setMeta: (meta: any) => void; meta: MetaDonnee[]; typeDoc: TypeDoc; compteMatricule: CompteMatricule[] } }
const DossierTable = ({ dossiers, globalFilterValue, setGlobalFilterValue, onUpdateDossier, onCreateDossier, onDeleteDossier }: DossierTableProps) => {
    const { dossierContext } = useContext(DossierContext) as DossierContextType;
    const { setMeta, meta, typeDoc, compteMatricule } = dossierContext;

    const [documentDialog, setDossierDialog] = useState(false);
    const [dossier, setDossier] = useState<any | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [fields, setFields] = useState([{ id: 0, cle: "", valeur: "" }]);
    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [docType, setDocType] = useState<TypeDoc>({ id: 0, code: "", nom_type: "" });
    const [compteClient, setCompteClient] = useState<CompteMatricule>({ id: 0, code: "", nom_type: "" });
    const [docTypeMeta, setDocTypeMeta] = useState<MetaDonnee[]>([]);
    const [activeStep, setActiveStep] = useState(0);
    const queryClient = useQueryClient();
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [formValues, setFormValues] = useState<FieldValue[] >([]);
    const [formValue, setFormValue] = useState<FieldValue >({cle:"",value:""});
    const [filePaths, setFilePaths] = useState<string[]>([]);
    const [deleteDossierDialog, setDeleteDossierDialog] = useState(false);

    useEffect(() => {
        if (docType.id) {
            const filteredMeta = meta.filter((item: MetaDonnee) => item.typesDocID === docType.id);
            setDocTypeMeta(filteredMeta);
        }
    }, [docType, meta]);

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
    };
    const openNew = () => {
        setDossier({ id: 0, nom: "", description: "" });
        setFields([{ id: 0, cle: "", valeur: "" }]);
        setSubmitted(false);
        setDossierDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDossierDialog(false);
    };

    const handleFieldChange = (id: number, cle: string, value: string) => {
        setFormValue({ cle, value })
        setFormValues(prevValues => ({
            ...prevValues,
            ...[{ cle, value }],
        }));
    };


    const hideDeleteDossierDialog = () => {
        setDeleteDossierDialog(false);
    };

    // const hideDeleteDossierDialog = () => {
    //     setDeleteDossierDialog(false);
    // };

    const saveDossier = () => {
        setSubmitted(true);

        if (nom && description) {
            const newDossier: TypeDocument = {
                ...dossier,
                nom,
                description,
                code: generateID(6),
                typeDocument: docType,
                metadonnees: fields,
                newValue: [formValues],
                filePaths: filePaths,
                compteClient:compteClient
            };

            console.info(newDossier);
            onCreateDossier(newDossier);
            setDossierDialog(false);
            setDossier(null);
        }
    };

    const changeStep = () => {
        if (activeStep === 0) {
            if (nom && description && docType.id) {
                setActiveStep(1);
            }
        } else if (activeStep === 1) {
            setActiveStep(2);
        } else {
            setSubmitted(true);
        }
    };

    const documentDialogFooter = (
        <>
            {activeStep === 1 ? (
                <Button label="Retourner" icon="pi pi-arrow-left" text onClick={() => setActiveStep(0)} />
            ) : activeStep === 2 ? (
                <Button label="Retourner" icon="pi pi-arrow-left" text onClick={() => setActiveStep(1)} />
            ) : null}
            <Button label={activeStep === 2 ? "Enregistrer" : "Suivant"} icon="pi pi-check" text onClick={activeStep === 2 ? saveDossier : changeStep} />
        </>
    );

    const deleteDossier = () => {
        if (dossier?.id) {
            onDeleteDossier(dossier.id);
            toast?.current?.show({ severity: 'success', summary: 'Document supprimé', detail: 'Le document a été supprimé avec succès', life: 3000 });
        } else {
            toast?.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Document non trouvé', life: 3000 });
        }
        setDeleteDossierDialog(false);
        setDossier(null);
    }

    const deleteDossierDialogFooter = (
        <>
            <Button label="Non" icon="pi pi-times" text onClick={hideDeleteDossierDialog} />
            <Button label="Oui" icon="pi pi-check" text onClick={deleteDossier} />
        </>
    );
    ;


    const leftToolbarTemplate = () => (
        <>
            <Button label="Nouveau" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
        </>
    );

    const rightToolbarTemplate = () => (
        <>
            <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Importer" className="mr-2 inline-block" />
            <Button label="Exporter" icon="pi pi-upload" severity="help" onClick={() => dt.current?.exportCSV()} />
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

    const editDossier = (document: TypeDocument) => {
        setDossier({ ...document });
        setFields(document.metadonnees || [{ id: 0, cle: "", valeur: "" }]);
        setDossierDialog(true);
    };

    const actionBodyTemplate = (rowData: TypeDocument) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editDossier(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteDossier(rowData)} />
            </>
        );
    };

    const confirmDeleteDossier = (document: TypeDocument) => {
        setDossier(document);
        setDeleteDossierDialog(true);
    };

    const formatDate = (date:Date) => {
        return `Le ${new Intl.DateTimeFormat('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
        }).format(new Date(date))}`
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />
                    <DataTable ref={dt} value={dossiers} responsiveLayout="scroll" dataKey="id" header={header}>
                        <Column field="id" header="ID" sortable />
                        <Column field="code" header="Code" sortable />
                        <Column field="created_at" header="Date creation" sortable body={(rowData) => formatDate(rowData.created_at)}  />
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }} />

                    </DataTable>

                    <Dialog visible={documentDialog} style={{ width: '850px' }} header="Détails du document" modal className="p-fluid" footer={documentDialogFooter} onHide={hideDialog}>
                        <NavStep step={activeStep} />
                        {activeStep === 0 ? (
                            <>
                                <div className="field">
                                    <label htmlFor="nom">Nom dossier</label>
                                    <InputText id="nom" placeholder="Nom du dossier" value={nom} onChange={(e) => setNom(e.target.value)} required className={classNames({ 'p-invalid': submitted && !nom })} />
                                    {submitted && !nom && <small className="p-invalid">Le nom est requis.</small>}
                                </div>

                                <div className="field">
                                    <label htmlFor="description">Description dossier</label>
                                    <InputTextarea id="description" placeholder="Description du dossier" rows={5} cols={30} value={description} onChange={(e) => setDescription(e.target.value)} required className={classNames({ 'p-invalid': submitted && !description })} />
                                    {submitted && !description && <small className="p-invalid">La description est requise.</small>}
                                </div>

                                <div className="field">
                                    <label htmlFor="docType">Type document </label>
                                    <DropDownComponent options={Array.isArray(typeDoc) ? typeDoc : []} setTypeDocument={setDocType} typeDocument={docType} placeholder={"Selectionne un type de document"} />
                                    {submitted && !docType?.id && <small className="p-invalid">Le type de document est requis.</small>}
                                </div>

                                <div className="compteClient">
                                    <label htmlFor="compteClient">Compte client</label>
                                    <DropDownComponent options={Array.isArray(compteMatricule) ? compteMatricule : []} setTypeDocument={setCompteClient} typeDocument={compteClient} placeholder={"Selectionne un compte client"} />
                                    {submitted && !docType.id && <small className="p-invalid">Le type de document est requis.</small>}
                                </div>
                            </>
                        ) : activeStep === 1 ? (
                            <>
                                {docTypeMeta.map((item: MetaDonnee) => (
                                    <DinamicForm
                                        key={item.id}
                                        field={item}
                                        fieldValue={formValue || { cle: item.cle, value: '' }}
                                        onFieldChange={handleFieldChange}
                                    />
                                ))}
                            </>
                        ) : (
                            <>
                                <label htmlFor="docType">Type document</label>
                                <UploadMultipleFile setFilePaths={setFilePaths} />
                            </>
                        )}
                    </Dialog>

                    <Dialog visible={deleteDossierDialog} style={{ width: '450px' }} header="Confirmer" modal footer={deleteDossierDialogFooter} onHide={hideDeleteDossierDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" />
                            {dossier && <span>Êtes-vous sûr de vouloir supprimer <b>{dossier.matricule}</b>?</span>}
                        </div>
                    </Dialog>


                </div>
            </div>
        </div>
    );
};

export default DossierTable;
