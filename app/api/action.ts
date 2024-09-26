'use server';
import prisma from '@/prisma/prismaClient';
import { PrismaClient } from '@prisma/client';
import { generateID } from '../(main)/utils/function';
// import { InvalidateQueryFilters, useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';

// export const findTypeDocument= async()=>{
//     // const queryClient = useQueryClient();

//     const {  isError, data, error } = useQuery({ queryKey: ['typeDocument'], queryFn:  fetchTypeDocument });
//     if(isError){
//         console.log(error);

//         return null
//     }

//     return data
// }
export const fetchTypeDocument = async () => {
    const data = await prisma.typesDocuments.findMany({
        include: {
            metadonnees: true,
            pieceName: true
        }
    });
    return data;
};

export const fetchClientCompte = async () => {
    const data = await prisma.compteClients.findMany({
        include: {
            client: true
        }
    });
    return data;
};

export const fetchClientCode = async () => {
    const data = await prisma.clients.findMany({
        select: {
            id: true,
            code: true
        }
    });
    console.log('--------------hfjdklk;l', data);
    return data;
};

export const createOption = async (option: { name: string }) => {
    try {
        const newOption = await prisma.typeCompte.create({
            data: option
        });
        return newOption;
    } catch (errors) {
        console.log(errors);
    }
};


export const createAgence = async (option:{ ageCreat: number, libAgence: string}) => {
    console.log("lllllllllllllllllllllllllllllllll")
    try {
        const newOption = await prisma.agence.create({
            data: option
        });
        return newOption;
    } catch (errors) {
        console.log(errors);
    }
};

export const createPiece = async (option: { nom: string; code: string }) => {
    try {
        const newPiece = await prisma.pieceName.create({
            data: option
        });

        console.log('ooooo', newPiece);
        return newPiece;
    } catch (errors) {
        console.log(errors);
    }
};

export const connectPieceToTypeDocument = async (pieceId: number, docId: number) => {
    console.log('Is update :) ', pieceId, docId);
    try {
        const newPiece = await prisma.pieceName.update({
            where: {
                id: pieceId
            },
            data: {
                typesDocuments: {
                    connect: {
                        id: docId
                    }
                }
            }
        });
        return newPiece;
    } catch (errors) {
        console.log(errors);
    }
};

