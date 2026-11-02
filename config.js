// ==========================================================================
// CONFIGURATION DE VOTRE INVITATION ROMANTIQUE
// ==========================================================================
// Numéro WhatsApp configuré : +237 6 55 75 20 04 (Format international : 237655752004)
// Vous pouvez également le modifier directement depuis le site en cliquant sur la roue ⚙️
// ==========================================================================

const APP_CONFIG = {
  // Votre numéro WhatsApp qui recevra les réponses :
  whatsappNumber: "237655752004",

  // Votre nom / signature (optionnel) :
  yourName: "",

  // Prénom suggéré par défaut (laisser vide pour lui laisser le champ libre) :
  defaultHerName: "",

  // Activer ou désactiver les sons doux (Web Audio) :
  enableAudio: true,

  // Titre du site dans l'onglet du navigateur :
  pageTitle: "Une invitation très spéciale pour toi… ❤️",

  // Message d'ambiance :
  tagline: "Un moment unique rien que pour nous deux"
};

// Exporter pour le script principal
if (typeof window !== "undefined") {
  window.APP_CONFIG = APP_CONFIG;
}
