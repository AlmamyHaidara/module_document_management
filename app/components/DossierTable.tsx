'use client';

import React, { useState, useRef, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { FileUpload, FileUploadUploadEvent } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { CompteMatricule, Dossier, MetaDonnee, TypeDoc, TypeDocument } from '@/types/types';
import { generateID } from '../(main)/utils/function';
import NavStep from '../../demo/components/NavStep';
import DinamicForm from '@/demo/components/DinamicForm';
import UploadMultipleFile from './MultipleFileUploadedComponent';
import DropDownComponent from './DopDownComponent';
import { DossierContext } from '../(main)/uikit/table/DossierExpandTable';
import { Image } from 'primereact/image';
import UploadFileComponent from './UploadFileComponent';
import { Divider } from 'primereact/divider';


type PropsType = {
    dossiers: any[];
    globalFilterValue: any;
    setGlobalFilterValue: any;
    onUpdateDossier: any;
    onCreateDossier: any;
    onDeleteDossier: any;
};

const DossierTable = ({ dossiers, globalFilterValue, setGlobalFilterValue, onUpdateDossier, onCreateDossier, onDeleteDossier }: PropsType) => {
    const { dossierContext }: any = useContext(DossierContext);
    const { meta, typeDoc, compteMatricule, fileField } = dossierContext;

    const [filteredDossiers, setFilteredDossiers] = useState(dossiers);
    const [documentDialog, setDossierDialog] = useState(false);
    const [dossier, setDossier] = useState<any | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');
    const [docType, setDocType] = useState<{ id: number; code: string; nom_type: string; piece?: any[] } | any>({ id: 0, code: '', nom_type: '' });
    const [compteClient, setCompteClient] = useState({ id: 0, code: '', nom_type: '' });
    const [docTypeMeta, setDocTypeMeta] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [formValues, setFormValues] = useState<any[]>([]);
    const [filePaths, setFilePaths] = useState<any>([]);
    const [pieces, setPieces] = useState([]);
    const [fileUploaded, setFileUploaded] = useState<any>([]);
    const [deleteDossierDialog, setDeleteDossierDialog] = useState(false);
    const [editAction, setEditAction] = useState(false);
    const [dossierInfo, setDossierInfo] = useState([]);
    const [viewClientsDialog, setViewClientsDialog] = useState(false);

    const [excelData, setExcelData] = useState<any>(null);


    const router = useRouter();
    const toast = useRef<any>(null);
    const dt = useRef<any>(null);

    useEffect(() => {
        if (docType?.id) {
            const filteredMeta = meta.filter((item: any) => item.typesDocID === docType.id);
            setDocTypeMeta(filteredMeta);
        }
    }, [docType, meta]);

    useEffect(() => {
        if (filePaths.length > 0) {
            setFileUploaded((prev: any) => [...prev, ...filePaths]);
        }
    }, [filePaths]);

    useEffect(() => {
        setPieces(docType?.piece);
    }, [docType]);

    const onGlobalFilterChange = (e: any) => {
        setGlobalFilterValue(e.target.value);
    };

    const openNew = () => {
        resetForm();
        setDossierDialog(true);
    };

    const resetForm = () => {
        setDossier({ id: 0, nom: '', description: '' });
        setNom('');
        setDescription('');
        setDocType({ id: 0, code: '', nom_type: '', piece: [] });
        setCompteClient({ id: 0, code: '', nom_type: '' });
        setSubmitted(false);
        setActiveStep(0);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDossierDialog(false);
    };

    const hideDeleteDossierDialog = () => {
        setDeleteDossierDialog(false);
    };

    const hideDeleteViewClientDialog = () => {
        setViewClientsDialog(false);
    };

    const saveDossier1 = () => {
        setSubmitted(true);

        if (nom && docType.id && compteClient.id && fileUploaded.length !== 0) {
            const updatedDossier = {
                ...dossier,
                nom,
                description,
                code: generateID(6),
                typeDocument: docType,
                metadonnees: formValues,
                filePaths: fileUploaded.length > 0 ? fileUploaded : pieces,
                compteClient: compteClient
            };

            dossier?.id ? onUpdateDossier(updatedDossier) : onCreateDossier(updatedDossier);

            setDossierDialog(false);
            setFilteredDossiers((prev) => [...prev, updatedDossier]);
            setDossier(null);
        }
    };

    const saveDossier = () => {
        setSubmitted(true);

        if (nom && docType.id && compteClient.id && fileUploaded.length != 0) {
            const newDossier = {
                ...dossier,
                nom,
                description,
                code: generateID(6),
                typeDocument: docType,
                metadonnees: formValues,
                filePaths: fileUploaded,
                compteClient: compteClient
            };


            onCreateDossier(newDossier);
            setFilteredDossiers((prev) => [...prev, newDossier]);

        } else {
            const editDossier = {
                ...dossier,
                nom,
                description,
                code: generateID(6),
                typeDocument: docType,
                metadonnees: formValues,
                filePaths: [...fileUploaded, ...pieces],
                compteClient: compteClient
            };

            onUpdateDossier(editDossier);

        }
        setDossierDialog(false);
        setDossier(null);
        window.location.reload();
    };

    const changeStep = () => {
        if (activeStep < 2) {
            setActiveStep(activeStep + 1);
        } else {
            saveDossier();
        }
    };

    const editDossier = (document: any) => {
        const { id, code, nom_type, compteClient: cptClt } = document.dossiers_typesDocuments[0].type_document;

        setDossier(document);
        setNom(nom_type);
        setDescription(document.description);

        const typeDocEdit = {
            id: id,
            code: code,
            nom_type: nom_type,
            piece:[]
        };
        setDocType(typeDocEdit);
        setCompteClient({ id: cptClt.id, code: cptClt.matricule, nom_type: cptClt.matricule });
        setPieces(document.dossiers_typesDocuments[0].type_document.pieceName);
        setFormValues(document.dossierInfos || []);
        setActiveStep(0);
        setDossierDialog(true);
        setEditAction(true);
    };

    const viewClientInfo = (rowData: any) => {
        setDossier({ ...rowData });
        setDossierInfo(rowData?.dossierInfos);
        setPieces(rowData?.dossiers_typesDocuments[0]?.dossier?.piece);
        setViewClientsDialog(true);
    };

    const handleFieldChange = (id: number, cle: string, value: string) => {
        setFormValues((prevValues) => {
            const updatedValues = [...prevValues];
            const index = updatedValues.findIndex((item) => item.cle === cle);
            if (index > -1) {
                updatedValues[index].valeur = value;
            } else {
                updatedValues.push({ cle, valeur: value });
            }
            return updatedValues;
        });
    };

    const deleteDossier = () => {
        if (dossier?.id) {
            onDeleteDossier(dossier.id);
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Dossier deleted successfully', life: 3000 });
        }
        setDeleteDossierDialog(false);
        setDossier(null);
    };

    const leftToolbarTemplate = () => (
        <Button label="Nouveau" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
    );

    const handleFileUpload = (event:FileUploadUploadEvent) => {
        console.log("ooooooooooooooo",event)
        // const file = event.files[0];
        // const reader = new FileReader();
        // reader.onload = (e:any) => {
        //     const data = new Uint8Array(e.target.result);
        //     const workbook = XLSX.read(data, { type: 'array' });
        //     const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        //     const sheetData = XLSX.utils.sheet_to_json(firstSheet);
        //     setExcelData(sheetData); // Stocker les données dans un état
        // };
        // reader.readAsArrayBuffer(file);
    };

    const rightToolbarTemplate = () => (
        <>

            <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Importer" className="mr-2 inline-block" />
            <Button label="Exporter" icon="pi pi-upload" severity="help" onClick={() => dt.current?.exportCSV()} />
        </>
    );

    const actionBodyTemplate = (rowData: any) => (
        <>
            <Button icon="pi pi-eye" rounded severity="info" className="mr-2" onClick={() => viewClientInfo(rowData)} />
            <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editDossier(rowData)} />
            <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteDossier(rowData)} />
        </>
    );

    const confirmDeleteDossier = (document: any) => {
        setDossier(document);
        setDeleteDossierDialog(true);
    };

    const documentDialogFooter = (
        <>
            {activeStep > 0 && <Button label="Retourner" icon="pi pi-arrow-left" text onClick={() => setActiveStep(activeStep - 1)} />}
            <Button label={activeStep === 2 ? 'Enregistrer' : 'Suivant'} icon="pi pi-check" text onClick={changeStep} />
        </>
    );

    const formatDate = (date: any) => {
        return `Le ${new Intl.DateTimeFormat('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: '2-digit'
        }).format(new Date(date))}`;
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filterValue = e.target.value.toLowerCase();
        const filtered = dossiers.filter((dossier: any) => dossier.code.toLowerCase().includes(filterValue));
        setFilteredDossiers(filtered);
    };

    const header = (
        <div className="flex justify-content-between">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={handleSearch} placeholder="Recherche par mots-clés" />
            </span>
        </div>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />

                    <DataTable
                        ref={dt}
                        value={filteredDossiers}
                        responsiveLayout="scroll"
                        dataKey="id"
                        header={header}
                        className="datatable-responsive"
                        paginator
                        rows={10}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} dossiers"
                        rowsPerPageOptions={[5, 10, 25]}
                        globalFilterFields={['code']}
                        emptyMessage="No dossiers found."
                    >
                        <Column field="id" header="ID" sortable />
                        <Column field="code" header="Code" sortable />
                        <Column field="nom" header="Nom" sortable />
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
                                    <DropDownComponent options={typeDoc} setTypeDocument={setDocType} typeDocument={docType} placeholder={'Sélectionner un type de document'} />
                                    {submitted && !docType.id && <small className="p-invalid">Le type de document est requis.</small>}
                                </div>
                                <div className="field">
                                    <label htmlFor="compteClient">Compte client</label>
                                    <DropDownComponent options={compteMatricule} setTypeDocument={setCompteClient} typeDocument={compteClient} placeholder={'Sélectionner un compte client'} />
                                </div>
                            </>
                        ) : activeStep === 1 ? (
                            <>
                                {docTypeMeta.map((item: any) => (
                                    <DinamicForm key={item?.id} field={item} fieldValue={formValues.find((f) => f?.cle === item?.cle) || { cle: item?.cle, valeur: '' }} onFieldChange={handleFieldChange} />
                                ))}
                            </>
                        ) : (
                            <>
                                {docType?.piece && docType?.piece.map((item: any, index: number) => <UploadFileComponent piece={item} setFilePaths={setFilePaths} key={index} />)}

                                {editAction && (
                                    <div className="w-full h-200 flex justify-between align-center">
                                        {pieces?.map((item: any, index) => (
                                            <div className=" w-full h-full object-cover" key={index}>
                                                <Image src={item?.path} alt="Image" className="w-full h-full object-fill" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </Dialog>

                    <Dialog
                        visible={deleteDossierDialog}
                        style={{ width: '450px' }}
                        header="Confirmer"
                        modal
                        footer={
                            <>
                                <Button label="Non" icon="pi pi-times" text onClick={hideDeleteDossierDialog} />
                                <Button label="Oui" icon="pi pi-check" text onClick={deleteDossier} />
                            </>
                        }
                        onHide={hideDeleteDossierDialog}
                    >
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" />
                            {dossier && (
                                <span>
                                    Êtes-vous sûr de vouloir supprimer <b>{dossier.nom}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={viewClientsDialog} style={{ width: '70%' }} header={`Les informations sur ${dossier?.nom}`} modal onHide={hideDeleteViewClientDialog}>
                        <div className="confirmation-content align-left">
                            <div className="flex  text-center">
                                <p className="text-xl">
                                    <span className="text-2xl font-medium">Code client:</span> {dossier?.code}
                                </p>
                            </div>
                            <div className="flex  text-center">
                                <p className="text-xl">
                                    <span className="text-2xl text-left font-medium">Nom:</span> {dossier?.nom}
                                </p>
                            </div>

                            <Divider />
                            <p className="text-2xl font-light mt-2">La description du dossier</p>
                            {dossierInfo?.map((res: any, index) => (
                                <div className="flex  text-center" key={index}>
                                    <p className="text-xl">
                                        <span className="text-2xl text-left font-medium">{res?.cle} :</span>
                                        {' ' + res?.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <Divider />

                        <p className="text-2xl font-light">Pièce jointe</p>
                        <div className="card flex justify-content-center">
                            {pieces &&
                                pieces.map((item: any, index) => (
                                    <div className="m-5" key={index}>
                                        <p className="text-2xl font-light ">{item?.nom}</p>
                                        <Image src={item?.path} indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview className="object-fill" width="100" height="100" />
                                    </div>
                                ))}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default DossierTable;
