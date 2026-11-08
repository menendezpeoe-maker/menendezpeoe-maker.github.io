// Ir a una sección del resultado por el menú «Secciones», como lo hace una persona (el resultado se ve de una sección en una).
export async function goSection(page, id) {
  await page.waitForSelector("#nav-btn", { state: "visible" });
  if (await page.locator("#nav-panel").isHidden()) await page.click("#nav-btn");
  await page.click(`#nav-panel a[data-sec="r-${id}"]`);
  await page.waitForSelector(`#r-${id}`, { state: "visible" });
}
