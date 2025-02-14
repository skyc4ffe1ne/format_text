const regexForCode = /(table)|(tbody)|(tr)|(td)/g;
const regexForHighlightText = /(?<=\>)\w{1,}(?=\<)/g;
const regexForHtml = /<([a-z]).+>/;

window.addEventListener("copy", function (e) {
  console.log("e.target = ", e.target);
  console.log("e.target parentElement = ", e.target.parentElement);

  let selected = window.getSelection();
  console.log("Selected : ", selected);
  let selectedText = selected.toString();

  if (!selectedText) return;

  //  console.log("Testo selezionato: " + selectedText);
  //  console.log("Inner Html di e.target: " + e.target.innerHTML);

  for (let i = 0; i < selected.rangeCount; i++) {
    let range = selected.getRangeAt(i);
    let fragment = range.cloneContents();
    console.log("Fragment: ", fragment.textContent);
    console.log("Fragment: ", fragment.innerHTML);

    let temp = document.createElement("div");
    temp.appendChild(fragment);

    console.log("Innerhtml of temp: ", temp.innerHTML);
    console.log("Temp: ", temp);

    console.log(
      "Inner html of temp highlight text :",
      temp.innerHTML.match(regexForHighlightText),
    );

    console.log("Node list of temp:", temp.childNodes);
    console.log("Node list of temp length:", temp.childNodes.length);

    let finalText = [];
    for (let i = 0; i < temp.childNodes.length; i++) {
      if (temp.childNodes[i].nodeName !== "#text") {
        let notFormatted = temp.childNodes[i].textContent;
        let formatted = "**" + notFormatted + "**";
        finalText.push(formatted);
      } else {
        finalText.push(temp.childNodes[i].textContent);
      }
    }

    console.log("Final array of text: ", finalText.join(""));

    console.log("Range :", range);
    console.log("Fragment :", fragment);

    console.log("Fragment length :", fragment.children.length);
    console.log("Fragment :", fragment.children[0].textContent);

    let codeBlocks = fragment.querySelectorAll(".JavaHighlightBlock");

    codeBlocks.forEach((el) => {
      console.log("onlyCode: forEach* textContent = ", el.textContent);
      el.textContent = "```java \n" + el.textContent + "\n```";
      console.log("onlyCode: forEach* After textContent = ", el.textContent);
    });
  }

  e.preventDefault();
  if (
    e.target.parentElement.tagName.toLowerCase().match(regexForCode) ||
    e.target.tagName.toLowerCase().match(regexForCode)
  ) {
    console.log("Match table tag for code format");
    // Take the clipboard text
  }

  if (e.target.innerHTML.match(regexForHighlightText)) {
    console.log("Match span for highlight text");
    // Take the clipboard text
    console.log(e.target.innerHTML.match(regexForHighlightText));
  }

  e.clipboardData.setData("text/plain", selectedText);
});
