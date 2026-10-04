import type { Data } from "./types";

interface ContentTabsProps {
  formation: Data;
}

export const ContentTabs = ({ formation }: ContentTabsProps) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    {/* Tab headers */}
    <div className="flex border-b border-gray-100 px-2 pt-1">
        <button
          className={`relative px-5 py-3 text-xs font-black uppercase tracking-widest transition-colors text-[#5a4fcf]`}
        >
          Programme
          <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#5a4fcf] rounded-full" />
        </button>
    </div>

    {/* Tab content */}
    <div className="p-5 sm:p-7">
      {formation.programme && (
        <div className="text-left text-lg text-black leading-relaxed max-w-2xl [&_ul]:list-disc [&_ul]:pl-2 [&_ul]:ml-10 [&_ol]:list-decimal [&_ol]:pl-2 [&_ol]:ml-10 [&_li]:mt-4" dangerouslySetInnerHTML={{ __html: formation.programme }} />
      )}
    </div>
  </div>
);