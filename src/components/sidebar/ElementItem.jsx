import {
  Type,
  Image,
  MousePointer2,
  TextCursorInput,
  Rows3,
  Columns3,
  Grid3X3,
  Video,
  PanelsTopLeft,
  ListCollapse,
} from "lucide-react";

function ElementItem({ name }) {
  const icons = {
    Text: Type,
    Image: Image,
    Button: MousePointer2,
    Input: TextCursorInput,
    Row: Rows3,
    Column: Columns3,
    Grid: Grid3X3,
    Video: Video,
    Tabs: PanelsTopLeft,
    Accordion: ListCollapse,
  };

  const Icon = icons[name] || Type;

  const handleDragStart = (event) => {
    event.dataTransfer.setData("elementType", name);
    event.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="
        group
        flex
        flex-col
        items-center
        justify-center
        gap-2
        min-h-[82px]
        px-3
        py-3
        bg-white
        border
        border-gray-200
        rounded-xl
        cursor-grab
        select-none
        transition-all
        duration-200
        hover:border-gray-400
        hover:bg-gray-50
        hover:shadow-sm
        active:cursor-grabbing
        active:scale-[0.98]
      "
    >
      <div
        className="
          flex
          items-center
          justify-center
          w-9
          h-9
          rounded-lg
          bg-gray-100
          text-gray-600
          transition-colors
          duration-200
          group-hover:bg-gray-200
          group-hover:text-gray-900
        "
      >
        <Icon size={18} strokeWidth={1.8} />
      </div>

      <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">
        {name}
      </span>
    </div>
  );
}

export default ElementItem;