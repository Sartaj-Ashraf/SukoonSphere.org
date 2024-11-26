import{f as s,j as e,k as o,l,L as t,V as i}from"./index-CG4Wj8KP.js";import{R as n}from"./index-B1cg723S.js";import{n as c}from"./notFoundBySearch-rxF9YpbP.js";function d(){const{category:r}=s();return e.jsx(o,{className:"flex flex-col w-full gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-[10px] shadow-lg",children:e.jsxs("div",{className:"flex flex-col lg:flex-row gap-4",children:[e.jsxs("div",{className:"w-full lg:w-1/2 relative group",children:[e.jsx("input",{type:"text",className:"w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-[10px] text-[var(--black-color)] placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-300",placeholder:"Search by name or category",name:"search"}),e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16",fill:"currentColor",className:"h-4 w-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors duration-300",children:e.jsx("path",{fillRule:"evenodd",d:"M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z",clipRule:"evenodd"})})]}),e.jsx("div",{className:"w-full lg:w-1/3",children:e.jsxs("select",{name:"category",className:"w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-[10px] text-[var(--black-color)] cursor-pointer focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-300 appearance-none",style:{backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,backgroundPosition:"right 1rem center",backgroundRepeat:"no-repeat",backgroundSize:"1.5em 1.5em"},children:[e.jsx("option",{disabled:!0,selected:!0,children:"Category"}),r.map(a=>e.jsx("option",{className:"text-[var(--primary)] cursor-pointer",children:a},a))]})}),e.jsxs("div",{className:"flex gap-3  lg:justify-end",children:[e.jsx("button",{type:"submit",className:"p-3 bg-[var(--primary)] hover:bg-[var(--ternery)] text-white rounded-[10px] shadow-sm hover:shadow-xl transform hover:scale-105 transition-all duration-300",children:e.jsx(l,{className:"size-5"})}),e.jsx(t,{to:"/media/all-videos",className:"p-3 bg-gray-100 hover:bg-gray-200 text-[var(--primary)] rounded-[10px] shadow-sm hover:shadow-xl transform hover:scale-105 transition-all duration-300",children:e.jsx(n,{className:"size-5"})})]})]})})}const u=()=>{const{data:r,category:a}=s();return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"relative p-4 max-w-7xl mx-auto ",children:[e.jsx("div",{className:"flex items-center gap-4 mb-8 ",children:e.jsx(d,{category:a,children:" "})}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6",children:(r==null?void 0:r.length)>0?e.jsx(e.Fragment,{children:e.jsx(i,{videos:r})}):e.jsxs("div",{className:"col-span-4 flex flex-col justify-center items-center",children:[e.jsx("p",{className:"pt-4",children:"No Videos found ! Please try searching for different keywords or adjusting your filters"}),e.jsx("img",{src:c,alt:"image",className:"h-[200px] md:h-[50vh]"})]})})]})})};export{u as default};