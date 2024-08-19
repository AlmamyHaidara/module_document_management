import { Demo } from "@/types";
import { Span } from "next/dist/trace";
import { InputNumberValueChangeEvent } from "primereact/inputnumber";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { Rating } from "primereact/rating";

export const onCategoryChange = (e: RadioButtonChangeEvent,product:Demo.Product) => {
    let _product = { ...product };
    _product['category'] = e.value;
    return _product
};

export const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string,product:Demo.Product) => {
    const val = (e.target && e.target.value) || '';
    let _product = { ...product };
    _product[`${name}`] = val;
    return _product;
};

export const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string,product:Demo.Product) => {
    const val = e.value || 0;
    let _product = { ...product };
    _product[`${name}`] = val;

    return _product;
};

export const calculateCustomerTotal = (name: string,customers3:Demo.Customer[]) => {
    let total = 0;

    if (customers3) {
        for (let customer of customers3) {
            if (customer.representative.name === name) {
                total++;
            }
        }
    }

    return total;
};

export const getCustomers = (data: Demo.Customer[]) => {
    return [...(data || [])].map((d) => {
        d.date = new Date(d.date);
        return d;
    });
};

export  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
};


export const generateID =(length: number): string =>{
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

export function generateUniqueNumber(nrb:number=20): string {
    const timestamp = Date.now().toString(); // Utilise le timestamp actuel pour garantir l'unicité
    const randomPart = Math.floor(Math.random() * 1e15).toString().padStart(15, '0'); // Génère un nombre aléatoire de 15 chiffres

    // Combine le timestamp (13 chiffres) et le nombre aléatoire (15 chiffres) pour obtenir 20 chiffres
    const uniqueNumber = (timestamp + randomPart).slice(0, nrb);

    return uniqueNumber;
}


