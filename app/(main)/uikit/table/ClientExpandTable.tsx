'use client';
import { CustomerService } from '../../../../demo/service/CustomerService';
import { ProductService } from '../../../../demo/service/ProductService';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column, ColumnFilterApplyTemplateOptions, ColumnFilterClearTemplateOptions, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { DataTable, DataTableExpandedRows, DataTableFilterMeta } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { ProgressBar } from 'primereact/progressbar';
import { Rating } from 'primereact/rating';
import { Slider } from 'primereact/slider';
import { ToggleButton } from 'primereact/togglebutton';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';

import type { Demo } from '@/types';

import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { calculateCustomerTotal, formatCurrency, getCustomers, onCategoryChange, onInputChange, onInputNumberChange } from '../../utils/function';
import { Client, CompteClient } from '@/types/types';

interface PropsType {
    clients: Client[];
    findClientCompte: (matricule: string) => Promise<void>;
}

const ClientExpendTable = ({ clients, findClientCompte }: PropsType) => {
    let emptyProduct: Demo.Product = {
        id: '',
        name: '',
        image: '',
        description: '',
        category: '',
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK'
    };
    const [customers1, setCustomers1] = useState<Demo.Customer[]>([]);
    const [customers2, setCustomers2] = useState<Demo.Customer[]>([]);
    const [customers3, setCustomers3] = useState<Demo.Customer[]>([]);
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [idFrozen, setIdFrozen] = useState(false);
    const [products, setProducts] = useState<Client[]>(clients);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const [expandedRows, setExpandedRows] = useState<any[] | DataTableExpandedRows>([]);
    const [allExpanded, setAllExpanded] = useState(false);

    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<Demo.Product>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const representatives = [
        { name: 'Amy Elsner', image: 'amyelsner.png' },
        { name: 'Anna Fali', image: 'annafali.png' },
        { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
        { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
        { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
        { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
        { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
        { name: 'Onyama Limba', image: 'onyamalimba.png' },
        { name: 'Stephen Shaw', image: 'stephenshaw.png' },
        { name: 'XuXue Feng', image: 'xuxuefeng.png' }
    ];

    const statuses = ['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'];

    const clearFilter1 = () => {
        initFilters1();
    };

    const onGlobalFilterChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        (_filters1['global'] as any).value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };

    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter1} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    useEffect(() => {
        setLoading2(true);
        CustomerService.getCustomersLarge().then((data) => {
            setCustomers1(getCustomers(data));
            setLoading1(false);
        });
        CustomerService.getCustomersLarge().then((data) => {
            setCustomers2(getCustomers(data));
            setLoading2(false);
        });
        CustomerService.getCustomersMedium().then((data) => setCustomers3(data));
        // ProductService.getProductsWithOrdersSmall().then((data) => setProducts(data));
        initFilters1();
    }, []);

    // const balanceTemplate = (rowData: Demo.Customer) => {
    //     return (
    //         <div>
    //             <span className="text-bold">{formatCurrency(rowData.balance as number)}</span>
    //         </div>
    //     );
    // };

    // const getCustomers = (data: Demo.Customer[]) => {
    //     return [...(data || [])].map((d) => {
    //         d.date = new Date(d.date);
    //         return d;
    //     });
    // };

    // const formatDate = (value: Date) => {
    //     return value.toLocaleDateString('en-US', {
    //         day: '2-digit',
    //         month: '2-digit',
    //         year: 'numeric'
    //     });
    // };

    // const formatCurrency = (value: number) => {
    //     return value.toLocaleString('en-US', {
    //         style: 'currency',
    //         currency: 'USD'
    //     });
    // };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !(selectedProducts as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };
    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (product.name.trim()) {
            let _products = [...(products as any)];
            let _product = { ...product };
            if (product.id) {
                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
            } else {
                _product.id = createId();
                _product.image = 'product-placeholder.svg';
                _products.push(_product);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
            }

            setProducts(_products as any);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const editProduct = (product: Demo.Product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product: Demo.Product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = (products as any)?.filter((val: any) => val.id !== product.id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000
        });
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (products as any)?.length; i++) {
            if ((products as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = (products as any)?.filter((val: any) => !(selectedProducts as any)?.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000
        });
    };

    // const onCategoryChange = (e: RadioButtonChangeEvent) => {
    //     let _product = { ...product };
    //     _product['category'] = e.value;
    //     setProduct(_product);
    // };

    // const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
    //     const val = (e.target && e.target.value) || '';
    //     let _product = { ...product };
    //     _product[`${name}`] = val;

    //     setProduct(_product);
    // };

    // const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
    //     const val = e.value || 0;
    //     let _product = { ...product };
    //     _product[`${name}`] = val;

    //     setProduct(_product);
    // };

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedProducts} />
        </>
    );
    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            'country.name': {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
            },
            balance: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            status: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue1('');
    };

    // const countryBodyTemplate = (rowData: Demo.Customer) => {
    //     return (
    //         <React.Fragment>
    //             <img alt="flag" src={`/demo/images/flag/flag_placeholder.png`} className={`flag flag-${rowData.country.code}`} width={30} />
    //             <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{rowData.country.name}</span>
    //         </React.Fragment>
    //     );
    // };

    // const filterClearTemplate = (options: ColumnFilterClearTemplateOptions) => {
    //     return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} severity="secondary"></Button>;
    // };

    // const filterApplyTemplate = (options: ColumnFilterApplyTemplateOptions) => {
    //     return <Button type="button" icon="pi pi-check" onClick={options.filterApplyCallback} severity="success"></Button>;
    // };

    // const representativeBodyTemplate = (rowData: Demo.Customer) => {
    //     const representative = rowData.representative;
    //     return (
    //         <React.Fragment>
    //             <img
    //                 alt={representative.name}
    //                 src={`/demo/images/avatar/${representative.image}`}
    //                 onError={(e) => ((e.target as HTMLImageElement).src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')}
    //                 width={32}
    //                 style={{ verticalAlign: 'middle' }}
    //             />
    //             <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{representative.name}</span>
    //         </React.Fragment>
    //     );
    // };

    // const representativesItemTemplate = (option: any) => {
    //     return (
    //         <div className="p-multiselect-representative-option">
    //             <img alt={option.name} src={`/demo/images/avatar/${option.image}`} width={32} style={{ verticalAlign: 'middle' }} />
    //             <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{option.name}</span>
    //         </div>
    //     );
    // };

    // const representativeFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    //     return (
    //         <>
    //             <div className="mb-3 text-bold">Agent Picker</div>
    //             <MultiSelect value={options.value} options={representatives} itemTemplate={representativesItemTemplate} onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="Any" className="p-column-filter" />
    //         </>
    //     );
    // };
    // const dateBodyTemplate = (rowData: Demo.Customer) => {
    //     return formatDate(rowData.date);
    // };

    // const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    //     return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    // };

    // const balanceBodyTemplate = (rowData: Demo.Customer) => {
    //     return formatCurrency(rowData.balance as number);
    // };

    // const balanceFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    //     return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="USD" locale="en-US" />;
    // };

    // const statusBodyTemplate = (rowData: Demo.Customer) => {
    //     return <span className={`customer-badge status-${rowData.status}`}>{rowData.status}</span>;
    // };

    // const statusFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    //     return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;
    // };

    // const statusItemTemplate = (option: any) => {
    //     return <span className={`customer-badge status-${option}`}>{option}</span>;
    // };

    // const activityBodyTemplate = (rowData: Demo.Customer) => {
    //     return <ProgressBar value={rowData.activity} showValue={false} style={{ height: '.5rem' }}></ProgressBar>;
    // };

    // const activityFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    //     return (
    //         <React.Fragment>
    //             <Slider value={options.value} onChange={(e) => options.filterCallback(e.value)} range className="m-3"></Slider>
    //             <div className="flex align-items-center justify-content-between px-2">
    //                 <span>{options.value ? options.value[0] : 0}</span>
    //                 <span>{options.value ? options.value[1] : 100}</span>
    //             </div>
    //         </React.Fragment>
    //     );
    // };

    // const verifiedBodyTemplate = (rowData: Demo.Customer) => {
    //     return (
    //         <i
    //             className={classNames('pi', {
    //                 'text-green-500 pi-check-circle': rowData.verified,
    //                 'text-pink-500 pi-times-circle': !rowData.verified
    //             })}
    //         ></i>
    //     );
    // };

    // const verifiedFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    //     return <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value)} />;
    // };

    const toggleAll = () => {
        if (allExpanded) collapseAll();
        else expandAll();
    };

    const expandAll = () => {
        let _expandedRows = {} as { [key: string]: boolean };
        products.forEach((p) => (_expandedRows[`${p.id}`] = true));

        setExpandedRows(_expandedRows);
        setAllExpanded(true);
    };

    const collapseAll = () => {
        setExpandedRows([]);
        setAllExpanded(false);
    };

    const amountBodyTemplate = (rowData: Demo.Customer) => {
        return formatCurrency(rowData.amount as number);
    };

    const statusOrderBodyTemplate = (rowData: Demo.Customer) => {
        return <span className={`order-badge order-${rowData.status?.toLowerCase()}`}>{rowData.status}</span>;
    };

    const searchBodyTemplate = (compte: CompteClient) => {
        return <Button icon="pi pi-search" onClick={() => findClientCompte(compte.matricule)} />;
    };

    const imageBodyTemplate = (rowData: Demo.Product) => {
        return <img src={`/demo/images/product/${rowData.image}`} onError={(e) => ((e.target as HTMLImageElement).src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')} alt={rowData.image} className="shadow-2" width={100} />;
    };

    // const priceBodyTemplate = (rowData: Demo.Product) => {
    //     return formatCurrency(rowData.price as number);
    // };

    const ratingBodyTemplate = (rowData: Demo.Product) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    };

    const statusBodyTemplate2 = (rowData: Demo.Product) => {
        return <span className={`product-badge status-${rowData.inventoryStatus?.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
    };

    const rowExpansionTemplate = (data: Client & CompteClient[]) => {
        return (
            <div className="orders-subtable">
                <h5>
                    Les comptes de {data.nom} {data.prenom}
                </h5>
                <DataTable value={data.CompteClients} responsiveLayout="scroll">
                    <Column field="id" header="Id" sortable></Column>
                    <Column field="matricule" header="Matricule" sortable></Column>
                    <Column field="numero_compte" header="Numero Compte" sortable></Column>
                    <Column field="type_compte" header="Type Compte" sortable></Column>
                    <Column field="agence" header="Agence" sortable></Column>
                    {/* <Column field="nature" header="Nature" body={amountBodyTemplate} sortable></Column> */}
                    {/* <Column field="status" header="Status" body={statusOrderBodyTemplate} sortable></Column> */}
                    <Column headerStyle={{ width: '4rem' }} body={searchBodyTemplate}></Column>
                </DataTable>
            </div>
        );
    };

    const header = (
        <React.Fragment>
            <div className="flex justify-content-between ">
                <Button icon={allExpanded ? 'pi pi-minus' : 'pi pi-plus'} label={allExpanded ? 'Collapse All' : 'Expand All'} onClick={toggleAll} className="w-11rem" />
                <div className="flex justify-content-between">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Keyword Search" />
                    </span>
                </div>
            </div>
        </React.Fragment>
    );

    const headerTemplate = (data: Demo.Customer) => {
        return (
            <React.Fragment>
                <img alt={data.representative.name} src={`/demo/images/avatar/${data.representative.image}`} width="32" style={{ verticalAlign: 'middle' }} />
                <span className="font-bold ml-2">{data.representative.name}</span>
            </React.Fragment>
        );
    };

    const footerTemplate = (data: Demo.Customer) => {
        return (
            <React.Fragment>
                <td colSpan={4} style={{ textAlign: 'right' }} className="text-bold pr-6">
                    Total Customers
                </td>
                <td>{calculateCustomerTotal(data.representative.name, customers3)}</td>
            </React.Fragment>
        );
    };

    // const calculateCustomerTotal = (name: string) => {
    //     let total = 0;

    //     if (customers3) {
    //         for (let customer of customers3) {
    //             if (customer.representative.name === name) {
    //                 total++;
    //             }
    //         }
    //     }

    //     return total;
    // };

    useEffect(() => {
        console.log('Changed...', product);
    }, [product]);
    const header1 = renderHeader1();

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <h5>Row Expand</h5>
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable value={products} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} responsiveLayout="scroll" rowExpansionTemplate={rowExpansionTemplate} dataKey="id" header={header}>
                        <Column expander style={{ width: '3em' }} />
                        <Column field="nom" header="Nom" sortable />
                        <Column field="prenom" header="Prenom" sortable />
                        <Column field="adresse" header="Adresse" sortable />
                        <Column field="telephone" header="Telephone" sortable />
                        <Column field="profession" header="Profession" sortable />
                        {/* <Column header="Image" body={imageBodyTemplate} /> */}
                        {/* <Column field="price" header="Price" sortable body={priceBodyTemplate} /> */}
                        <Column field="nature" header="Nature" sortable />
                        {/* <Column field="rating" header="Reviews" sortable body={ratingBodyTemplate} /> */}
                        {/* <Column field="inventoryStatus" header="Status" sortable body={statusBodyTemplate2} /> */}
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        {product.image && <img src={`/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={product.name}
                                onChange={(e) => setProduct(onInputChange(e, 'name', product))}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !product.name
                                })}
                            />
                            {submitted && !product.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={product.description} onChange={(e) => setProduct(onInputChange(e, 'description', product))} required rows={3} cols={20} />
                        </div>

                        <div className="field">
                            <label className="mb-3">Category</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category1" name="category" value="Accessories" onChange={(e) => setProduct(onCategoryChange(e, product))} checked={product.category === 'Accessories'} />
                                    <label htmlFor="category1">Accessories</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category2" name="category" value="Clothing" onChange={(e) => setProduct(onCategoryChange(e, product))} checked={product.category === 'Clothing'} />
                                    <label htmlFor="category2">Clothing</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category3" name="category" value="Electronics" onChange={(e) => setProduct(onCategoryChange(e, product))} checked={product.category === 'Electronics'} />
                                    <label htmlFor="category3">Electronics</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category4" name="category" value="Fitness" onChange={(e) => setProduct(onCategoryChange(e, product))} checked={product.category === 'Fitness'} />
                                    <label htmlFor="category4">Fitness</label>
                                </div>
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Price</label>
                                <InputNumber id="price" value={product.price} onValueChange={(e) => setProduct(onInputNumberChange(e, 'price', product))} mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Quantity</label>
                                <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => setProduct(onInputNumberChange(e, 'quantity', product))} />
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Are you sure you want to delete <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ClientExpendTable;
