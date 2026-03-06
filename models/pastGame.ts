import mongoose from "mongoose";
import { Schema, Document } from "mongoose";

interface Ability {
  abilityLevel?: number;
  displayName: string;
  id: string;
  rawDescription: string;
  rawDisplayName: string;
}

interface ChampionStats {
  abilityPower: number;
  armor: number;
  armorPenetrationFlat: number;
  armorPenetrationPercent: number;
  attackDamage: number;
  attackRange: number;
  attackSpeed: number;
  bonusArmorPenetrationPercent: number;
  bonusMagicPenetrationPercent: number;
  cooldownReduction: number;
  critChance: number;
  critDamage: number;
  currentHealth: number;
  healthRegenRate: number;
  lifeSteal: number;
  magicLethality: number;
  magicPenetrationFlat: number;
  magicPenetrationPercent: number;
  magicResist: number;
  maxHealth: number;
  moveSpeed: number;
  physicalLethality: number;
  resourceMax: number;
  resourceRegenRate: number;
  resourceType: string;
  resourceValue: number;
  spellVamp: number;
  tenacity: number;
}

interface Rune {
  displayName?: string;
  id: number;
  rawDescription: string;
  rawDisplayName?: string;
}

interface Runes {
  generalRunes: Rune[];
  keystone: Rune;
  primaryRuneTree: Rune;
  secondaryRuneTree: Rune;
  statRunes: Rune[];
}

interface ActivePlayer {
  abilities: Record<string, Ability>;
  championStats: ChampionStats;
  currentGold: number;
  fullRunes: Runes;
  level: number;
  summonerName: string;
}

interface SummonerSpell {
  displayName: string;
  rawDescription: string;
  rawDisplayName: string;
}

interface Player {
  championName: string;
  isBot: boolean;
  isDead: boolean;
  items: any[];
  level: number;
  position: string;
  rawChampionName: string;
  respawnTimer: number;
  runes: {
    keystone: Rune;
    primaryRuneTree: Rune;
    secondaryRuneTree: Rune;
  };
  scores: {
    assists: number;
    creepScore: number;
    deaths: number;
    kills: number;
    wardScore: number;
  };
  skinID: number;
  summonerName: string;
  summonerSpells: {
    summonerSpellOne: SummonerSpell;
    summonerSpellTwo: SummonerSpell;
  };
  team: string;
}

interface GameEvent {
  EventID: number;
  EventName: string;
  EventTime: number;
}

interface GameData {
  gameMode: string;
  gameTime: number;
  mapName: string;
  mapNumber: number;
  mapTerrain: string;
}

export interface PreviousGameDocument extends Document {
  activePlayer: ActivePlayer;
  allPlayers: Player[];
  events: { Events: GameEvent[] };
  gameData: GameData;
}

const AbilitySchema = new Schema<Ability>({
  abilityLevel: Number,
  displayName: { type: String, required: true },
  id: { type: String, required: true },
  rawDescription: { type: String, required: true },
  rawDisplayName: { type: String, required: true },
});

const ChampionStatsSchema = new Schema<ChampionStats>({
  abilityPower: Number,
  armor: Number,
  armorPenetrationFlat: Number,
  armorPenetrationPercent: Number,
  attackDamage: Number,
  attackRange: Number,
  attackSpeed: Number,
  bonusArmorPenetrationPercent: Number,
  bonusMagicPenetrationPercent: Number,
  cooldownReduction: Number,
  critChance: Number,
  critDamage: Number,
  currentHealth: Number,
  healthRegenRate: Number,
  lifeSteal: Number,
  magicLethality: Number,
  magicPenetrationFlat: Number,
  magicPenetrationPercent: Number,
  magicResist: Number,
  maxHealth: Number,
  moveSpeed: Number,
  physicalLethality: Number,
  resourceMax: Number,
  resourceRegenRate: Number,
  resourceType: String,
  resourceValue: Number,
  spellVamp: Number,
  tenacity: Number,
});

const RuneSchema = new Schema<Rune>({
  displayName: String,
  id: { type: Number, required: true },
  rawDescription: { type: String, required: true },
  rawDisplayName: String,
});

const RunesSchema = new Schema<Runes>({
  generalRunes: [RuneSchema],
  keystone: RuneSchema,
  primaryRuneTree: RuneSchema,
  secondaryRuneTree: RuneSchema,
  statRunes: [RuneSchema],
});

const ActivePlayerSchema = new Schema<ActivePlayer>({
  abilities: { type: Map, of: AbilitySchema, required: true },
  championStats: { type: ChampionStatsSchema, required: true },
  currentGold: Number,
  fullRunes: { type: RunesSchema, required: true },
  level: Number,
  summonerName: String,
});

const SummonerSpellSchema = new Schema<SummonerSpell>({
  displayName: String,
  rawDescription: String,
  rawDisplayName: String,
});

const PlayerSchema = new Schema<Player>({
  championName: String,
  isBot: Boolean,
  isDead: Boolean,
  items: Array,
  level: Number,
  position: String,
  rawChampionName: String,
  respawnTimer: Number,
  runes: {
    keystone: RuneSchema,
    primaryRuneTree: RuneSchema,
    secondaryRuneTree: RuneSchema,
  },
  scores: {
    assists: Number,
    creepScore: Number,
    deaths: Number,
    kills: Number,
    wardScore: Number,
  },
  skinID: Number,
  summonerName: String,
  summonerSpells: {
    summonerSpellOne: SummonerSpellSchema,
    summonerSpellTwo: SummonerSpellSchema,
  },
  team: String,
});

const GameEventSchema = new Schema<GameEvent>({
  EventID: Number,
  EventName: String,
  EventTime: Number,
});

const GameDataSchema = new Schema<GameData>({
  gameMode: String,
  gameTime: Number,
  mapName: String,
  mapNumber: Number,
  mapTerrain: String,
});

const PreviousGameSchema = new Schema<PreviousGameDocument>({
  activePlayer: { type: ActivePlayerSchema, required: true },
  allPlayers: [PlayerSchema],
  events: { Events: [GameEventSchema] },
  gameData: GameDataSchema,
});

module.exports = mongoose.model<PreviousGameDocument>(
  "PreviousGame",
  PreviousGameSchema,
);
