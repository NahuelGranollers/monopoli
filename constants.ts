
import { GameSpace, SpaceType, PlayerToken } from './types';

export const PLAYER_TOKENS: PlayerToken[] = ['car', 'thimble', 'boot', 'dog', 'battleship', 'tophat'];
export const PLAYER_COLORS = ['#ed1b24', '#0072bb', '#1fb25a', '#fff200', '#f7941d', '#d93a96'];


export const BOARD_SPACES: GameSpace[] = [
  { name: 'SALIDA', type: SpaceType.Go },
  { name: 'Avenida Mediterráneo', type: SpaceType.Property, price: 60, rent: [2, 10, 30, 90, 160, 250], houseCost: 50, color: 'brown', houses: 0 },
  { name: 'Caja de Comunidad', type: SpaceType.CommunityChest },
  { name: 'Avenida Báltica', type: SpaceType.Property, price: 60, rent: [4, 20, 60, 180, 320, 450], houseCost: 50, color: 'brown', houses: 0 },
  { name: 'Impuesto sobre la Renta', type: SpaceType.Tax, amount: 200 },
  { name: 'Ferrocarril Reading', type: SpaceType.Railroad, price: 200 },
  { name: 'Avenida Oriental', type: SpaceType.Property, price: 100, rent: [6, 30, 90, 270, 400, 550], houseCost: 50, color: 'light-blue', houses: 0 },
  { name: 'Suerte', type: SpaceType.Chance },
  { name: 'Avenida Vermont', type: SpaceType.Property, price: 100, rent: [6, 30, 90, 270, 400, 550], houseCost: 50, color: 'light-blue', houses: 0 },
  { name: 'Avenida Connecticut', type: SpaceType.Property, price: 120, rent: [8, 40, 100, 300, 450, 600], houseCost: 50, color: 'light-blue', houses: 0 },
  { name: 'Cárcel / De visita', type: SpaceType.Jail },
  { name: 'Plaza San Carlos', type: SpaceType.Property, price: 140, rent: [10, 50, 150, 450, 625, 750], houseCost: 100, color: 'pink', houses: 0 },
  { name: 'Compañía de Electricidad', type: SpaceType.Utility, price: 150 },
  { name: 'Avenida de los Estados', type: SpaceType.Property, price: 140, rent: [10, 50, 150, 450, 625, 750], houseCost: 100, color: 'pink', houses: 0 },
  { name: 'Avenida Virginia', type: SpaceType.Property, price: 160, rent: [12, 60, 180, 500, 700, 900], houseCost: 100, color: 'pink', houses: 0 },
  { name: 'Ferrocarril de Pensilvania', type: SpaceType.Railroad, price: 200 },
  { name: 'Plaza San Jaime', type: SpaceType.Property, price: 180, rent: [14, 70, 200, 550, 750, 950], houseCost: 100, color: 'orange', houses: 0 },
  { name: 'Caja de Comunidad', type: SpaceType.CommunityChest },
  { name: 'Avenida Tennessee', type: SpaceType.Property, price: 180, rent: [14, 70, 200, 550, 750, 950], houseCost: 100, color: 'orange', houses: 0 },
  { name: 'Avenida Nueva York', type: SpaceType.Property, price: 200, rent: [16, 80, 220, 600, 800, 1000], houseCost: 100, color: 'orange', houses: 0 },
  { name: 'Parking Gratuito', type: SpaceType.FreeParking },
  { name: 'Avenida Kentucky', type: SpaceType.Property, price: 220, rent: [18, 90, 250, 700, 875, 1050], houseCost: 150, color: 'red', houses: 0 },
  { name: 'Suerte', type: SpaceType.Chance },
  { name: 'Avenida Indiana', type: SpaceType.Property, price: 220, rent: [18, 90, 250, 700, 875, 1050], houseCost: 150, color: 'red', houses: 0 },
  { name: 'Avenida Illinois', type: SpaceType.Property, price: 240, rent: [20, 100, 300, 750, 925, 1100], houseCost: 150, color: 'red', houses: 0 },
  { name: 'Ferrocarril B. & O.', type: SpaceType.Railroad, price: 200 },
  { name: 'Avenida Atlántico', type: SpaceType.Property, price: 260, rent: [22, 110, 330, 800, 975, 1150], houseCost: 150, color: 'yellow', houses: 0 },
  { name: 'Avenida Ventnor', type: SpaceType.Property, price: 260, rent: [22, 110, 330, 800, 975, 1150], houseCost: 150, color: 'yellow', houses: 0 },
  { name: 'Compañía de Aguas', type: SpaceType.Utility, price: 150 },
  { name: 'Jardines Marvin', type: SpaceType.Property, price: 280, rent: [24, 120, 360, 850, 1025, 1200], houseCost: 150, color: 'yellow', houses: 0 },
  { name: 'Vaya a la Cárcel', type: SpaceType.GoToJail },
  { name: 'Avenida del Pacífico', type: SpaceType.Property, price: 300, rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200, color: 'green', houses: 0 },
  { name: 'Avenida Carolina del Norte', type: SpaceType.Property, price: 300, rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200, color: 'green', houses: 0 },
  { name: 'Caja de Comunidad', type: SpaceType.CommunityChest },
  { name: 'Avenida Pensilvania', type: SpaceType.Property, price: 320, rent: [28, 150, 450, 1000, 1200, 1400], houseCost: 200, color: 'green', houses: 0 },
  { name: 'Ferrocarril de Vía Corta', type: SpaceType.Railroad, price: 200 },
  { name: 'Suerte', type: SpaceType.Chance },
  { name: 'Plaza del Parque', type: SpaceType.Property, price: 350, rent: [35, 175, 500, 1100, 1300, 1500], houseCost: 200, color: 'dark-blue', houses: 0 },
  { name: 'Impuesto de Lujo', type: SpaceType.Tax, amount: 100 },
  { name: 'Paseo Marítimo', type: SpaceType.Property, price: 400, rent: [50, 200, 600, 1400, 1700, 2000], houseCost: 200, color: 'dark-blue', houses: 0 },
];
