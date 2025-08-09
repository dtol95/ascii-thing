import { Game } from './game';
import './style.css';

const GRID_WIDTH = 80;
const GRID_HEIGHT = 45;
const CELL_SIZE = 16; // Increased for better visibility

async function main() {
  const container = document.getElementById('game-container');
  if (!container) {
    throw new Error('Game container not found');
  }

  const game = new Game({
    gridWidth: GRID_WIDTH,
    gridHeight: GRID_HEIGHT,
    cellSize: CELL_SIZE
  });

  await game.init(container);
  game.start();
}

main().catch(console.error);