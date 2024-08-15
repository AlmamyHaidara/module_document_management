import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const schema = z.object({
    name: z.string().min(1, { message: 'Required' }),
    age: z.number().min(10)
});
function InputForm({ product }: { product: any }) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(schema)
    });

    return (
        <>
            <form onSubmit={handleSubmit((d) => console.log(d))}>
                <div className="field">
                    <label htmlFor="name">Name</label>
                    <InputText
                        {...register('name')}
                        // id="name"
                        // value={product.name}
                        // onChange={(e) => setProduct(onInputChange(e, 'name', product))}
                        required
                        autoFocus
                        /*className={classNames({
          'p-invalid': submitted && !product.name
        })}*/
                    />
                    {/* <p>{errors?.name?.message && errors?.name?.message}</p> */}
                    {/* {submitted && !product.name && <small className="p-invalid">Name is required.</small>} */}
                </div>
                <div className="field">
                    <label htmlFor="description">Description</label>
                    <InputTextarea
                        id="description"
                        value={product.description}
                        // onChange={(e) => setProduct(onInputChange(e, 'description', product))}
                        required
                        rows={3}
                        cols={20}
                    />
                </div>
                <div className="field">
                    <label className="mb-3">Category</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton
                                inputId="category1"
                                name="category"
                                value="Accessories"
                                // onChange={(e) => setProduct(onCategoryChange(e, product))} checked={product.category === 'Accessories'}
                            />
                            <label htmlFor="category1">Accessories</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category2" name="category" value="Clothing" /*onChange={(e) => setProduct(onCategoryChange(e, product))} checked={product.category === 'Clothing'}*/ />
                            <label htmlFor="category2">Clothing</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category3" name="category" value="Electronics" /*onChange={(e) => setProduct(onCategoryChange(e, product))} checked={product.category === 'Electronics'}*/ />
                            <label htmlFor="category3">Electronics</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category4" name="category" value="Fitness" /*onChange={(e) => setProduct(onCategoryChange(e, product))} checked={product.category === 'Fitness'}*/ />
                            <label htmlFor="category4">Fitness</label>
                        </div>
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price">Price</label>
                        <InputNumber id="price" value={product.price} /*onValueChange={(e) => setProduct(onInputNumberChange(e, 'price', product))} */ mode="currency" currency="USD" locale="en-US" />
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity">Quantity</label>
                        <InputNumber id="quantity" value={product.quantity} /*onValueChange={(e) => setProduct(onInputNumberChange(e, 'quantity', product))}*/ />
                    </div>
                </div>
            </form>
        </>
    );
}

export default InputForm;
function zodResolver(
    schema: z.ZodObject<{ name: z.ZodString; age: z.ZodNumber }, 'strip', z.ZodTypeAny, { name: string; age: number }, { name: string; age: number }>
): import('react-hook-form').Resolver<import('react-hook-form').FieldValues, any> | undefined {
    throw new Error('Function not implemented.');
}
