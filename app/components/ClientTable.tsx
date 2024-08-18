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
import { Client } from "@/types/types";
import { DocumentService } from "@/demo/service/Document.service";
import { MetaDonneService } from "@/demo/service/MetaDonne.service";
import { generateID } from "../(main)/utils/function";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Tooltip } from 'primereact/tooltip';
import DropDownComponent from "./DopDownComponent";
import { Dropdown } from "primereact/dropdown";
import { NatureEnum } from "@prisma/client";

interface ClientTableProps {
    clients: Client[];
    globalFilterValue: string;
    setGlobalFilterValue: (value: string) => void;
    onUpdateClient: (client: Client) => void;
    onCreateClient: (client: Client) => void;
    onDeleteClient: (id: number) => void;
}

const ClientTable = ({ clients, globalFilterValue, setGlobalFilterValue, onUpdateClient, onCreateClient, onDeleteClient }: ClientTableProps) => {
    const [clientDialog, setClientDialog] = useState(false);
    const [deleteClientDialog, setDeleteDocumentDialog] = useState(false);
    const [deleteClientsDialog, setDeleteDocumentsDialog] = useState(false);
    const [client, setClient] = useState<Client | any >(null);
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

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
    };
    useEffect(()=>{
       console.log("-----------nature: ",nature)
    }, [nature]);
    const openNew = () => {
     setClient({  nom: "", prenom:"", email:"",telephone:"",profession:"",adresse:'' });
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

const onUpdateMeta = useMutation({
    mutationFn:(data:any)=> MetaDonneService.updateMetaDonnee(data.cle,data.data),
    onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:['client']})

    }
})
    const saveDocument = () => {
        try {
            setSubmitted(true);
            console.log("------------client",client)
            if(client && client?.id){
                console.log("-----------ClientModifier: ",client)
                onUpdateClient(client)
            }else{
                delete client.id

                onCreateClient(client)
            }
        setClientDialog(false);
        setClient(null);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la métadonnée:", error);
                         toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la mise à jour des métadonnées', life: 3000 });

        }
    };

    const editDocument = (client: Client) => {
        setClient({ ...client });
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
        selectedClient?.forEach((doc:{id:number}) => onDeleteClient(doc.id))
        setDeleteDocumentsDialog(false);
        setSelectedClient(null);
        toast.current?.show({ severity: 'success', summary: 'Documents supprimés', detail: 'Les clients sélectionnés ont été supprimés avec succès', life: 3000 });
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
                    <DataTable ref={dt} value={clients} responsiveLayout="scroll" dataKey="id" header={header}>
                         <Column field="id" header="ID" sortable />
                        <Column field="nom" header="Nom" sortable />
                        <Column field="prenom" header="Prenom" sortable  />
                        <Column field="email" header="Email" sortable  />
                        <Column field="telephone" header="Telephone" sortable  />
                        <Column field="adresse" header="Adresse" sortable  />
                        <Column field="profession" header="Profession" sortable  />
                        <Column field="nature" header="Nature" sortable  />
                        <Column field="created_at" header="Date creation" sortable body={(rowData) => formatDate(rowData.created_at)}  />
                       <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }} />
                    </DataTable>

                    <Dialog visible={clientDialog} style={{ width: '450px' }} header="Détails du client" modal className="p-fluid" footer={documentDialogFooter} onHide={hideDialog}>
                        <div className="field">

                            <div className="p-fluid grid">
                                    <div className="field col">
                                        <label htmlFor="nom_type">Nom</label>
                                        <InputText id="nom" value={client?.nom || ''} onChange={(e) => setClient({ ...client, nom: e.target.value })} required className={classNames({ 'p-invalid': submitted && !client?.nom })} />
                                        {submitted && !client?.nom && <small className="p-invalid">Le nom est requis.</small>}
                                    </div>
                                    <div className="field col">
                                    <label htmlFor="prenom">Prenom</label>
                                        <InputText id="prenom" value={client?.prenom || ''} onChange={(e) => setClient({ ...client, prenom: e.target.value })} required className={classNames({ 'p-invalid': submitted && !client?.prenom })} />
                                        {submitted && !client?.prenom && <small className="p-invalid">Le prenom est requis.</small>}
                                    </div>
                            </div>

                            <div className="p-fluid grid">
                                    <div className="field col">
                                        <label htmlFor="email">Email</label>
                                        <InputText id="email" value={client?.email || ''} onChange={(e) => setClient({ ...client, email: e.target.value })} required className={classNames({ 'p-invalid': submitted && !client?.email })} />
                                        {submitted && !client?.email && <small className="p-invalid">Le email est requis.</small>}
                                    </div>
                                    <div className="field col">
                                    <label htmlFor="prenom">Telephone</label>
                                        <InputText id="telephone" value={client?.telephone || ''} onChange={(e) => setClient({ ...client, telephone: e.target.value })} required className={classNames({ 'p-invalid': submitted && !client?.telephone })} />
                                        {submitted && !client?.telephone && <small className="p-invalid">Le telephone est requis.</small>}
                                    </div>
                            </div>
                            <div className="p-fluid grid">
                                    <div className="field col-6">
                                        <label htmlFor="profession">Profession</label>
                                        <InputText id="profession" value={client?.profession || ''} onChange={(e) => setClient({ ...client, profession: e.target.value })} required className={classNames({ 'p-invalid': submitted && !client?.profession })} />
                                        {submitted && !client?.profession && <small className="p-invalid">Le profession est requis.</small>}
                                    </div>
                                    <div className="field col-6">
                                        <label htmlFor="nature">Nature</label>
                                        <Dropdown name="nature" value={{name: client?.nature}} options={natures} onChange={(e) => {  setClient({ ...client,nature:e.target.value.name}) }} optionLabel="name" placeholder="Sélectionnez une nature" />
                                        {/* {submitted && !nature.nature && <small className="p-invalid">La nature est requis.</small>} */}
                                    </div>
                            </div>
                               <div className="p-fluid grid">
                                    <div className="field  w-full">
                                        <label htmlFor="adresse">Address</label>
                                        <InputText id="adresse" type="text" value={client?.adresse || ''} onChange={(e) => setClient({ ...client, adresse: e.target.value })} required className={classNames({ 'p-invalid': submitted && !client?.adresse })} />
                                        {/* {submitted && !client?.adresse && <small className="p-invalid">Le adresse est requis.</small>} */}
                                    </div>
                                    {/* <div className="field col-6">
                                        <label htmlFor="nature">Nature</label>
                                        <Dropdown name="nature" value={{name: client?.nature}} options={natures} onChange={(e) => {  setClient({ ...client,nature:e.target.value.name}) }} optionLabel="name" placeholder="Sélectionnez une nature" />
                                    </div> */}
                            </div>

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
                </div>
            </div>
        </div>
    );
};

export default ClientTable;
