export function verifyColision(a, b, marginX, marginY) {
  if (a.x == b.x && a.y == b.y)
    return true;
  return !(
    ((a.y + marginY) < (b.y)) ||
    (a.y > (b.y + marginY)) ||
    ((a.x + marginX) < b.x) ||
    (a.x > (b.x + marginX))
  );
}