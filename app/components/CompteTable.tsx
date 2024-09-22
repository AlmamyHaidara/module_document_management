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
import { Client, CompteClient } from "@/types/types";
import { DocumentService } from "@/demo/service/Document.service";
import { MetaDonneServices } from "@/demo/service/Metadonne.service";
import { generateID, generateUniqueNumber } from "../(main)/utils/function";
import { InvalidateQueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from "primereact/dropdown";
import { useQuery } from '@tanstack/react-query';
import { createOption, deleteOption, fetchClientCode, fetchOption } from '@/app/api/action';

interface ClientTableProps {
    comptes: any[];
    globalFilterValue: string;
    setGlobalFilterValue: (value: string) => void;
    onUpdateCompte: (compte: CompteClient) => void;
    onCreateCompte: (compte: CompteClient) => void;
    onDeleteCompte: (id: number) => void;
}

const CompteTable = ({ comptes, globalFilterValue, setGlobalFilterValue, onUpdateCompte, onCreateCompte, onDeleteCompte }: ClientTableProps) => {
    const [clientDialog, setCompteDialog] = useState(false);
    const [deleteClientDialog, setDeleteDocumentDialog] = useState(false);
    const [deleteClientsDialog, setDeleteDocumentsDialog] = useState(false);
    const [compte, setCompte] = useState<Client | any>(null);
    const [selectedClient, setSelectedClient] = useState<Client[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fields, setFields] = useState([{ id: 0, cle: "", valeur: "" }]);
    const queryClient = useQueryClient();
    const router = useRouter()
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const queryCompte = useQueryClient();


    const [newTypeCompte, setNewTypeCompte] = useState<string>("");
    const [addingNew, setAddingNew] = useState<boolean>(false);

    const { data: clientCode } = useQuery({ queryKey: ['clientCode'], queryFn: async () => fetchClientCode() });
    const { isSuccess, data: typeComptes } = useQuery({ queryKey: ['typeCompte'], queryFn: async () => fetchOption() });
    const [type_comptes, setTypeComptes] = useState<{ id: number, name: string }[]>(typeComptes || []);
    const [value, setValue] = useState<{ id: number }>({ id: 0 });
    const [nature, setNature] = useState<{ name: string }>({ name: "" });

    useEffect(() => {
        console.log("---------------------", isSuccess);

        if (isSuccess) {
            setTypeComptes(typeComptes)
        }
    }, [isSuccess])

    const createMutation = useMutation({
        mutationFn: (opt: Omit<{ name: string }, "id">) => createOption(opt),
        onSuccess: async (opt) => {
            await queryCompte.invalidateQueries(["typeCompte"] as InvalidateQueryFilters);
            if (opt && opt.id !== undefined) {
                setValue({ id: opt.id });
            }
        },
        onError: (error) => {
            toast.current?.show({ severity: 'error', summary: 'Creation Failed', detail: 'La création du compte a échoué', life: 3000 });
            console.log("onError", error);
        }

    });
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteOption(id),
        onSuccess: () => {
            queryCompte.invalidateQueries({ queryKey: ["typeCompte"] });
        },
        onError: (error) => {
            console.log("onDeleteError", error);
            toast.current?.show({ severity: 'error', summary: 'Deletion Failed', detail: 'La suppression du compte a échoué', life: 3000 });
        }
    });

    // createOption
    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
    };
    useEffect(() => {
        console.log("-----------nature: ", nature)
    }, [nature]);
    const openNew = () => {
        setCompte({ matricule: generateID(10), numero_compte: generateUniqueNumber(), code_gestionnaire: generateID(5), type_compte: "", date_ouverture: Date.now(), agence: "", client_id: 0 });
        // setFields([{ id: 0, cle: "", valeur: "" }]);
        setSubmitted(false);
        setCompteDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCompteDialog(false);
    };

    const hideDeleteDocumentDialog = () => {
        setDeleteDocumentDialog(false);
    };

    const hideDeleteDocumentsDialog = () => {
        setDeleteDocumentsDialog(false);
    };


    const saveCompte = () => {
        try {
            setSubmitted(true);
            console.log("------------compte", compte)
            if (compte && compte?.id) {
                console.log("-----------ClientModifier: ", compte)
                onUpdateCompte(compte)
            } else {
                delete compte.id

                onCreateCompte(compte)
            }
            setCompteDialog(false);
            setCompte(null);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la métadonnée:", error);
            toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la mise à jour des métadonnées', life: 3000 });

        }
    };

    const editDocument = (compte: Client) => {
        console.log("================compte: ", compte);

        setCompte({ ...compte });
        setCompteDialog(true);
    };

    const confirmDeleteDocument = (compte: Client) => {
        setCompte(compte);
        setDeleteDocumentDialog(true);
    };

    const handleRemove = (index: number) => {
        const fieldToRemove = fields[index];
        setFields(fields.filter((_, i) => i !== index));
    };

    const deleteDocument = () => {
        if (compte?.id) {
            onDeleteCompte(compte.id);
            toast?.current?.show({ severity: 'success', summary: 'Document supprimé', detail: 'Le compte a été supprimé avec succès', life: 3000 });
        } else {
            toast?.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Document non trouvé', life: 3000 });
        }
        setDeleteDocumentDialog(false);
        setCompte(null);
    };

    const confirmDeleteSelected = () => {
        setDeleteDocumentsDialog(true);
    };
    const deleteSelectedDocuments = () => {
        selectedClient?.forEach((doc: Client) => {
            if (doc.id !== undefined) {
                onDeleteCompte(doc.id);
            }
        });
        setDeleteDocumentsDialog(false);
        setSelectedClient(null);
        toast.current?.show({ severity: 'success', summary: 'Documents supprimés', detail: 'Les comptes sélectionnés ont été supprimés avec succès', life: 3000 });
    };

    const actionBodyTemplate = (rowData: Client) => {
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
                {/* <Button label="Supprimer" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedClient || !selectedClient.length} /> */}
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
            <Button label="Enregistrer" icon="pi pi-check" text onClick={saveCompte} />
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
    const formatDate = (date: Date) => {
        return `Le ${new Intl.DateTimeFormat('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
        }).format(new Date(date))}`
    };
    const countMedonne = (metaDatas: any) => {
        console.log(metaDatas.metadonnees.length);

    }


    const selectedCountryTemplate = (option: any, props: any) => {
        console.log("------------kkkkkkkkkkkkkkk",option)
        if (props?.value?.code) {
            return (
                <div className="flex align-items-center">
                    <div>{props?.value?.code}</div>
                </div>
            );
        }

        console.log("--------option: ", option)
        return <span>{props.placeholder}</span>;
    };

    const countryOptionTemplate = (option: any) => {
        // console.log("--------option: ",option.code);

        return (
            <div className="flex align-items-center">
                <div>{option.code}</div>
            </div>
        );
    };

    const addNewTypeCompte = async () => {
        if (newTypeCompte.trim() !== "") {
            createMutation.mutate({ name: newTypeCompte })
            //    console.log("-----------pppppp: ",creation);

            setTypeComptes([...type_comptes, { id: value.id, name: newTypeCompte }]);
            setCompte({ ...compte, type_compte: newTypeCompte }); // Sélectionner automatiquement le nouveau type de compte
            setNewTypeCompte(""); // Réinitialiser le champ de saisie
            setAddingNew(false); // Fermer la saisie après ajout

        }
    };

    const removeTypeCompte = (option: { id: number, name: string }) => {
        const newOptions = [...type_comptes].filter((opt) => opt.id != option.id)
        deleteMutation.mutate(option.id)
        console.log(option)
        console.log(newOptions)
        setTypeComptes(newOptions)

    }
    useEffect(() => {
        console.log("---------------Compte: ", comptes);

    }, [])

    const optionTemplate = (option: any) => {
        if (option.name === "addNew") {
            return (
                <div className="flex align-items-center ">
                    <Button
                        label="Ajouter un nouveau type"
                        icon="pi pi-plus"
                        className="w-full"
                        outlined
                        onClick={() => setAddingNew(true)}
                    />
                </div>
            );
        } else {
            return (
                <div className="   flex align-items-center justify-between">
                    <div className="!bg-black w-full ">
                        {option.name}
                    </div>
                    <div>
                        <Button icon="pi pi-times" className=" w-14 border-0 text-red-500" outlined onClick={(e) => removeTypeCompte(option)} />
                    </div>
                </div>
            );
        }
    };


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />
                    <DataTable ref={dt} value={comptes} responsiveLayout="scroll" dataKey="id" header={header}>
                        <Column field="id" header="ID" sortable />
                        <Column field="matricule" header="Matricule" sortable />
                        <Column field="numero_compte" header="Numero Compte" sortable />
                        <Column field="code_gestionnaire" header="Code Gestionnaire" sortable />
                        <Column field="agence" header="Agence" sortable />
                        <Column field="type_compte" header="Telephone" sortable body={(cpt) => cpt.type_compte?.name} />

                        <Column field="created_at" header="Date creation" sortable body={(rowData) => formatDate(rowData.created_at)} />
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }} />
                    </DataTable>

                    <Dialog visible={clientDialog} style={{ width: '450px' }} header="Détails du compte" modal className="p-fluid" footer={documentDialogFooter} onHide={hideDialog}>
                        <div className="field">

                            <div className="p-fluid grid">
                                <div className="field col">
                                    <label htmlFor="matricule">Matricule</label>
                                    <InputText id="matricule" value={compte?.matricule || ''} onChange={(e) => setCompte({ ...compte, matricule: e.target.value })} required disabled className={classNames({ 'p-invalid': submitted && !compte?.matricule })} />
                                    {submitted && !compte?.matricule && <small className="p-invalid">Le matricule est requis.</small>}
                                </div>
                                <div className="field col">
                                    <label htmlFor="agence">Agence</label>
                                    <InputText id="agence" value={compte?.agence || ''} onChange={(e) => setCompte({ ...compte, agence: e.target.value })} required className={classNames({ 'p-invalid': submitted && !compte?.agence })} />
                                    {submitted && !compte?.agence && <small className="p-invalid">Le agence est requis.</small>}
                                </div>
                            </div>

                            <div className="p-fluid grid">
                                <div className="field col">
                                    <label htmlFor="email">code client</label>
                                    <Dropdown
                                        name="code"
                                        value={compte?.client}
                                        onChange={(e) => setCompte({ ...compte, client: e.value })}
                                        options={clientCode}
                                        optionLabel="code"
                                        placeholder="Sélectionnez un client"
                                        filter
                                        valueTemplate={selectedCountryTemplate}
                                        itemTemplate={countryOptionTemplate}
                                        className="w-full md:w-14rem"
                                    />
                                    {submitted && !compte?.email && <small className="p-invalid">Le email est requis.</small>}
                                </div>

                                <div className="field col-6">
                                    <label htmlFor="type_compte">Type de compte</label>
                                    <Dropdown
                                        name="type_compte"
                                        value={type_comptes.find(tc => tc.name === compte?.type_compte?.name) || { name: compte?.type_compte?.name }}
                                        options={[...type_comptes, { name: "addNew" }]} // Ajoute l'option spéciale "addNew"
                                        onChange={(e) => setCompte({ ...compte, type_compte: e.value })}
                                        optionLabel="name"
                                        placeholder="Sélectionnez une nature"
                                        itemTemplate={optionTemplate}
                                        className="w-full md:w-14rem"
                                    />
                                    {/* {submitted && !compte?.type_compte && <small className="p-invalid">Le type de compte est requis.</small>} */}

                                    {addingNew && (
                                        <div className="flex mt-3">
                                            <InputText
                                                value={newTypeCompte}
                                                onChange={(e) => setNewTypeCompte(e.target.value)}
                                                placeholder="Ajouter un nouveau type"
                                                className="mr-2"
                                            />
                                            <Button icon="pi pi-plus" className=" w-3" onClick={addNewTypeCompte} />
                                        </div>
                                    )}
                                </div>
                            </div>



                        </div>




                    </Dialog>

                    <Dialog visible={deleteClientDialog} style={{ width: '450px' }} header="Confirmer" modal footer={deleteDocumentDialogFooter} onHide={hideDeleteDocumentDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" />
                            {compte && <span>Êtes-vous sûr de vouloir supprimer <b>{compte.nom_type}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteClientsDialog} style={{ width: '450px' }} header="Confirmer" modal footer={deleteDocumentsDialogFooter} onHide={hideDeleteDocumentsDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" />
                            {selectedClient && <span>Êtes-vous sûr de vouloir supprimer les comptes sélectionnés?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default CompteTable;
