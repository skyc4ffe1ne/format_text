let finalText = [];

const regexForCode = /<(table|tbody|tr|td)>/g;

window.addEventListener("copy", function(e) {
  let selected = window.getSelection();
  let selectedText = selected.toString();

  if (!selectedText) return;

  for (let i = 0; i < selected.rangeCount; i++) {
    let range = selected.getRangeAt(i);
    let fragment = range.cloneContents();

    let temp = document.createElement("div");
    console.log("Temp: ", temp);
    temp.appendChild(fragment);

    for (let i = 0; i < temp.childNodes.length; i++) {
      if (
        temp.childNodes[i].nodeName.toLowerCase() !== "span" &&
        temp.childNodes[i].nodeName.toLowerCase() !== "table" &&
        temp.childNodes[i].nodeName.toLowerCase() !== "li" &&
        temp.childNodes[i].nodeName.toLowerCase() !== "#text"
      ) {
        takeRightNode(temp.childNodes[i]);
      } else {
        whatIsIt(temp.childNodes[i], temp?.classList, temp.innerHTML);
      }
    }
  }

  e.preventDefault();

  let formattedText = finalText;
  console.log("FinalText: ", finalText);
  finalText = [];

  e.clipboardData.setData("text/plain", formattedText.join(""));
});

function takeRightNode(temp) {
  for (let i = 0; i < temp.childNodes.length; i++) {
    whatIsIt(temp.childNodes[i], temp.childNodes[i].classList, temp.innerHTML);
  }
}

function goodFormat(temp, tempType) {
  const regexForNewLine = /\n(?!$)/g;
  const tempWithoutN = temp.textContent.replace(regexForNewLine, "");
  console.log("TempWitoutN: ", tempWithoutN);
  if (tempType === "code") {
    let formatted = "\n```java \n" + tempWithoutN + "\n```\n";
    finalText.push(formatted);
  } else if (tempType === "span") {
    let formatted = "**" + tempWithoutN + "**";
    finalText.push(formatted);
  } else if (tempType === "list") {
    let formatted = "- " + tempWithoutN + "\n";
    finalText.push(formatted);
  } else {
    finalText.push(tempWithoutN);
  }
}

function whatIsIt(temp, tempClass, tempInner) {
  if (
    tempInner.match(regexForCode) ||
    tempClass?.contains("SCodeFlow") ||
    tempClass?.contains("JavaHighlightBlock")
  ) {
    goodFormat(temp, "code");
  } else if (temp.nodeName.toLowerCase() === "span") {
    goodFormat(temp, "span");
  } else if (temp.nodeName.toLowerCase() === "li") {
    goodFormat(temp, "list");
  } else {
    goodFormat(temp, "text");
  }
}
