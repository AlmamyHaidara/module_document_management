import { FileUpload, FileUploadUploadEvent } from 'primereact/fileupload'
import { InputText } from 'primereact/inputtext'
import React from 'react'

function UploadFileComponent({piece, setFilePaths}:{piece:any,setFilePaths:any}) {

    const onTemplateUpload = (e: FileUploadUploadEvent) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        
        const response = JSON.parse(e.xhr.responseText);
        // toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
        setFilePaths(response?.filePaths)
        console.log('Response from API:', response.filePaths);

    };


  return (
    <div className='mt-5'>
        <p className="text-xl mb-2"  >{piece.nom && piece.nom}</p>
        <FileUpload name="demo[]" url={'/api/upload'} multiple accept="*" maxFileSize={1000000} onUpload={onTemplateUpload} emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />


    </div>
  )
}

export default UploadFileComponent
