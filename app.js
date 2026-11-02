/* ==========================================================================
   APP.JS — EXPÉRIENCE ROMANTIQUE & INVITATION 100% CAMEROUNAISE 🇨🇲❤️
   Auteur : Antigravity UI/UX Senior Full-Stack
   ========================================================================== */

(function () {
  'use strict';

  // ==========================================================================
  // ÉTAT GLOBAL DE L'APPLICATION
  // ==========================================================================
  const state = {
    herName: '',
    city: 'Yaoundé',
    placeId: '',
    placeTitle: '',
    customPlace: '',
    foods: new Set(),
    customFood: '',
    drinks: new Set(),
    customDrink: '',
    extras: new Set(),
    moment: 'Soirée',
    date: '',
    time: '18:30',
    customNote: '',
    quizAnswers: {},
    singleSurpriseOpened: false,
    unlockedSurprises: new Set(),
    confidences: {},
    currentStepId: 'step-1',
    escapeCount: 0,
    soundEnabled: true,
    musicPlaying: false,
    musicVolume: 0.3,
    complimentIdx: 0,
    generatedProposal: null,
    whatsappNumber: (window.APP_CONFIG && window.APP_CONFIG.whatsappNumber) || '237655752004'
  };

  // 22 Compliments doux, drôles, chaleureux et raffinés
  const complimentsList = [
    "Ton sourire mérite probablement son propre réseau social.",
    "Je pense que même Google aurait du mal à trouver quelqu'un comme toi.",
    "Tu as quelque chose de spécial, et je ne parle pas de ton Wi-Fi. 😂",
    "Certaines rencontres méritent qu'on prenne le temps de les découvrir.",
    "Si la gentillesse était une matière à la fac, tu aurais 20/20 avec mention.",
    "Tu as cette énergie rare qui rend n'importe quelle journée plus lumineuse.",
    "Même le café le plus fort ne réveille pas autant que de croiser ton regard.",
    "Il y a des gens qu'on croise et d'autres qu'on a envie de connaître pour de vrai.",
    "Ton rire devrait être remboursé par la sécurité sociale tellement il fait du bien.",
    "Tu as un charme naturel, sans filtre et sans aucun effort.",
    "Je me demande souvent comment tu fais pour être aussi captivante sans même essayer.",
    "La faculté a beaucoup plus de style depuis que tu y passes.",
    "Tu es le genre de personne avec qui 5 minutes de discussion passent comme 2 secondes.",
    "Si la beauté était un délit, tu passerais en comparution immédiate. 😇",
    "Tu as une façon d'être qui donne immédiatement envie d'en savoir plus sur toi.",
    "Si j'avais un vœu pour cette semaine, ce serait simplement de partager un fou rire avec toi.",
    "Tu as cette étincelle dans les yeux qui ne s'invente pas.",
    "On ne se connaît pas encore beaucoup, mais mon intuition ne se trompe jamais sur les personnes rares.",
    "Passer du temps avec toi promet d'être le meilleur moment de ma semaine.",
    "Tu es la preuve vivante qu'il existe encore des personnes exceptionnelles.",
    "Tu as ce petit truc en plus qui fait toute la différence. ✨",
    "Promis, je serai sage… mais je ne garantis rien si tu me souris comme ça ! 😉"
  ];

  // Messages taquins camerounais lorsque le bouton "Non" s'enfuit
  const escapeMessages = [
    "Oups, le bouton a glissé ! 🙈",
    "Le ndolé n'attend pas, dis oui ! 😋❤️",
    "Tu veux esquiver comme ça ? Impossible au Mboa ! 🇨🇲",
    "Erreur 404 : Le 'Non' est introuvable au Cameroun ❤️",
    "Même les gars de Bonanjo n'ont jamais vu ce bouton marcher 😂",
    "Allez, dis oui… tu vas voir comment la suite est chic ✨",
    "Ce bouton fuit plus vite qu'un bend-skin à l'heure de pointe ! 🏍️💨",
    "Regarde le bouton 'Oui', il brille rien que pour toi ! 🌟",
    "Impossible de refuser, c'est l'affaire de cœur ! 😌❤️",
    "Tu as déjà vu quelqu'un refuser du poisson braisé ? Jamais ! 😉"
  ];

  // ==========================================================================
  // BASE DE DONNÉES DES LIEUX PAR VILLE CAMEROUNAISE 🇨🇲
  // ==========================================================================
  const placesDatabase = {
    'Yaoundé': [
      {
        id: 'bois-sainte-anastasie',
        title: 'Bois Sainte Anastasie',
        badge: '🌳 Havre de verdure',
        desc: 'Allées boisées ombragées, fleurs tropicales et bancs intimes pour discuter en toute sérénité.',
        img: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'lac-municipal-yde',
        title: 'Lac municipal',
        badge: '🌊 Balade paisible',
        desc: 'Promenade apaisante au bord de l’eau au cœur de Yaoundé, idéale pour une marche complice.',
        img: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'mont-febe',
        title: 'Mont Fébé',
        badge: '⛰️ Vue panoramique',
        desc: 'Vue majestueuse dominant les 7 collines de Yaoundé, air frais et coucher de soleil féerique.',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'centre-ville-yde',
        title: 'Centre-ville chic',
        badge: '✨ Ambiance urbaine',
        desc: 'Café moderne, lumières scintillantes et atmosphère vibrante de la capitale politique.',
        img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'restaurant-chic-yde',
        title: 'Restaurant chic',
        badge: '🍷 Dîner raffiné',
        desc: 'Cadre feutré, lumières tamisées, plats succulents et service attentif pour marquer le coup.',
        img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'terrasse-romantique-yde',
        title: 'Terrasse romantique',
        badge: '🍸 Sous les étoiles',
        desc: 'Rooftop intime avec vue dégagée, cocktails doux et musique d’ambiance feutrée.',
        img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'autre',
        title: 'Je choisis mon propre endroit',
        badge: '✨ Ton choix',
        desc: 'Dis-moi ton endroit coup de cœur ou un lieu secret que tu rêves de me faire découvrir !',
        img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80'
      }
    ],

    'Douala': [
      {
        id: 'bonanjo',
        title: 'Bonanjo',
        badge: '🏛️ Quartier historique',
        desc: 'Rues calmes bordées de palmiers centenaires, terrasses discrètes et charme colonial intemporel.',
        img: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'bonapriso',
        title: 'Bonapriso',
        badge: '🍸 Chic & branché',
        desc: 'Les plus beaux lounges, restaurants élégants et terrasses cosy pour une soirée tout en style.',
        img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'jardin-botanique-dla',
        title: 'Jardin botanique',
        badge: '🌿 Oasis tropicale',
        desc: 'Un coin de nature préservé en pleine capitale économique pour se couper du bruit du monde.',
        img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'resto-terrasse-dla',
        title: 'Restaurant avec terrasse',
        badge: '🍽️ En plein air',
        desc: 'Dîner savoureux sous la brise nocturne avec des saveurs d’ici et d’ailleurs.',
        img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'bord-de-mer-dla',
        title: 'Bord de mer / Fleuve Wouri',
        badge: '🌊 Brise marine',
        desc: 'Coucher de soleil doré sur l’eau, vue panoramique et atmosphère romantique garantie.',
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'lounge-romantique-dla',
        title: 'Lounge romantique',
        badge: '🎶 Musique feutrée',
        desc: 'Fauteuils confortables, lumières douces et verres partagés pour briser la glace avec le sourire.',
        img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'autre',
        title: 'Je choisis mon propre endroit',
        badge: '✨ Ton choix',
        desc: 'Propose ton resto ou lounge préféré à Douala !',
        img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80'
      }
    ],

    'Kribi': [
      {
        id: 'plage-kribi',
        title: 'Plage de Kribi',
        badge: '🏖️ Paradis doré',
        desc: 'Sable blanc fin, cocotiers ondulants et clapotis des vagues de l’océan Atlantique.',
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'chutes-lobe',
        title: 'Chutes de la Lobé',
        badge: '🌊 Merveille du monde',
        desc: 'L’un des rares fleuves au monde se jetant directement dans l’océan en cascades spectaculaires.',
        img: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'resto-bord-mer-kribi',
        title: 'Restaurant en bord de mer',
        badge: '🦞 Pieds dans le sable',
        desc: 'Poisson braisé frais du jour et crevettes géantes dégustés au son des vagues.',
        img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'coucher-soleil-kribi',
        title: 'Promenade au coucher du soleil',
        badge: '🌅 Horizon flamboyant',
        desc: 'Marcher pieds nus sur le sable chaud pendant que le ciel s’embrase de pourpre et d’or.',
        img: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'autre',
        title: 'Je choisis mon propre endroit',
        badge: '✨ Ton choix',
        desc: 'Ton spot préféré à Kribi pour un moment inoubliable.',
        img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80'
      }
    ],

    'Limbe': [
      {
        id: 'jardin-botanique-limbe',
        title: 'Jardin botanique',
        badge: '🌺 Paradis vert',
        desc: 'Arbres séculaires, fleurs exotiques et allées ombragées au micro-climat océanique délicieux.',
        img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'plage-limbe',
        title: 'Plage de Limbe',
        badge: '🌋 Sable noir volcanique',
        desc: 'Une plage singulière de sable volcanique noir caressée par la brise atlantique.',
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'resto-vue-mer-limbe',
        title: 'Restaurant avec vue sur la mer',
        badge: '🐟 Saveurs côtières',
        desc: 'Délicieux poissons braisés de l’Atlantique avec une vue imprenable sur l’horizon marin.',
        img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'autre',
        title: 'Je choisis mon propre endroit',
        badge: '✨ Ton choix',
        desc: 'Un lieu secret que tu connais à Limbe.',
        img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80'
      }
    ],

    'Bafoussam': [
      {
        id: 'collines-bafoussam',
        title: 'Belvédère des collines',
        badge: '⛰️ Hauts plateaux',
        desc: 'Fraîcheur vivifiante et panorama à couper le souffle sur le pays Bamiléké.',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'resto-chic-bafoussam',
        title: 'Restaurant gastronomique de l’Ouest',
        badge: '🍲 Délices locaux',
        desc: 'Taro sauce jaune, koki doré et viandes braisées savoureuses dans un cadre très soigné.',
        img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'terrasse-bafoussam',
        title: 'Terrasse lounge feutrée',
        badge: '✨ Détente étoilée',
        desc: 'Ambiance intime et chaleureuse pour papoter tranquillement sous le ciel de l’Ouest.',
        img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'autre',
        title: 'Je choisis mon propre endroit',
        badge: '✨ Ton choix',
        desc: 'Propose ton lieu fétiche à Bafoussam.',
        img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80'
      }
    ],

    'Buea': [
      {
        id: 'pied-mont-cameroun',
        title: 'Au pied du Mont Cameroun',
        badge: '🌋 Air pur & brume',
        desc: 'Atmosphère romantique et fraîcheur des hauteurs avec le majestueux Mont Fako en toile de fond.',
        img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'tea-estate-buea',
        title: 'Tea Estate (Champs de thé)',
        badge: '🌿 Vagues vertes',
        desc: 'Promenade féerique au milieu des plantations de thé verdoyantes à perte de vue.',
        img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'cafe-cosy-buea',
        title: 'Café montagnard cosy',
        badge: '☕ Chaleur & douceur',
        desc: 'Boissons chaudes, pâtisseries gourmandes et discussions passionnées au coin du feu.',
        img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'autre',
        title: 'Je choisis mon propre endroit',
        badge: '✨ Ton choix',
        desc: 'Ton endroit préféré à Buea.',
        img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80'
      }
    ],

    'Bamenda': [
      {
        id: 'falaise-bamenda',
        title: 'Falaise d’Up-Station',
        badge: '⛰️ Panorama d’exception',
        desc: 'Vue plongeante spectaculaire sur toute la cuvette de Bamenda et ses collines verdoyantes.',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'jardin-terrasse-bamenda',
        title: 'Jardin & terrasse calme',
        badge: '🌿 Pause discrète',
        desc: 'Ambiance reposante et cadre verdoyant pour partager un bon moment en toute tranquillité.',
        img: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'autre',
        title: 'Je choisis mon propre endroit',
        badge: '✨ Ton choix',
        desc: 'Ton lieu favori à Bamenda.',
        img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80'
      }
    ],

    'Dschang': [
      {
        id: 'lac-dschang',
        title: 'Lac municipal de Dschang',
        badge: '🛶 Promenade romantique',
        desc: 'Balade en pédalo, allées paisibles et fraîcheur d’altitude réputée.',
        img: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'musee-dschang',
        title: 'Jardins du Musée des Civilisations',
        badge: '🏛️ Charme culturel',
        desc: 'Cadre fleuri et élégant, parfait pour une balade complice et des souvenirs mémorables.',
        img: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'autre',
        title: 'Je choisis mon propre endroit',
        badge: '✨ Ton choix',
        desc: 'Ton adresse secrète à Dschang.',
        img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80'
      }
    ],

    'Garoua': [
      {
        id: 'benoue-garoua',
        title: 'Rives de la Bénoué',
        badge: '🌅 Coucher de soleil sahélien',
        desc: 'Lumières dorées éclatantes sur l’eau du fleuve au crépuscule.',
        img: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'terrasse-garoua',
        title: 'Terrasse sous les étoiles sahéliennes',
        badge: '✨ Ciel scintillant',
        desc: 'Fraîcheur nocturne bienvenue et accueil chaleureux légendaire du Grand Nord.',
        img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'autre',
        title: 'Je choisis mon propre endroit',
        badge: '✨ Ton choix',
        desc: 'Ton lieu de prédilection à Garoua.',
        img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80'
      }
    ],

    'Maroua': [
      {
        id: 'colline-maroua',
        title: 'Colline de Maroua',
        badge: '⛰️ Panorama féerique',
        desc: 'Vue à 360 degrés sur toute la ville aux couleurs ocre du soleil couchant.',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'oasis-maroua',
        title: 'Jardin ombragé & artisanat',
        badge: '🌴 Douceur sahélienne',
        desc: 'Havre de paix fleuri sous les neemiers pour discuter à l’abri de la chaleur.',
        img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'autre',
        title: 'Je choisis mon propre endroit',
        badge: '✨ Ton choix',
        desc: 'Un lieu secret que tu aimes à Maroua.',
        img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80'
      }
    ],

    'Autre ville': [
      {
        id: 'resto-chic-autre',
        title: 'Restaurant chic & soigné',
        badge: '🍷 Belle table',
        desc: 'Une table réservée dans un restaurant accueillant et gourmand.',
        img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'terrasse-vue-autre',
        title: 'Terrasse romantique en plein air',
        badge: '✨ Cadre aéré',
        desc: 'Une terrasse agréable pour profiter de la soirée et de notre compagnie.',
        img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'jardin-parc-autre',
        title: 'Jardin paisible pour une promenade',
        badge: '🌿 Balade douce',
        desc: 'Marcher tranquillement et apprendre à se connaître sans artifice.',
        img: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'autre',
        title: 'Je choisis mon propre endroit',
        badge: '✨ Ton choix',
        desc: 'Dis-moi précisément quel endroit tu as en tête.',
        img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80'
      }
    ]
  };

  // ==========================================================================
  // SYSTÈME AUDIO & SONS DOUX (Web Audio API)
  // ==========================================================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, duration, type = 'sine', gainVal = 0.15) {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio playTone error", e);
    }
  }

  function playChime() {
    playTone(523.25, 0.25, 'triangle', 0.12);
    setTimeout(() => playTone(659.25, 0.35, 'sine', 0.1), 110);
  }

  function playEscapeSound() {
    playTone(320, 0.1, 'sine', 0.15);
    setTimeout(() => playTone(480, 0.15, 'triangle', 0.12), 60);
  }

  function playCelebrationFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, 0.45, 'sine', 0.16);
      }, idx * 110);
    });
  }

  // ==========================================================================
  // LECTEUR MUSICAL DISCRET (Synthèse Lo-Fi / Piano Romantique Doux)
  // ==========================================================================
  let musicMasterGain = null;
  let musicInterval = null;

  const romanticChords = [
    [174.61, 261.63, 329.63, 392.00, 440.00], // Fmaj9
    [146.83, 220.00, 261.63, 329.63, 349.23], // Dmin9
    [116.54, 174.61, 220.00, 293.66, 349.23], // Bbmaj7
    [130.81, 196.00, 246.94, 293.66, 392.00]  // C9
  ];

  let chordIndex = 0;

  function startMusicLoop() {
    if (!audioCtx) initAudio();
    if (!audioCtx) return;

    if (!musicMasterGain) {
      musicMasterGain = audioCtx.createGain();
      musicMasterGain.gain.setValueAtTime(state.musicVolume, audioCtx.currentTime);
      musicMasterGain.connect(audioCtx.destination);
    }

    function playArpeggio() {
      if (!state.musicPlaying) return;
      const currentChord = romanticChords[chordIndex % romanticChords.length];
      chordIndex++;

      currentChord.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, audioCtx.currentTime);

        const startTime = audioCtx.currentTime + i * 0.45;
        const dur = 2.4;

        noteGain.gain.setValueAtTime(0.001, startTime);
        noteGain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.12);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(musicMasterGain);

        osc.start(startTime);
        osc.stop(startTime + dur);
      });
    }

    playArpeggio();
    musicInterval = setInterval(() => {
      if (state.musicPlaying) {
        playArpeggio();
      }
    }, 2400);
  }

  function stopMusicLoop() {
    if (musicInterval) {
      clearInterval(musicInterval);
      musicInterval = null;
    }
  }

  function setupMusicPlayer() {
    const toggleBtn = document.getElementById('music-toggle-btn');
    const volumeSlider = document.getElementById('music-volume');
    const musicIcon = document.getElementById('music-icon');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        initAudio();
        state.musicPlaying = !state.musicPlaying;

        if (state.musicPlaying) {
          toggleBtn.classList.add('playing');
          if (musicIcon) musicIcon.textContent = '⏸️';
          startMusicLoop();
        } else {
          toggleBtn.classList.remove('playing');
          if (musicIcon) musicIcon.textContent = '🎵';
          stopMusicLoop();
        }
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        state.musicVolume = parseFloat(e.target.value);
        if (musicMasterGain && audioCtx) {
          musicMasterGain.gain.setValueAtTime(state.musicVolume, audioCtx.currentTime);
        }
      });
    }
  }

  // ==========================================================================
  // DOSE DE COMPLIMENTS (MODALE & PARCOURS)
  // ==========================================================================
  function setupCompliments() {
    const openBtn = document.getElementById('open-compliments-btn');
    const modal = document.getElementById('compliments-modal');
    const closeBtn = document.getElementById('close-compliments-btn');
    const closeSubBtn = document.getElementById('btn-close-compliments-sub');
    const nextBtn = document.getElementById('btn-next-compliment');
    const displayEl = document.getElementById('compliment-text-display');
    const counterEl = document.getElementById('compliment-counter-text');

    function renderCompliment() {
      if (!displayEl) return;
      let text = complimentsList[state.complimentIdx % complimentsList.length];
      if (state.herName) {
        text = text.replace(/\[Prénom\]/g, state.herName);
      } else {
        text = text.replace(/\[Prénom\]/g, '');
      }
      displayEl.textContent = `« ${text} »`;
      if (counterEl) {
        counterEl.textContent = `Compliment ${(state.complimentIdx % complimentsList.length) + 1} sur ${complimentsList.length}`;
      }
      playTone(580, 0.15, 'sine', 0.08);
    }

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        renderCompliment();
        modal.classList.add('show');
      });
    }

    const closeModal = () => {
      if (modal) modal.classList.remove('show');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeSubBtn) closeSubBtn.addEventListener('click', closeModal);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        state.complimentIdx++;
        renderCompliment();
        fireRomanticConfetti(35);
      });
    }
  }

  // ==========================================================================
  // CANVAS AMBIENT (Cœurs & Étincelles Flottants)
  // ==========================================================================
  function initAmbientCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class HeartParticle {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 20;
        this.size = Math.random() * 14 + 10;
        this.speedY = Math.random() * 0.75 + 0.35;
        this.speedX = (Math.random() - 0.5) * 0.45;
        this.opacity = Math.random() * 0.35 + 0.12;
        this.rotation = Math.random() * Math.PI;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
        this.isSparkle = Math.random() > 0.65;
      }
      update() {
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.3;
        this.rotation += this.rotSpeed;
        if (this.y < -30) {
          this.reset(false);
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        if (this.isSparkle) {
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.25, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#E11D48';
          const s = this.size;
          ctx.beginPath();
          ctx.moveTo(0, s * 0.3);
          ctx.bezierCurveTo(-s * 0.5, -s * 0.3, -s, s * 0.1, 0, s);
          ctx.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.3, 0, s * 0.3);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    const count = Math.min(26, Math.floor(window.innerWidth / 32));
    for (let i = 0; i < count; i++) {
      particles.push(new HeartParticle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let p of particles) {
        p.update();
        p.draw();
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ==========================================================================
  // CONFETTI ROMANTIQUE
  // ==========================================================================
  function fireRomanticConfetti(customCount = 180) {
    if (typeof confetti !== 'function') return;

    confetti({
      particleCount: customCount,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#E11D48', '#BE123C', '#F43F5E', '#FECDD3', '#F59E0B', '#007A5E', '#FCD116']
    });
  }

  // ==========================================================================
  // GESTIONNAIRE D'ÉTAPES & PROGRESSION
  // ==========================================================================
  const stepsMetadata = {
    'step-1': { title: 'Bienvenue', percent: 10 },
    'step-secret-message': { title: 'Message secret', percent: 20 },
    'step-2': { title: 'La Question', percent: 35 },
    'step-quiz': { title: 'Test complice', percent: 45 },
    'step-3': { title: 'Le Lieu 🇨🇲', percent: 60 },
    'step-4': { title: 'Le Menu & Boissons', percent: 75 },
    'step-surprises': { title: 'Ta Surprise 🎁', percent: 85 },
    'step-5': { title: 'Ambiance & Mood', percent: 90 },
    'step-confidences': { title: 'Confidences', percent: 94 },
    'step-letter': { title: 'Mots Doux', percent: 97 },
    'step-6': { title: 'L’Invitation', percent: 100 }
  };

  function goToStep(stepId) {
    const prevEl = document.getElementById(state.currentStepId);
    const nextEl = document.getElementById(stepId);

    if (prevEl) prevEl.classList.remove('active');

    state.currentStepId = stepId;

    if (nextEl) {
      nextEl.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateProgress();
    playChime();
  }

  function updateProgress() {
    const progressContainer = document.getElementById('progress-container');
    const fillEl = document.getElementById('progress-fill');
    const stepTextEl = document.getElementById('progress-step-text');
    const badgeEl = document.getElementById('progress-percent-badge');

    if (state.currentStepId === 'step-1') {
      if (progressContainer) progressContainer.style.display = 'none';
      return;
    }

    if (progressContainer) progressContainer.style.display = 'block';

    const info = stepsMetadata[state.currentStepId] || { title: '', percent: 100 };
    if (fillEl) fillEl.style.width = `${info.percent}%`;
    if (stepTextEl) stepTextEl.textContent = info.title;
    if (badgeEl) badgeEl.textContent = `${info.percent}%`;
  }

  // ==========================================================================
  // ÉTAPE 1 : PREMIÈRE PAGE — PRÉNOM
  // ==========================================================================
  function submitName() {
    const input = document.getElementById('her-name-input');
    if (!input) return;

    let val = input.value.trim();
    if (!val) {
      input.focus();
      return;
    }

    val = val.charAt(0).toUpperCase() + val.slice(1);
    state.herName = val;

    document.querySelectorAll('.user-name-target').forEach(el => {
      el.textContent = val;
    });

    goToStep('step-secret-message');
  }

  // ==========================================================================
  // ÉTAPE 1-B : MESSAGE SECRET PERSONNALISÉ
  // ==========================================================================
  function setupSecretEnvelope() {
    const trigger = document.getElementById('secret-envelope-trigger');
    const envelopeEl = document.getElementById('secret-envelope-el');
    const hint = document.getElementById('envelope-click-hint');
    const btnOpen = document.getElementById('btn-open-envelope');

    if (!trigger || !envelopeEl) return;

    trigger.addEventListener('click', () => {
      if (!envelopeEl.classList.contains('opened')) {
        envelopeEl.classList.add('opened');
        if (hint) hint.style.display = 'none';
        if (btnOpen) btnOpen.style.display = 'inline-flex';

        playCelebrationFanfare();
        fireRomanticConfetti(60);
      }
    });

    if (btnOpen) {
      btnOpen.addEventListener('click', () => {
        goToStep('step-2');
      });
    }
  }

  // ==========================================================================
  // ÉTAPE 2 : LA QUESTION (OUI / NON FUGITIF AUX COULEURS DU MBOA)
  // ==========================================================================
  function setupEvasiveButton() {
    const btnNo = document.getElementById('btn-no');
    const arena = document.getElementById('arena-actions');
    const toast = document.getElementById('escape-toast');

    if (!btnNo || !arena) return;
    let toastTimeout = null;

    function showToast() {
      if (!toast) return;
      const msg = escapeMessages[state.escapeCount % escapeMessages.length];
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 2000);
    }

    function dodge(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      state.escapeCount++;
      playEscapeSound();
      showToast();

      const maxRangeX = Math.min(160, window.innerWidth * 0.35);
      const maxRangeY = 60;
      const angle = Math.random() * Math.PI * 2;
      const distanceX = (Math.cos(angle) * maxRangeX) * (Math.random() * 0.5 + 0.6);
      const distanceY = (Math.sin(angle) * maxRangeY) * (Math.random() * 0.5 + 0.6);

      btnNo.style.transform = `translate(${distanceX}px, ${distanceY}px)`;
    }

    btnNo.addEventListener('mouseenter', dodge);
    btnNo.addEventListener('mouseover', dodge);
    btnNo.addEventListener('touchstart', dodge, { passive: false });
    btnNo.addEventListener('pointerdown', dodge, { passive: false });
    btnNo.addEventListener('click', dodge);
  }

  function onYesClicked() {
    playCelebrationFanfare();
    fireRomanticConfetti(150);

    const overlay = document.getElementById('celebration-overlay');
    if (overlay) overlay.classList.add('show');

    setTimeout(() => {
      if (overlay) overlay.classList.remove('show');
      goToStep('step-quiz');
    }, 2200);
  }

  // ==========================================================================
  // ÉTAPE 2-B : MINI-JEU — TEST DE COMPATIBILITÉ
  // ==========================================================================
  function setupQuiz() {
    const quizBoxes = document.querySelectorAll('.quiz-question-box');
    const resultCard = document.getElementById('quiz-result-card');
    const btnContinue = document.getElementById('btn-continue-quiz');
    const btnSkip = document.getElementById('btn-skip-quiz');

    quizBoxes.forEach(box => {
      const qNum = box.getAttribute('data-q');
      const buttons = box.querySelectorAll('.quiz-option-btn');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          state.quizAnswers[qNum] = btn.getAttribute('data-val');

          playTone(600, 0.1, 'sine', 0.08);

          if (Object.keys(state.quizAnswers).length >= 5) {
            if (resultCard) resultCard.style.display = 'block';
            if (btnContinue) btnContinue.disabled = false;
            fireRomanticConfetti(70);
            playCelebrationFanfare();
          }
        });
      });
    });

    if (btnSkip) {
      btnSkip.addEventListener('click', () => goToStep('step-3'));
    }

    if (btnContinue) {
      btnContinue.addEventListener('click', () => goToStep('step-3'));
    }
  }

  // ==========================================================================
  // ÉTAPE 3 : LIEU DU RENDEZ-VOUS & GÉNÉRATEUR « ORGANISE NOTRE DATE 🇨🇲 »
  // ==========================================================================
  function setupPlaces() {
    const tabAuto = document.getElementById('tab-mode-auto');
    const tabManual = document.getElementById('tab-mode-manual');
    const viewAuto = document.getElementById('view-mode-auto');
    const viewManual = document.getElementById('view-mode-manual');

    const cityPills = document.querySelectorAll('.city-pill');
    const currentCityLabel = document.getElementById('current-city-label');
    const placesGrid = document.getElementById('places-grid');
    const customPlaceBox = document.getElementById('custom-place-box');
    const customPlaceInput = document.getElementById('custom-place-input');

    const btnRunGen = document.getElementById('btn-run-generator');
    const btnRegen = document.getElementById('btn-regen-proposal');
    const btnApply = document.getElementById('btn-apply-proposal');

    const btnContinue = document.getElementById('btn-continue-step-3');
    const btnBack = document.getElementById('btn-back-step-3');

    // 1. Toggle Mode Automatique vs Mode Manuel
    if (tabAuto && tabManual && viewAuto && viewManual) {
      tabAuto.addEventListener('click', () => {
        tabAuto.classList.add('active');
        tabManual.classList.remove('active');
        viewAuto.style.display = 'block';
        viewManual.style.display = 'none';
        playTone(620, 0.1, 'sine', 0.06);
      });

      tabManual.addEventListener('click', () => {
        tabManual.classList.add('active');
        tabAuto.classList.remove('active');
        viewManual.style.display = 'block';
        viewAuto.style.display = 'none';
        renderPlacesForCity(state.city);
        playTone(620, 0.1, 'sine', 0.06);
      });
    }

    // 2. Rendu dynamique des lieux pour la ville sélectionnée
    function renderPlacesForCity(cityName) {
      state.city = cityName;
      if (currentCityLabel) currentCityLabel.textContent = cityName;

      if (!placesGrid) return;
      placesGrid.innerHTML = '';

      const places = placesDatabase[cityName] || placesDatabase['Yaoundé'];

      places.forEach(p => {
        const card = document.createElement('div');
        card.className = 'choice-card';
        card.setAttribute('data-id', p.id);
        card.setAttribute('data-title', p.title);

        if (state.placeId === p.id) {
          card.classList.add('selected');
        }

        card.innerHTML = `
          <div class="choice-card-img-wrap">
            <img src="${p.img}" alt="${p.title}" class="choice-card-img" loading="lazy">
            <span class="choice-card-badge">${p.badge}</span>
            <span class="choice-card-check">✓</span>
          </div>
          <div class="choice-card-body">
            <div class="choice-card-title">${p.title}</div>
            <div class="choice-card-desc">${p.desc}</div>
          </div>
        `;

        card.addEventListener('click', () => {
          placesGrid.querySelectorAll('.choice-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');

          state.placeId = p.id;
          state.placeTitle = p.title;

          if (p.id === 'autre') {
            if (customPlaceBox) customPlaceBox.classList.add('show');
            if (customPlaceInput) customPlaceInput.focus();
          } else {
            if (customPlaceBox) customPlaceBox.classList.remove('show');
          }

          if (btnContinue) btnContinue.disabled = false;
          playTone(660, 0.12, 'sine', 0.08);
        });

        placesGrid.appendChild(card);
      });
    }

    // 3. Clic sur les pilules de villes
    cityPills.forEach(pill => {
      pill.addEventListener('click', () => {
        cityPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const cityName = pill.getAttribute('data-city');
        renderPlacesForCity(cityName);

        // Mettre à jour aussi le sélecteur du générateur pour garder la cohérence
        const genCitySelect = document.getElementById('gen-city');
        if (genCitySelect) genCitySelect.value = cityName;

        playTone(550, 0.1, 'sine', 0.08);
      });
    });

    if (customPlaceInput) {
      customPlaceInput.addEventListener('input', () => {
        state.customPlace = customPlaceInput.value.trim();
        if (btnContinue && state.customPlace.length > 0) {
          btnContinue.disabled = false;
        }
      });
    }

    // Rendu initial des lieux à Yaoundé
    renderPlacesForCity('Yaoundé');

    // 4. MOTEUR DU GÉNÉRATEUR « ORGANISE NOTRE DATE 🇨🇲 »
    function generateDateProposal() {
      const city = document.getElementById('gen-city')?.value || 'Yaoundé';
      const style = document.getElementById('gen-style')?.value || 'Dîner intime';
      const mood = document.getElementById('gen-mood')?.value || 'Romantique';
      const moment = document.getElementById('gen-moment')?.value || 'Soirée';

      // Suggestions adaptées intelligentes
      const placeSuggestions = {
        'Yaoundé': [
          "Terrasse panoramique du Mont Fébé avec vue scintillante",
          "Bois Sainte Anastasie et balade fleurie intime",
          "Table feutrée dans un restaurant chic du centre-ville",
          "Lac municipal pour une promenade douce au bord de l'eau"
        ],
        'Douala': [
          "Rooftop lounge à Bonapriso avec musique douce",
          "Terrasse aérée à Bonanjo sous les palmiers",
          "Dîner face au fleuve Wouri au coucher du soleil",
          "Restaurant lounge intime avec vue sur les lumières de la ville"
        ],
        'Kribi': [
          "Dîner les pieds dans le sable à la Plage de Kribi face aux vagues",
          "Chutes de la Lobé avec dégustation de crevettes braisées au bord de l'eau",
          "Restaurant en bord de mer éclairé par des torches douces",
          "Balade les pieds dans l'eau au coucher du soleil doré"
        ],
        'Limbe': [
          "Restaurant face à la mer avec brise atlantique à Down Beach",
          "Allées fleuries du Jardin botanique de Limbe",
          "Plage de sable volcanique noir au crépuscule"
        ],
        'Bafoussam': [
          "Belvédère des collines au grand air des hauts plateaux",
          "Restaurant traditionnel chic avec ambiance feutrée",
          "Terrasse panoramique sous le ciel étoilé de l'Ouest"
        ],
        'Buea': [
          "Pause douceur au pied du Mont Cameroun avec brume poétique",
          "Tea Estate et promenade romantique au milieu des collines de thé",
          "Café montagnard intimiste et feutré"
        ],
        'Bamenda': [
          "Falaise d'Up-Station avec vue panoramique spectaculaire",
          "Jardin secret et terrasse discrète au calme"
        ],
        'Dschang': [
          "Balade en pédalo sur le Lac municipal de Dschang",
          "Allées romantiques du Musée des Civilisations"
        ],
        'Garoua': [
          "Coucher de soleil doré sur les rives de la Bénoué",
          "Terrasse sahélienne accueillante sous un ciel étoilé"
        ],
        'Maroua': [
          "Sommet de la colline de Maroua au crépuscule",
          "Oasis de fraîcheur sous les grands arbres ombragés"
        ],
        'Autre ville': [
          "Restaurant chic et confidentiel sélectionné avec soin",
          "Terrasse romantique propice aux longues conversations complices"
        ]
      };

      const foodSuggestions = [
        "Ndolé royal aux crevettes et miondo bien chaud",
        "Poulet DG croustillant et plantains mûrs dorés",
        "Poisson braisé tendre aux épices du pays et bâton de manioc",
        "Soya braisé au feu de bois avec kan-kan et oignons frais",
        "Koki fondant avec plantains vapeur",
        "Eru savoureux et water fufu",
        "Taro sauce jaune noble et généreux",
        "Pizza artisanale gourmande ou grillades internationales"
      ];

      const drinkSuggestions = [
        "Jus de foléré glacé parfumé à la menthe fraîche",
        "Cocktail fruité sans alcool (ananas, bissap & passion)",
        "Jus de baobab onctueux et rafraîchissant",
        "Jus d'ananas naturel fraîchement pressé",
        "Jus de gingembre tonique et citronné"
      ];

      const activitySuggestions = [
        "Balade complice main dans la main, rires et dégustation partagée",
        "Longue discussion sans voir le temps passer, regards complices et musique feutrée",
        "Séance photo spontanée pour garder un joli souvenir de cette rencontre",
        "Coucher de soleil à deux et confidences sous les étoiles",
        "Sortie glace gourmande et promenade tranquille"
      ];

      const giftSuggestions = [
        "Une rose délicate déposée avec soin sur la table 🌹",
        "Une douceur sucrée surprise à déguster ensemble 🍰",
        "Une playlist personnalisée avec nos morceaux préférés 🎶",
        "Un petit mot doux secret écrit spécialement pour toi 💌"
      ];

      const sweetMessages = [
        `« ${state.herName || 'Ma star'}, tout est pensé pour que tu passes un moment magique, sans stress et avec le plus beau sourire. ❤️ »`,
        `« Le programme est calé ! Promis, on va s'occuper de toi comme une vraie reine du Mboa. 🇨🇲✨ »`,
        `« Affaire de cœur seulement : prépare juste ta bonne humeur, je m'occupe de tout le reste ! 😌❤️ »`,
        `« Parce que certaines rencontres méritent qu'on mette les petits plats dans les grands… Hâte de partager ça avec toi ! 🌹 »`
      ];

      const cityPlaces = placeSuggestions[city] || placeSuggestions['Yaoundé'];
      const pickedPlace = cityPlaces[Math.floor(Math.random() * cityPlaces.length)];
      const pickedFood = foodSuggestions[Math.floor(Math.random() * foodSuggestions.length)];
      const pickedDrink = drinkSuggestions[Math.floor(Math.random() * drinkSuggestions.length)];
      const pickedActivity = activitySuggestions[Math.floor(Math.random() * activitySuggestions.length)];
      const pickedGift = giftSuggestions[Math.floor(Math.random() * giftSuggestions.length)];
      const pickedMessage = sweetMessages[Math.floor(Math.random() * sweetMessages.length)];

      state.generatedProposal = {
        city,
        style,
        mood,
        moment,
        place: pickedPlace,
        food: pickedFood,
        drink: pickedDrink,
        activity: pickedActivity,
        gift: pickedGift,
        message: pickedMessage
      };

      // Remplissage de la carte
      const cardEl = document.getElementById('date-proposal-card');
      const tagEl = document.getElementById('proposal-city-tag');
      const placeEl = document.getElementById('proposal-place');
      const foodEl = document.getElementById('proposal-food');
      const drinkEl = document.getElementById('proposal-drink');
      const actEl = document.getElementById('proposal-activity');
      const giftEl = document.getElementById('proposal-gift');
      const msgEl = document.getElementById('proposal-message');

      if (tagEl) tagEl.textContent = `${city} • ${mood} (${moment})`;
      if (placeEl) placeEl.textContent = pickedPlace;
      if (foodEl) foodEl.textContent = pickedFood;
      if (drinkEl) drinkEl.textContent = pickedDrink;
      if (actEl) actEl.textContent = pickedActivity;
      if (giftEl) giftEl.textContent = pickedGift;
      if (msgEl) msgEl.textContent = pickedMessage;

      if (cardEl) {
        cardEl.classList.add('show');
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      playCelebrationFanfare();
      fireRomanticConfetti(50);
    }

    if (btnRunGen) {
      btnRunGen.addEventListener('click', generateDateProposal);
    }

    if (btnRegen) {
      btnRegen.addEventListener('click', generateDateProposal);
    }

    if (btnApply) {
      btnApply.addEventListener('click', () => {
        if (!state.generatedProposal) return;
        const p = state.generatedProposal;

        state.city = p.city;
        state.placeTitle = p.place;
        state.placeId = 'gen-' + Date.now();
        state.foods.clear();
        state.foods.add(p.food);
        state.drinks.clear();
        state.drinks.add(p.drink);
        state.extras.clear();
        state.extras.add(p.activity);
        state.moment = p.moment;

        if (btnContinue) btnContinue.disabled = false;

        playCelebrationFanfare();
        fireRomanticConfetti(90);

        // Transition fluide vers l'étape suivante
        setTimeout(() => {
          goToStep('step-4');
        }, 600);
      });
    }

    if (btnContinue) {
      btnContinue.addEventListener('click', () => {
        goToStep('step-4');
      });
    }

    if (btnBack) {
      btnBack.addEventListener('click', () => goToStep('step-quiz'));
    }
  }

  // ==========================================================================
  // ÉTAPE 4 : NOURRITURE & BOISSONS DU CAMEROUN 🇨🇲
  // ==========================================================================
  function setupFoodAndDrinks() {
    const tabCameroon = document.getElementById('tab-food-cameroon');
    const tabIntl = document.getElementById('tab-food-international');
    const gridCameroon = document.getElementById('food-cameroon-grid');
    const gridIntl = document.getElementById('food-intl-grid');
    const btnSurpriseFood = document.getElementById('btn-surprise-food');

    const customFoodInput = document.getElementById('custom-food-input');
    const drinksGrid = document.getElementById('drinks-grid');
    const customDrinkBox = document.getElementById('custom-drink-box');
    const customDrinkInput = document.getElementById('custom-drink-input');

    const btnContinue = document.getElementById('btn-continue-step-4');
    const btnBack = document.getElementById('btn-back-step-4');

    // 1. Toggle Onglets Cuisine Cameroun vs Cuisine Internationale
    if (tabCameroon && tabIntl && gridCameroon && gridIntl) {
      tabCameroon.addEventListener('click', () => {
        tabCameroon.classList.add('active');
        tabIntl.classList.remove('active');
        gridCameroon.style.display = 'grid';
        gridIntl.style.display = 'none';
        playTone(600, 0.1, 'sine', 0.06);
      });

      tabIntl.addEventListener('click', () => {
        tabIntl.classList.add('active');
        tabCameroon.classList.remove('active');
        gridIntl.style.display = 'grid';
        gridCameroon.style.display = 'none';
        playTone(600, 0.1, 'sine', 0.06);
      });
    }

    function checkFoodValidity() {
      const hasFood = state.foods.size > 0 || (state.customFood && state.customFood.length > 0);
      if (btnContinue) btnContinue.disabled = !hasFood;
    }

    // 2. Sélection des plats
    const allFoodCards = document.querySelectorAll('#food-cameroon-grid .choice-card, #food-intl-grid .choice-card');
    allFoodCards.forEach(card => {
      card.addEventListener('click', () => {
        const title = card.getAttribute('data-title');

        if (state.foods.has(title)) {
          state.foods.delete(title);
          card.classList.remove('selected');
        } else {
          state.foods.add(title);
          card.classList.add('selected');
          playTone(680, 0.12, 'sine', 0.07);
        }

        checkFoodValidity();
      });
    });

    // 3. Bouton « 🎲 Surprise, choisis pour moi ! »
    if (btnSurpriseFood) {
      btnSurpriseFood.addEventListener('click', () => {
        const cameroonCards = Array.from(document.querySelectorAll('#food-cameroon-grid .choice-card'));
        if (cameroonCards.length === 0) return;

        // Réinitialiser la sélection
        cameroonCards.forEach(c => c.classList.remove('selected'));
        state.foods.clear();

        // Choisir 2 plats favoris aléatoirement
        const shuffled = cameroonCards.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 2);

        selected.forEach(card => {
          card.classList.add('selected');
          state.foods.add(card.getAttribute('data-title'));
        });

        // Activer l'onglet Cameroun si ce n'était pas le cas
        if (tabCameroon && tabIntl && gridCameroon && gridIntl) {
          tabCameroon.classList.add('active');
          tabIntl.classList.remove('active');
          gridCameroon.style.display = 'grid';
          gridIntl.style.display = 'none';
        }

        playCelebrationFanfare();
        fireRomanticConfetti(60);
        checkFoodValidity();
      });
    }

    if (customFoodInput) {
      customFoodInput.addEventListener('input', () => {
        state.customFood = customFoodInput.value.trim();
        checkFoodValidity();
      });
    }

    // 4. Sélection des boissons camerounaises
    if (drinksGrid) {
      drinksGrid.querySelectorAll('.drink-card').forEach(card => {
        card.addEventListener('click', () => {
          const drink = card.getAttribute('data-drink');

          if (state.drinks.has(drink)) {
            state.drinks.delete(drink);
            card.classList.remove('selected');
            if (drink === 'Autre boisson' && customDrinkBox) {
              customDrinkBox.classList.remove('show');
            }
          } else {
            state.drinks.add(drink);
            card.classList.add('selected');
            playTone(740, 0.12, 'sine', 0.07);

            if (drink === 'Autre boisson') {
              if (customDrinkBox) customDrinkBox.classList.add('show');
              if (customDrinkInput) customDrinkInput.focus();
            }
          }
        });
      });
    }

    if (customDrinkInput) {
      customDrinkInput.addEventListener('input', () => {
        state.customDrink = customDrinkInput.value.trim();
      });
    }

    if (btnContinue) {
      btnContinue.addEventListener('click', () => {
        goToStep('step-surprises');
      });
    }

    if (btnBack) {
      btnBack.addEventListener('click', () => goToStep('step-3'));
    }
  }

  // ==========================================================================
  // ÉTAPE 4-B : LA BOÎTE À SURPRISE UNIQUE 🎁 (UNE SEULE SURPRISE DE LUXE)
  // ==========================================================================
  function setupSingleSurprise() {
    const giftBox = document.getElementById('single-gift-box');
    const btnOpen = document.getElementById('btn-open-single-gift');
    const revealedCard = document.getElementById('surprise-revealed-card');
    const btnContinue = document.getElementById('btn-continue-surprises');
    const btnBack = document.getElementById('btn-back-step-surprises');

    function openTheSurprise() {
      if (state.singleSurpriseOpened) return;
      state.singleSurpriseOpened = true;

      if (giftBox) giftBox.classList.add('opened');
      if (btnOpen) btnOpen.style.display = 'none';

      playCelebrationFanfare();
      fireRomanticConfetti(140);

      setTimeout(() => {
        if (revealedCard) {
          revealedCard.classList.add('show');
          revealedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 350);

      const surpriseNote = "Une glace ou douceur offerte & un mot doux inoubliable 🍦❤️";
      state.unlockedSurprises.add(surpriseNote);
    }

    if (giftBox) giftBox.addEventListener('click', openTheSurprise);
    if (btnOpen) btnOpen.addEventListener('click', openTheSurprise);

    if (btnContinue) {
      btnContinue.addEventListener('click', () => {
        goToStep('step-5');
      });
    }

    if (btnBack) {
      btnBack.addEventListener('click', () => goToStep('step-4'));
    }
  }

  // ==========================================================================
  // ÉTAPE 5 : LES PETITS PLUS, AMBIANCE, DATE & HEURE
  // ==========================================================================
  function setupExtras() {
    const extrasList = document.getElementById('extras-list');
    const momentPills = document.getElementById('moment-pills');
    const dateInput = document.getElementById('date-picker-input');
    const timeInput = document.getElementById('time-picker-input');
    const noteInput = document.getElementById('custom-note-input');
    const btnContinue = document.getElementById('btn-continue-step-5');
    const btnBack = document.getElementById('btn-back-step-5');

    // 1. Date minimale = Aujourd'hui
    if (dateInput) {
      dateInput.min = new Date().toISOString().split('T')[0];
      dateInput.addEventListener('change', () => {
        state.date = dateInput.value;
      });
    }

    if (timeInput) {
      timeInput.addEventListener('change', () => {
        state.time = timeInput.value;
      });
    }

    // 2. Activités & Ambiance
    if (extrasList) {
      extrasList.querySelectorAll('.extra-item').forEach(item => {
        item.addEventListener('click', () => {
          const label = item.querySelector('.extra-label').textContent.trim();
          if (state.extras.has(label)) {
            state.extras.delete(label);
            item.classList.remove('selected');
          } else {
            state.extras.add(label);
            item.classList.add('selected');
            playTone(720, 0.1, 'sine', 0.08);
          }
        });
      });
    }

    // 3. Moment préféré
    if (momentPills) {
      momentPills.querySelectorAll('.moment-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          momentPills.querySelectorAll('.moment-pill').forEach(p => p.classList.remove('selected'));
          pill.classList.add('selected');
          state.moment = pill.getAttribute('data-moment');
          playTone(650, 0.1, 'sine', 0.08);
        });
      });
    }

    if (noteInput) {
      noteInput.addEventListener('input', () => {
        state.customNote = noteInput.value.trim();
      });
    }

    if (btnContinue) {
      btnContinue.addEventListener('click', () => {
        goToStep('step-confidences');
      });
    }

    if (btnBack) {
      btnBack.addEventListener('click', () => goToStep('step-surprises'));
    }
  }

  // ==========================================================================
  // ÉTAPE 5-B : ESPACE DE CONFIDENCES (FACULTATIF)
  // ==========================================================================
  function setupConfidences() {
    const btnSkip = document.getElementById('btn-skip-confidences');
    const btnContinue = document.getElementById('btn-continue-confidences');

    function saveConfidences() {
      state.confidences.smile = document.getElementById('conf-smile')?.value.trim() || '';
      state.confidences.pleasure = document.getElementById('conf-pleasure')?.value.trim() || '';
      state.confidences.dreamPlace = document.getElementById('conf-dream-place')?.value.trim() || '';
      state.confidences.dateDef = document.getElementById('conf-date-def')?.value.trim() || '';
      state.confidences.attention = document.getElementById('conf-attention')?.value.trim() || '';
    }

    if (btnSkip) {
      btnSkip.addEventListener('click', () => {
        goToStep('step-letter');
      });
    }

    if (btnContinue) {
      btnContinue.addEventListener('click', () => {
        saveConfidences();
        goToStep('step-letter');
      });
    }
  }

  // ==========================================================================
  // ÉTAPE 5-C : LETTRE ROMANTIQUE FINALE
  // ==========================================================================
  function setupLetter() {
    const btnContinue = document.getElementById('btn-continue-letter');
    if (btnContinue) {
      btnContinue.addEventListener('click', () => {
        populateRecap();
        goToStep('step-6');
      });
    }
  }

  // ==========================================================================
  // ÉTAPE 6 : RÉCAPITULATIF FINAL & EXPÉDITION WHATSAPP
  // ==========================================================================
  function populateRecap() {
    const nameEl = document.getElementById('recap-name');
    const cityEl = document.getElementById('recap-city');
    const placeEl = document.getElementById('recap-place');
    const foodEl = document.getElementById('recap-food');
    const drinksEl = document.getElementById('recap-drinks');
    const extrasEl = document.getElementById('recap-extras');
    const datetimeEl = document.getElementById('recap-datetime');
    const messageEl = document.getElementById('recap-message');

    if (nameEl) nameEl.textContent = state.herName || 'Non précisé';
    if (cityEl) cityEl.textContent = `${state.city || 'Yaoundé'} 🇨🇲`;

    let finalPlace = state.placeTitle || 'Une belle surprise';
    if (state.placeId === 'autre' && state.customPlace) {
      finalPlace = `${state.customPlace} ✨`;
    }
    if (placeEl) placeEl.textContent = finalPlace;

    // Plats
    const foodArr = Array.from(state.foods);
    if (state.customFood) foodArr.push(state.customFood);
    if (foodEl) foodEl.textContent = foodArr.length > 0 ? foodArr.join(', ') : 'Au gré de nos envies 😋';

    // Boissons
    const drinksArr = Array.from(state.drinks);
    if (state.customDrink) drinksArr.push(state.customDrink);
    if (drinksEl) drinksEl.textContent = drinksArr.length > 0 ? drinksArr.join(', ') : 'Foléré ou cocktail glacé 🥤';

    // Activités
    const extrasArr = Array.from(state.extras);
    if (extrasEl) extrasEl.textContent = extrasArr.length > 0 ? extrasArr.join(' • ') : 'Juste nous deux ❤️';

    // Date & Heure
    let dt = [];
    if (state.date) {
      try {
        const dObj = new Date(state.date + 'T12:00:00');
        const formattedDate = dObj.toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        });
        dt.push(formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1));
      } catch (e) {
        dt.push(state.date);
      }
    }
    if (state.time) dt.push(`à ${state.time}`);
    if (state.moment) dt.push(`(${state.moment})`);
    if (datetimeEl) datetimeEl.textContent = dt.length > 0 ? dt.join(' ') : 'À définir ensemble 😊';

    if (messageEl) {
      messageEl.textContent = state.customNote || '« Rendez-vous très bientôt ! »';
    }
  }

  function generateWhatsAppText() {
    let finalPlace = state.placeTitle || 'Une belle surprise';
    if (state.placeId === 'autre' && state.customPlace) {
      finalPlace = state.customPlace;
    }

    const foodArr = Array.from(state.foods);
    if (state.customFood) foodArr.push(state.customFood);
    const finalFood = foodArr.length > 0 ? foodArr.join(', ') : 'Ce que tu choisiras avec amour';

    const drinksArr = Array.from(state.drinks);
    if (state.customDrink) drinksArr.push(state.customDrink);
    const finalDrinks = drinksArr.length > 0 ? drinksArr.join(', ') : 'Jus de foléré ou cocktail sans alcool';

    const extrasArr = Array.from(state.extras);
    const finalExtras = extrasArr.length > 0 ? extrasArr.join(', ') : 'Notre complicité et nos sourires';

    let dt = [];
    if (state.date) {
      try {
        const dObj = new Date(state.date + 'T12:00:00');
        dt.push(dObj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }));
      } catch (e) {
        dt.push(state.date);
      }
    }
    if (state.time) dt.push(`à ${state.time}`);
    if (state.moment) dt.push(`(${state.moment})`);
    const finalDateTime = dt.length > 0 ? dt.join(' ') : 'À convenir ensemble';

    // Surprises débloquées
    let surprisesSection = '';
    if (state.unlockedSurprises.size > 0) {
      surprisesSection = `\n🎁 Ma surprise débloquée : ${Array.from(state.unlockedSurprises).join(' | ')}`;
    }

    // Confidences si renseignées
    let confSection = '';
    const answeredConf = [];
    if (state.confidences.smile) answeredConf.push(`Sourire : ${state.confidences.smile}`);
    if (state.confidences.pleasure) answeredConf.push(`Plaisir : ${state.confidences.pleasure}`);
    if (state.confidences.dreamPlace) answeredConf.push(`Rêve : ${state.confidences.dreamPlace}`);
    if (answeredConf.length > 0) {
      confSection = `\n💬 Mes petites confidences : ${answeredConf.join(' • ')}`;
    }

    const text = 
