import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Controller } from 'react-hook-form';

interface ProductDialogProps {
    visible: boolean;
    onHide: () => void;
    onSave: () => void;
    fields: any[];
    addField: () => void;
    removeField: (index: number) => void;
    control: any;
    errors: any;
    setFieldValue: (index: number, value: string) => void;
    setFieldType: (index: number, cle: string) => void;
    getValues: () => any;
}

const ProductDialog = ({
    visible,
    onHide,
    onSave,
    fields,
    addField,
    removeField,
    control,
    errors,
    getValues,
}: ProductDialogProps) => {
    const cities = [
        { name: 'text' },
        { name: 'number' },
        { name: 'date' },
        { name: 'email' },
    ];

    return (
        <Dialog
            visible={visible}
            style={{ width: '500px' }}
            header="Document Details"
            modal
            className="p-fluid"
            footer={
                <div style={{ textAlign: 'center' }}>
                    <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onHide} />
                    <Button label="Save" icon="pi pi-check" className="p-button-success" onClick={onSave} />
                </div>
            }
            onHide={onHide}
        >
            <div className="p-field p-grid">
                <label htmlFor="code" className="p-col-12 p-md-2">Code</label>
                <div className="p-col-12 p-md-10">
                    <Controller
                        name="code"
                        control={control}
                        render={({ field }) => (
                            <InputText id="code" {...field} className={errors.code ? "p-invalid" : ""} />
                        )}
                    />
                    {errors.code && <small className="p-error">{errors.code.message}</small>}
                </div>
            </div>

            <div className="p-field p-grid">
                <label htmlFor="nom" className="p-col-12 p-md-2">Nom</label>
                <div className="p-col-12 p-md-10">
                    <Controller
                        name="nom"
                        control={control}
                        render={({ field }) => (
                            <InputText id="nom" {...field} className={errors.nom ? "p-invalid" : ""} />
                        )}
                    />
                    {errors.nom && <small className="p-error">{errors.nom.message}</small>}
                </div>
            </div>

            <h5>Champs dynamiques</h5>
            {fields.map((field, index) => (
                <div key={index} className="p-field p-grid align-items-center">
                    <div className="p-col-5">
                        <Controller
                            name={`fields.${index}.cle`}
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={cities}
                                    optionLabel="name"
                                    optionValue="name"
                                    placeholder="Nom du champ"
                                    className={errors.fields?.[index]?.cle ? "p-invalid" : ""}
                                />
                            )}
                        />
                        {errors.fields?.[index]?.cle && <small className="p-error">{errors.fields[index].cle.message}</small>}
                    </div>
                    <div className="p-col-5">
                        <Controller
                            name={`fields.${index}.valeur`}
                            control={control}
                            render={({ field }) => (
                                <InputText {...field} placeholder="Valeur" className={errors.fields?.[index]?.valeur ? "p-invalid" : ""} />
                            )}
                        />
                        {errors.fields?.[index]?.valeur && <small className="p-error">{errors.fields[index].valeur.message}</small>}
                    </div>
                    <div className="p-col-2">
                        <Button icon="pi pi-minus" className="p-button-danger p-button-rounded" onClick={() => removeField(index)} />
                    </div>
                </div>
            ))}

            <div className="p-field">
                <Button label="Ajouter un champ" icon="pi pi-plus" className="p-button-success p-button-rounded p-mt-2" onClick={addField} />
            </div>
        </Dialog>
    );
};

export default ProductDialog;
