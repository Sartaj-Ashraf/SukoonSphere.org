import{j as e,L as t}from"./index-CG4Wj8KP.js";function l({article:s}){return e.jsx(t,{to:`/articles/article/${s._id}`,className:"block",children:e.jsxs("div",{className:"border-[1px] rounded-lg h-[400px] shadow-lg hover:-translate-y-3.5 hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col gap-4",children:[e.jsx("div",{className:"h-60 overflow-hidden",children:e.jsx("div",{className:"prose max-w-none scale-50 origin-top h-full",dangerouslySetInnerHTML:{__html:s.coverPage}})}),e.jsxs("div",{className:"flex flex-col gap-2 text-black px-3 py-3 transition ease-in-out",children:[e.jsx("h4",{className:"text-xl font-bold text-[#13404f] line-clamp-2 hover:text-[var(--ternery)] cursor-pointer",children:s.title||"Untitled Article"}),e.jsxs("p",{className:"text-gray-600",children:["By ",s.author.name]}),e.jsx("div",{className:"flex justify-between items-center",children:e.jsx("span",{className:"text-sm text-gray-400",children:new Date(s.timestamp).toLocaleDateString()})})]})]})})}export{l as M};
