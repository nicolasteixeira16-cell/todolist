// Récupère dans le HTML le formulaire ayant l'identifiant "userForm"
// Cela permet de pouvoir écouter l'envoi du formulaire
const form = document.getElementById("userForm");

// Récupère le champ de saisie du prénom ayant l'identifiant "firstname"
// On pourra ainsi récupérer la valeur entrée par l'utilisateur
const firstnameInput = document.getElementById("firstname");

// Récupère l'élément HTML qui servira à afficher les messages d'erreur
// Par exemple, si l'utilisateur ne renseigne pas son prénom
const error = document.getElementById("error");

// Ajoute un événement "submit" sur le formulaire
// Cette fonction sera exécutée lorsque l'utilisateur clique sur le bouton de validation
form.addEventListener("submit", (event) => {

    // Empêche le comportement par défaut du formulaire
    // Sans cette ligne, la page serait rechargée après l'envoi du formulaire
    event.preventDefault();
    
    // Récupère la valeur saisie dans le champ prénom
    // trim() supprime les espaces inutiles avant et après le texte
    // Exemple : "   Paul   " devient "Paul"
    const firstname = firstnameInput.value.trim();

    // Vérifie si le champ prénom est vide après suppression des espaces
    if (firstname === "") {
        
        // Affiche un message d'erreur dans l'élément HTML prévu à cet effet
        error.textContent = "Veuillez saisir votre prénom";
        
        // Arrête l'exécution de la fonction ici
        // Le reste du code ne sera pas exécuté tant que le prénom n'est pas renseigné
        return;
    }

    // Stocke le prénom dans le LocalStorage du navigateur
    // La donnée sera conservée même si l'utilisateur ferme la page
    // Ici :
    // - "firstname" est le nom de la clé
    // - firstname est la valeur enregistrée
    localStorage.setItem("firstname", firstname);
    
    // Redirige l'utilisateur vers la page tasks.html
    // Cette page correspond généralement à la liste des tâches dans une Todo List
    window.location.href = "tasks.html";
});