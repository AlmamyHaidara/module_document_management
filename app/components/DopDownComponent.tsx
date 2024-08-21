
import React, { useState } from "react";
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { TypeDoc } from "@/types/types";

interface Country {
    name: string;
    code: string;
}
interface PropsType{
    options:any[];
    setTypeDocument:React.Dispatch<React.SetStateAction<any>>;
     typeDocument:any;
     placeholder:string
}

export default function DropDownComponent({options,setTypeDocument, typeDocument, placeholder}:PropsType) {

    const selectedCountryTemplate = (option: any, props:any) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.nom_type || option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const countryOptionTemplate = (option: any) => {
        return (
            <div className="flex align-items-center">
                <div>{option.nom_type || option.name}</div>
            </div>
        );
    };

    return (
        <div className="flex w-full">
            <Dropdown  value={typeDocument} onChange={(e: DropdownChangeEvent) => setTypeDocument(e.value)} options={options} optionLabel={ "nom_type"} placeholder={placeholder}
                filter valueTemplate={selectedCountryTemplate} itemTemplate={countryOptionTemplate} className="w-full" />
        </div>
    )
}
