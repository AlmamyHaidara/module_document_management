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
import { CompteMatricule, Dossier, MetaDonnee, TypeDoc, TypeDocument } from "@/types/types";
import { generateID } from "../(main)/utils/function";
import NavStep from '../../demo/components/NavStep';
import DinamicForm from "@/demo/components/DinamicForm";
import UploadMultipleFile from "./MultipleFileUploadedComponent";
import DropDownComponent from "./DopDownComponent";
import { DossierContext } from "../(main)/uikit/table/DossierExpandTable";
import { Image } from "primereact/image";

type PropsType={
    dossiers:any[],
    globalFilterValue:any,
    setGlobalFilterValue:any,
    onUpdateDossier:any,
    onCreateDossier:any,
    onDeleteDossier:any

}
const DossierTable = ({ dossiers, globalFilterValue, setGlobalFilterValue, onUpdateDossier, onCreateDossier, onDeleteDossier }:PropsType) => {
    const { dossierContext }:any = useContext(DossierContext);
    const { meta, typeDoc, compteMatricule } = dossierContext;

    const [documentDialog, setDossierDialog] = useState(false);
    const [dossier, setDossier] = useState<any | null>({});
    const [submitted, setSubmitted] = useState(false);
    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [docType, setDocType] = useState({ id: 0, code: "", nom_type: "" });
    const [compteClient, setCompteClient] = useState({ id: 0, code: "", nom_type: "" });
    const [docTypeMeta, setDocTypeMeta] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [formValues, setFormValues] = useState<any[]>([]);
    const [filePaths, setFilePaths] = useState<any>([]);
    const [pieces, setPieces] = useState([]);
    const [deleteDossierDialog, setDeleteDossierDialog] = useState(false);
    const [editAction, setEditAction] = useState(false)
    const toast = useRef<any>(null);
    const dt = useRef<any>(null);

    useEffect(() => {
        console.log("o-------------------p",dossiers)
        if (docType?.id) {
            const filteredMeta = meta.filter((item:any) => item.typesDocID === docType.id);
            setDocTypeMeta(filteredMeta);
        }
    }, [docType, meta]);

    const onGlobalFilterChange = (e:any) => {
        setGlobalFilterValue(e.target.value);
    };

    const openNew = () => {
        setDossier({ id: 0, nom: "", description: "" });
        setNom("");
        setDescription("");
        setDocType({ id: 0, code: "", nom_type: "" });
        setCompteClient({ id: 0, code: "", nom_type: "" });
        setSubmitted(false);
        setActiveStep(0);
        setDossierDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDossierDialog(false);
    };

    const hideDeleteDossierDialog = () => {
        setDeleteDossierDialog(false);
    };

    const saveDossier = () => {
        setSubmitted(true);
        console.log("-------------FormValues",formValues)
        console.log("-------------Nom",nom)
        console.log("-------------DocType",docType)
        console.log("-------------CompteClient",compteClient)

        if (nom && docType.id && compteClient.id && filePaths.length != 0) {
            const newDossier = {
                ...dossier,
                nom,
                description,
                code: generateID(6),
                typeDocument: docType,
                metadonnees: formValues,
                filePaths: filePaths,
                compteClient: compteClient
            };

            console.log("--------------NewDossier: ", newDossier)
            onUpdateDossier(newDossier);
            // setDossierDialog(false);
            // setDossier(null);
        }else{
            console.log("ooooooooooooooooooooooooooooo")
            console.log("-------------FormValues",formValues)
        console.log("-------------Nom",nom)
        console.log("-------------DocType",docType)
        console.log("-------------CompteClient",compteClient)
        console.log("-------------FilePaths",[...filePaths, ...pieces])
        const editDossier = {
            ...dossier,
            nom,
            description,
            code: generateID(6),
            typeDocument: docType,
            metadonnees: formValues,
            filePaths: [...filePaths, ...pieces],
            compteClient: compteClient
        };

        console.log("--------------EditDossier: ", editDossier)
        onUpdateDossier(editDossier);
        setDossierDialog(false);
        setDossier(null);

        }
    };

    const changeStep = () => {
        if (activeStep < 2) {
            setActiveStep(activeStep + 1);
        } else {
            saveDossier();
        }
    };

    const editDossier = (document:any) => {
        console.log("-------------1document: ",document)
        setDossier(document);
        setNom(document.nom);
        setDescription(document.description);
        const {id,code,nom_type,compteClient:cptClt}=document.dossiers_typesDocuments[0].type_document
        setDocType({
            id:id,
            code:code,
            nom_type:nom_type
        });
        // console.log("-------------1document: ",document.dossiers_typesDocuments[0].type_document)
        setPieces(document.piece)
        setCompteClient({
            id:cptClt.id,
            code:cptClt.matricule,
            nom_type:cptClt.matricule
        });
        setFormValues(document.dossierInfos || []);
        // console.log("-------------id,code,nom_type,compteClientCptClt: ",formValues)
        setActiveStep(0);
        setDossierDialog(true);
        setEditAction(true)
    };

    const handleFieldChange = (id: number,cle: string, value: string) => {
        console.log(id,"pp",cle,"=>",value)
        setFormValues(prevValues => {
            const updatedValues = [...prevValues];
            const index = updatedValues.findIndex((item) => item.cle === cle);
            if (index > -1) {
                updatedValues[index].valeur = value;
            } else {
                updatedValues.push({ cle,valeur:value });
            }
            return updatedValues;
        });
    };

    const deleteDossier = () => {
        if (dossier?.id) {
            onDeleteDossier(dossier.id);
            toast.current?.show({ severity: 'success', summary: 'Document supprimé', detail: 'Le document a été supprimé avec succès', life: 3000 });
        }
        setDeleteDossierDialog(false);
        setDossier(null);
    };

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

    const actionBodyTemplate = (rowData:any) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editDossier(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteDossier(rowData)} />
            </>
        );
    };

    const confirmDeleteDossier = (document:any) => {
        setDossier(document);
        setDeleteDossierDialog(true);
    };

    const documentDialogFooter = (
        <>
            {activeStep > 0 && <Button label="Retourner" icon="pi pi-arrow-left" text onClick={() => setActiveStep(activeStep - 1)} />}
            <Button label={activeStep === 2 ? "Enregistrer" : "Suivant"} icon="pi pi-check" text onClick={changeStep} />
        </>
    );

    const formatDate = (date:any) => {
        return `Le ${new Intl.DateTimeFormat('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
        }).format(new Date(date))}`;
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />
                    <DataTable ref={dt} value={dossiers} responsiveLayout="scroll" dataKey="id" header={
                        <div className="flex justify-content-between">
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Recherche par mots-clés" />
                            </span>
                        </div>
                    }>
                        <Column field="id" header="ID" sortable />
                        <Column field="code" header="Code" sortable />
                        <Column field="created_at" header="Date creation" sortable body={(rowData) => formatDate(rowData.created_at)} />
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
                                    <label htmlFor="docType">Type document</label>
                                    <DropDownComponent options={typeDoc} setTypeDocument={setDocType} typeDocument={docType} placeholder={"Selectionne un type de document"} />
                                    {submitted && !docType.id && <small className="p-invalid">Le type de document est requis.</small>}
                                </div>
                                <div className="field">
                                    <label htmlFor="compteClient">Compte client</label>
                                    <DropDownComponent options={compteMatricule} setTypeDocument={setCompteClient} typeDocument={compteClient} placeholder={"Selectionne un compte client"} />
                                    {submitted && !compteClient?.id && <small className="p-invalid">Le compte client est requis.</small>}
                                </div>
                            </>
                        ) : activeStep === 1 ? (
                            <>
                                {docTypeMeta.map((item:any) => (
                                    <DinamicForm
                                        key={item?.id}
                                        field={item}
                                        fieldValue={formValues.find(f => f?.cle === item?.cle) || { cle: item?.cle, valeur: '' }}
                                        onFieldChange={(id,cle, value) => handleFieldChange(id,cle, value)}
                                    />
                                ))}
                            </>
                        ) : (
                            <>
                                <label htmlFor="docType">Documents</label>
                                <UploadMultipleFile setFilePaths={setFilePaths} />


                                 {
                                editAction && <div className="w-full h-200 flex justify-between align-center">
                                    {
                                        pieces.map((item:any,index)=>(

                                            <div className=" w-full h-full object-cover" key={index} >
                                                 <Image src={item?.path} alt="Image" className="w-full h-full object-fill" />
                                            </div>

                                        ))
                                    }
                                </div>
                               }
                                {/* </div> */}


                            </>
                        )}
                    </Dialog>

                    <Dialog visible={deleteDossierDialog} style={{ width: '450px' }} header="Confirmer" modal footer={
                        <>
                            <Button label="Non" icon="pi pi-times" text onClick={hideDeleteDossierDialog} />
                            <Button label="Oui" icon="pi pi-check" text onClick={deleteDossier} />
                        </>
                    } onHide={hideDeleteDossierDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" />
                            {dossier && <span>Êtes-vous sûr de vouloir supprimer <b>{dossier.nom}</b>?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default DossierTable;
