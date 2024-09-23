import React,{useEffect} from "react";
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { TypeDoc } from "@/types/types";

interface PropsType {
    options: any[];
    setTypeDocument: React.Dispatch<React.SetStateAction<any | null>>;
    typeDocument: TypeDoc | null;
    placeholder: string;
}

export default function DropDownComponent({ options, setTypeDocument, typeDocument, placeholder }: PropsType) {

    useEffect(() => {
        if (typeDocument) {
            console.log('Type de document mis à jour : ', typeDocument);
        }
    }, [typeDocument]);

    const selectedOptionTemplate = (option: TypeDoc, props: any) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.nom_type}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const optionTemplate = (option: TypeDoc) => {
        return (
            <div className="flex align-items-center">
                <div>{option.nom_type}</div>
            </div>
        );
    };

    return (
        <div className="flex w-full">
            <Dropdown
             value={typeDocument?.id}  // Utiliser seulement l'id pour comparer la valeur sélectionnée
             onChange={(e: DropdownChangeEvent) => {
                 const selectedOption = options.find(option => option.id === e.value); // Trouver l'objet complet
                 setTypeDocument(selectedOption || null);  // Mettre à jour l'état avec l'objet sélectionné complet
             }}
             options={options}
             optionLabel="nom_type"
             optionValue="id" // Utilisation de l'ID pour faire la correspondance
             placeholder={placeholder}
             filter
             valueTemplate={selectedOptionTemplate}
             itemTemplate={optionTemplate}
             className="w-full"
            />
        </div>
    );
}
