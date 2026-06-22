function escapeHTML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function convertToHTML() {
  const input = document.getElementById("inputText").value;
  const lines = input.split("\n");

  let html = "";
  let inList = false;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed === "") return;

    if (trimmed.startsWith("### ")) {
      if (inList) { html += "</ul>\n"; inList = false; }
      html += `<h3>${escapeHTML(trimmed.substring(4))}</h3>\n`;
    } else if (trimmed.startsWith("## ")) {
      if (inList) { html += "</ul>\n"; inList = false; }
      html += `<h2>${escapeHTML(trimmed.substring(3))}</h2>\n`;
    } else if (trimmed.startsWith("# ")) {
      if (inList) { html += "</ul>\n"; inList = false; }
      html += `<h1>${escapeHTML(trimmed.substring(2))}</h1>\n`;
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) { html += "<ul>\n"; inList = true; }
      html += `  <li>${escapeHTML(trimmed.substring(2))}</li>\n`;
    } else {
      if (inList) { html += "</ul>\n"; inList = false; }
      html += `<p>${escapeHTML(trimmed)}</p>\n`;
    }
  });

  if (inList) html += "</ul>\n";

  document.getElementById("outputHTML").value = html;
  document.getElementById("preview").innerHTML = html || "Your formatted preview will appear here...";
}

function copyHTML() {
  const output = document.getElementById("outputHTML");
  if (!output.value.trim()) {
    alert("Nothing to copy. Convert text first.");
    return;
  }
  output.select();
  document.execCommand("copy");
  alert("HTML copied!");
}

function clearAll() {
  document.getElementById("inputText").value = "";
  document.getElementById("outputHTML").value = "";
  document.getElementById("preview").innerHTML = "Your formatted preview will appear here...";
  updateCounter();
}

function updateCounter() {
  const input = document.getElementById("inputText").value;
  document.getElementById("charCounter").innerText = input.length + " characters";
}

function downloadHTML() {
  const html = document.getElementById("outputHTML").value;
  if (!html.trim()) {
    alert("Nothing to download. Convert text first.");
    return;
  }

  const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Converted HTML</title>
</head>
<body>
${html}
</body>
</html>`;

  const blob = new Blob([fullHTML], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "converted-html.html";
  link.click();
  URL.revokeObjectURL(link.href);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark") ? "yes" : "no");
}

function loadExample() {
  document.getElementById("inputText").value = `# Benefits of AI Content Cleanup Tools

AI-generated text is useful, but it often needs formatting before publishing.

## Main Benefits

- Converts messy text into clean HTML
- Saves time for bloggers and marketers
- Helps prepare content for websites
- Makes ChatGPT output easier to publish

## Conclusion

AI cleanup tools are useful for anyone who creates content online.`;
  updateCounter();
  convertToHTML();
}

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "yes") {
    document.body.classList.add("dark");
  }
});
