if (typeof platApiUrl === 'undefined') {
    var platApiUrl = "http://127.0.0.1:8000/api/";
}

async function chargerPlats() {
    const response = await fetch(platApiUrl + "plats");
    const plats = await response.json();

    const mapping = {
        "Froides": "froides",
        "Chaudes": "chaudes",
        "Poissons et Crustaces": "poissons-et-crustaces",
        "Viandes et Gibiers": "viandes-et-gibiers",
    };

    let dessertCount = 0;

    plats.forEach(plat => {
        const allergenes = (plat.allergenes ?? [])
            .map(a => `<span class="badge-allergen">${a}</span>`)
            .join('');

        const html = `
            <div class="plat-row">
                <div>
                    <p class="plat-nom">${plat.nom} ${allergenes}</p>
                    <p class="plat-desc">${plat.description ?? ''}</p>
                </div>
                <span class="plat-prix">${plat.prix} EUR</span>
            </div>`;

        let conteneurId;

        if (plat.categorie === "desserts") {
            conteneurId = dessertCount % 2 === 0 ? "desserts-col1" : "desserts-col2";
            dessertCount++;
        } else {
            conteneurId = mapping[plat.sousCategorie] ?? plat.categorie;
        }

        const conteneur = document.getElementById(conteneurId);
        if (conteneur) conteneur.insertAdjacentHTML('beforeend', html);
    });
}

chargerPlats();