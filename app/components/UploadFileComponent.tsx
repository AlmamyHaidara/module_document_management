import { FileUpload, FileUploadUploadEvent } from 'primereact/fileupload'
import { InputText } from 'primereact/inputtext'
import React from 'react'

function UploadFileComponent({piece, setFilePaths}:{piece:any,setFilePaths:any}) {
   
    const onTemplateUpload = (e: FileUploadUploadEvent) => {
        
        console.log('Response from API:',piece);
        const response = JSON.parse(e.xhr.responseText);
        const newFilePaths:any =  []
        response.filePaths.map((item:any)=> {
            item.code = piece.code
            newFilePaths.push(item)
        })
        setFilePaths(newFilePaths)
        
        console.log('Response from API:',newFilePaths);

    };


  return (
    <div className='mt-5'>
        <p className="text-xl mb-2"  >{piece.nom && piece.nom}</p>
        <FileUpload name="demo[]"  url={'/api/upload'} multiple accept="*" maxFileSize={1000000} onUpload={onTemplateUpload} emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />


    </div>
  )
}

export default UploadFileComponent
