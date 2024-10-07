import React, { useState, useRef, useEffect } from "react";
import { DataTable, DataTableExpandedRows, DataTableRowEvent, DataTableValueArray } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from "primereact/dialog";
import { FileUpload, FileUploadUploadEvent } from "primereact/fileupload";
import { InputText } from 'primereact/inputtext';
import { classNames } from "primereact/utils";
import { Client,CompteClients } from "@/types/types";
import { generateID } from "../(main)/utils/function";
import { useRouter } from "next/navigation";
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from "primereact/dropdown";
import { Fieldset } from "primereact/fieldset";
import { NatureEnum } from "@prisma/client";
import { InvalidateQueryFilters, useMutation, useQueryClient,useQuery } from "@tanstack/react-query";
import { createOption, deleteOption, deleteAgence, fetchTypeCompte,fetchAgences, insertCompteExcelRows, createAgence } from '@/app/api/action';
import { Divider } from 'primereact/divider';
import { MetaDonneServices } from "@/demo/service/Metadonne.service";
import * as XLSX from 'xlsx';
import { Calendar } from "primereact/calendar";


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
    const [viewExelsDialog, setViewExelsDialog] = useState(false);
    const [client, setClient] = useState<Client|any >(null);
    const { isSuccess, data: typeComptes } = useQuery({ queryKey: ['typeCompte'], queryFn: async () => fetchTypeCompte() });
    const { isSuccess:agSuccess, data: agencess } = useQuery({ queryKey: ['agences'], queryFn: async () => fetchAgences() });


    const [type_comptes, setTypeComptes] = useState<{ id: number, name: string }[]>(typeComptes || []);
    const [agences, setAgences] = useState<{ id: number, ageCreat:number, libAgence: string }[]>(agencess || []);
    const [agence, setAgence] = useState<{ id: number, ageCreat:number, libAgence: string } | any>({ id: 0, ageCreat:0, libAgence: "" });

    const [compte, setCompte] = useState<CompteClients | any >(null);
    const [selectedClient, setSelectedClient] = useState<Client[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fields, setFields] = useState([{ id: 0, cle: "", valeur: "" }]);
    const queryClient = useQueryClient();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const natures:{name:string}[]= ([{name:"Physique"},{name:"Morale"}]);
    const [nature, setNature] = useState<{name:string}>({name:""});
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
    const [addingNew, setAddingNew] = useState<boolean>(false);
    const [addingNewAges, setAddingNewAge] = useState<boolean>(false);
    const [excelData, setExcelData] = useState<any>(null);

    const [ageValue, setAgeValue] = useState<{ id: number }>({ id: 0 });
    const [value, setValue] = useState<{ id: number }>({ id: 0 });

    const [newTypeCompte, setNewTypeCompte] = useState<string>("")
    const [newAgeCreat, setNewAgeCreat] = useState<number>(0)
    const [newLibAgence, setNewLibAgence] = useState<string>("")
    const [filteredDocuments, setFilteredDocuments] = useState<any[]>(clients)


    useEffect(() => {
        console.log("Data is changed :)");
        setFilteredDocuments(clients)
    }, [clients]);

    useEffect(() => {
        if (isSuccess) {
            setTypeComptes(typeComptes)
        }
    }, [isSuccess])

    useEffect(() => {
        if (agSuccess) {
            setAgences(agencess)
        }
    }, [agSuccess])




    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
    };


    const openNew = () => {
     setClient({  ini: "",code:generateID(8), prenom:"", email:"",telephone:"",profession:"",adresse:'' });
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

    const hideClosViewExelDialog = () => {
        setViewExelsDialog(false);
    };

const onUpdateMeta = useMutation({
    mutationFn:(data:any)=> MetaDonneServices.updateMetaDonnee(data.cle,data.data),
    onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:['client']})

    }
})
const saveDocument = () => {
    try {
        setSubmitted(true);
        console.log("------------client",{client:{...client}, compte:{...compte}})
        if(client && client?.id){
            console.log("-----------ClientModifier1: ",{client:{...client}, compte:{...compte}})
            onUpdateClient({client:{...client}, compte:{...compte}})
        }else{

            onCreateClient({client:{...client}, compte:{...compte,...{agence}}})
        }
    setClientDialog(false);
    setClient(null);
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la métadonnée:", error);
        toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la mise à jour des métadonnées', life: 3000 });

    }
};

