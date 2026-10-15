import {
  ChevronDown,
  ChevronRight,
  Type,
  Image as ImageIcon,
  MousePointer2,
  TextCursorInput,
  Rows3,
  Columns3,
  Grid3X3,
  Video,
  PanelsTopLeft,
  ListCollapse,
  GripVertical,
} from "lucide-react";
import { useState } from "react";

function LayersPanel({ elements, selectedElementId, onSelect, onMoveElement }) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">Layers</h2>

        <p className="text-xs text-gray-500 mt-1">Page structure</p>
      </div>

      <div className="max-h-80 overflow-y-auto p-2">
        {elements.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-gray-400">No elements added yet</p>
          </div>
        ) : (
          elements.map((element, index) => (
            <LayerItem
              key={element.id}
              element={element}
              index={index}
              elements={elements}
              selectedElementId={selectedElementId}
              onSelect={onSelect}
              onMoveElement={onMoveElement}
              level={0}
            />
          ))
        )}
      </div>
    </div>
  );
}

function LayerItem({
  element,
  index,
  elements,
  selectedElementId,
  onSelect,
  onMoveElement,
  level,
}) {
  const [isOpen, setIsOpen] = useState(true);

  const hasChildren = element.children && element.children.length > 0;

  const icons = {
    Text: Type,
    Image: ImageIcon,
    Button: MousePointer2,
    Input: TextCursorInput,
    Row: Rows3,
    Column: Columns3,
    Grid: Grid3X3,
    Video: Video,
    Tabs: PanelsTopLeft,
    Accordion: ListCollapse,
  };

  const Icon = icons[element.type] || Type;

  const isSelected = selectedElementId === element.id;

  const handleDragStart = (event) => {
    event.dataTransfer.setData("layerId", String(element.id));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const draggedId = event.dataTransfer.getData("layerId");

    if (!draggedId || draggedId === String(element.id)) {
      return;
    }

    const draggedIndex = elements.findIndex(
      (item) => String(item.id) === draggedId,
    );

    if (draggedIndex === -1) return;

    onMoveElement(draggedIndex, index);
  };

  return (
    <div>
      <div
        draggable
        onDragStart={handleDragStart}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        onClick={() => onSelect(element.id)}
        className={`
          flex
          items-center
          gap-2
          w-full
          rounded-lg
          px-2
          py-2
          cursor-grab
          transition-colors
          ${
            isSelected
              ? "bg-gray-900 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }
        `}
        style={{
          paddingLeft: `${8 + level * 18}px`,
        }}
      >
        <GripVertical size={14} className="text-gray-400 shrink-0" />

        {hasChildren ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setIsOpen((previous) => !previous);
            }}
            className="shrink-0"
          >
            {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
        ) : (
          <span className="w-[15px]" />
        )}

        <Icon size={16} strokeWidth={1.8} className="shrink-0" />

        <span className="text-xs font-medium truncate">{element.type}</span>
      </div>

      {hasChildren && isOpen && (
        <div>
          {element.children.map((child, childIndex) => (
            <LayerItem
              key={child.id}
              element={child}
              index={childIndex}
              elements={element.children}
              selectedElementId={selectedElementId}
              onSelect={onSelect}
              onMoveElement={(fromIndex, toIndex) =>
                onMoveElement(fromIndex, toIndex, element.id)
              }
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default LayersPanel;
