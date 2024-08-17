"use client";

import React, { ChangeEvent } from 'react';
import { InputText } from 'primereact/inputtext';

type FieldValue = {
    cle: string;
    value: string;
};

type PropsType = {
    field: {
        id: number;
        cle: string;
        valeur: string; // Le type du champ (par exemple, 'text', 'number', 'email')
    };
    fieldValue: FieldValue;
    onFieldChange: (id: number, cle: string, value: string) => void;
}

const DinamicForm = ({ field, fieldValue, onFieldChange }: PropsType) => {

    // Fonction pour gérer le changement de valeur du champ
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onFieldChange(field.id, field.cle, e.target.value);
    };

    return (
        <div className="p-fluid grid">
            <div className="field col-12">
                <label htmlFor={field.cle}>{field.cle}</label>
                <InputText
                    id={field.cle}
                    value={fieldValue.value}
                    type={field.valeur || 'text'} // Par défaut, 'text' est utilisé si 'valeur' est vide
                    onChange={handleChange}
                    placeholder="Renseignez vos informations"
                />
            </div>
        </div>
    );
};

export default DinamicForm;
