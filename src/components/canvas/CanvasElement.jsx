import { memo } from "react";

function CanvasElement({
  element,
  onSelect,
  onNestedDrop,
  selectedElementId,
  onTabChange,
  onAccordionChange,
}) {
  const handleClick = (event) => {
    event.stopPropagation();
    onSelect(element.id);
  };

  const handleDragOver = (event) => {
    if (
      element.type === "Row" ||
      element.type === "Column" ||
      element.type === "Grid"
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleDrop = (event) => {
    if (
      element.type === "Row" ||
      element.type === "Column" ||
      element.type === "Grid"
    ) {
      onNestedDrop(event, element.id);
    }
  };

  const renderChildren = () => {
    if (!element.children?.length) {
      return (
        <div className="text-xs text-gray-400 text-center py-6">
          Drop elements here
        </div>
      );
    }

    return element.children.map((child) => (
      <CanvasElement
        key={child.id}
        element={child}
        onSelect={onSelect}
        onNestedDrop={onNestedDrop}
        selectedElementId={selectedElementId}
        onTabChange={onTabChange}
        onAccordionChange={onAccordionChange}
      />
    ));
  };

  if (element.type === "Text") {
    return (
      <div
        onClick={handleClick}
        style={element.styles}
        className="cursor-pointer"
      >
        {element.content}
      </div>
    );
  }

  if (element.type === "Image") {
    return (
      <img
        src={element.content}
        alt=""
        onClick={handleClick}
        loading="lazy"
        style={element.styles}
        className="cursor-pointer object-cover"
      />
    );
  }

  if (element.type === "Button") {
    return (
      <a
        href={element.link}
        onClick={(event) => {
          event.preventDefault();
          handleClick(event);
        }}
        style={element.styles}
        className="inline-block cursor-pointer"
      >
        {element.content}
      </a>
    );
  }

  if (element.type === "Input") {
    return (
      <input
        type={element.inputType}
        placeholder={element.content}
        onClick={handleClick}
        style={element.styles}
        className="border px-3 py-2 outline-none cursor-pointer"
      />
    );
  }

  if (
    element.type === "Row" ||
    element.type === "Column" ||
    element.type === "Grid"
  ) {
    return (
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={element.styles}
        className={`border border-dashed border-gray-200 rounded-lg min-h-[80px] ${
          selectedElementId === element.id ? "ring-2 ring-gray-800" : ""
        }`}
      >
        {renderChildren()}
      </div>
    );
  }

  if (element.type === "Video") {
    return element.content ? (
      <iframe
        src={element.content}
        title="Video"
        onClick={handleClick}
        style={element.styles}
        loading="lazy"
        className="w-full border-0"
        allowFullScreen
      />
    ) : (
      <div
        onClick={handleClick}
        style={element.styles}
        className="bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer"
      >
        Add a YouTube or Vimeo URL
      </div>
    );
  }

  if (element.type === "Tabs") {
    return (
      <div
        onClick={handleClick}
        style={element.styles}
        className="cursor-pointer"
      >
        <div className="flex border-b border-gray-200">
          {element.items.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onTabChange(element.id, index);
              }}
              className={`px-4 py-2 text-sm ${
                element.activeTab === index
                  ? "border-b-2 border-gray-900 font-medium"
                  : "text-gray-500"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className="py-4 text-sm text-gray-600">
          {element.items[element.activeTab]?.content}
        </div>
      </div>
    );
  }

  if (element.type === "Accordion") {
    return (
      <div
        onClick={handleClick}
        style={element.styles}
        className="space-y-2 cursor-pointer"
      >
        {element.items.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onAccordionChange(element.id, index);
              }}
              className="w-full text-left px-4 py-3 font-medium"
            >
              {item.title}
            </button>

            {element.openItem === index && (
              <div className="px-4 py-3 text-sm text-gray-600 border-t border-gray-200">
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default memo(CanvasElement);