`Coucou ma star ! ❤️

J'ai répondu à ton invitation ! Le programme est calé :

👤 Mon prénom : ${state.herName || 'Moi'}
🇨🇲 Ville : ${state.city || 'Yaoundé'}
📍 Lieu choisi : ${finalPlace}
🍲 Ce qu'on mange : ${finalFood}
🥤 Boisson : ${finalDrinks}
✨ Notre ambiance : ${finalExtras}${surprisesSection}${confSection}
📅 Date & Heure : ${finalDateTime}
💬 Mon mot doux : ${state.customNote || 'Rendez-vous bientôt ! 😊'}

« Ce rendez-vous est mon invitation. Toi, viens simplement avec ton sourire. ❤️ »

Affaire de cœur seulement ! J'attends notre rendez-vous avec impatience 😊❤️`;

    return text;
  }

  function formatWhatsAppNumber(num) {
    let cleaned = (num || '').replace(/[^0-9]/g, '');
    // Si c'est un numéro à 9 chiffres camerounais commençant par 6 (ex: 655752004)
    if (cleaned.length === 9 && cleaned.startsWith('6')) {
      cleaned = '237' + cleaned;
    }
    return cleaned;
  }

  function sendWhatsApp() {
    const rawNumber = formatWhatsAppNumber(state.whatsappNumber);
    const message = generateWhatsAppText();
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${rawNumber}?text=${encoded}`;

    fireRomanticConfetti(220);
    playCelebrationFanfare();

    const overlay = document.getElementById('celebration-overlay');
    const titleEl = document.getElementById('celebration-title');
    const descEl = document.getElementById('celebration-desc');
    const emojiEl = document.getElementById('celebration-emoji');

    if (titleEl) titleEl.textContent = "Invitation prête à être envoyée ❤️";
    if (descEl) descEl.textContent = "WhatsApp s'ouvre pour transmettre tes réponses… Le programme est calé au Mboa ! 🇨🇲";
    if (emojiEl) emojiEl.textContent = "💌✨";
    if (overlay) overlay.classList.add('show');

    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 700);

    setTimeout(() => {
      if (overlay) overlay.classList.remove('show');
    }, 4500);
  }

  function copySummaryToClipboard() {
    const message = generateWhatsAppText();
    const btn = document.getElementById('btn-copy-summary');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(message).then(() => {
        if (btn) {
          const original = btn.innerHTML;
          btn.innerHTML = '<span>Copié dans le presse-papier ! ✨</span>';
          setTimeout(() => {
            btn.innerHTML = original;
          }, 2500);
        }
      });
    }
  }

  // ==========================================================================
  // MODALE : REVOIR LES SURPRISES DÉBLOQUÉES
  // ==========================================================================
  function setupSurprisesReviewModal() {
    const btnReview = document.getElementById('btn-review-surprises');
    const modal = document.getElementById('surprises-review-modal');
    const closeBtn = document.getElementById('close-surprises-modal-btn');
    const actionBtn = document.getElementById('close-surprises-modal-action');
    const listEl = document.getElementById('surprises-unlocked-list');

    function openModal() {
      if (!listEl) return;
      listEl.innerHTML = '';

      if (state.unlockedSurprises.size === 0) {
        listEl.innerHTML = `
          <div style="padding: 12px; background: #FFF1F2; border-radius: 12px; font-size: 0.9rem; color: var(--rose-velvet);">
            La boîte surprise t'attend ! (Une glace offerte 🍦 et un mot doux plein d'attention 🤫❤️).
          </div>
        `;
      } else {
        state.unlockedSurprises.forEach(surp => {
          const div = document.createElement('div');
          div.style.cssText = 'padding: 12px 14px; background: #FFF7F8; border-radius: 12px; border: 1px solid #FDA4AF; font-size: 0.92rem; font-weight: 600; color: var(--rose-velvet);';
          div.textContent = `✨ ${surp}`;
          listEl.appendChild(div);
        });
      }

      if (modal) modal.classList.add('show');
    }

    const closeModal = () => {
      if (modal) modal.classList.remove('show');
    };

    if (btnReview) btnReview.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (actionBtn) actionBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }
  }

  // ==========================================================================
  // MODALE CONFIGURATION WHATSAPP
  // ==========================================================================
  function setupConfigModal() {
    const openBtn = document.getElementById('open-config-btn');
    const closeBtn = document.getElementById('close-config-btn');
    const modal = document.getElementById('config-modal');
    const saveBtn = document.getElementById('cfg-save-btn');
    const input = document.getElementById('cfg-whatsapp-input');

    const saved = localStorage.getItem('romantic_wa_number');
    if (saved && saved !== '33612345678') {
      state.whatsappNumber = saved;
    } else {
      state.whatsappNumber = (window.APP_CONFIG && window.APP_CONFIG.whatsappNumber) || '237655752004';
      localStorage.setItem('romantic_wa_number', state.whatsappNumber);
    }
    if (input) input.value = state.whatsappNumber;

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        if (input) input.value = state.whatsappNumber;
        modal.classList.add('show');
      });
    }

    const closeModal = () => {
      if (modal) modal.classList.remove('show');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (saveBtn && input && modal) {
      saveBtn.addEventListener('click', () => {
        let val = input.value.trim().replace(/[^0-9]/g, '');
        if (val.length === 9 && val.startsWith('6')) {
          val = '237' + val;
        }
        if (val.length >= 7) {
          state.whatsappNumber = val;
          localStorage.setItem('romantic_wa_number', val);
          modal.classList.remove('show');
          playTone(800, 0.2, 'sine', 0.1);
        } else {
          alert('Veuillez entrer un numéro valide (ex: 655752004 ou 237655752004)');
        }
      });
    }
  }

  // ==========================================================================
  // TOGGLE SONS BRUITAGES
  // ==========================================================================
  function setupAudioToggle() {
    const btn = document.getElementById('audio-toggle-btn');
    const onIcon = document.getElementById('sound-on-icon');
    const offIcon = document.getElementById('sound-off-icon');

    const saved = localStorage.getItem('romantic_sound_enabled');
    if (saved !== null) {
      state.soundEnabled = saved === 'true';
    }

    function updateIcons() {
      if (onIcon && offIcon) {
        onIcon.style.display = state.soundEnabled ? 'block' : 'none';
        offIcon.style.display = state.soundEnabled ? 'none' : 'block';
      }
    }
    updateIcons();

    if (btn) {
      btn.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        localStorage.setItem('romantic_sound_enabled', state.soundEnabled);
        updateIcons();
        if (state.soundEnabled) {
          playTone(550, 0.15, 'sine', 0.1);
        }
      });
    }
  }

  // Fallback sécurisé en cas de problème d'image externe
  function setupImageFallbacks() {
    document.querySelectorAll('.choice-card-img').forEach(img => {
      img.addEventListener('error', () => {
        img.style.display = 'none';
      });
    });
  }

  // ==========================================================================
  // INITIALISATION GLOBALE
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initAmbientCanvas();
    setupImageFallbacks();
    setupAudioToggle();
    setupMusicPlayer();
    setupCompliments();
    setupConfigModal();
    setupSecretEnvelope();
    setupEvasiveButton();
    setupQuiz();
    setupPlaces();
    setupFoodAndDrinks();
    setupSingleSurprise();
    setupExtras();
    setupConfidences();
    setupLetter();
    setupSurprisesReviewModal();

    // Bouton OUI de l'étape 2
    const btnYes = document.getElementById('btn-yes');
    if (btnYes) btnYes.addEventListener('click', onYesClicked);

    // Bouton Retour étape 6
    const btnBack6 = document.getElementById('btn-back-step-6');
    if (btnBack6) btnBack6.addEventListener('click', () => goToStep('step-letter'));

    // Bouton WhatsApp
    const btnWa = document.getElementById('btn-send-whatsapp');
    if (btnWa) btnWa.addEventListener('click', sendWhatsApp);

    // Bouton Copier
    const btnCopy = document.getElementById('btn-copy-summary');
    if (btnCopy) btnCopy.addEventListener('click', copySummaryToClipboard);

    // Prise en charge des clics pour l'AudioContext
    window.addEventListener('click', () => initAudio(), { once: true });
    window.addEventListener('touchstart', () => initAudio(), { once: true });
  });

  // Export dans l'objet global window.App
  window.App = {
    state,
    goToStep,
    submitName,
    onYesClicked,
    sendWhatsApp,
    copySummaryToClipboard
  };

})();
