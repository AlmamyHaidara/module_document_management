/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { DataTable, DataTableExpandedRows, DataTableRowEvent, DataTableValueArray } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { InputText } from 'primereact/inputtext';
import { classNames } from "primereact/utils";
import { Client,CompteClients } from "@/types/types";
import { DocumentService } from "@/demo/service/Document.service";
import { MetaDonneService } from "@/demo/service/MetaDonne.service";
import { generateID } from "../(main)/utils/function";
import { useRouter } from "next/navigation";
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from "primereact/dropdown";
import { Fieldset } from "primereact/fieldset";
import { NatureEnum } from "@prisma/client";
import { InvalidateQueryFilters, useMutation, useQueryClient,useQuery } from "@tanstack/react-query";
import { createOption, deleteOption, fetchClientCode, fetchOption } from '@/app/api/action';
import { Divider } from 'primereact/divider';


interface ClientTableProps {
    clients: Client[];
    globalFilterValue: string;
    setGlobalFilterValue: (value: string) => void;
    onUpdateClient: (client: any) => void;
    onCreateClient: (client: any) => void;
    onDeleteClient: (id: number) => void;
}

const ClientTable = ({ clients, globalFilterValue, setGlobalFilterValue, onUpdateClient, onCreateClient, onDeleteClient }: ClientTableProps) => {
    const queryCompte = useQueryClient();

    const [clientDialog, setClientDialog] = useState(false);
    const [deleteClientDialog, setDeleteDocumentDialog] = useState(false);
    const [deleteClientsDialog, setDeleteDocumentsDialog] = useState(false);
    const [viewClientsDialog, setViewClientsDialog] = useState(false);
    const [client, setClient] = useState<Client | any >(null);
    const { isSuccess, data: typeComptes } = useQuery({ queryKey: ['typeCompte'], queryFn: async () => fetchOption() });
    const [type_comptes, setTypeComptes] = useState<{ id: number, name: string }[]>(typeComptes || []);

    const [compte, setCompte] = useState<CompteClients | any >(null);
    const [selectedClient, setSelectedClient] = useState<Client[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fields, setFields] = useState([{ id: 0, cle: "", valeur: "" }]);
    const queryClient = useQueryClient();
    const router = useRouter()
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const natures:{name:string}[]= ([{name:"Physique"},{name:"Moral"}]);
    const [nature, setNature] = useState<{name:string}>({name:""});
    const [value, setValue] = useState<{ id: number }>({ id: 0 });
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
    const [newTypeCompte, setNewTypeCompte] = useState<string>("");
    const [addingNew, setAddingNew] = useState<boolean>(false);



    useEffect(() => {
        console.log("---------------------", isSuccess);

        if (isSuccess) {
            setTypeComptes(typeComptes)
        }
    }, [isSuccess])


    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
    };
    useEffect(()=>{
       console.log("-----------nature: ",nature)
    }, [nature]);


    const openNew = () => {
     setClient({  nom: "",code:generateID(8), prenom:"", email:"",telephone:"",profession:"",adresse:'' });
     setCompte({matricule:"",numero_compte:"", code_gestionnaire:"", agence:"",type_compte:""})
        // setFields([{ id: 0, cle: "", valeur: "" }]);
        setSubmitted(false);
        setClientDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setClientDialog(false);
    };

    const hideDeleteDocumentDialog = () => {
        setDeleteDocumentDialog(false);
    };

    const hideDeleteDocumentsDialog = () => {
        setDeleteDocumentsDialog(false);
    };

    const hideDeleteViewClientDialog = () => {
        setViewClientsDialog(false);
    };

