const translations = {
  en: {
    profile: "Profile",
    tasksLeft: "Tasks left",
    tasksDone: "Tasks done",
    settings: "Settings",
    changeAccountName: "Change Account Name",
    changeAccountPassword: "Change Account Password",
    changeAccountImage: "Change Account Image",
    changeAccountMail: "Change Account Mail",
    aboutUs: "About Us",
    helpFeedback: "Help & Feedback",
    supportUs: "Support Us",
    privacySecurity: "Privacy & Security",
    logout: "LogOut",
    account: "Account",
    appsettings: "App Settings",
    tasks: "Tasks",
    calendar: "Calendar",
    home: "Home",
    yearlycalendar: "Yearly Calendar",
    lytacyd: "List your tasks and Conquer your day",
    camic: "Click + and make it count!",
    tasklist: "Task List",
    login: "Login",
    signup: "Sign Up",
    username: "Username",
    password: "Password",
    email: "Email",
  },
  de: {
    profile: "Profil",
    tasksLeft: "Aufgaben übrig",
    tasksDone: "Aufgaben erledigt",
    settings: "Einstellungen",
    changeAccountName: "Kontonamen ändern",
    changeAccountPassword: "Kontopasswort ändern",
    changeAccountImage: "Konto-Bild ändern",
    changeAccountMail: "Kontomail ändern",
    aboutUs: "Über uns",
    helpFeedback: "Hilfe & Feedback",
    supportUs: "Unterstützen Sie uns",
    privacySecurity: "Datenschutz & Sicherheit",
    logout: "Abmelden",
    account: "Konto",
    appsettings: "App-Einstellungen",
    tasks: "Aufgaben",
    calendar: "Kalender",
    home: "Startseite",
    yearlycalendar: "Jahreskalender",
    lytacyd: "Listen Sie Ihre Aufgaben auf und Erobern Sie Ihren Tag",
    camic: "Klicken + und zähle!",
    tasklist: "Aufgabenliste",
    login: "Anmelden",
    signup: "Registrieren",
    
    
  },
  fr: {
    profile: "Profil",
    tasksLeft: "Tâches restantes",
    tasksDone: "Tâches terminées",
    settings: "Paramètres",
    changeAccountName: "Changer le nom du compte",
    changeAccountPassword: "Changer le mot de passe du compte",
    changeAccountImage: "Changer l'image du compte",
    changeAccountMail: "Changer le mail du compte",
    aboutUs: "À propos de nous",
    helpFeedback: "Aide & Retour",
    supportUs: "Soutenez-nous",
    privacySecurity: "Confidentialité & Sécurité",
    logout: "Se déconnecter",
    account: "Compte",
    appsettings: "Paramètres de l'application",
    tasks: "Tâches",
    calendar: "Calendrier",
    home: "Accueil",
    yearlycalendar: "Calendrier annuel",
    lytacyd: "Listez vos tâches et Conquérez votre journée",
    camic: "Cliquez + et comptez !",
    tasklist: "Liste des tâches",
    login: "Se connecter",
    signup: "S’inscrire",
    
   
  },
};

function updateLanguage(language) {
  const elements = {
    profile: document.querySelector(".profile"),
    tasksLeft: document.querySelector(".third .taskleft"),
    tasksDone: document.querySelector(".third .taskdone"),
    settings: document.querySelector(".fourth p"),
    changeAccountName: document.querySelector(".name .one span"),
    changeAccountPassword: document.querySelector(".password .one span"),
    changeAccountImage: document.querySelector(".image .one span"),
    changeAccountMail: document.querySelector(".mail .one span"),
    aboutUs: document.querySelector(".aboutus .one span"),
    helpFeedback: document.querySelector(".feedback .one span"),
    supportUs: document.querySelector(".support .one span"),
    privacySecurity: document.querySelector(".privacy .one span"),
    logout: document.querySelector(".logout .one span"),
    account:document.querySelector(".fifth p"),
    appsettings:document.querySelector(".apps"),
    tasks:document.querySelector(".tasks"),
    calendar:document.querySelector(".calendars"),
    home:document.querySelector(".home"),
    yearlycalendar:document.querySelector(".yc"),
    lytacyd:document.querySelector(".lytacyd"),
    camic:document.querySelector(".camic"),
    tasklist:document.querySelector(".tasklist"),
    login:document.querySelector(".login label"),
    signup:document.querySelector(".signup label"),
    
  };

  const translation = translations[language];
  for (const key in elements) {
    if (elements[key]) {
      elements[key].textContent = translation[key];
    }
  }
}

// Load the saved language on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedLanguage = localStorage.getItem("appLanguage") || "en";
  updateLanguage(savedLanguage);
});