const addNewTypeCompte = async () => {
    try{

        if (newTypeCompte.trim() !== "") {
            createMutation.mutate({ name: newTypeCompte })
            //    console.log("-----------pppppp: ",creation);

            setTypeComptes([...type_comptes, { id: ageValue.id, name: newTypeCompte }]);
            setCompte({ ...compte, type_compte: newTypeCompte }); // Sélectionner automatiquement le nouveau type de compte
            setNewTypeCompte(""); // Réinitialiser le champ de saisie
            setAddingNew(false); // Fermer la saisie après ajout

        }
    } catch(e){
        console.error(e);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: `Il a eu un probleme lors de la supression du type de document: ${compte.name}`, life: 3000 });


    }
};

const addNewAgences = async () => {
    try{

        if (newLibAgence.trim() !== "" && newAgeCreat !== 0) {
            createAgencyMutation.mutate({ ageCreat: Number(newAgeCreat), libAgence: newLibAgence})

            setAgences([...agences, { id: ageValue.id, ageCreat: newAgeCreat,libAgence: newLibAgence }])
            setNewAgeCreat(0)
            setNewLibAgence("")
            setAddingNewAge(false); // Fermer la saisie après ajout
            toast.current?.show({ severity: 'success', summary: 'Success', detail: "Le type de compte a ete bien suprimer avec success", life: 3000 });

        }
    }catch(e){
        console.error(e);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: `Il a eu un probleme lors de l'ajout de l'agence: ${newLibAgence}`, life: 3000 });


    }
};

const removeTypeCompte = (option: { id: number, name: string }) => {
    try{

        const newOptions = [...type_comptes].filter((opt) => opt.id != option.id)
        deleteMutation.mutate(option.id)
        console.log(option)
        console.log(newOptions)
        setTypeComptes(newOptions)
        toast.current?.show({ severity: 'success', summary: 'Success', detail: "Le type de compte a ete bien suprimer avec success", life: 3000 });
    } catch(e){
        console.error(e);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: `Il a eu un probleme lors de la supression du type de document: ${option.name}`, life: 3000 });


    }


}

