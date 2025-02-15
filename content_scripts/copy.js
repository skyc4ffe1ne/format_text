let finalText = [];

const regexForCode = /<(table|tbody|tr|td)>/g;

window.addEventListener("copy", function (e) {
  let selected = window.getSelection();
  let selectedText = selected.toString();

  if (!selectedText) return;

  for (let i = 0; i < selected.rangeCount; i++) {
    let range = selected.getRangeAt(i);
    let fragment = range.cloneContents();

    let temp = document.createElement("div");
    temp.appendChild(fragment);

    console.log("Temp: ", temp);

    for (let i = 0; i < temp.childNodes.length; i++) {
      if (
        temp.childNodes[i].nodeName.toLowerCase() !== "span" &&
        temp.childNodes[i].nodeName.toLowerCase() !== "table" &&
        temp.childNodes[i].nodeName.toLowerCase() !== "#text"
      ) {
        takeRightNode(temp.childNodes[i]);
      } else {
        whatIsIt(temp.childNodes[i], temp?.classList, temp.innerHTML);
      }
    }
  }

  e.preventDefault();

  console.log("Final text: ", finalText);

  let formattedText = finalText;
  finalText = [];

  e.clipboardData.setData("text/plain", formattedText.join(""));
});

function takeRightNode(temp) {
  for (let i = 0; i < temp.childNodes.length; i++) {
    if (temp.childNodes[i].nodeName !== "#text") {
      whatIsIt(
        temp.childNodes[i],
        temp.childNodes[i].classList,
        temp.innerText,
      );
    } else {
      finalText.push(temp.childNodes[i].textContent);
    }
  }
}

function goodFormat(temp, tempType) {
  if (tempType === "code") {
    let notFormatted = temp.textContent;
    let formatted = "\n```java \n" + notFormatted + "\n```\n";
    finalText.push(formatted);
  } else if (tempType === "span") {
    let notFormatted = temp.textContent;
    let formatted = "**" + notFormatted + "**";
    finalText.push(formatted);
  } else {
    finalText.push(temp.textContent);
  }
}

function whatIsIt(temp, tempClass = "", tempInner) {
  if (
    tempClass?.contains("SCodeFlow") ||
    tempClass?.contains("JavaHighlightBlock") ||
    tempInner.match(regexForCode)
  ) {
    goodFormat(temp, "code");
  } else if (temp.nodeName.toLowerCase() === "span") {
    goodFormat(temp, "span");
  } else {
    goodFormat(temp, "text");
  }
}
