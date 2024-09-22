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
import { generateID } from "../(main)/utils/function";
import { useRouter } from "next/navigation";
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from "primereact/dropdown";
import { Fieldset } from "primereact/fieldset";
import { NatureEnum } from "@prisma/client";
import { InvalidateQueryFilters, useMutation, useQueryClient,useQuery } from "@tanstack/react-query";
import { attachPieceToDossier,deletePiece,deletedPiece, createOption, deleteOption, fetchClientCode, fetchOption } from '@/app/api/action';
import { Divider } from 'primereact/divider';
import { MetaDonneServices } from "@/demo/service/Metadonne.service";
import { Image } from 'primereact/image';
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import {fetchDossier } from '../api/action';
import { ListBox } from 'primereact/listbox';


interface PieceTableProps {
    clients: Client[];
    globalFilterValue: string;
    setGlobalFilterValue: (value: string) => void;
    onUpdateClient: (client: any) => void;
    onCreateClient: (client: any) => void;
    onDeleteClient: (id: number) => void;
}

const PieceTable = ({ clients, globalFilterValue, setGlobalFilterValue, onUpdateClient, onCreateClient, onDeleteClient }: PieceTableProps) => {
    const queryClient = useQueryClient();

    const [clientDialog, setClientDialog] = useState(false);
    const [deleteClientDialog, setDeleteDocumentDialog] = useState(false);
    const [deletePieceDialog, setDeletePieceDialog] = useState(false);
    const [deleteClientsDialog, setDeleteDocumentsDialog] = useState(false);
    const [viewClientsDialog, setViewClientsDialog] = useState(false);
    const [viewLinkDialog, setViewLinkDialog] = useState(false)
    const [viewPieceDialog, setViewPieceDialog] = useState(false)
    const [client, setClient] = useState<Client | any >(null);
    const { isSuccess, data: typeComptes } = useQuery({ queryKey: ['typeCompte'], queryFn: async () => fetchOption() });
    const [type_comptes, setTypeComptes] = useState<{ id: number, name: string }[]>(typeComptes || []);
    const { isSuccess: isSuccessPiece, data: typeDossier } = useQuery({ queryKey: ['TypeDossier'], queryFn: async () => fetchDossier() });

    const [typeDossiers, setTypeDossiers] = useState<{ id: number; code: string; nom: string }[]>(typeDossier || []);


const [selectedDossier,setSelectedDossier] = useState<any>()
    const [compte, setCompte] = useState<CompteClients | any >(null);
    const [selectedClient, setSelectedClient] = useState<Client[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fields, setFields] = useState([{ id: 0, cle: "", valeur: "" }]);
   
    const router = useRouter()
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const natures:{name:string}[]= ([{name:"Physique"},{name:"Morale"}]);
    const [nature, setNature] = useState<{name:string}>({name:""});
    const [value, setValue] = useState<{ id: number }>({ id: 0 });
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
    const [newTypeCompte, setNewTypeCompte] = useState<string>("");
    const [addingNew, setAddingNew] = useState<boolean>(false);
    const [pieceSelected,setPieceSelected] = useState<any>({})

    const [products, setProducts] = useState<any[]>([]);
    const [layout, setLayout] = useState<'list' | 'grid' | (string & Record<string, unknown>)>('grid');

    useEffect(() => {
        setProducts(clients.slice(0, 12))
    }, []);

    useEffect(() => {
        console.log('---------------------', typeDossier);

        if (isSuccessPiece) {
            setTypeDossiers(typeDossier);
        }
    }, [isSuccessPiece]);


    
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

   const hideViewLinkDialog = () =>{ setViewLinkDialog(false)}

    const hideDeleteDocumentDialog = () => {
        setDeleteDocumentDialog(false);
    };


   const hideViewPieceDialog = () =>{ setViewPieceDialog(false)}

    const hideDeleteDocumentsDialog = () => {
        setDeleteDocumentsDialog(false);
    };

    const hideDeleteViewClientDialog = () => {
        setViewClientsDialog(false);
    };


    const hideDeletePieceDialog = ()=>{
        setDeletePieceDialog(false)
    }

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
            await queryClient.invalidateQueries(["typeCompte"] as InvalidateQueryFilters);
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
            queryClient.invalidateQueries({ queryKey: ["typeCompte"] });
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

   
    const [filteredDocuments, setFilteredDocuments] = useState(clients);

    useEffect(() => {
        console.log("Data is changed :)");
        setFilteredDocuments(clients)
    }, [clients]);

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

    const header = ()=>(
        <div className="flex justify-content-between">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                {/* <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Recherche par mots-clés" /> */}
                <InputText type="search" onInput={handleSearch}  placeholder="Recherche par mots-clés" />

            </span>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                {/* <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Recherche par mots-clés" /> */}
                {/* <InputText type="search" onInput={handleSearch}  placeholder="Recherche par mots-clés" /> */}
            <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />

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
   

    const confirmDeletePiece = (piece: any) => {
        setPieceSelected(piece);
        setDeletePieceDialog(true);
    };

 
    const onAttachPiece = useMutation({
        mutationFn: (data:Omit<{pieceId:number,dossierId:number}, "id">) => attachPieceToDossier(data.pieceId, data.dossierId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['piece'] });
            queryClient.invalidateQueries({ queryKey: ['TypeDossier'] });
        }
    });

    const onDeletePiece = useMutation({
        mutationFn: (data:Omit<{pieceId:number}, "id">) => deletedPiece(data.pieceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['piece'] });
            queryClient.invalidateQueries({ queryKey: ['TypeDossier'] });
        },
        onError:()=>{
            toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors du rattachement de la piece', life: 3000 });

        }
    });

    const handleAttache = async ()=>{
        if(!! selectedDossier){
            try{

                console.log(selectedDossier,pieceSelected)
                const newData = onAttachPiece.mutate({dossierId:selectedDossier?.id, pieceId:pieceSelected?.id})
                console.log("--------Piece is rattached", newData)
                hideViewLinkDialog()
                setPieceSelected({})
                setDeletePieceDialog(false);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'La pece rattacher avec success', life: 3000 });
            }catch(e:any){
                console.error(e)
                toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors du rattachement de la piece', life: 3000 });

            }

        }
    }

    

    const handleDetedPiece= ()=>{
            try{
                if(!!pieceSelected){

                    console.log(pieceSelected)
                    const newData = onDeletePiece.mutate({pieceId:pieceSelected?.id})
                    hideViewLinkDialog()
                    setPieceSelected({})
                    setDeletePieceDialog(false);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'La pece rattacher avec success', life: 3000 });
                }
            }catch(e:any){
                console.error(e)
                toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors du rattachement de la piece', life: 3000 });

            }
    }


       
    const deletePieceDialogFooter = (
        <>
            <Button label="Non" icon="pi pi-times" text onClick={hideDeleteDocumentDialog} />
            <Button label="Oui" icon="pi pi-check" text onClick={handleDetedPiece} />
        </>
    );