const removeAgence = (option: { id: number, ageCreat: string }) => {
   try{ const newOptions = [...agences].filter((opt) => opt.id != option.id)
    deleteAgenceMutation.mutate(option.id)
    setAgence(newOptions)
    toast.current?.show({ severity: 'success', summary: 'Success', detail: "L'agence a ete bien suprimer avec success", life: 3000 });
} catch(e){
    console.error(e);
    toast.current?.show({ severity: 'error', summary: 'Error', detail: `Il a eu un probleme lors de la supression du type de l'agence: ${option.ageCreat}`, life: 3000 });


}
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

const createAgencyMutation = useMutation({
    mutationFn: (age: Omit<{ ageCreat: number, libAgence: string}, "id">) => createAgence(age),

    onSuccess: async (age) => {
        await queryCompte.invalidateQueries(["agences"] as InvalidateQueryFilters);
        if (age && age.id !== undefined) {
            setAgeValue({ id: age.id });
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

const deleteAgenceMutation = useMutation({
    mutationFn: (id: number) => deleteAgence(id),
    onSuccess: () => {
        queryCompte.invalidateQueries({ queryKey: ["agences"] });
    },
    onError: (error) => {
        console.log("onDeleteError", error);
        toast.current?.show({ severity: 'error', summary: 'Deletion Failed', detail: 'La suppression du compte a échoué', life: 3000 });
    }
});

const editDocument = (client: Client) => {
    setClient({ ...client });
    setCompte(client?.comptes ? client.comptes[0]: null); // Set the first compte or null if none exist
    // setTypeComptes(client.)
    console.log("ppppppppppppppppppppppp",clients);

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

const handleFileUpload = (event: FileUploadUploadEvent) => {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        // Récupérer toutes les lignes pour chercher les en-têtes
        const allRows: any = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        // Trouver la ligne où les en-têtes se trouvent
        const headerRowIndex = allRows.findIndex((row: any) =>
            row.includes('AGE CREAT') &&
            row.includes('LIB Agence') &&
            row.includes('Nat cpt') &&
            row.includes('AGE CPT') &&
            row.includes('Num compte') &&
            row.includes("CLE") &&
            row.includes("Chapitre") &&
            row.includes('Intitule compte') &&
            row.includes('Date ouverture')
        );

        if (headerRowIndex !== -1) {
            // Utiliser cette ligne comme en-tête
            const sheetData = XLSX.utils.sheet_to_json(firstSheet, {
                header: allRows[headerRowIndex], // Utiliser la ligne trouvée comme en-tête
                range: headerRowIndex + 1, // Ignorer la ligne des en-têtes dans les données
            });

            // Ajouter un ID unique à chaque ligne et convertir la date
            const sheetDataWithIds = sheetData.map((row: any, index: number) => {
                let dateCreation = null;

                // Vérifier et convertir la "DATE DE CREATION" si elle existe et est au format Excel (numéro)
                if (row['Date ouverture']) {
                    const excelDate = row['Date ouverture'];

                    // Si la date est sous forme de nombre (comme 43598), utiliser la conversion
                    if (!isNaN(excelDate)) {
                        const parsedDate = XLSX.SSF.parse_date_code(excelDate);
                        if (parsedDate) {
                            dateCreation = new Date(parsedDate.y, parsedDate.m - 1, parsedDate.d);
                        }
                    }
                }

                return {
                    id: index + 1,  // Génère un ID unique pour chaque ligne
                    ...row,
                    'Date ouverture': dateCreation  // Remplace par la date convertie
                };
            });

            setExcelData(sheetDataWithIds); // Stocker les données avec des IDs uniques et la date convertie
        } else {
            console.error('Ligne d\'en-tête non trouvée');
        }
    };

    reader.readAsArrayBuffer(file);
    setViewExelsDialog(true);
};



    const handleValidation = async () => {
        console.log('Validation des données Excel',excelData);
        setSubmitted(true)

    insertMutation.mutate()

    };


    const extractionFunc = async()=>{
        const BATCH_SIZE = 1000; // Exemple de taille de lot
        const batchedData = [];

        for (let i = 0; i < excelData.length; i += BATCH_SIZE) {
            batchedData.push(excelData.slice(i, i + BATCH_SIZE));
        }
        try {
            for (const batch of batchedData) {
                await insertCompteExcelRows(batch);
            }

        } catch (error:any) {
            console.error('Erreur lors de l\'insertion des données:', error.message);
        }

    }
    const insertMutation = useMutation({
        mutationFn: () => extractionFunc(),
        onSuccess: (clt) => {
            console.log('Données insérées avec succès');
            setSubmitted(false)
            queryClient.invalidateQueries({queryKey:["typeCompte"]})
            queryClient.invalidateQueries({queryKey:["client"]})
            setViewExelsDialog(false)

            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Les donner sont enregistre avec success', life: 3000 });

        },
        onError: (error) => {
            toast.current?.show({ severity: 'error', summary: 'Creation Failed', detail: 'La création du client a échoué', life: 3000 });
            console.log("onError", error);
        }
    });

        const rightToolbarTemplate = () => {
            return (
                <>
                    <FileUpload name="excelFiles[]"  mode="basic" accept=".xlsx, .xls" chooseLabel="Importer" className="mr-2 inline-block" onSelect={(e:any)=>handleFileUpload(e)} />
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

        const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
            const filterValue = e.target.value.toLowerCase(); // Convertir en minuscules pour une recherche insensible à la casse
            console.log('Search Value:', clients);

            const filtered = clients.filter((client:any) =>
                client.code.toLowerCase().includes(filterValue) ||
                client.nom.toLowerCase().includes(filterValue) ||
                client.prenom.toLowerCase().includes(filterValue) ||
                client.telephone.toLowerCase().includes(filterValue) ||
                client.adresse.toLowerCase().includes(filterValue) ||
                client.profession.toLowerCase().includes(filterValue) ||
                client.nature.toLowerCase().includes(filterValue)||
                client.created_at.toLowerCase().includes(filterValue)
            );

            setFilteredDocuments(filtered);
        //    'nom', 'prenom','telephone','addresse','profession','nature', 'created_at'

        };

        const header = (
            <div className="flex justify-content-between">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    {/* <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Recherche par mots-clés" /> */}
                    <InputText type="search" onInput={handleSearch}  placeholder="Recherche par mots-clés" />

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

    const optionAgenceTemplate = (option: any) => {
        console.log("OPto5t", option);

        if (option.libAgence === "addNew") {
            return (
                <div className="flex align-items-center ">
                    <Button
                        label="Ajouter une nouveau Agence"
                        icon="pi pi-plus"
                        className="w-full"
                        outlined
                        onClick={() => setAddingNewAge(true)}
                    />
                </div>
            );
        } else {
            return (
                <div className="   flex align-items-center justify-between">
                    <div className="!bg-black w-full flex">
                    <span>{option.ageCreat} </span>
                    <span className="w-2">
                    {/* <Divider layout="vertical"  className="hidden md:flex h-1" /> */}
                    </span>
                    <span> {option.libAgence}</span>

                    </div>

                    <div>
                        <Button icon="pi pi-times" className=" w-14 border-0 text-red-500" outlined onClick={(e) => removeAgence(option)} />
                    </div>
                </div>
            );
        }
    };


    const formatDate = (date:Date) => {

        // console.log("kdjlgnuvihgiuvehgbuivrehugke",date)
        return `Le ${new Intl.DateTimeFormat('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
        })?.format(new Date(date))}`
    };

    const countMedonne=(metaDatas:any) =>{
        console.log(metaDatas.metadonnees.length);

    }

    const collapseAll = () => {
        setExpandedRows(undefined);
    };

    const [filter, setFilter] = useState("");

    useEffect(() => {

        agences.filter((agence) => {
            const filterLower = filter?.toLowerCase();
            const matchesLibAgence = agence.libAgence.toLowerCase().includes(filterLower);
            const matchesAgeCreat = String(agence.ageCreat).includes(filterLower);
            return matchesLibAgence || matchesAgeCreat;
        });

    }, [filter]);
    // Filter the agences based on libAgence or ageCreat


    const rowExpansionTemplate = (data: any) => {
        return (
            <div className="p-3">
                <h5>Les comptes du clients {data.nom}</h5>
                <DataTable
                    value={data.comptes}
                >
                    <Column field="id" header="Id" sortable></Column>
                     <Column field="natCompte" header="Nat Compte" sortable></Column>
                     <Column field="cle" header="Cle" sortable></Column>
                     <Column field="chapitre" header="Chapitre" sortable></Column>
                     <Column field="libelleNatCompte" header="Libelle Nat Compte" sortable></Column>
                    <Column field="numero_compte" header="numéro du compte" sortable></Column>
                    <Column  header="AGE CREAT"  body={(rowData) => (rowData.agences && rowData.agences.length > 0 ? rowData.agences[0].ageCreat : 'N/A')}  sortable  ></Column>
                    <Column  header="LIB Agence"  body={(rowData) => (rowData.agences && rowData.agences.length > 0 ? rowData.agences[0].libAgence : 'N/A')}  sortable  ></Column>
                    <Column field="created_at" header="Date creation" sortable body={(rowData) => formatDate(rowData.created_at)}  />
                </DataTable>
            </div>
        );
    };
    const onRowExpand = (event: DataTableRowEvent) => {
        toast.current?.show({ severity: 'info', summary: 'Product Expanded', detail: event.data.nom, life: 3000 });
    };

    const onRowCollapse = (event: DataTableRowEvent) => {
        toast.current?.show({ severity: 'success', summary: 'Product Collapsedd', detail: event.data.nom, life: 3000 });
    };

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

                     <DataTable
                        ref={dt}
                        value={filteredDocuments}
                        expandedRows={expandedRows}
                        onRowToggle={(e) => setExpandedRows(e.data)}
                        onRowExpand={onRowExpand}
                        onRowCollapse={onRowCollapse}
                        rowExpansionTemplate={rowExpansionTemplate}
                        dataKey="id"
                        header={header}
                        tableStyle={{ minWidth: '60rem' }}
                        className="datatable-responsive"
                        paginator
                        rows={10}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        rowsPerPageOptions={[5, 10, 25,50,100]}
                        // globalFilter={globalFilter}
                        globalFilterFields={['Intituler','telephone','addresse','profession','nature', 'created_at']}
                        filterDisplay="row"
                        emptyMessage="No products found."

                    >
            <Column expander={allowExpansion} style={{ width: '5rem' }} />


                     <Column field="id" header="ID" sortable />
                    <Column field="code" header="Code" sortable />
                    <Column field="intitule" header="Intituler" sortable />
                    <Column field="telephone" header="Telephone" sortable  />
                    <Column field="adresse" header="Adresse" sortable  />
                    <Column field="profession" header="Profession" sortable  />
                    <Column field="nature" header="Nature" sortable  />
                    {/* <Column field="created_at" header="Date creation" sortable body={(rowData) => formatDate(rowData.created_at)}  /> */}
                   <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }} />
                </DataTable>

                <Dialog visible={clientDialog} style={{ width: '90%' }} header="Détails du client" modal className="p-fluid" footer={documentDialogFooter} onHide={hideDialog}>
                    <div className="field flex ">
                     <Fieldset legend="Information du client">

                            <div className="p-fluid grid">
{/*
                                    <div className="field col">
                                    <InputText id="nom" value={client?.nom || ''} onChange={(e) => setClient({ ...client, nom: e.target.value })} required className={classNames({ 'p-invalid': submitted && !client?.nom })} />
                                    {submitted && !client?.nom && <small className="p-invalid">Le nom est requis.</small>}
                                    </div> */}
                                    <div className="field col">
                                        {/* <label htmlFor="prenom">{
                                    client?.nature=="Physique"?"Prenom":"Cygle"
                                    }</label> */}
                                    <label htmlFor="nom_type">Intituler</label>
                                        <InputText id="intitule" value={client?.intitule || ''} onChange={(e) => setClient({ ...client, intitule: e.target.value })} required className={classNames({ 'p-invalid': submitted && !client?.intitule })} />
                                        {submitted && !client?.prenom && <small className="p-invalid">Le prenom est requis.</small>}
                                    </div>

                            </div>
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
                                <label htmlFor="type_compte">Agence</label>
                                <Dropdown
                                    name="agence"
                                    filter
                                    value={agences.find(tc => tc.libAgence?.trim() === agence?.libAgence?.trim()) || { libAgence: agence?.libAgence || "" }}
                                    options={[...agences, { libAgence: "addNew" }]}
                                    onChange={(e) => {
                                        const selectedAgence = e.value || {};
                                        setAgence({
                                            ...agence,
                                            libAgence: selectedAgence.libAgence || agence?.libAgence,
                                            ageCreat: selectedAgence.ageCreat || agence?.ageCreat,
                                            compte_id: selectedAgence.compte_id || agence?.compte_id
                                        });
                                    }}
                                    optionLabel="libAgence"
                                    placeholder="Sélectionnez une nature"
                                    itemTemplate={optionAgenceTemplate}
                                    className="w-full"
                                    onFilter={(e:any) => setFilter(e?.target?.value)}  // Met à jour le filtre basé sur l'entrée

                                />

                                {/* {submitted && !compte?.type_compte && <small className="p-invalid">Le type de compte est requis.</small>} */}
                                {addingNewAges && (
                                    <div className="flex mt-3">
                                        <div>
                                        <InputText
                                            value={String(newAgeCreat)}
                                            onChange={(e:any) => setNewAgeCreat(e.target.value)}
                                            className="mr-2 w-[5%]"
                                            type="number"
                                        min={0}
                                        />
                                        </div>
                                        <InputText
                                            value={newLibAgence}
                                            onChange={(e) => setNewLibAgence(e.target.value)}
                                            placeholder="Ajouter un nouveau type"
                                            className="ml-5 mr-2"
                                        />
                                        <Button icon="pi pi-plus" className=" w-3" onClick={addNewAgences } />
                                    </div>
                                )}

                            </div>

                            <div className="field col">
                                <label htmlFor="type_compte">Type de compte</label>
                                <Dropdown
                                filter
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

                        <div className="p-fluid grid">
                            <div className="field col">
                                <label htmlFor="natCompte">Nat cpt</label>
                                <InputText type="number" id="natCompte" value={compte?.natCompte || ''} onChange={(e) => setCompte({ ...compte, natCompte: e.target.value })} required  className={classNames({ 'p-invalid': submitted && !compte?.natCompte })} />
                                {submitted && !compte?.natCompte && <small className="p-invalid">Le matricule est requis.</small>}
                            </div>
                             <div className="field col">
                                <label htmlFor="libelleNatCompte">Libelle nat cpte</label>
                                <InputText id="libelleNatCompte"value={compte?.libelleNatCompte || ''} onChange={(e) => setCompte({ ...compte, libelleNatCompte: e.target.value })} required className={classNames({ 'p-invalid': submitted && !compte?.libelleNatCompte })} />
                                {submitted && !compte?.libelleNatCompte && <small className="p-invalid">Le agence est requis.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="num_compte">Numero de compte</label>
                                <InputText id="num_compte" type="number" value={compte?.numero_compte || ''} onChange={(e) => setCompte({ ...compte, numero_compte: e.target.value })} required className={classNames({ 'p-invalid': submitted && !compte?.numero_compte })} />
                                {submitted && !compte?.numero_compte && <small className="p-invalid">Le agence est requis.</small>}
                            </div>

                        </div>

                        <div className="p-fluid grid">
                            <div className="field col">
                                <label htmlFor="cle">CLE</label>
                                <InputText type="number" id="cle" min={0} value={compte?.cle || ''} onChange={(e) => setCompte({ ...compte, cle: e.target.value })} required  className={classNames({ 'p-invalid': submitted && !compte?.cle })} />
                                {submitted && !compte?.cle && <small className="p-invalid">Le matricule est requis.</small>}
                            </div>
                             <div className="field col">
                                <label htmlFor="chapitre">Chapitre</label>
                                <InputText type='number' id="chapitre"value={compte?.chapitre || ''} onChange={(e) => setCompte({ ...compte, chapitre: e.target.value })} required className={classNames({ 'p-invalid': submitted && !compte?.chapitre })} />
                                {submitted && !compte?.chapitre && <small className="p-invalid">Le agence est requis.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="created_at">Date ouverture</label>
                                <Calendar value={new Date(compte?.created_at) || ''}  onChange={(e) => setCompte({ ...compte, created_at: e.target.value })} showIcon    className={classNames({ 'p-invalid': submitted && !compte?.created_at })} />
                                {/* <InputText id="created_at" type="number" value={compte?.created_at || ''} onChange={(e) => setCompte({ ...compte, created_at: e.target.value })} required className={classNames({ 'p-invalid': submitted && !compte?.created_at })} /> */}
                                {submitted && !compte?.created_at && <small className="p-invalid">Le agence est requis.</small>}
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

                <Dialog visible={viewClientsDialog} style={{ width: '70%' }} header={`Les information sur le client ${client?.intitule}`} modal /*footer={deleteDocumentsDialogFooter}*/  onHide={hideDeleteViewClientDialog}>
                    {/* <div className="confirmation-content align-left">
                        <div className="flex  text-center"><p className="text-xl"><span className="text-2xl font-medium">Code client:</span> {client?.code}</p></div>
                        <div className="flex  text-center"><p className="text-xl"><span className="text-2xl text-left font-medium">Nom:</span> {client?.nom}</p></div>
                        <div className="flex  text-center"><p className="text-xl"><span className="text-2xl text-left font-medium">{client?.nature=="Physique"?"Prenom: ":"Cygle: "}</span> {client?.nom}</p></div>
                        <div className="flex  text-center"><p className="text-xl"><span className="text-2xl text-left font-medium">Telephone : </span> {client?.telephone}</p></div>
                        <div className="flex  text-center"><p className="text-xl"><span className="text-2xl text-left font-medium">Profession : </span> {client?.profession}</p></div>
                        <div className="flex  text-center"><p className="text-xl"><span className="text-2xl text-left font-medium">Adresse : </span> {client?.adresse}</p></div>
                        <div className="flex  text-center"><p className="text-xl"><span className="text-2xl text-left font-medium">Nature: </span> {client?.nature}</p></div>
                    </div>
                    <Divider />*/}
                    {/* <p className="text-2xl font-semibold ">Comptes </p>  */}
                    <DataTable ref={dt} value={client?.comptes} responsiveLayout="scroll" dataKey="id" header={header}>

                <Column field="id" header="Id" sortable></Column>
                <Column  header="AGE CREAT"  body={(rowData) => (rowData.agences && rowData.agences.length > 0 ? rowData.agences[0].ageCreat : 'N/A')}  sortable  ></Column>
                <Column  header="LIB Agence"  body={(rowData) => (rowData.agences && rowData.agences.length > 0 ? rowData.agences[0].libAgence : 'N/A')}  sortable  ></Column>
                 <Column field="natCompte" header="Nat cpt" sortable></Column>
                 <Column field="libelleNatCompte" header="Libelle Nat Compte" sortable></Column>
                <Column field="numero_compte" header="Num compte" sortable></Column>
                 <Column field="cle" header="Cle" sortable></Column>
                <Column field="chapitre" header="Chapitre" sortable></Column>
                 <Column  header="Intitule compte"  body={() => client.intitule}  sortable  ></Column>
                <Column field="created_at" header="Date ouverture" sortable body={(rowData) => formatDate(rowData.created_at)}  />

</DataTable>
                </Dialog>


                <Dialog
        visible={viewExelsDialog}
        style={{ width: '90%' }}
        header="Les informations sur le client"
        modal
        footer={
            <div>
                <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hideClosViewExelDialog} />
                <Button label="Valider" icon="pi pi-check" disabled={submitted} className="p-button-text" onClick={handleValidation} />
            </div>
        }
        onHide={hideClosViewExelDialog}
    >
        <DataTable
            ref={dt}
            value={excelData}
            dataKey="id"
            tableStyle={{ minWidth: '60rem' }}
            className="datatable-responsive"
            paginator
            rows={10}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} clients"
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            filterDisplay="row"
            emptyMessage="No clients found."
        >
            <Column field="id" header="ID" sortable />
            <Column field="AGE CREAT" header="AGE CREAT" sortable />
            <Column field="LIB Agence" header="LIB Agence" sortable />
            <Column field="Nat cpt" header="Nat cpt" sortable />
            <Column field="Libelle nat cpte" header="Libelle nat cpte" sortable />
            <Column field="AGE CPT" header="AGE CPT" sortable />
            <Column field="Num compte" header="Num compte" sortable />
            <Column field="CLE" header="CLE" sortable />
            <Column field="Chapitre" header="Chapitre" sortable />
            <Column field="Intitule compte" header="Intitule compte" sortable />
            <Column field="Date ouverture" header="Date ouverture" sortable
                body={(rowData) => formatDate(rowData['Date ouverture'])}  // Formater la date ici
            />

        </DataTable>
    </Dialog>
            </div>
        </div>
    </div>
    );
};

export default ClientTable;
