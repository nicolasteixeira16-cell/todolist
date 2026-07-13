/**
 * @jest-environment jsdom
 */

require('jest');

let firstnameInput, error, form;


beforeEach(() => {

    // Réinitialise les modules avant chaque test
    jest.resetModules();


    // Nettoie le localStorage avant chaque test
    localStorage.clear();


    // Création d'un faux DOM comme dans index.html
    document.body.innerHTML = `

        <form id="userForm">

            <input id="firstname" type="text">

            <p id="error"></p>

            <button type="submit">
                Valider
            </button>

        </form>

    `;


    // Récupération des éléments HTML
    firstnameInput = document.getElementById("firstname");

    error = document.getElementById("error");

    form = document.getElementById("userForm");


    // Charge le fichier app.js
    require("../app.js");

});



test("affiche une erreur si le prénom est vide", () => {


    // Champ prénom vide
    firstnameInput.value = "";


    // Simulation de l'envoi du formulaire
    form.dispatchEvent(
        new Event("submit", { bubbles: true })
    );


    expect(error.textContent)
        .toBe("Veuillez saisir votre prénom");


    expect(localStorage.getItem("firstname"))
        .toBeNull();

});



test("enregistre le prénom dans localStorage si le prénom est valide", () => {


    firstnameInput.value = "Nicolas";


    form.dispatchEvent(
        new Event("submit", { bubbles: true })
    );


    expect(localStorage.getItem("firstname"))
        .toBe("Nicolas");


});