const onUpdateMeta = useMutation({
    mutationFn:(data:any)=> MetaDonneService.updateMetaDonnee(data.cle,data.data),
    onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:['client']})

    }
})
    const saveDocument = () => {
        try {
            setSubmitted(true);
            console.log("------------client",{client:{...client}, compte:{...compte}})
            if(client && client?.id){
                console.log("-----------ClientModifier: ",{client:{...client}, compte:{...compte}})
                onUpdateClient({client:{...client}, compte:{...compte}})
            }else{

                onCreateClient({client:{...client}, compte:{...compte}})
            }
        setClientDialog(false);
        setClient(null);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la métadonnée:", error);
                         toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la mise à jour des métadonnées', life: 3000 });

        }
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

    const editDocument = (client: Client) => {
        setClient({ ...client });
        setCompte(client?.comptes ? client.comptes[0] : null); // Set the first compte or null if none exist
        console.log("ewsdcx ", compte);
        // setTypeComptes(client.)
        console.log("ppppppppppppppppppppppp",client.comptes[0]);

        // setFields(client.metadonnees || [{ id: 0, cle: "", valeur: "" }]);
        setClientDialog(true);
    };

    const confirmDeleteDocument = (client: Client) => {
        setClient(client);
        setDeleteDocumentDialog(true);
    };

    const handleRemove = (index: number) => {
        const fieldToRemove = fields[index];
        setFields(fields.filter((_, i) => i !== index));
    };

    const deleteDocument = () => {
        if (client?.id) {
            onDeleteClient(client.id);
            toast?.current?.show({ severity: 'success', summary: 'Document supprimé', detail: 'Le client a été supprimé avec succès', life: 3000 });
        } else {
            toast?.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Document non trouvé', life: 3000 });
        }
        setDeleteDocumentDialog(false);
        setClient(null);
    };

    const confirmDeleteSelected = () => {
        setDeleteDocumentsDialog(true);
    };

    const deleteSelectedDocuments = () => {
        selectedClient?.forEach((doc:any) => onDeleteClient(doc.id))
        setDeleteDocumentsDialog(false);
        setSelectedClient(null);
        toast.current?.show({ severity: 'success', summary: 'Documents supprimés', detail: 'Les clients sélectionnés ont été supprimés avec succès', life: 3000 });
    };

    const viewClientInfo = async (rowData:any)=>{

        setClient({ ...rowData });
        setCompte(rowData?.comptes ? rowData.comptes[0] : null); // Set the first compte or null if none exist
        console.log("ewsdcx ", compte);
        // setTypeComptes(client.)
        console.log("ppppppppppppppppppppppp",rowData);

        setViewClientsDialog(true)
    }

    const actionBodyTemplate = (rowData: Client) => {
        return (
            <>
                <Button icon="pi pi-eye" rounded severity="info" className="mr-2" onClick={() => viewClientInfo(rowData)} />
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

    const collapseAll = () => {
        setExpandedRows(undefined);
    };

    const rowExpansionTemplate = (data: any) => {
        return (
            <div className="p-3">
                <h5>Les comptes du clients {data.nom}</h5>
                <DataTable value={data.comptes}>
                    <Column field="id" header="Id" sortable></Column>
                     <Column field="matricule" header="Matricule" sortable></Column>
                    <Column field="numero_compte" header="numéro du compte" sortable></Column>
                    <Column field="code_gestionnaire" header="Code de gestionnaire" sortable></Column>
                    <Column field="agence" header="agence"  sortable></Column>
                    <Column field="created_at" header="Date creation" sortable body={(rowData) => formatDate(rowData.created_at)}  />

                    {/*<Column field="status" header="Status" body={statusOrderBodyTemplate} sortable></Column>
                    <Column headerStyle={{ width: '4rem' }} body={searchBodyTemplate}></Column> */}
                </DataTable>
            </div>
        );
    };
    const onRowExpand = (event: DataTableRowEvent) => {
        toast.current?.show({ severity: 'info', summary: 'Product Expanded', detail: event.data.nom, life: 3000 });
    };

    const onRowCollapse = (event: DataTableRowEvent) => {
        toast.current?.show({ severity: 'success', summary: 'Product Collapsed', detail: event.data.nom, life: 3000 });
    };

    // const expandAll = () => {
    //     let _expandedRows: DataTableExpandedRows = {};

    //     clients?.comptes.forEach((p) => (_expandedRows[`${p.id}`] = true));

    //     setExpandedRows(_expandedRows);
    // };
    const allowExpansion = (rowData: any) => {
        return rowData.comptes!.length > 0;
    };




    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />
                    {/* <DataTable ref={dt} value={clients} responsiveLayout="scroll" dataKey="id" header={header}> */}

                         <DataTable ref={dt} value={clients} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                    onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate}
                    dataKey="id" header={header} tableStyle={{ minWidth: '60rem' }}>
                <Column expander={allowExpansion} style={{ width: '5rem' }} />


                         <Column field="id" header="ID" sortable />
                        <Column field="code" header="Code" sortable />
                        <Column field="nom" header="Nom" sortable />
                        <Column field="prenom" header="Prenom" sortable  />
                        <Column field="telephone" header="Telephone" sortable  />
                        <Column field="adresse" header="Adresse" sortable  />
                        <Column field="profession" header="Profession" sortable  />
                        <Column field="nature" header="Nature" sortable  />
                        <Column field="created_at" header="Date creation" sortable body={(rowData) => formatDate(rowData.created_at)}  />
                       <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }} />
                    </DataTable>

                    <Dialog visible={clientDialog} style={{ width: '80%' }} header="Détails du client" modal className="p-fluid" footer={documentDialogFooter} onHide={hideDialog}>
                        <div className="field flex ">
                         <Fieldset legend="Information du client">

                                <div className="p-fluid grid">
                                <div className="field col-6">
                                            <label htmlFor="nature">Nature</label>
                                            <Dropdown name="nature" value={{name: client?.nature}} options={natures} onChange={(e) => {  setClient({ ...client,nature:e.target.value.name}) }} optionLabel="name" placeholder="Sélectionnez une nature" />
                                        </div>
                                        <div className="field col">
                                        <label htmlFor="adresse">Address</label>
                                        <InputText id="adresse" type="text" value={client?.adresse || ''} onChange={(e) => setClient({ ...client, adresse: e.target.value })} required className={classNames({ 'p-invalid': submitted && !client?.adresse })} />
                                    </div>
                                </div>

                                <div className="p-fluid grid">

                                        <div className="field col">
                                            <label htmlFor="nom_type">Nom</label>
                                            <InputText id="nom" value={client?.nom || ''} onChange={(e) => setClient({ ...client, nom: e.target.value })} required className={classNames({ 'p-invalid': submitted && !client?.nom })} />
                                            {submitted && !client?.nom && <small className="p-invalid">Le nom est requis.</small>}
                                        </div>
                                        <div className="field col">
                                            <label htmlFor="prenom">{
                                        client?.nature=="Physique"?"Prenom":"Cygle"
                                    }</label>
                                            <InputText id="prenom" value={client?.prenom || ''} onChange={(e) => setClient({ ...client, prenom: e.target.value })} required className={classNames({ 'p-invalid': submitted && !client?.prenom })} />
                                            {submitted && !client?.prenom && <small className="p-invalid">Le prenom est requis.</small>}
                                        </div>

                                </div>
                                <div className="p-fluid grid">
                                        <div className="field col">
                                        <label htmlFor="prenom">Telephone</label>
                                            <InputText id="telephone" value={client?.telephone || ''} onChange={(e) => setClient({ ...client, telephone: e.target.value })} required className={classNames({ 'p-invalid': submitted && !client?.telephone })} />
                                            {submitted && !client?.telephone && <small className="p-invalid">Le telephone est requis.</small>}
                                        </div>
                                        <div className="field col-6">
                                            <label htmlFor="profession">Profession</label>
                                            <InputText id="profession" value={client?.profession || ''} onChange={(e) => setClient({ ...client, profession: e.target.value })} required className={classNames({ 'p-invalid': submitted && !client?.profession })} />
                                            {submitted && !client?.profession && <small className="p-invalid">Le profession est requis.</small>}
                                        </div>


                                </div>
                               <div className="p-fluid grid">
                                </div>
                            </ Fieldset>

                            <Fieldset legend="Les information du compte">
                            <div className="p-fluid grid">
                                <div className="field col">
                                    <label htmlFor="matricule">Matricule</label>
                                    <InputText id="matricule" value={compte?.matricule || ''} onChange={(e) => setCompte({ ...compte, matricule: e.target.value })} required  className={classNames({ 'p-invalid': submitted && !compte?.matricule })} />
                                    {submitted && !compte?.matricule && <small className="p-invalid">Le matricule est requis.</small>}
                                </div>
                                <div className="field col">
                                    <label htmlFor="num_compte">Numero de compte</label>
                                    <InputText id="num_compte"value={compte?.numero_compte || ''} onChange={(e) => setCompte({ ...compte, numero_compte: e.target.value })} required className={classNames({ 'p-invalid': submitted && !compte?.numero_compte })} />
                                    {submitted && !compte?.numero_compte && <small className="p-invalid">Le agence est requis.</small>}
                                </div>

                                 <div className="field col">
                                    <label htmlFor="code_gestionnaire">Code de gestionnaire</label>
                                    <InputText id="code_gestionnaire"value={compte?.code_gestionnaire || ''} onChange={(e) => setCompte({ ...compte, code_gestionnaire: e.target.value })} required className={classNames({ 'p-invalid': submitted && !compte?.code_gestionnaire })} />
                                    {submitted && !compte?.code_gestionnaire && <small className="p-invalid">Le agence est requis.</small>}
                                </div>
                            </div>

                            <div className="p-fluid grid">

                            <div className="field col">
                                    <label htmlFor="agence">Agence</label>
                                    <InputText id="agence" value={compte?.agence || ''} onChange={(e) => setCompte({ ...compte, agence: e.target.value })} required className={classNames({ 'p-invalid': submitted && !compte?.agence })} />
                                    {submitted && !compte?.agence && <small className="p-invalid">Le agence est requis.</small>}
                                </div>
                                <div className="field col">
                                    <label htmlFor="type_compte">Type de compte</label>
                                    <Dropdown
                                        name="type_compte"
                                        value={type_comptes.find(tc => tc.name === compte?.type_compte?.name) || { name: compte?.type_compte?.name }}
                                        options={[...type_comptes, { name: "addNew" }]} // Ajoute l'option spéciale "addNew"
                                        onChange={(e) => setCompte({ ...compte, type_compte: e.value })}
                                        optionLabel="name"
                                        placeholder="Sélectionnez une nature"
                                        itemTemplate={optionTemplate}
                                        className="w-full "
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
                            </Fieldset>

                        </div>




                    </Dialog>

                    <Dialog visible={deleteClientDialog} style={{ width: '450px' }} header="Confirmer" modal footer={deleteDocumentDialogFooter} onHide={hideDeleteDocumentDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" />
                            {client && <span>Êtes-vous sûr de vouloir supprimer <b>{client.nom_type}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteClientsDialog} style={{ width: '450px' }} header="Confirmer" modal footer={deleteDocumentsDialogFooter} onHide={hideDeleteDocumentsDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" />
                            {selectedClient && <span>Êtes-vous sûr de vouloir supprimer les clients sélectionnés?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={viewClientsDialog} style={{ width: '70%' }} header={`Les information sur le client ${client?.nom} ${client?.prenom}`}modal /*footer={deleteDocumentsDialogFooter}*/  onHide={hideDeleteViewClientDialog}>
                        <div className="confirmation-content align-left">
                            <div className="flex  text-center"><p className="text-xl"><span className="text-2xl font-medium">Code client:</span> {client?.code}</p></div>
                            <div className="flex  text-center"><p className="text-xl"><span className="text-2xl text-left font-medium">Nom:</span> {client?.nom}</p></div>
                            <div className="flex  text-center"><p className="text-xl"><span className="text-2xl text-left font-medium">{client?.nature=="Physique"?"Prenom: ":"Cygle: "}</span> {client?.nom}</p></div>
                            <div className="flex  text-center"><p className="text-xl"><span className="text-2xl text-left font-medium">Telephone : </span> {client?.telephone}</p></div>
                            <div className="flex  text-center"><p className="text-xl"><span className="text-2xl text-left font-medium">Profession : </span> {client?.profession}</p></div>
                            <div className="flex  text-center"><p className="text-xl"><span className="text-2xl text-left font-medium">Adresse : </span> {client?.adresse}</p></div>
                            <div className="flex  text-center"><p className="text-xl"><span className="text-2xl text-left font-medium">Nature: </span> {client?.nature}</p></div>
                        </div>
                        <Divider />
                        <p className="text-2xl font-semibold ">Comptes </p>
                        <DataTable ref={dt} value={client?.comptes} responsiveLayout="scroll" dataKey="id" header={header}>

                        <Column field="id" header="Id" sortable></Column>
                     <Column field="matricule" header="Matricule" sortable></Column>
                    <Column field="numero_compte" header="numéro du compte" sortable></Column>
                    <Column field="code_gestionnaire" header="Code de gestionnaire" sortable></Column>
                    <Column field="agence" header="agence"  sortable></Column>
                    <Column field="created_at" header="Date creation" sortable body={(rowData) => formatDate(rowData.created_at)}  />
</DataTable>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ClientTable;
