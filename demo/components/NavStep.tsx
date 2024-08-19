
import React from 'react';
import { Steps } from 'primereact/steps';

interface PropsType{
    step:number
}
export default function NavStep({step}:PropsType) {
    const items = [
        {
            label: 'Dossier info'
        },
        {
            label: 'Les information a renseigne'
        }, {
            label: 'Les pieces a fournirs'
        },
    ];

    return (
        <div className="mb-5">
            <Steps model={items} activeIndex={step}/>
        </div>
    )
}
