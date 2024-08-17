"use client";

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
import { DocumentTypeInfo, Dossier, MetaDonnee, TypeDoc, TypeDocument } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import NavStep from '../../demo/components/NavStep';
import { InputTextarea } from "primereact/inputtextarea";
import DropDownComponent from "./DopDownComponent";
import DinamicForm from "@/demo/components/DinamicForm";
import { generateID } from "../(main)/utils/function";
import UploadMultipleFile from "./MultipleFileUploadedComponent";

interface DossierTableProps {
    dossiers: Dossier[];
    globalFilterValue: string;
    setGlobalFilterValue: (value: string) => void;
    onUpdateDossier: (document: Dossier) => void;
    onCreateDossier: (document: TypeDocument) => void;
    onDeleteDossier: (id: string) => void;
    typeDoc: TypeDoc[];
    meta: MetaDonnee[];
    setMeta: any;
}

type FieldValue = {
    cle: string;
    value: string;
};

const DossierTable = ({ dossiers, globalFilterValue, setGlobalFilterValue, onUpdateDossier, onCreateDossier, onDeleteDossier, typeDoc, meta, setMeta }: DossierTableProps) => {
    const [documentDialog, setDossierDialog] = useState(false);
    const [dossier, setDossier] = useState<TypeDocument | any>(null);
    const [submitted, setSubmitted] = useState(false);
    const [fields, setFields] = useState([{ id: 0, cle: "", valeur: "" }]);
    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [docType, setDocType] = useState<TypeDoc>({ id: 0, code: "", nom_type: "" });
    const [docTypeMeta, setDocTypeMeta] = useState<MetaDonnee[]>([]);
    const [activeStep, setActiveStep] = useState(0);
    const queryClient = useQueryClient();
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [formValues, setFormValues] = useState<{ [key: string]: FieldValue }>({});
    const [filePaths, setFilePaths] = useState<string[]>([]);

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
        setFormValues(prevValues => ({
            ...prevValues,
            [cle]: { id, cle, value },
        }));
    };

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
                filePaths: filePaths
            };

            console.info(newDossier);
            onCreateDossier(newDossier);
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

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />
                    <DataTable ref={dt} value={dossiers} responsiveLayout="scroll" dataKey="id" header={header}>
                        <Column field="id" header="ID" sortable />
                        <Column field="nom_type" header="Nom" sortable />
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
                                    <label htmlFor="docType">Type document</label>
                                    <DropDownComponent options={typeDoc} setTypeDocument={setDocType} typeDocument={docType} />
                                    {submitted && !docType.id && <small className="p-invalid">Le type de document est requis.</small>}
                                </div>
                            </>
                        ) : activeStep === 1 ? (
                            <>
                                {docTypeMeta.map((item: MetaDonnee) => (
                                    <DinamicForm
                                        key={item.id}
                                        field={item}
                                        fieldValue={formValues[item.cle] ||  { cle: item.cle, value: '' }}
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
                </div>
            </div>
        </div>
    );
};

export default DossierTable;
