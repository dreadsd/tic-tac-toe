function handleEvents(e) {
  if (e.key && !(e.key == "Enter" || e.key == " ")) return;
  if (!e.target) return;

  if (e.target.id == "start") dom.beginGame(e);
  if (e.target.className.includes("cell")) dom.markCell(e.target);
  if (e.target.id == "themeIcon") dom.changeTheme();
  if (e.target.id == "autoIcon") dom.automaticMode();
}

document.addEventListener("click", handleEvents);
document.addEventListener("keydown", handleEvents);

dom.restoreProfile()
