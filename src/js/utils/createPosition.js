let lastPosition = null;

function createArrayPositions(boardSize) {
  const totalCells = boardSize ** 2;
  return Array.from({ length: totalCells / 8 }, (_, i) => i * 8).flatMap(
    (cell) => [cell, cell + 1],
  );
}

export default function createPosition(boardSize) {
  const cells = createArrayPositions(boardSize);
  let rand;

  do {
    rand = Math.floor(Math.random() * cells.length);
  } while (cells[rand] === lastPosition);

  lastPosition = cells[rand];
  return lastPosition;
}
