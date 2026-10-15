import { LayoutTemplate } from "lucide-react";

function TemplatesPanel({ onLoadSection }) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="px-4 py-3">
        <div className="flex items-center gap-2">
          <LayoutTemplate size={16} />

          <h2 className="text-sm font-semibold text-gray-900">
            Sections
          </h2>
        </div>

        <p className="text-xs text-gray-500 mt-1">
          Add a predesigned section
        </p>
      </div>

      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={() => onLoadSection("Hero")}
          className="w-full text-left px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          Hero Section
        </button>
      </div>
    </div>
  );
}

export default TemplatesPanel;