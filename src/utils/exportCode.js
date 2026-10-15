const escapeHtml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const stylesToString = (styles = {}) => {
  return Object.entries(styles)
    .map(([property, value]) => {
      if (!value) return "";

      return `${property.replace(
        /[A-Z]/g,
        (match) => `-${match.toLowerCase()}`,
      )}:${value};`;
    })
    .filter(Boolean)
    .join("");
};

const renderElement = (element) => {
  const styles = stylesToString(element.styles);

  if (element.type === "Text") {
    return `<div style="${styles}">${escapeHtml(element.content)}</div>`;
  }

  if (element.type === "Image") {
    return `<img src="${escapeHtml(
      element.content,
    )}" style="${styles}" alt="" />`;
  }

  if (element.type === "Button") {
    return `<a href="${escapeHtml(
      element.link || "#",
    )}" style="${styles}">${escapeHtml(element.content)}</a>`;
  }

  if (element.type === "Input") {
    return `<input type="${escapeHtml(
      element.inputType || "text",
    )}" placeholder="${escapeHtml(element.content)}" style="${styles}" />`;
  }

  if (element.type === "Video") {
    return `<iframe src="${escapeHtml(
      element.content,
    )}" style="${styles}" frameborder="0" allowfullscreen></iframe>`;
  }

  if (
    element.type === "Row" ||
    element.type === "Column" ||
    element.type === "Grid"
  ) {
    return `<div style="${styles}">${
      element.children?.map(renderElement).join("") || ""
    }</div>`;
  }

  if (element.type === "Tabs") {
    return `<div style="${styles}">${
      element.items
        ?.map(
          (item) => `
            <div style="margin-bottom:12px;">
              <strong>${escapeHtml(item.title)}</strong>
              <p>${escapeHtml(item.content)}</p>
            </div>
          `,
        )
        .join("") || ""
    }</div>`;
  }

  if (element.type === "Accordion") {
    return `<div style="${styles}">${
      element.items
        ?.map(
          (item) => `
            <details style="margin-bottom:8px;">
              <summary>${escapeHtml(item.title)}</summary>
              <p>${escapeHtml(item.content)}</p>
            </details>
          `,
        )
        .join("") || ""
    }</div>`;
  }

  return "";
};

export const generateHtml = (elements) => {
  return elements.map(renderElement).join("\n");
};

export const generateCss = () => {
  return `
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
}

img,
iframe {
  max-width: 100%;
}

@media (max-width: 768px) {
  body {
    overflow-x: hidden;
  }
}
`;
};

export const generateFullHtml = (elements) => {
  const html = generateHtml(elements);
  const css = generateCss();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Builder Export</title>
  <style>
${css}
  </style>
</head>
<body>
${html}
</body>
</html>`;
};

export const downloadFile = (content, fileName, type = "text/plain") => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};

export const generateEmbedCode = () => {
  const iframe = `<iframe src="YOUR_PAGE_URL" width="100%" height="600" frameborder="0"></iframe>`;

  const script = `<script src="YOUR_PAGE_URL/embed.js"></script>`;

  return {
    iframe,
    script,
  };
};
