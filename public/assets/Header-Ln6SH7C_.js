import{j as e,N as d,L as l,r as v,U as _,u as C,R as h,W as S}from"./index-CG4Wj8KP.js";import{a as y}from"./index-B1cg723S.js";import{c as U,d as z,B as b}from"./index-ETM6aJFZ.js";import{a as u}from"./index-CFWXTYax.js";import{l as j,B,a as P,b as E}from"./PageLinks-cHyw7gV7.js";import{a as F,b as R}from"./index-CyP4qBnb.js";const f="/assets/SukoonSphere_Logo-DIywWUj7.png";function A({links:a}){return e.jsx("div",{className:"hidden lg:flex justify-center flex-grow",children:e.jsx("ul",{className:"flex mt-[.8rem] h-10 gap-5 items-center",children:a.map((s,o)=>e.jsx($,{link:s,index:o},s.name))})})}const $=({link:a,index:s})=>e.jsxs("div",{className:"group relative h-full align-middle",children:[e.jsxs(d,{to:a.address,className:"flex group items-center justify-center ",children:[e.jsx("span",{className:"ml-2",children:a.name}),s!==0&&e.jsx(F,{className:"size-[1.4rem] ml-1 group-hover:rotate-180 transition-all duration-300 ease-in-out transform hover:scale-110 text-[var(--primary)] group-hover:text-[var(--ternery)] drop-shadow-sm hover:drop-shadow-md"})]}),a.sublinks&&e.jsx(k,{sublinks:a.sublinks})]}),k=({sublinks:a})=>e.jsxs("ul",{className:"top-14 absolute opacity-0 max-h-0 invisible group-hover:opacity-100 group-hover:max-h-[500px] group-hover:visible transition-[opacity, max-height, transform] duration-300 ease-in-out transform group-hover:translate-y-1 shadow-[0px_1px_10px_rgba(0,0,0,0.1)] bg-white p-2 rounded-[5px] w-72",children:[e.jsx(U,{className:"text-lg absolute -top-3 left-5 text-white"}),a.map(s=>s.name==="Videos"||s.name==="Podcasts"?e.jsx("li",{className:"relative transition-opacity duration-300 ease-in-out border-b-[2px] border-gray-500] last-of-type:border-none opacity-50 cursor-not-allowed",children:e.jsxs("div",{className:"flex items-center gap-2 px-2 py-2",children:[e.jsx("div",{className:"border bg-gray-400 text-white text-base rounded-full p-2 font-bold",children:s.icon}),e.jsxs("div",{className:"flex flex-col ml-2 text-[16px] text-gray-400",children:[e.jsx("span",{children:s.name}),e.jsx("span",{className:"text-[12px]",children:"Coming Soon! 🎬"})]})]})},s.name):e.jsx(O,{sublink:s},s.name))]}),O=({sublink:a})=>e.jsx("li",{className:"transition-opacity duration-300 ease-in-out border-b-[2px] border-gray-500] last-of-type:border-none",children:e.jsxs(d,{to:a.address,className:"flex items-center gap-2 px-2 py-2 text-[var(--primary)] hover:text-[var(--ternery)] opacity-0 group-hover:opacity-100 transition-opacity duration-200",children:[e.jsx("div",{className:"border bg-[var(--primary)] text-white text-base border-[var(--primary)] rounded-full p-2 font-bold",children:a.icon}),e.jsxs("div",{className:"flex flex-col ml-2 text-[16px] text-gray-600",children:[e.jsx("span",{className:"hover:text-[var(--ternery)]",children:a.name}),e.jsx("span",{className:"text-[12px] text-gray-400",children:a.description})]})]})});function V({user:a,miniMenu:s,handleLogout:o}){return e.jsx("div",{className:`${s?"opacity-100 max-h-[500px] ":"opacity-0 max-h-0"} absolute overflow-hidden transition-all duration-300 
      ease-in-out shadow-lg rounded-[4px] bg-[var(--body)] flex flex-col w-72 top-[4.5rem] right-[7.5rem]`,style:{transition:"opacity 0.5s ease, max-height 0.5s ease "},children:e.jsxs("div",{className:"flex items-center flex-col gap-4 pb-3 relative",children:[e.jsx("div",{className:"bg-[var(--primary)] w-full h-[100px] flex items-center justify-center relative rounded-t-lg",children:e.jsx("h4",{className:"text-white text-lg font-bold",children:a==null?void 0:a.name})}),e.jsxs("div",{className:"flex flex-col justify-center items-center mt-[-40px] z-10",children:[e.jsx("img",{className:"w-12 h-12 rounded-full border-1 border-black shadow-lg",src:(a==null?void 0:a.avatar)||"https://cdn-icons-png.flaticon.com/512/147/147142.png",alt:"User"}),e.jsx("h4",{className:"text-[var(--gray--900)] mt-2 font-semibold",children:a==null?void 0:a.name}),e.jsx("p",{className:"text-[var(--grey--800)] text-sm",children:a==null?void 0:a.email}),e.jsx("div",{className:"flex gap-1",children:e.jsx(D,{})}),e.jsx("div",{className:"flex justify-center gap-4 mt-4",children:e.jsx("button",{onClick:o,className:"btn-2",children:"Logout"})})]})]})})}const D=()=>e.jsx(e.Fragment,{children:e.jsx(l,{to:"/user/change-passowrd",children:e.jsx("button",{className:"bg-gray-800 hover:bg-gray-900 text-white rounded-full p-2",children:e.jsx(z,{className:"size-5"})})})});function I(){const[a,s]=v.useState(null),[o,c]=v.useState(!1),i=_(),{user:n,logout:x}=C(),N=()=>c(!o),p=t=>{s(t===a?null:t)};h.useEffect(()=>{const t=m=>{a!==null&&s(null)};return document.addEventListener("click",t),()=>document.removeEventListener("click",t)},[a]);const g=async()=>{try{await x(),c(!1),i("/")}catch(t){console.error("Logout failed:",t)}},w=n?[{name:"Change Password",address:"/user/change-passowrd",icon:e.jsx(R,{})},{name:"Logout",icon:e.jsx(y,{}),onClick:g}]:[{name:"Sign Up",address:"/auth/sign-up",icon:e.jsx(S,{})},{name:"Login",address:"/auth/sign-in",icon:e.jsx(E,{})}];return e.jsxs(e.Fragment,{children:[e.jsx("nav",{className:"hidden lg:flex w-full bg-[var(--white-color)] sticky top-0 items-center justify-between shadow-[0px_1px_10px_rgba(0,0,0,0.1)] z-50 transition-all ease-in-out p-2 h-[65px]",children:e.jsxs("div",{className:"flex w-full justify-between items-center px-4 lg:px-20",children:[e.jsx("img",{src:f,className:"object-contain w-14",alt:"Logo Loading..."}),e.jsx(A,{links:j}),n?e.jsx(K,{user:n,miniMenu:o,toggleMiniMenu:N,handleLogout:g}):e.jsx(T,{})]})}),e.jsx("header",{className:"lg:hidden  left-0 right-0 bg-[var(--white-color)] h-14 z-50",children:e.jsxs("div",{className:"flex items-center justify-between h-full px-4",children:[e.jsx("div",{className:"flex items-center gap-3",children:e.jsx(l,{to:"/",children:e.jsx("img",{src:f,className:"object-contain h-8 w-auto",alt:"Logo"})})}),e.jsxs("div",{className:"flex items-center gap-4",children:[n&&e.jsx(l,{to:"/Posts",children:e.jsx(B,{className:"text-2xl"})}),n?e.jsx(l,{to:"/about/user",children:e.jsx("img",{src:(n==null?void 0:n.avatar)||"https://cdn-icons-png.flaticon.com/512/147/147142.png",alt:"User",className:"w-8 h-8 rounded-full object-cover"})}):e.jsx(l,{to:"/auth/sign-in",children:e.jsx(P,{className:"text-2xl text-gray-600"})})]})]})}),e.jsx("nav",{className:"lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--white-color)] shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50",children:e.jsxs("div",{className:"flex justify-around items-center h-16",children:[j.map((t,m)=>e.jsx("div",{className:"relative group",children:t.sublinks?e.jsxs("div",{className:"p-2 text-2xl text-[var(--grey--800)] hover:text-[var(--ternery)] transform transition-all duration-150 hover:scale-110 active:scale-95",onClick:r=>{r.stopPropagation(),p(m)},children:[t.icon,e.jsxs("div",{className:`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[var(--white-color)] rounded-2xl shadow-xl p-2 w-fit border border-[var(--grey--400)] transition-all duration-200 ease-out ${a===m?"opacity-100 translate-y-0":"opacity-0 translate-y-4 pointer-events-none"}`,children:[e.jsx("div",{className:"flex flex-col space-y-3",children:t.sublinks.map(r=>r.name==="Videos"||r.name==="Podcasts"?e.jsxs("div",{className:"flex items-center gap-3 p-2 rounded-xl whitespace-nowrap opacity-50 cursor-not-allowed",children:[e.jsx("div",{className:"text-xl text-gray-400",children:r.icon}),e.jsxs("div",{children:[e.jsx("span",{className:"text-sm text-gray-400",children:r.name}),e.jsx("span",{className:"block text-xs text-gray-400",children:"Coming Soon! 🎬"})]})]},r.name):e.jsxs(d,{to:r.address,className:({isActive:L})=>`flex items-center gap-3 p-2 rounded-xl whitespace-nowrap transform transition-all duration-150 hover:scale-105 active:scale-95 ${L?"bg-[var(--blue--100)] text-[var(--ternery)] shadow-sm":"hover:bg-[var(--grey--200)] text-[var(--grey--800)]"}`,onClick:()=>s(null),children:[e.jsx("div",{className:"text-xl",children:r.icon}),e.jsx("span",{className:"text-sm",children:r.name})]},r.name))}),e.jsx("div",{className:"absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--white-color)] transform rotate-45 border-r border-b border-[var(--grey--400)] z-[-1]"})]})]}):e.jsx(d,{to:t.address,className:({isActive:r})=>`p-2 text-2xl transform transition-all duration-150 hover:scale-110 active:scale-95 ${r?"text-[var(--ternery)]":"text-[var(--grey--800)] hover:text-[var(--ternery)]"}`,children:t.icon})},t.name)),e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"p-2 text-2xl text-[var(--grey--800)] hover:text-[var(--ternery)] transform transition-all duration-150 hover:scale-110 active:scale-95",onClick:t=>{t.stopPropagation(),p("settings")},children:e.jsx(b,{})}),e.jsxs("div",{className:`absolute bottom-full right-2 mb-2 bg-[var(--white-color)] rounded-2xl shadow-xl p-2 w-fit border border-[var(--grey--400)] transition-all duration-200 ease-out ${a==="settings"?"opacity-100 translate-y-0":"opacity-0 translate-y-4 pointer-events-none"}`,children:[e.jsx("div",{className:"flex flex-col space-y-3",children:w.map(t=>t.onClick?e.jsxs("div",{className:"flex items-center gap-3 p-2 hover:bg-[var(--grey--200)] rounded-xl cursor-pointer whitespace-nowrap transform transition-all duration-150 hover:scale-105 active:scale-95",onClick:()=>{t.onClick(),s(null)},children:[e.jsx("div",{className:"text-xl text-[var(--grey--800)]",children:t.icon}),e.jsx("span",{className:"text-sm text-[var(--grey--800)]",children:t.name})]},t.name):e.jsxs(l,{to:t.address,className:"flex items-center gap-3 p-2 hover:bg-[var(--grey--200)] rounded-xl whitespace-nowrap transform transition-all duration-150 hover:scale-105 active:scale-95",onClick:()=>s(null),children:[e.jsx("div",{className:"text-xl text-[var(--grey--800)]",children:t.icon}),e.jsx("span",{className:"text-sm text-[var(--grey--800)]",children:t.name})]},t.name))}),e.jsx("div",{className:"absolute -bottom-2 right-4 w-4 h-4 bg-[var(--white-color)] transform rotate-45 border-r border-b border-[var(--grey--400)] z-[-1]"})]})]})]})})]})}const K=({user:a,miniMenu:s,toggleMiniMenu:o,handleLogout:c})=>{const i=h.useRef(null);return h.useEffect(()=>{const n=x=>{i.current&&!i.current.contains(x.target)&&s&&o()};return document.addEventListener("mousedown",n),()=>document.removeEventListener("mousedown",n)},[s,o]),e.jsxs("div",{ref:i,children:[e.jsxs("div",{className:"hidden lg:flex items-center justify-center gap-2",children:[e.jsx(l,{to:"about/user",children:e.jsxs("div",{className:"group relative",children:[e.jsx("img",{className:"w-9 h-9 rounded-full border-[3px] border-[var(--grey--600)] hover:border-[var(--ternery)]",src:(a==null?void 0:a.avatar)||"https://cdn-icons-png.flaticon.com/512/147/147142.png",alt:"User"}),e.jsx("div",{className:"absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[var(--grey--900)] text-[var(--white-color)] px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap",children:"View Profile"})]})}),s?e.jsx(y,{className:"block cursor-pointer size-8 hover:text-[var(--ternery)] hover:bg-[var(--grey--200)] rounded-full p-1 transition-transform duration-300",onClick:o}):e.jsx(b,{className:"block cursor-pointer size-8 hover:text-[var(--ternery)] hover:bg-[var(--grey--200)] rounded-full p-1 transition-transform duration-300",onClick:o})]}),e.jsx(V,{user:a,miniMenu:s,handleLogout:c})]})},T=()=>e.jsxs("div",{className:"flex gap-2",children:[e.jsx(l,{to:"/auth/sign-up",children:e.jsxs("button",{className:"hidden lg:flex bg-[var(--white-color)] items-center gap-1 rounded-[5px] shadow-[0_2px_0_0_rgba(0,0,0,0.04),_inset_0_0_0_2px_var(--grey--500)] transition-all ease-in-out duration-600 text-[var(--grey--900)] px-3 py-2 text-xs leading-[1.32] hover:bg-[var(--grey--200)]",children:[e.jsx("span",{children:"Sign Up"}),e.jsx(u,{})]})}),e.jsx(l,{to:"/auth/sign-in",children:e.jsxs("button",{className:"hidden lg:flex bg-[var(--black-color)] items-center gap-1 rounded-[5px] transition-all ease-in-out duration-600 text-[var(--white-color)] px-3 py-2 text-xs leading-[1.32] hover:bg-[var(--brand--black-pearl)]",children:[e.jsx("span",{children:"Login"}),e.jsx(u,{})]})})]}),Q=()=>e.jsx(e.Fragment,{children:e.jsx(I,{})});export{Q as default};