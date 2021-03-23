document.addEventListener("click", (e) => {

  if(!e.target) return

  if(e.target.id == "start") dom.beginGame(e)
  if(e.target.className.includes("cell")) dom.markCell(e)
  if(e.target.id == "themeIcon") dom.changeTheme()
})
