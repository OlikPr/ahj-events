export default function calcTileType(index, boardSize) {
  const isTopRow = index < boardSize;
  const isBottomRow = index >= boardSize * (boardSize - 1);
  const isLeftColumn = index % boardSize === 0;
  const isRightColumn = (index + 1) % boardSize === 0;

  if (isTopRow && isLeftColumn) return 'top-left';
  if (isTopRow && isRightColumn) return 'top-right';
  if (isBottomRow && isLeftColumn) return 'bottom-left';
  if (isBottomRow && isRightColumn) return 'bottom-right';
  if (isTopRow) return 'top';
  if (isBottomRow) return 'bottom';
  if (isLeftColumn) return 'left';
  if (isRightColumn) return 'right';
  return 'center';
}
