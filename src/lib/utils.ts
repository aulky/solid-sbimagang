export function getPageNumbers(current: number, total: number): (number | string)[] {
  const pages: (number | string)[] = [];

  if (total <= 4) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (current <= 2) {
      pages.push(2);
      pages.push("...");
      pages.push(total);
    } else if (current >= total - 1) {
      pages.push("...");
      pages.push(total - 1);
      pages.push(total);
    } else {
      pages.push("...");
      pages.push(current);
      pages.push("...");
      pages.push(total);
    }
  }
  return pages;
}
