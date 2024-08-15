"use client"
import React,{useRef} from "react"
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { useState } from 'react';
import { DataTable } from 'primereact/datatable';


interface ToolbarProps {
    onNewClick: () => void;
}

const ToolbarComponent = ({ onNewClick }: ToolbarProps) => {
    const [deletedocumentsDialog, setDeleteDocumentsDialog] = useState(false);
    const [selectedDocuments, setSelectedDocuments] = useState(null);
    const dt = useRef<DataTable<any>>(null);

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteDocumentsDialog(true);
    };
    return (
        <Toolbar
            left={() => (
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className="mr-2" onClick={onNewClick} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedDocuments || !(selectedDocuments as any).length} />

                </div>


            )}

            right={
                ()=>(
                    <div>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </div>
                )
            }
        />
    );
};

export default ToolbarComponent;
