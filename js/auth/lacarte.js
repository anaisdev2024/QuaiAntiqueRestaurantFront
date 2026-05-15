const apiUrl = "http://127.0.0.1:8000/api/";

async function chargerPlats() {
    const response = await fetch(apiUrl + "plats");
    const plats = await response.json();

    // Vider les conteneurs existants
    document.querySelectorAll('[id^="tab-"]').forEach(el => {
        // garde les titres, supprime les plat-row
        el.querySelectorAll('.plat-row').forEach(r => r.remove());
    });

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

        // Trouver le bon conteneur selon catégorie + sousCategorie
        const sousId = plat.sousCategorie
            ? plat.sousCategorie.toLowerCase().replace(/\s+/g, '-').replace(/[éè]/g, 'e')
            : plat.categorie;

        const conteneur = document.getElementById(sousId) 
            ?? document.getElementById(plat.categorie);

        if (conteneur) conteneur.insertAdjacentHTML('beforeend', html);
    });
}

document.addEventListener('DOMContentLoaded', chargerPlats);