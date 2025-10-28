
export type PlayerToken = 'car' | 'thimble' | 'boot' | 'dog' | 'battleship' | 'tophat';

export interface Player {
  id: number;
  name: string;
  money: number;
  position: number;
  properties: number[]; // array of property space indices
  inJail: boolean;
  jailTurns: number;
  token: PlayerToken;
  color: string;
}

export type PropertyColor = 'brown' | 'light-blue' | 'pink' | 'orange' | 'red' | 'yellow' | 'green' | 'dark-blue';

export enum SpaceType {
  Property,
  Railroad,
  Utility,
  Chance,
  CommunityChest,
  Tax,
  Go,
  Jail,
  FreeParking,
  GoToJail,
}

export interface BaseSpace {
  name: string;
  type: SpaceType;
}

export interface PropertySpace extends BaseSpace {
  type: SpaceType.Property;
  price: number;
  rent: number[];
  houseCost: number;
  color: PropertyColor;
  ownerId?: number;
  houses: number;
}

export interface RailroadSpace extends BaseSpace {
  type: SpaceType.Railroad;
  price: number;
  ownerId?: number;
}

export interface UtilitySpace extends BaseSpace {
  type: SpaceType.Utility;
  price: number;
  ownerId?: number;
}

export interface TaxSpace extends BaseSpace {
  type: SpaceType.Tax;
  amount: number;
}

export interface CardSpace extends BaseSpace {
  type: SpaceType.Chance | SpaceType.CommunityChest;
}

export interface CornerSpace extends BaseSpace {
  type: SpaceType.Go | SpaceType.Jail | SpaceType.FreeParking | SpaceType.GoToJail;
}

export type GameSpace = PropertySpace | RailroadSpace | UtilitySpace | TaxSpace | CardSpace | CornerSpace;

export enum GamePhase {
  Setup,
  PlayerTurn,
  DiceRoll,
  LandedOnSpace,
  EndTurn,
  GameOver
}

export interface GameState {
  players: Player[];
  board: GameSpace[];
  currentPlayerIndex: number;
  phase: GamePhase;
  dice: [number, number];
  gameLog: string[];
}

export type GameAction =
  | { type: 'START_GAME'; playerNames: string[] }
  | { type: 'ROLL_DICE'; dice: [number, number] }
  | { type: 'MOVE_PLAYER' }
  | { type: 'BUY_PROPERTY' }
  | { type: 'PAY_RENT' }
  | { type: 'END_TURN' }
  | { type: 'PASS_GO' }
  | { type: 'NO_ACTION' }; // For spaces like Free Parking
