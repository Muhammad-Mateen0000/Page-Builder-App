import { useState } from "react";
import {
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Pencil,
} from "lucide-react";

import ElementItem from "../sidebar/ElementItem";
import CanvasElement from "../canvas/CanvasElement";
import LayersPanel from "../panels/LayersPanel";
import TemplatesPanel from "../panels/TemplatesPanel";
import ExportPanel from "../panels/ExportPanel";

import {
  generateHtml,
  generateCss,
  generateEmbedCode,
  downloadFile,
} from "../../utils/exportCode";

function Builder() {
  const elements = [
    "Text",
    "Image",
    "Button",
    "Input",
    "Row",
    "Column",
    "Grid",
    "Video",
    "Tabs",
    "Accordion",
  ];

  const [canvasElements, setCanvasElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);

  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  const [isPreview, setIsPreview] = useState(false);
  const [device, setDevice] = useState("desktop");

  const updateCanvas = (newElements) => {
    setCanvasElements((currentElements) => {
      setPast((currentPast) => [...currentPast, currentElements]);
      setFuture([]);

      return newElements;
    });
  };

  const undo = () => {
    if (past.length === 0) return;

    const previousState = past[past.length - 1];

    setPast((currentPast) => currentPast.slice(0, -1));
    setFuture((currentFuture) => [canvasElements, ...currentFuture]);

    setCanvasElements(previousState);
    setSelectedElementId(null);
  };

  const redo = () => {
    if (future.length === 0) return;

    const nextState = future[0];

    setFuture((currentFuture) => currentFuture.slice(1));
    setPast((currentPast) => [...currentPast, canvasElements]);

    setCanvasElements(nextState);
    setSelectedElementId(null);
  };

  const convertToEmbedUrl = (url) => {
    if (!url) return "";

    try {
      if (url.includes("youtube.com/embed/")) {
        return url;
      }

      if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1]?.split("?")[0];

        return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
      }

      if (url.includes("youtube.com/watch")) {
        const videoId = new URL(url).searchParams.get("v");

        return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
      }

      if (url.includes("youtube.com/shorts/")) {
        const videoId = url.split("youtube.com/shorts/")[1]?.split("?")[0];

        return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
      }

      if (url.includes("vimeo.com/")) {
        const videoId = url.split("vimeo.com/")[1]?.split("?")[0];

        return videoId ? `https://player.vimeo.com/video/${videoId}` : "";
      }

      return url;
    } catch {
      return url;
    }
  };

  const createElement = (elementType) => {
    const newElement = {
      id: Date.now() + Math.random(),
      type: elementType,
      visibility: {
        desktop: true,
        tablet: true,
        mobile: true,
      },
    };

    if (elementType === "Text") {
      newElement.content = "Welcome to my website";

      newElement.styles = {
        fontSize: "24px",
        color: "#1f2937",
        textAlign: "left",
        padding: "16px",
        margin: "0px",
      };
    }

    if (elementType === "Image") {
      newElement.content = "https://placehold.co/600x300";

      newElement.styles = {
        width: "600px",
        height: "300px",
        borderRadius: "8px",
        margin: "0px",
        textAlign: "left",
      };
    }

    if (elementType === "Button") {
      newElement.content = "Click Me";
      newElement.link = "#";

      newElement.styles = {
        fontSize: "16px",
        color: "#ffffff",
        backgroundColor: "#111827",
        padding: "10px 20px",
        borderRadius: "8px",
        textAlign: "left",
      };
    }

    if (elementType === "Input") {
      newElement.content = "Enter text";
      newElement.inputType = "text";

      newElement.styles = {
        width: "300px",
        height: "42px",
        borderColor: "#d1d5db",
        borderRadius: "8px",
      };
    }

    if (elementType === "Row") {
      newElement.children = [];

      newElement.styles = {
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        padding: "16px",
        minHeight: "100px",
      };
    }

    if (elementType === "Column") {
      newElement.children = [];

      newElement.styles = {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
        minHeight: "100px",
      };
    }

    if (elementType === "Grid") {
      newElement.children = [];

      newElement.styles = {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "16px",
        padding: "16px",
        minHeight: "100px",
      };
    }

    if (elementType === "Video") {
      newElement.content = "";

      newElement.styles = {
        width: "100%",
        height: "400px",
        borderRadius: "8px",
      };
    }

    if (elementType === "Tabs") {
      newElement.items = [
        {
          title: "Tab 1",
          content: "This is the first tab.",
        },
        {
          title: "Tab 2",
          content: "This is the second tab.",
        },
        {
          title: "Tab 3",
          content: "This is the third tab.",
        },
      ];

      newElement.activeTab = 0;

      newElement.styles = {
        width: "100%",
        padding: "16px",
      };
    }

    if (elementType === "Accordion") {
      newElement.items = [
        {
          title: "Question 1",
          content: "Answer for question 1.",
        },
        {
          title: "Question 2",
          content: "Answer for question 2.",
        },
        {
          title: "Question 3",
          content: "Answer for question 3.",
        },
      ];

      newElement.openItem = 0;

      newElement.styles = {
        width: "100%",
        padding: "16px",
      };
    }

    return newElement;
  };

  const createText = (content, styles = {}) => {
    const textElement = createElement("Text");

    return {
      ...textElement,
      content,
      styles: {
        ...textElement.styles,
        ...styles,
      },
    };
  };

  const createButton = (content) => {
    const buttonElement = createElement("Button");

    return {
      ...buttonElement,
      content,
    };
  };

  const createSection = (sectionType) => {
    if (sectionType === "Hero") {
      const section = createElement("Column");

      section.styles = {
        ...section.styles,
        gap: "20px",
        padding: "60px 40px",
        minHeight: "300px",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f3f4f6",
      };

      section.children = [
        createText("Build Your Website", {
          fontSize: "40px",
          textAlign: "center",
          fontWeight: "700",
        }),

        createText("Create beautiful pages with our simple page builder.", {
          fontSize: "18px",
          textAlign: "center",
          color: "#6b7280",
        }),

        createButton("Get Started"),
      ];

      return section;
    }

    return null;
  };

  const loadSection = (sectionType) => {
    const section = createSection(sectionType);

    if (!section) return;

    updateCanvas([...canvasElements, section]);
    setSelectedElementId(section.id);
  };

  const addElementToParent = (elementsList, parentId, newElement) => {
    return elementsList.map((element) => {
      if (element.id === parentId) {
        return {
          ...element,
          children: [...(element.children || []), newElement],
        };
      }

      if (element.children?.length > 0) {
        return {
          ...element,
          children: addElementToParent(element.children, parentId, newElement),
        };
      }

      return element;
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();

    if (isPreview) return;

    const elementType = event.dataTransfer.getData("elementType");

    if (!elementType) return;

    const newElement = createElement(elementType);

    updateCanvas([...canvasElements, newElement]);
    setSelectedElementId(newElement.id);
  };

  const handleNestedDrop = (event, parentId) => {
    event.preventDefault();
    event.stopPropagation();

    if (isPreview) return;

    const elementType = event.dataTransfer.getData("elementType");

    if (!elementType) return;

    const newElement = createElement(elementType);

    updateCanvas(addElementToParent(canvasElements, parentId, newElement));

    setSelectedElementId(newElement.id);
  };

  const updateElementById = (elementsList, elementId, updateFunction) => {
    return elementsList.map((element) => {
      if (element.id === elementId) {
        return updateFunction(element);
      }

      if (element.children?.length > 0) {
        return {
          ...element,
          children: updateElementById(
            element.children,
            elementId,
            updateFunction,
          ),
        };
      }

      return element;
    });
  };

  const handleElementSelect = (id) => {
    if (isPreview) return;

    setSelectedElementId(id);
  };

  const handleElementContentChange = (property, value) => {
    if (!selectedElementId || isPreview) return;

    updateCanvas(
      updateElementById(canvasElements, selectedElementId, (element) => ({
        ...element,
        [property]: value,
      })),
    );
  };

  const handleElementStyleChange = (property, value) => {
    if (!selectedElementId || isPreview) return;

    updateCanvas(
      updateElementById(canvasElements, selectedElementId, (element) => ({
        ...element,
        styles: {
          ...element.styles,
          [property]: value,
        },
      })),
    );
  };

  const handleVisibilityChange = (deviceType) => {
    if (!selectedElementId || isPreview) return;

    updateCanvas(
      updateElementById(canvasElements, selectedElementId, (element) => ({
        ...element,
        visibility: {
          desktop: element.visibility?.desktop ?? true,
          tablet: element.visibility?.tablet ?? true,
          mobile: element.visibility?.mobile ?? true,
          [deviceType]: !(element.visibility?.[deviceType] ?? true),
        },
      })),
    );
  };

  const handleTabChange = (id, index) => {
    if (isPreview) return;

    updateCanvas(
      updateElementById(canvasElements, id, (element) => ({
        ...element,
        activeTab: index,
      })),
    );
  };

  const handleAccordionChange = (id, index) => {
    if (isPreview) return;

    updateCanvas(
      updateElementById(canvasElements, id, (element) => ({
        ...element,
        openItem: element.openItem === index ? -1 : index,
      })),
    );
  };

  const reorderElements = (elementsList, fromIndex, toIndex) => {
    const updatedElements = [...elementsList];

    const [movedElement] = updatedElements.splice(fromIndex, 1);

    updatedElements.splice(toIndex, 0, movedElement);

    return updatedElements;
  };

  const handleMoveElement = (fromIndex, toIndex, parentId = null) => {
    if (isPreview) return;

    if (!parentId) {
      updateCanvas(reorderElements(canvasElements, fromIndex, toIndex));

      return;
    }

    updateCanvas(
      updateElementById(canvasElements, parentId, (element) => ({
        ...element,
        children: reorderElements(element.children || [], fromIndex, toIndex),
      })),
    );
  };

  const findElementById = (elementsList, id) => {
    for (const element of elementsList) {
      if (element.id === id) {
        return element;
      }

      if (element.children?.length > 0) {
        const foundElement = findElementById(element.children, id);

        if (foundElement) return foundElement;
      }
    }

    return null;
  };

  const selectedElement = findElementById(canvasElements, selectedElementId);

  const getCanvasWidth = () => {
    if (device === "mobile") {
      return "w-[375px]";
    }

    if (device === "tablet") {
      return "w-[768px]";
    }

    return "w-full";
  };

  const handleDownloadHtml = () => {
    const html = generateHtml(canvasElements);

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Builder Export</title>
</head>
<body>
${html}
</body>
</html>`;

    downloadFile(fullHtml, "page.html", "text/html");
  };

  const handleDownloadCss = () => {
    const css = generateCss();

    downloadFile(css, "styles.css", "text/css");
  };

  const { iframe, script } = generateEmbedCode();

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {!isPreview && (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen shrink-0">
          <div className="px-5 py-4 border-b border-gray-200 shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">Elements</h2>

            <p className="text-xs text-gray-500 mt-1">
              Drag elements to the canvas
            </p>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300">
            <TemplatesPanel onLoadSection={loadSection} />

            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                {elements.map((element) => (
                  <ElementItem key={element} name={element} />
                ))}
              </div>
            </div>

            <div className="px-4 pb-5">
              <ExportPanel
                onDownloadHtml={handleDownloadHtml}
                onDownloadCss={handleDownloadCss}
                iframeCode={iframe}
                scriptCode={script}
              />
            </div>
          </div>
        </aside>
      )}

      <main className="flex-1 bg-white overflow-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300">
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPreview(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  !isPreview
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Pencil size={16} />
                Edit
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPreview(true);
                  setSelectedElementId(null);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  isPreview
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Eye size={16} />
                Preview
              </button>
            </div>

            <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setDevice("desktop")}
                title="Desktop"
                className={`p-2 rounded-md ${
                  device === "desktop"
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Monitor size={17} />
              </button>

              <button
                type="button"
                onClick={() => setDevice("tablet")}
                title="Tablet"
                className={`p-2 rounded-md ${
                  device === "tablet"
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Tablet size={17} />
              </button>

              <button
                type="button"
                onClick={() => setDevice("mobile")}
                title="Mobile"
                className={`p-2 rounded-md ${
                  device === "mobile"
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Smartphone size={17} />
              </button>
            </div>
          </div>
        </div>

        <div className="min-h-[calc(100vh-65px)] flex justify-center">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`${getCanvasWidth()} min-h-[calc(100vh-65px)] bg-white px-6 py-8 transition-all duration-300`}
          >
            {canvasElements.length === 0 ? (
              <div className="text-center text-gray-400 py-20">
                Drag an element here
              </div>
            ) : (
              <div className="space-y-4">
                {canvasElements.map((element) => {
                  const isVisible = element.visibility?.[device] ?? true;

                  if (!isVisible) return null;

                  return (
                    <div
                      key={element.id}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleElementSelect(element.id);
                      }}
                      className={`rounded-lg ${
                        !isPreview && selectedElementId === element.id
                          ? "ring-2 ring-gray-800"
                          : ""
                      }`}
                    >
                      <CanvasElement
                        element={element}
                        onSelect={handleElementSelect}
                        onNestedDrop={handleNestedDrop}
                        selectedElementId={selectedElementId}
                        onTabChange={handleTabChange}
                        onAccordionChange={handleAccordionChange}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {!isPreview && (
        <aside className="w-80 bg-white border-l border-gray-200 flex flex-col h-screen shrink-0">
          <div className="pt-5 px-4 pb-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">History</h2>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={undo}
                  disabled={past.length === 0}
                  title="Undo"
                  className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Undo2 size={17} />
                </button>

                <button
                  type="button"
                  onClick={redo}
                  disabled={future.length === 0}
                  title="Redo"
                  className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Redo2 size={17} />
                </button>
              </div>
            </div>
          </div>

          <LayersPanel
            elements={canvasElements}
            selectedElementId={selectedElementId}
            onSelect={handleElementSelect}
            onMoveElement={handleMoveElement}
          />

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300 p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Configuration
            </h2>

            {!selectedElement ? (
              <p className="text-sm text-gray-500">
                Select an element to edit its properties.
              </p>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Responsive Visibility
                  </label>

                  <div className="space-y-2">
                    {[
                      {
                        key: "desktop",
                        label: "Desktop",
                        icon: Monitor,
                      },
                      {
                        key: "tablet",
                        label: "Tablet",
                        icon: Tablet,
                      },
                      {
                        key: "mobile",
                        label: "Mobile",
                        icon: Smartphone,
                      },
                    ].map(({ key, label, icon: Icon }) => {
                      const visible = selectedElement.visibility?.[key] ?? true;

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleVisibilityChange(key)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm ${
                            visible
                              ? "border-gray-300 bg-white text-gray-800"
                              : "border-gray-200 bg-gray-100 text-gray-400"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Icon size={16} />
                            {label}
                          </span>

                          <span className="text-xs">
                            {visible ? "Visible" : "Hidden"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedElement.type === "Tabs" ||
                selectedElement.type === "Accordion" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Items
                      </label>

                      <p className="text-xs text-gray-500">
                        Use the default items for now.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Padding
                      </label>

                      <input
                        type="number"
                        value={parseInt(selectedElement.styles.padding)}
                        onChange={(event) =>
                          handleElementStyleChange(
                            "padding",
                            `${event.target.value}px`,
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </>
                ) : selectedElement.type === "Video" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        YouTube / Vimeo URL
                      </label>

                      <input
                        type="text"
                        value={selectedElement.content}
                        onChange={(event) =>
                          handleElementContentChange(
                            "content",
                            convertToEmbedUrl(event.target.value),
                          )
                        }
                        placeholder="Paste YouTube or Vimeo URL"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Height
                      </label>

                      <input
                        type="text"
                        value={selectedElement.styles.height}
                        onChange={(event) =>
                          handleElementStyleChange("height", event.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </>
                ) : selectedElement.type === "Text" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Text Content
                      </label>

                      <textarea
                        value={selectedElement.content}
                        onChange={(event) =>
                          handleElementContentChange(
                            "content",
                            event.target.value,
                          )
                        }
                        rows="4"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Font Size
                      </label>

                      <input
                        type="number"
                        value={parseInt(selectedElement.styles.fontSize)}
                        onChange={(event) =>
                          handleElementStyleChange(
                            "fontSize",
                            `${event.target.value}px`,
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Text Color
                      </label>

                      <input
                        type="color"
                        value={selectedElement.styles.color}
                        onChange={(event) =>
                          handleElementStyleChange("color", event.target.value)
                        }
                        className="w-full h-10 border rounded"
                      />
                    </div>
                  </>
                ) : selectedElement.type === "Image" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Image URL
                      </label>

                      <input
                        type="text"
                        value={selectedElement.content}
                        onChange={(event) =>
                          handleElementContentChange(
                            "content",
                            event.target.value,
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Width
                      </label>

                      <input
                        type="text"
                        value={selectedElement.styles.width}
                        onChange={(event) =>
                          handleElementStyleChange("width", event.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Height
                      </label>

                      <input
                        type="text"
                        value={selectedElement.styles.height}
                        onChange={(event) =>
                          handleElementStyleChange("height", event.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </>
                ) : selectedElement.type === "Button" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Button Label
                      </label>

                      <input
                        type="text"
                        value={selectedElement.content}
                        onChange={(event) =>
                          handleElementContentChange(
                            "content",
                            event.target.value,
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Button Link
                      </label>

                      <input
                        type="text"
                        value={selectedElement.link}
                        onChange={(event) =>
                          handleElementContentChange("link", event.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </>
                ) : selectedElement.type === "Input" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Placeholder
                      </label>

                      <input
                        type="text"
                        value={selectedElement.content}
                        onChange={(event) =>
                          handleElementContentChange(
                            "content",
                            event.target.value,
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Input Type
                      </label>

                      <select
                        value={selectedElement.inputType}
                        onChange={(event) =>
                          handleElementContentChange(
                            "inputType",
                            event.target.value,
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="number">Number</option>
                        <option value="password">Password</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Gap
                      </label>

                      <input
                        type="number"
                        value={parseInt(selectedElement.styles.gap || 16)}
                        onChange={(event) =>
                          handleElementStyleChange(
                            "gap",
                            `${event.target.value}px`,
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Padding
                      </label>

                      <input
                        type="number"
                        value={parseInt(selectedElement.styles.padding || 16)}
                        onChange={(event) =>
                          handleElementStyleChange(
                            "padding",
                            `${event.target.value}px`,
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}

export default Builder;
