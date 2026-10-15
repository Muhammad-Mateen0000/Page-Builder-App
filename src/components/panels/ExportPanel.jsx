import { useState } from "react";
import { Download, Code2, Copy } from "lucide-react";

function ExportPanel({
  onDownloadHtml,
  onDownloadCss,
  iframeCode,
  scriptCode,
}) {
  const [copied, setCopied] = useState("");

  const copyCode = async (code, type) => {
    await navigator.clipboard.writeText(code);

    setCopied(type);

    setTimeout(() => {
      setCopied("");
    }, 1500);
  };

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Code2 size={16} />

          <h2 className="text-sm font-semibold text-gray-900">Export</h2>
        </div>
      </div>

      <div className="px-4 pb-4 space-y-3">
        <button
          type="button"
          onClick={onDownloadHtml}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg text-xs hover:bg-gray-800"
        >
          <Download size={15} />
          Download HTML
        </button>

        <button
          type="button"
          onClick={onDownloadCss}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs hover:bg-gray-50"
        >
          <Download size={15} />
          Download CSS
        </button>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-700">
              iframe Embed
            </span>

            <button
              type="button"
              onClick={() => copyCode(iframeCode, "iframe")}
              className="text-gray-500 hover:text-gray-900"
            >
              <Copy size={14} />
            </button>
          </div>

          <textarea
            readOnly
            value={iframeCode}
            className="w-full h-20 border border-gray-200 rounded-lg p-2 text-xs resize-none bg-gray-50"
          />

          {copied === "iframe" && (
            <p className="text-xs text-green-600 mt-1">Copied</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-700">
              Script Embed
            </span>

            <button
              type="button"
              onClick={() => copyCode(scriptCode, "script")}
              className="text-gray-500 hover:text-gray-900"
            >
              <Copy size={14} />
            </button>
          </div>

          <textarea
            readOnly
            value={scriptCode}
            className="w-full h-20 border border-gray-200 rounded-lg p-2 text-xs resize-none bg-gray-50"
          />

          {copied === "script" && (
            <p className="text-xs text-green-600 mt-1">Copied</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExportPanel;
