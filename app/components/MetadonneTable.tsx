import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { TypeDocument } from '@/types/types';
import { DocumentService } from '@/demo/service/Document.service';
// import { MetaDonneService } from "@/demo/service/MetaDonne.service";
import { generateID } from '../(main)/utils/function';
import { useMutation, useQueryClient, useQuery, InvalidateQueryFilters } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from 'primereact/dropdown';
import { createPiece, deletePiece, fetchPiece, fetchTypeDocuments, connectPieceToTypeDocument } from '../api/action';
import { MetaDonneServices } from '@/demo/service/Metadonne.service';
import { Chips } from 'primereact/chips';
import { ListBox } from 'primereact/listbox';

interface DocumentTableProps {
    documents: TypeDocument[];
    onUpdateDocument: (document: TypeDocument) => void;
    onCreateDocument: (document: TypeDocument) => void;
    onDeleteDocument: (id: number) => void;
}

const MetadonneTable = ({ documents, onUpdateDocument, onCreateDocument, onDeleteDocument }: DocumentTableProps) => {
    const [documentDialog, setDocumentDialog] = useState(false);
    const [deleteDocumentDialog, setDeleteDocumentDialog] = useState(false);
    const [deleteDocumentsDialog, setDeleteDocumentsDialog] = useState(false);
    const [document, setDocument] = useState<TypeDocument | any>(null);
    const [selectedDocuments, setSelectedDocuments] = useState<any[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [isEditItem, setIsEditItem] = useState(false);
    const [fields, setFields] = useState([{ id: 0, cle: '', valeur: '' }]);
    const queryClient = useQueryClient();
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [typeDocuments, setTypeDocuments] = useState([]);
    const typeDoc: { name: string }[] = [{ name: 'text' }, { name: 'number' }, { name: 'email' }, { name: 'tel' }, { name: 'date' }, { name: 'file' }];
    const [docType, setDocType] = useState<{ name: string }>({ name: '' });
    const [typee, setTypee] = useState<any>({});
    const [deletedFiel, setDeletedFiel] = useState([]);
    const [piece, setPiece] = useState<{ id: number; code: string; nom: string }>({ id: 0, code: '', nom: '' });
    const [addingNew, setAddingNew] = useState<boolean>(false);
    const { isSuccess: isSuccessPiece, data: typePiece } = useQuery({ queryKey: ['TypePiece'], queryFn: async () => fetchPiece() });
    const [newTypeCompte, setNewTypeCompte] = useState<string>('');

    const [type_pieces, setTypePieces] = useState<{ id: number; code: string; nom: string }[]>(typePiece || []);

    const { isSuccess, data: typeDocum }: { isSuccess: boolean; data: any } = useQuery({ queryKey: ['typeDocumentValue'], queryFn: async () => await fetchTypeDocuments() });
    const queryCompte = useQueryClient();

    const [newType, setNewType] = useState();
    const [del, setDel] = useState({ id: 0, code: 'string', nom: 'string' });
    const [selectedCountry, setSelectedCountry] = useState([]);

    useEffect(() => {
        setTypeDocuments(typeDocum);
        console.log('-----------TypeDocuments: ', typeDocuments);
    }, [isSuccess]);

    useEffect(() => {
        const tt = selectedCountry.filter((item: any) => item.id != del?.id);
        setSelectedCountry(tt);
    }, [del]);

    useEffect(() => {
        console.log('---------------------', typePiece);

        if (isSuccessPiece) {
            setTypePieces(typePiece);
        }
    }, [isSuccessPiece]);

    useEffect(() => {
        console.log('Nouvelle valeur de typee :', typee);
    }, [typee]);

    const openNew = () => {
        setDocument({ id: 0, nom_type: '', metadonnees: [] });
        setFields([{ id: 0, cle: '', valeur: '' }]);
        setTypee({ nom_type: '' });
        setSubmitted(false);
        setDocumentDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDocumentDialog(false);
        setEdit(false)
    };

    const hideDeleteDocumentDialog = () => {
        setDeleteDocumentDialog(false);
    };

    const hideDeleteDocumentsDialog = () => {
        setDeleteDocumentsDialog(false);
    };

    const onUpdateMeta = useMutation({
        mutationFn: (data: any) => MetaDonneServices.updateMetaDonnee(data.cle, data.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['document'] });
            queryClient.invalidateQueries({ queryKey: ['metadonne'] });
        }
    });
    const saveDocument = async () => {
        try {
            setSubmitted(true);
            document.piece = piece;
            document.metadonnees = fields;
            console.log('-----------document: ', document);
            console.log('-----------Fields: ', fields);
            console.log('-----------Fields: ', deletedFiel);
            console.log('-----------newPecies: ', selectedCountry);
            if (!document?.nom_type && !document.typeDocument.nom_type) {
                toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Le type de document est requis', life: 3000 });
                return;
            }

            const existingFields = document?.metadonnees || [document] || [];
            const fieldsToAdd = fields.filter((field) => field.id == 0); // Ajoute documentId à chaque élément
            const fieldsToUpdate = existingFields.filter((field: any) => (deletedFiel.length != 0 ? deletedFiel.some((deleteField: any) => field.id !== 0 && deleteField.id !== field.id) : field));
            // Identifie les éléments à supprimer
            const fieldsToDelete = deletedFiel;

            console.log('-----------existingFields: ', existingFields);
            console.log('-----------fieldsToUpdate: ', fieldsToUpdate);
            console.log('-----------fieldsToDelete: ', fieldsToDelete);
            console.log('-----------fieldsToAdd: ', fieldsToAdd);
            console.log('-----------fieldsToAdd: ', isEditItem);

            if (!isEditItem) {
                for (const pc of selectedCountry) {
                    console.log('============================:pcEdite', pc);
                    await connectPieceToTypeDocument(pc.id, document.nom_type.id);
                }

                // Ajoutez les nouveaux champs
                for (const field of document.metadonnees) {
                    console.log(field);
                    await MetaDonneServices.addMetaDonnee(document.nom_type.id, field);
                }
            } else {
                for (const fldAdd of fieldsToAdd) {
                    console.log('============================:fldAdd', fldAdd);
                    await MetaDonneServices.addMetaDonnee(document.typeDocument.id, fldAdd);
                }

                for (const pc of selectedCountry) {
                    console.log('============================:pc', pc);
                    await connectPieceToTypeDocument(pc?.id, document.typeDocument.id);
                }

                console.log('============================:fldUpdate', fieldsToUpdate);
                for (const fldUpdate of fieldsToUpdate) {
                    await MetaDonneServices.updateDocument(fldUpdate.id, fldUpdate);
                }

                for (const fldDelete of fieldsToDelete) {
                    console.log('============================:fldDelete', fldDelete);
                    await MetaDonneServices.deleteMetaDonnee(fldDelete?.id);
                }
            }

            setIsEditItem(false);
            setDocumentDialog(false);
            // setDocument(null);
            toast.current?.show({ severity: 'success', summary: 'Document mis à jour', detail: 'Le document a été mis à jour avec succès', life: 3000 });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la métadonnée:', error);
            toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la mise à jour des métadonnées', life: 3000 });
        } finally {
            queryClient.invalidateQueries({ queryKey: ['metadonne'] });

            setRefresh((prev) => !prev);
        }
    };

    const editDocument = (document: TypeDocument) => {
        console.log('***************document', document.typeDocument);

        // const editType = { nom_type: { id: document.typeDocument?.id, code: document?.typeDocument?.code, nom_type: document.typeDocument?.nom_type } }
        const editType = { nom_type: document.typeDocument?.nom_type };
        setTypee(editType);
        console.log('***************document', typee);
        setDocument({ ...document });
        setFields([document] || [{ id: 0, cle: '', valeur: '' }]);
        setSelectedCountry(document.typeDocument && document.typeDocument?.pieceName);
        setDocumentDialog(true);
        setIsEditItem(true);
    };

    const confirmDeleteDocument = (document: TypeDocument) => {
        setDocument(document);
        setDeleteDocumentDialog(true);
    };

    const handleRemove = (index: number) => {
        const fieldToRemove = fields[index];
        setFields(fields.filter((_: any, i: number) => i !== index));
    };

    const deleteDocument = () => {
        if (document?.id) {
            console.log('************document', document);
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
        selectedDocuments?.forEach((doc: { id: number }) => onDeleteDocument(doc.id));
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
    const [filteredDocuments, setFilteredDocuments] = useState(documents);

    useEffect(() => {
        console.log('Data is changed :)');
        setFilteredDocuments(documents);
    }, [documents]);
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filterValue = e.target.value.toLowerCase(); // Convertir en minuscules pour une recherche insensible à la casse
        console.log('Search Value:', documents);

        const filtered = documents.filter((document: any) => document.cle.toLowerCase().includes(filterValue) || document.valeur.toLowerCase().includes(filterValue) || formatDate(document.created_at).toLowerCase().includes(filterValue));

        setFilteredDocuments(filtered);
    };
    const header = (
        <div className="flex justify-content-between">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />

                <InputText type="search" onInput={handleSearch} placeholder="Recherche par mots-clés" />
            </span>
        </div>
    );
    const formatDate = (date: Date) => {
        return `Le ${new Intl.DateTimeFormat('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: '2-digit'
        }).format(new Date(date))}`;
    };

    const optionItemTemplate = (option: any) => {
        return (
            <div className="   flex align-items-center justify-between">
                <div className="!bg-black w-full ">{option.nom_type}</div>
            </div>
        );
    };

    const removeTypeCompte = (option: { id: number; name: string }) => {
        const newOptions = [...type_pieces].filter((opt) => opt.id != option.id);
        deleteMutation.mutate(option.id);
        console.log(option);
        console.log(newOptions);
        setTypePieces(newOptions);
    };

    const optionTemplate = (option: any) => {
        if (option.nom === 'addNew') {
            return (
                <div className="flex align-items-center ">
                    <Button label="Ajouter un nouveau type" icon="pi pi-plus" className="w-full" outlined onClick={() => setAddingNew(true)} />
                </div>
            );
        } else {
            return (
                <div className="   flex align-items-center justify-between">
                    <div className="!bg-black w-full ">{option.nom}</div>
                    <div>
                        <Button icon="pi pi-times" className=" w-14 border-0 text-red-500" outlined onClick={(e) => removeTypeCompte(option)} />
                    </div>
                </div>
            );
        }
    };

    const addNewTypeCompte = async () => {
        console.log(newType);

        if (newType != undefined && newType.trim() !== '') {
            await createMutation.mutate({ nom: newType });
            console.log('-----------pppppp: ', newType);
        }
    };

    const createMutation = useMutation({
        mutationFn: (opt: Omit<{ nom: string }, 'id'>) => createPiece({ ...opt, code: generateID(4) }),
        onSuccess: async (opt) => {
            await queryCompte.invalidateQueries(['typePiece'] as InvalidateQueryFilters);
            if (opt && opt.id !== undefined) {
                console.log('-----opt', opt);

                const option = { id: opt.id, code: opt.code, nom: opt.nom as string };

                setPiece({ ...option });

                setTypePieces([...type_pieces, option]);
                setNewType('');
                toast.current?.show({ severity: 'success', summary: 'Creation avec success', detail: 'La création du nom des piece ', life: 3000 });
            }
        },
        onError: (error) => {
            toast.current?.show({ severity: 'error', summary: 'Creation Failed', detail: 'La création du compte a échoué', life: 3000 });
            console.log('onError', error);
        }
    });
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deletePiece(id),
        onSuccess: () => {
            queryCompte.invalidateQueries({ queryKey: ['typePiece'] });
        },
        onError: (error) => {
            console.log('onDeleteError', error);
            toast.current?.show({ severity: 'error', summary: 'Deletion Failed', detail: 'La suppression du compte a échoué', life: 3000 });
        }
    });

    const countryTemplate = (option: any) => {
        return (
            <div className="  flex align-items-center justify-between">
                <div className="!bg-black w-full ">{option.nom}</div>
                <div>
                    <Button
                        icon="pi pi-times"
                        className=" w-14 border-0 text-red-500"
                        outlined
                        onClick={(e) => {
                            setDel(option);
                            removeTypeCompte(option);
                        }}
                    />
                </div>
            </div>
            // <div className="flex align-items-center justify-between	">
            //     {/* removeTypeCompte */}
            //     {/* <img alt={option.nom} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`flag flag-${option.code.toLowerCase()}`} style={{ width: '1.25rem', marginRight: '.5rem' }}/> */}
            //     <div>{option.nom}</div>
            //     <Button icon="pi pi-times" className=" w-14 border-0 text-red-500" outlined onClick={(e) => removeTypeCompte(option)} />
            // </div>
        );
    };

    const customChip = (item) => {
        return (
            <div>
                <span>{item.nom}</span>
            </div>
        );
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />
                    <DataTable
                        // key={globalFilter}
                        ref={dt}
                        value={filteredDocuments}
                        responsiveLayout="scroll"
                        dataKey="id"
                        header={header}
                        className="datatable-responsive"
                        paginator
                        rows={10}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        rowsPerPageOptions={[5, 10, 25]}
                        // globalFilter={globalFilter}
                        globalFilterFields={['cle', 'valeur', 'created_at']}
                        filterDisplay="row"
                        emptyMessage="No products found."
                    >
                        <Column field="id" header="ID" sortable />
                        {/* <Column field="code" header="Code" sortable /> */}
                        <Column field="cle" header="Nom de champs" sortable />
                        <Column field="valeur" header="Type de champs" sortable />
                        <Column field="created_at" header="Date creation" sortable body={(rowData) => formatDate(rowData.created_at)} />
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }} />
                    </DataTable>

                    <Dialog visible={documentDialog} style={{ width: '950px', height: '70%' }} header="Détails du document" modal className="p-fluid" footer={documentDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nom_type">Type de document</label>
                            {/* <InputText id="nom_type" value={document?.nom_type || ''} onChange={(e) => setDocument({ ...document, nom_type: e.target.value })} required className={classNames({ 'p-invalid': submitted && !document?.nom_type })} /> */}

                            <Dropdown
                                name="nom_type"
                                value={typeDocuments?.find((doc) => doc.nom_type === typee?.nom_type) || typee?.nom_type}
                                options={typeDocuments}
                                onChange={(e) => {
                                    console.log('ppppppppp', typee);
                                    console.log('ppppppppp', typeDocuments);
                                    console.log('ppppppppp', typee?.nom_type);

                                    setTypee({ nom_type: e.value });
                                    setDocument({ ...document, nom_type: e.value });
                                }}
                                optionLabel="nom_type"
                                placeholder="Sélectionnez une nature"
                                itemTemplate={optionItemTemplate}
                                className="w-full "
                            />

                            {submitted && !document?.nom_type && <small className="p-invalid">Le nom est requis.</small>}
                        </div>
                        <div className="flex gap-5">
                            <div>
                                <h5>Champs dynamiques</h5>
                                {fields.map((field, index) => (
                                    <div className="field" key={index}>
                                        <div className="p-fluid grid">
                                            <div className="field col-5">
                                                <InputText
                                                    value={field.cle}
                                                    onChange={(e) => {
                                                        const newFields = [...fields];
                                                        newFields[index].cle = e.target.value;
                                                        setFields(newFields);
                                                    }}
                                                    placeholder="Nom du champ"
                                                />
                                            </div>
                                            <div className="field col-5">
                                                <Dropdown
                                                    value={typeDoc.find((td) => td.name === field.valeur) || null}
                                                    options={typeDoc}
                                                    onChange={(e) => {
                                                        const newFields = [...fields];
                                                        newFields[index].valeur = e.target.value.name;
                                                        console.log('pp', newFields[index]);

                                                        setFields(newFields);
                                                    }}
                                                    optionLabel="name"
                                                    placeholder="Sélectionnez un type de document"
                                                />
                                            </div>
                                            {!isEditItem && (
                                                <div className="field col-2">
                                                    <Button
                                                        icon="pi pi-minus"
                                                        className="p-button-danger"
                                                        onClick={() => {
                                                            setDeletedFiel((prev:any) => [...prev, field]);
                                                            handleRemove(index);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {!isEditItem && (
                                    <div className="field">
                                        <div className="p-fluid grid">
                                            <div className="field col-5"></div>
                                            <div className="field col-5"></div>
                                            <div className="field col-2">
                                                <Button
                                                    icon="pi pi-plus"
                                                    onClick={() => setFields([...fields, { id: 0, cle: '', valeur: '' }])}
                                                    tooltip="Ajouter des nouveaux champs"
                                                    tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                                                />
                                                <Tooltip target=".logo" mouseTrack mouseTrackLeft={10} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h5>Le nom des différentes pièces jointes</h5>
                                <div className="field">
                                    <div className="p-fluid grid">
                                        <div className="!w-[300px] mt-2">
                                            <div className="!w-[300px]">
                                                <Chips value={selectedCountry} disabled itemTemplate={customChip} className="!w-[300px] mb-5" />
                                            </div>

                                            <div className="!w-[300px]">
                                                <ListBox
                                                    filter
                                                    value={selectedCountry}
                                                    onChange={(e) => {
                                                        console.log(e.value);
                                                        setSelectedCountry(e.value);
                                                    }}
                                                    options={type_pieces}
                                                    optionLabel="nom"
                                                    itemTemplate={countryTemplate}
                                                    className="w-full  "
                                                    listStyle={{ maxHeight: '150px' }}
                                                    multiple
                                                />
                                            </div>

                                            <div className="p-fluid grid mt-2 ">
                                                <div className="field col-8">
                                                    <InputText
                                                        value={newType}
                                                        onChange={(e) => {
                                                            // console.log(e.target.value)
                                                            const newFields = e.target.value;
                                                            setNewType(newFields);
                                                            // [index].cle = e.target.value;
                                                            // setFields(newFields);
                                                        }}
                                                        placeholder="Nom du champ"
                                                    />
                                                </div>
                                                <div className="field col-4">
                                                    <Button label="Ajouter " onClick={addNewTypeCompte} tooltip="Ajouter des nouveaux type de piece" tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }} text />

                                                    <Tooltip target=".logo" mouseTrack mouseTrackLeft={10} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteDocumentDialog} style={{ width: '450px' }} header="Confirmer" modal footer={deleteDocumentDialogFooter} onHide={hideDeleteDocumentDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" />
                            {document && (
                                <span>
                                    Êtes-vous sûr de vouloir supprimer <b>{document.nom_type}</b>?
                                </span>
                            )}
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

export default MetadonneTable;
