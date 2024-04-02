import React, { useState, useEffect, useRef } from 'react';

// Définition du composant Bureau
function Bureau({ type, nb_prises_reseau, nb_prises_secteur, nb_prises_tel, nb_chaises, nb_tables, nb_personnes }) {
    // Calcul de l'espace disponible
    const espacedispo = () => {
        if (type === "commercial") {
            return Math.min(
                Math.floor(nb_prises_reseau / 1),
                Math.floor(nb_prises_secteur / 1),
                Math.floor(nb_prises_tel / 2),
                Math.floor(nb_chaises / 2),
                Math.floor(nb_tables / 1)
            ) - nb_personnes;
        } else if (type === "developpeur") {
            return Math.min(
                Math.floor(nb_prises_reseau / 3),
                Math.floor(nb_prises_secteur / 3),
                Math.floor(nb_chaises / 1),
                Math.floor(nb_tables / 1)
            ) - nb_personnes;
        }
    }

    return (
        <div>
            <h2>{type === "commercial" ? "Bureau Commercial" : "Bureau Developpeur"}</h2>
            <p>Espace disponible: {espacedispo()}</p>
        </div>
    );
}

// Définition du composant Societe
function Societe() {
    const [bureaux, setBureaux] = useState([]);

    // Ajout de bureaux commerciaux
    useEffect(() => {
        const commercialBureaux = Array.from({ length: 3 }, () => ({
            type: "commercial", nb_prises_reseau: 10, nb_prises_secteur: 10, nb_prises_tel: 10, nb_chaises: 10, nb_tables: 10, nb_personnes: 0
        }));
        setBureaux(prevBureaux => [...prevBureaux, ...commercialBureaux]);
    }, []);

    // Ajout de bureaux développeurs
    useEffect(() => {
        const developpeurBureaux = Array.from({ length: 2 }, () => ({
            type: "developpeur", nb_prises_reseau: 10, nb_prises_secteur: 10, nb_prises_tel: 0, nb_chaises: 10, nb_tables: 10, nb_personnes: 0
        }));
        setBureaux(prevBureaux => [...prevBureaux, ...developpeurBureaux]);
    }, []);

    // Référence à la fonction espacedispo
    const espacedispoRef = useRef(() => {});

    // Fonction pour ajouter une personne à un bureau aléatoire
    const ajouterPersonne = () => {
        // Générer un type de bureau aléatoire
        const typeBureauAleatoire = Math.random() < 0.5 ? "commercial" : "developpeur";
        // Filtrer les bureaux selon le type choisi
        const bureauxDisponibles = bureaux.filter(bureau => bureau.type === typeBureauAleatoire && espacedispoRef.current(bureau) > 0);
        // S'il n'y a pas de bureaux disponibles, arrêter la fonction
        if (bureauxDisponibles.length === 0) return;
        // Choisir un bureau aléatoire parmi ceux disponibles
        const bureauChoisi = bureauxDisponibles[Math.floor(Math.random() * bureauxDisponibles.length)];
        // Incrémenter le nombre de personnes dans le bureau choisi
        bureauChoisi.nb_personnes++;
    }

    // Boucle d'ajout de personnel jusqu'à ce qu'il n'y ait plus d'espace disponible
    useEffect(() => {
        espacedispoRef.current = (bureau) => {
            if (bureau.type === "commercial") {
                return Math.min(
                    Math.floor(bureau.nb_prises_reseau / 1),
                    Math.floor(bureau.nb_prises_secteur / 1),
                    Math.floor(bureau.nb_prises_tel / 2),
                    Math.floor(bureau.nb_chaises / 2),
                    Math.floor(bureau.nb_tables / 1)
                ) - bureau.nb_personnes;
            } else if (bureau.type === "developpeur") {
                return Math.min(
                    Math.floor(bureau.nb_prises_reseau / 3),
                    Math.floor(bureau.nb_prises_secteur / 3),
                    Math.floor(bureau.nb_chaises / 1),
                    Math.floor(bureau.nb_tables / 1)
                ) - bureau.nb_personnes;
            }
        };

        const interval = setInterval(() => {
            ajouterPersonne();
            const espaceDispoSociete = bureaux.reduce((total, bureau) => {
                return total + espacedispoRef.current(bureau);
            }, 0);
            const nbCommerciaux = bureaux.filter(bureau => bureau.type === "commercial").reduce((total, bureau) => total + bureau.nb_personnes, 0);
            const nbDeveloppeurs = bureaux.filter(bureau => bureau.type === "developpeur").reduce((total, bureau) => total + bureau.nb_personnes, 0);
            console.log("Nombre de commerciaux:", nbCommerciaux);
            console.log("Nombre de développeurs:", nbDeveloppeurs);
            bureaux.forEach((bureau, index) => {
                console.log(`Espace dispo du bureau ${index + 1}:`, espacedispoRef.current(bureau));
            });
            console.log("Espace dispo dans la société:", espaceDispoSociete);
            console.log("------------------------------------");

            // Arrêter l'ajout de personnes si tous les espaces sont occupés
            if (espaceDispoSociete <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [bureaux]);

    return (
        <div>
            <h1>Societe</h1>
            {bureaux.map((bureau, index) => (
                <Bureau key={index} {...bureau} />
            ))}
        </div>
    );
}

export default Societe;