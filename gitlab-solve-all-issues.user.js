// ==UserScript==
// @name     Gitlab Solve all threads button
// @version  1
// @grant    GM.setValue
// @grant    GM.getValue
// @include *gitlab.com*/merge_requests/*
// ==/UserScript==

let newButtonExistsKey = "buttonExists"
let newButtonId = "resolve-all-issues-button"

let mainLoop = () => {
  let jumpToFirstButton = document.querySelector('[data-testid="jump-to-first"]');
  let miniJumpToFirstButton = document.querySelector('[data-track-label="mr_next_unresolved_thread"]');

  GM.getValue(newButtonExistsKey)
    .then(exists => {
      if (!exists && (jumpToFirstButton && miniJumpToFirstButton)) {
          createCloseIssuesButton(jumpToFirstButton)
          createCloseIssuesButton(miniJumpToFirstButton)
          return GM.setValue(newButtonExistsKey, true)
      } else if (exists && !(jumpToFirstButton || miniJumpToFirstButton)) {
          return GM.setValue(newButtonExistsKey, false)
      }
    })
}

function createCloseIssuesButton(baseNode) {
  let buttonBox = baseNode.parentElement
  let closeIssuesButton = baseNode.cloneNode(true);
  let checkSvg = document.querySelector(".ic-check-circle").cloneNode(true);

  if (checkSvg) {
    let existingSvg = closeIssuesButton.querySelector("svg")
    let svgParent = existingSvg.parentNode
    svgParent.replaceChild(checkSvg, existingSvg)
  }
  let internalTextSpan = closeIssuesButton.querySelector("span")
  if (internalTextSpan) {
    internalTextSpan.textContent = "Resolve All Threads"
  }
  if (closeIssuesButton.title != "") {
    closeIssuesButton.title = "Resolve All Threads"
  }
  closeIssuesButton.dataset['testid'] = newButtonId

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

GM.setValue(newButtonExistsKey, false);

let interval = setInterval(mainLoop, 1000)

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState == "hidden") {
    clearInterval(interval)
  } else {
    setInterval(mainLoop, 1000)
  }
})

