import type { SkinItem } from "@/types";

const MCHEADS = "https://mc-heads.net";

const players = [
  // ============================================================
  // VANILLA / ICONIC
  // ============================================================

  "Notch",
  "Steve",
  "Alex",
  "Herobrine",

  // ============================================================
  // MINECRAFT DEFAULT / MHF
  // ============================================================

  "MHF_Steve",
  "MHF_Alex",
  "MHF_Creeper",
  "MHF_Skeleton",
  "MHF_Spider",
  "MHF_Zombie",
  "MHF_Enderman",
  "MHF_Blaze",
  "MHF_Ghast",
  "MHF_Slime",
  "MHF_MagmaCube",
  "MHF_Pig",
  "MHF_Cow",
  "MHF_Sheep",
  "MHF_Chicken",
  "MHF_Ocelot",
  "MHF_Cat",
  "MHF_Wolf",
  "MHF_Villager",
  "MHF_IronGolem",
  "MHF_Golem",
  "MHF_Wither",
  "MHF_Squid",
  "MHF_EnderDragon",
  "MHF_PigZombie",
  "MHF_SnowGolem",
  "MHF_ArrowUp",
  "MHF_ArrowDown",
  "MHF_ArrowLeft",
  "MHF_ArrowRight",

  // ============================================================
  // CREATOR / YOUTUBER SKINS
  // ============================================================

  "Dream",
  "Technoblade",
  "GeorgeNotFound",
  "Sapnap",
  "BadBoyHalo",
  "Skeppy",
  "TommyInnit",
  "Tubbo",
  "Ranboo",
  "WilburSoot",
  "Philza",
  "Quackity",
  "KarlJacobs",
  "Punz",
  "Purpled",
  "Antfrost",
  "Awesamdude",

  "CaptainSparklez",
  "DanTDM",
  "PopularMMOs",
  "PrestonPlayz",
  "SSundee",
  "JeromeASF",
  "BajanCanadian",
  "Vikkstar123",
  "SkyDoesMinecraft",
  "Bitzel",
  "Aphmau",

  "Wemmbu",
  "ParrotX2",
  "SpokeIsHere",
  "ClownPierce",
  "Rekrap2",
  "MinuteTech",
  "PrinceZam",
  "Feinberg",
  "Wallibear",
  "Purpled",

  // ============================================================
  // HERMITS / SMP / MINECRAFT CREATORS
  // ============================================================

  "Grian",
  "MumboJumbo",
  "GoodTimesWithScar",
  "ImpulseSV",
  "Xisumavoid",
  "EthosLab",
  "VintageBeef",
  "BdoubleO100",
  "TangoTek",
  "Docm77",
  "Keralis",
  "Cubfan135",
  "FalseSymmetry",
  "GeminiTay",
  "SmallishBeans",
  "SolidarityGaming",
  "LDShadowLady",
  "ZombieCleo",
  "PearlescentMoon",
  "iJevin",

  // ============================================================
  // FAMOUS / HISTORICAL MINECRAFT PLAYERS
  // ============================================================

  "Jeb_",
  "Dinnerbone",
  "Grumm",
  "jeb",
  "Notch",
  "C418",

  // ============================================================
  // POPULAR CHARACTERS / MEMES
  // ============================================================

  "AmongUs",
  "Mario",
  "Luigi",
  "Sonic",
  "Tails",
  "Knuckles",
  "Shadow",
  "Kirby",
  "Pikachu",

  // ============================================================
  // SUPERHEROES
  // ============================================================

  "SpiderMan",
  "Batman",
  "Superman",
  "IronMan",
  "CaptainAmerica",
  "Hulk",
  "Thor",
  "Deadpool",
  "Wolverine",
  "Venom",
  "Joker",

  // ============================================================
  // ANIME
  // ============================================================

  "Naruto",
  "Sasuke",
  "Itachi",
  "Kakashi",
  "Madara",
  "Goku",
  "Vegeta",
  "Gohan",
  "Trunks",
  "Frieza",
  "Luffy",
  "Zoro",
  "Sanji",
  "Gojo",
  "Sukuna",
  "Tanjiro",
  "Nezuko",
  "Levi",
  "Eren",
  "Mikasa",

  // ============================================================
  // POPULAR SKIN TYPES / THEMES
  // ============================================================

  "Fox",
  "Wolf",
  "Cat",
  "Creeper",
  "Enderman",
  "Herobrine",
  "Angel",
  "Demon",
  "Ninja",
  "Samurai",
  "Knight",
  "Wizard",
  "Pirate",
  "Robot",
  "Astronaut",
  "Zombie",
  "Skeleton",
  "Vampire",
  "Ghost",
  "Dragon",

  // ============================================================
  // EXTRA POPULAR / RECOGNIZABLE NAMES
  // ============================================================

  "MrBeast",
  "Technoblade",
  "Dream",
  "GeorgeNotFound",
  "Sapnap",
  "TommyInnit",
  "Ranboo",
  "Tubbo",
  "Philza",
  "Quackity",
  "Grian",
  "MumboJumbo",
  "CaptainSparklez",
  "DanTDM",
  "Aphmau",
  "PrestonPlayz",
  "SSundee",
  "Skeppy",
  "BadBoyHalo",
  "Purpled",
];

const uniquePlayers = [
  ...new Set(players),
];

const featuredPlayers = new Set([
  "Notch",
  "Steve",
  "Alex",
  "Herobrine",
  "Dream",
  "Technoblade",
  "GeorgeNotFound",
  "Sapnap",
  "TommyInnit",
  "Grian",
  "MumboJumbo",
  "CaptainSparklez",
  "DanTDM",
  "Skeppy",
  "BadBoyHalo",
  "MrBeast",
]);

export const skins: SkinItem[] = players.map(
  (username, index) => ({
    id: index + 1,

    slug: username.toLowerCase(),

    title: username,

    description:
      `Minecraft skin de ${username}.`,

    image:
      `${MCHEADS}/body/${encodeURIComponent(username)}/256`,

    category: "skins",

    edition: [
      "java",
      "bedrock",
    ],

    version: ["all"],

    author: username,

    username,

    skinUrl:
      `${MCHEADS}/skin/${encodeURIComponent(username)}`,

    featured: [
      "Notch",
      "MHF_Steve",
      "MHF_Alex",
      "Herobrine",
    ].includes(username),

    downloads: 0,

    tags: [
      "minecraft",
      "skin",
      username.toLowerCase(),
    ],

    platform: "both",

    download: "",

    createdAt: new Date(),
  }),
);