"use client"
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Controller, useFieldArray } from 'react-hook-form';
import { FieldItem } from '../(main)/uikit/table/DocumentExpandTable';

interface ProductDialogUpdateProps {
    visible: boolean;
    onHide: () => void;
    onSave: () => void;
    fields: FieldItem[];
    addField: () => void;
    removeField: (index: number) => void;
    control: any;
    errors: any;
    setFieldValue: (index: number, value: string) => void;
    setFieldType: (index: number, cle: string) => void;
    getValues: () => any;
}

const ProductDialogUpdate = ({
    visible,
    onHide,
    onSave,
    fields,
    addField,
    removeField,
    control,
    errors,
    getValues,
}: ProductDialogUpdateProps) => {
    const cities = [
        { name: 'text' },
        { name: 'number' },
        { name: 'date' },
        { name: 'email' },
    ];

    const handleShowValues = () => {
        const currentValues = getValues(); // Récupère les valeurs actuelles du formulaire
        console.log('Valeurs du formulaire:', currentValues);
        // Vous pouvez aussi afficher ces valeurs dans un autre composant ou une boîte de dialogue si nécessaire
    };

    return (
        <Dialog
            visible={visible}
            style={{ width: '450px' }}
            header="Product Details"
            modal
            className="p-fluid"
            footer={
                <>
                    <Button label="Cancel" icon="pi pi-times" text onClick={onHide} />
                    <Button label="Afficher les valeurs" icon="pi pi-eye" text onClick={handleShowValues} />
                    <Button label="Save" icon="pi pi-check" text onClick={onSave} />
                </>
            }
            onHide={onHide}
        >
            <>
                <div className="formgrid grid">
                    <div className="field col">
                        <label>Code</label>
                        <Controller
                            name="code"
                            control={control}
                            render={({ field }) => (
                                <InputText {...field} className={errors.code ? "p-invalid" : ""} />
                            )}
                        />
                        {errors.code && <small className="p-error">{errors.code.message}</small>}
                    </div>
                    <div className="field col">
                        <label>Nom Document</label>
                        <Controller
                            name="nom"
                            control={control}
                            render={({ field }) => (
                                <InputText {...field} className={errors.nom ? "p-invalid" : ""} />
                            )}
                        />
                        {errors.nom && <small className="p-error">{errors.nom.message}</small>}
                    </div>
                </div>

                {fields.map((field, index) => (
                    <div className="formgrid grid align-items-center" key={index}>
                        <div className="field col">
                            <Controller
                                name={`fields.${index}.valeur`}
                                control={control}
                                render={({ field }) => (
                                    <InputText {...field} className={errors.fields?.[index]?.valeur ? "p-invalid" : ""} />
                                )}
                            />
                            {errors.fields?.[index]?.valeur && <small className="p-error">{errors.fields[index].valeur.message}</small>}
                        </div>
                        <div className="field col">
                        <Controller
    name={`fields.${index}.cle`}
    control={control}
    render={({ field }) => (
        <Dropdown
            {...field}
            options={cities}
            optionLabel="name"
            optionValue="name" // Assurez-vous que seule la valeur est stockée, pas un objet
            className={errors.fields?.[index]?.cle ? "p-invalid" : ""}
        />
    )}
/>
                            {errors.fields?.[index]?.cle && <small className="p-error">{errors.fields[index].cle.message}</small>}
                        </div>
                        <div className="field col-0">
                            <Button icon="pi pi-trash" text className="p-button-danger" onClick={() => removeField(index)} />
                        </div>
                    </div>
                ))}

                <div className="formgrid grid">
                    <div className="field col">
                        <Button label="Ajouter un champ" text icon="pi pi-plus" onClick={addField} />
                    </div>
                </div>
            </>
        </Dialog>
    );
};

export default ProductDialogUpdate;