export const fetchTypeCompte = async () => {
    try {
        return await prisma.typeCompte.findMany();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const fetchAgences = async () => {
    try {
        console.log("pppppppppppppppppppppppp",await prisma.agence.findMany());
        
        return await prisma.agence.findMany();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const fetchPiece = async () => {
    try {
        return await prisma.pieceName.findMany({
            select: {
                id: true,
                code: true,
                nom: true
            }
        });
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const fetchDossier = async () => {
    try {
        return await prisma.dossiers.findMany({
            select: {
                id: true,
                code: true,
                nom: true
            }
        });
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const attachPieceToDossier = async (pieceId: number, dossierId: number) => {
    try {
        return await prisma.piece.update({
            where: {
                id: pieceId
            },
            data: {
                dossierId: dossierId
            }
        });
    } catch (error) {
        console.error(error);
        return {};
    }
};

export const deleteOption = async (id: number) => {
    try {
        return await prisma.typeCompte.delete({
            where: {
                id: id
            }
        });
    } catch (error) {
        console.error(error);
    }
};

export const deleteAgence = async (id: number) => {
    try {
        return await prisma.agence.delete({
            where: {
                id: id
            }
        });
    } catch (error) {
        console.error(error);
    }
};


export const deletePiece = async (id: number) => {
    console.log('pppppppppppppp,', id);

    try {
        return await prisma.pieceName.delete({
            where: {
                id: id
            }
        });
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const deletedPiece = async (id: number) => {
    console.log('pppppppppppppp,', id);

    try {
        return await prisma.piece.deleteMany({
            where: {
                id: id
            }
        });
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const fetchTypeDocuments = async () => {
    try {
        const typesDoc = await prisma.typesDocuments.findMany({
            select: {
                id: true,
                code: true,
                nom_type: true,
                pieceName: true
            }
        });

        console.log('pppppppppppkkkkkkkkkkk: ', typesDoc);
        return typesDoc;
    } catch (error) {
        console.error(error);
    }
};

// [
//     "AGENCE",ok
//     "CODE AGENCE",ok
//     "TYPE DE COMPTE",ok
//     "ANNEE",ok
//     "Immatriculation",ok
//     "Num compte",ok
//     "RAISON SOCIALE",
//     "Date ouverture"ok
// ]
// export const insertCompteExcelRows = async (exelRows: any[]) =>{
//     try {
//         await prisma.$transaction(async (prisma) => {
//             for (const exelRow of exelRows) {
//                 console.log(exelRow.AGENCE);
//                 const createdAtDate = new Date(exelRow["Date ouverture"]); // Exemple de date
//                 const isoCreatedAt = createdAtDate.toISOString(); // Convertir en format ISO-8601

//                 await prisma.compteClients.upsert({
//                     where: {
//                         matricule:  `${exelRow.Immatriculation}`,
//                     },
//                     create: {
//                         agence:exelRow.AGENCE,
//                         matricule: `${exelRow.Immatriculation}`,
//                         code_gestionnaire:`${exelRow["CODE AGENCE"]}`,
//                         numero_compte:`${exelRow["Num compte"]}`,
//                         annee:`${exelRow["ANNEE"]}`,
//                         created_at:`${isoCreatedAt}`,
//                         client:{

//                         },
//                         type_compte:{
//                             connectOrCreate:{
//                                 where:{
//                                     name:`${exelRow["TYPE DE COMPTE"]}`
//                                 },
//                                 create:{
//                                     name:`${exelRow["TYPE DE COMPTE"]}`
//                                 },
//                             }

//                         }
//                         // Ajoute ici les autres champs nécessaires
//                     },
//                     update: {}, // Ne rien faire si le atricule existe déjà
//                 });
//             }
//         });
//     } catch (error) {
//         console.error('Erreur lors de l\'insertion:', error);
//         throw new Error('Échec de l\'insertion');
//     }
// }
function hasDuplicates(array:any[], keys:any[]) {
    const uniqueSet = new Set();

    for (const item of array) {
        // Créer une clé unique basée sur les propriétés spécifiées
        const compositeKey = keys.map(key => item[key]).join('|');
        if (uniqueSet.has(compositeKey)) {
            return true; // Duplicata trouvé
        }
        uniqueSet.add(compositeKey);
    }
    return false; // Aucun duplicata trouvé
}

function removeDuplicates(array:any[], keys:any[]) {
    const uniqueSet = new Set();
    const duplicates:any[] = [];

    const uniqueArray = array.filter(item => {
        const compositeKey = keys.map(key => item[key]).join('|');

        if (uniqueSet.has(compositeKey)) {
            duplicates.push(item); // Ajoute à la liste des doublons
            return false; // Exclut du tableau unique
        } else {
            uniqueSet.add(compositeKey); // Ajoute la clé composite à l'ensemble unique
            return true; // Inclut dans le tableau unique
        }
    });

    return { uniqueArray, duplicates }; // Retourne les deux tableaux
}

export const insertCompteExcelRows = async (exelRows:any[]) => {
    try {
        const operations = [];
        const operations1 = [];
        const { uniqueArray, duplicates } = removeDuplicates(exelRows, ['id', 'AGE CREAT', "Num compte"]);

        console.log('Unique Array:', uniqueArray.length);
        console.log('Duplicates:', duplicates.length);
        console.log('Has Duplicates:', hasDuplicates(uniqueArray, ['id',  "Num compte","AGE CREAT"]));

        for (const exelRow of uniqueArray) {
            if (!exelRow['Num compte'] || !exelRow['AGE CREAT'] || !exelRow['LIB Agence'] || !exelRow['Nat cpt'] || !exelRow['AGE CPT'] || !exelRow['Num compte'] || !exelRow['CLE'] || !exelRow['Chapitre'] || !exelRow['Intitule compte']) {
                console.warn('Ligne sautée à cause des valeurs manquantes ou invalides:', exelRow);
                continue;
            }

            // Gestion de la date de création
            let isoCreatedAt;
            const createdAtDate = new Date(exelRow['Date ouverture']);
            isoCreatedAt = isNaN(createdAtDate.getTime())
                ? new Date('01/01/2024').toISOString() // Date par défaut
                : createdAtDate.toISOString();

            // Vérifier si le matricule ou le numéro de compte existe déjà
            const existingCompte = await prisma.compteClients.findFirst({
                where: {
                    OR: [
                        // { matricule: String(exelRow.Immatriculation) },
                        { numero_compte: String(exelRow['Num compte']) }
                    ]
                }
            });
            if (existingCompte) {
                operations1.push(existingCompte)
                console.log(`Num compte ${exelRow['Num compte']} existe déjà, aucune action effectuée.`);
                continue;
            }

            // // Préparer l'opération de création
            operations.push(
                prisma.clients.create({
                    data:{
                        code:generateID(6),
                        intitule: exelRow['Intitule compte'],
                        // nature:"Morale",
                        comptes:{
                            create:{
                                chapitre:Number(exelRow['Chapitre']),
                                cle:Number(exelRow['CLE']),
                                libelleNatCompte:exelRow['Libelle nat cpte'],
                                natCompte:Number(exelRow['Nat cpt']),
                                numero_compte:exelRow['Num compte'],
                                created_at: new Date(exelRow['Date ouverture']),

                                agences:{
                                    connectOrCreate: {
                                        where: { ageCreat: Number(exelRow['AGE CREAT']) },
                                        create: {
                                            ageCreat: Number(exelRow['AGE CREAT']), 
                                            libAgence: exelRow['LIB Agence'] 
                                        }
                                    }
                                  
                                },
                                type_compte:{
                                    connectOrCreate: {
                                        where: { name: exelRow['Libelle nat cpte'] },
                                        create: { name: exelRow['Libelle nat cpte'] }
                                    }
                                },
                            }
                        }
                        // comptes:{
                        //     create:{
                        //         agences
                                    // agence:String(exelRow.AGENCE),
                                    // matricule: String(exelRow.Immatriculation),
                                    // code_gestionnaire: String(exelRow['CODE AGENCE']),
                        //             numero_compte: String(exelRow['Num compte']),
                        //             // annee: String(exelRow['ANNEE']),
                        //             created_at: isoCreatedAt,
                        //             type_compte: {
                        //                 connectOrCreate: {
                        //                     where: { name: exelRow['TYPE DE COMPTE'] },
                        //                     create: { name: exelRow['TYPE DE COMPTE'] }
                        //                 }
                        //             }
                        //     }

                        // }
                    }
                })
            );
        }

        // Exécuter toutes les opérations dans une transaction

        await prisma.$transaction(operations);
        console.log('Toutes les opérations ont été exécutées avec succès.',operations1.length);
    } catch (error) {
        console.error('Erreur lors de l\'insertion:', error);
        throw new Error('Échec de l\'insertion');
    }
};
