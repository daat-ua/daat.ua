// Links that can't go anywhere yet:
// - in-page links whose target section doesn't exist are marked unavailable (styled in global.css);
// - placeholder links (href="#") don't jump to the top. TODO: give them real targets.
for (const a of document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')) {
  const id = a.getAttribute("href")!.slice(1);
  if (!id) {
    a.addEventListener("click", (e) => e.preventDefault());
    continue;
  }
  if (document.getElementById(id)) continue;
  a.setAttribute("aria-disabled", "true");
  a.setAttribute("tabindex", "-1");
  a.addEventListener("click", (e) => e.preventDefault());
}
