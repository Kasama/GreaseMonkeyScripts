// ==UserScript==
// @name     Gitlab Solve all threads button
// @version  1
// @include *gitlab.com*/merge_requests/*
// ==/UserScript==

let newButtonExistsKey = "buttonExists"
let newButtonId = "resolve-all-issues-button"

let mainLoop = () => {
  let jumpToFirstButton = document.querySelector('[data-testid="jump-to-first"]');
  let miniJumpToFirstButton = document.querySelector('[data-track-label="mr_next_unresolved_thread"]');
  let closeAllThreadsButton = document.querySelector('[data-extratag="normal"]')
  let miniCloseAllThreadsButton = document.querySelector('[data-extratag="mini"]')

  if (jumpToFirstButton && !closeAllThreadsButton)
    createCloseIssuesButton(jumpToFirstButton, "normal")
  if (miniJumpToFirstButton && !miniCloseAllThreadsButton)
    createCloseIssuesButton(miniJumpToFirstButton, "mini")
}

function createCloseIssuesButton(baseNode, extra_tag) {
  let buttonBox = baseNode.parentElement
  let closeIssuesButton = baseNode.cloneNode(true);
  let checkSvg = document.querySelector('svg[data-testid="check-circle-icon"]').cloneNode(true);

  if (checkSvg) {
    let existingSvg = closeIssuesButton.querySelector("svg")
    if (existingSvg) {
      let svgParent = existingSvg.parentNode
      svgParent.replaceChild(checkSvg, existingSvg)
    }
  }
  let internalTextSpan = closeIssuesButton.querySelector("span")
  if (internalTextSpan) {
    internalTextSpan.textContent = "Resolve All Threads"
  }
  if (closeIssuesButton.title != "") {
    closeIssuesButton.title = "Resolve All Threads"
  }
  closeIssuesButton.dataset['testid'] = newButtonId
  closeIssuesButton.dataset['extratag'] = extra_tag

  closeIssuesButton.onclick = () => {
    Array.from(
      document.querySelectorAll("[data-qa-selector=resolve_discussion_button]")
    ).filter(
      node => !node.textContent.toLowerCase().includes("unresolve")
    ).forEach(
      button => button.click()
    )
  }
  buttonBox.append(closeIssuesButton)
  return closeIssuesButton
}

let interval = setInterval(mainLoop, 1000)

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState == "hidden") {
    clearInterval(interval)
  } else {
    setInterval(mainLoop, 1000)
  }
})