const listItem = (product: any, index: number) => {
    return (
        <div className="col-12" key={product.id}>
            <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                <Image className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`${product.path}`} alt={product.name} />
                <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                    <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                        <div className="text-2xl font-bold text-900">{product.name}</div>
                        {/* <Rating value={product.rating} readOnly cancel={false}></Rating> */}
                        <div className="flex align-items-center gap-3">
                            <span className="flex align-items-center gap-2">
                                <i className="pi pi-tag"></i>
                                <span className="font-semibold">{product.category}</span>
                            </span>
                            {/* <Tag value={product.inventoryStatus} severity={getSeverity(product)}></Tag> */}
                        </div>
                    </div>
                    <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                        <span className="text-2xl font-semibold">${product.price}</span>
                        <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={product.inventoryStatus === 'OUTOFSTOCK'}></Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const gridItem = (product: any) => {
    return (
        <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={product.id}>
            <div className="p-4 border-1 surface-border surface-card border-round">
                <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                    <div className="flex align-items-center gap-2">
                        {/* <i className="pi pi-tag"></i> */}
                        <Button icon="pi pi-trash" severity="danger" rounded text onClick={()=>confirmDeletePiece(product)}></Button>

                        {/* <span className="font-semibold">{product.code}</span> */}
                    </div>
                    {/* <Tag value={product.inventoryStatus} severity={getSeverity(product)}></Tag> */}
                </div>
                <div className="flex flex-column align-items-center gap-3 py-5">
                    <Image className="w-9 shadow-2 border-round" src={`${product.path}`} alt={product.nom} />
                    <div className="text-2xl font-bold">{product.nom}</div>
                    {/* <Rating value={product.rating} readOnly cancel={false}></Rating> */}
                </div>
                <div className="flex align-items-center justify-content-between">
                    {/* <span className="text-2xl font-semibold">{product.code}</span> */}
                    <Button icon="pi pi-link"  className="p-button-rounded" severity={product.dossierId?"secondary":"danger"}  onClick={()=>{ setViewLinkDialog(true); setPieceSelected(product); console.log(viewLinkDialog); }}></Button>

                    <Button icon="pi pi-eye" className="p-button-rounded" onClick={()=>{ setViewPieceDialog(true); setPieceSelected(product); console.log(viewLinkDialog); }}></Button>
                </div>
            </div>
        </div>
    );
};

const itemTemplate = (product: any, layout: string, index?: number) => {
    if (!product) {
        return;
    }

    if (layout === 'list' && index) return listItem(product, index);
    else if (layout === 'grid') return gridItem(product);
};


return (
    <div className="card">
        <Toast ref={toast} />

        <DataView value={products} itemTemplate={itemTemplate} layout={layout} header={header()} />

        <Dialog visible={viewLinkDialog} style={{ width: '50%' }} header={`Ratache le fichier a dossier`} modal /*footer={deleteDocumentsDialogFooter}*/  onHide={hideViewLinkDialog}>
        <div className="confirmation-content">
        <div className="!w-[300px]">
            {/* <label className="font-semibold text-xl">Liste des dossiers</label> */}
                                                <ListBox
                                                    filter
                                                    value={selectedDossier}
                                                    onChange={(e) => {
                                                        console.log(e.value);
                                                        setSelectedDossier(e.value);
                                                    }}
                                                    options={typeDossiers}
                                                    optionLabel="nom"
                                                    // itemTemplate={countryTemplate}
                                                    className="w-full  mt-5"
                                                    listStyle={{ maxHeight: '150px' }}
                                                />
                                            </div>
                                            <div className="w-full mt-5 flex justify-items-end	">
             
                                            <Button icon="pi pi-check float-rigth" label="Attachez" onClick={handleAttache}/>
                                            </div>

                                              </div>
        </Dialog>

        <Dialog visible={viewPieceDialog} style={{ width: '80%' , height:"auto"}} header={`Piece : ${pieceSelected?.nom} `} modal /*footer={deleteDocumentsDialogFooter}*/  onHide={hideViewPieceDialog}>
        <div className=" flex justify-content-center justify-item-center items-center ">

        <div className="flex justify-self-center	 ">
        <Image src={`${pieceSelected?.path}`} alt="Image" width="100%" height="100%" className="object-cover"  />

                                              </div>
        </div>
        </Dialog>


        <Dialog visible={deletePieceDialog} style={{ width: '450px' }} header="Confirmer" modal footer={deletePieceDialogFooter} onHide={hideDeletePieceDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" />
                            {pieceSelected && (
                                <span>
                                    Êtes-vous sûr de vouloir supprimer <b>{pieceSelected?.code}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
    </div>
)
};

export default PieceTable;
