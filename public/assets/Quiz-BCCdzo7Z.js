import{j as e,L as r,f as i,i as a}from"./index-CG4Wj8KP.js";const c=[{quizId:2,title:"How Empathic are you?",imgSrc:"https://via.placeholder.com/50/000000/FFFFFF/?text=A"},{quizId:3,title:"What is your communication style?",imgSrc:"https://via.placeholder.com/50/000000/FFFFFF/?text=B"},{quizId:4,title:"Discover your stress management style?",imgSrc:"https://via.placeholder.com/50/000000/FFFFFF/?text=C"},{quizId:1,title:"What is your attachment style?",imgSrc:"https://via.placeholder.com/50/000000/FFFFFF/?text=D"}];function n({title:t,imgSrc:s}){return e.jsxs("div",{className:"flex items-center py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 rounded-[8px]  ",children:[e.jsx("img",{src:s,alt:t,className:"w-12 h-12 mr-4 rounded-r-[8px]"}),e.jsx("h3",{className:"text-lg font-semibold text-[#364663] hover:text-[var(--ternery)]",children:t})]})}function o(){return e.jsx("div",{className:"w-full max-w-sm mx-auto",children:e.jsx("div",{children:c.map((t,s)=>e.jsx(r,{to:`/all-quizzes/quiz/${t.quizId}`,children:e.jsx(n,{title:t.title,imgSrc:t.imgSrc},s)}))})})}const m=({data:t})=>t?e.jsxs("div",{className:"attachment-styles",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-[1.6rem] md:text-[2.5rem] sm:text-[3.5rem] sm:leading-[3.5rem] font-bold  mb-2",children:t.title}),e.jsx("p",{className:"text-[var(--black-color)] mb-4 text-semibold md:text-base lg:text-base font-bold",children:t.subtitle})]}),e.jsx("div",{className:"flex w-full items-center col-span-2  pb-4 justify-start gap-8",children:e.jsx("div",{className:"flex items-center col-span-2 justify-start gap-8 order-3 sm:order-none",children:e.jsxs("div",{className:"flex items-center justify-center gap-2  cursor-pointer",children:[e.jsx("img",{className:"rounded-full size-7 border-2 border-gray-400",src:`https://ui-avatars.com/api/?name=${encodeURIComponent("Sartaj Ashraf")}&background=random`,alt:t.author.name}),e.jsxs("span",{className:"text-sm text-[var(--primary)]",children:[" ",t.author.name||"Author"]})]})})}),e.jsxs("div",{className:"mb-6 overflow-hidden rounded-lg flex flex-col md:flex-col",children:[e.jsx("img",{src:t.mainImage.src,alt:t.mainImage.alt,className:"sm:w-full object-cover"}),e.jsx("h3",{className:"text-gray-900 mb-4 text-semibold md:text-base lg:text-base my-3",children:t.mainImage.description})]}),Object.keys(t).filter(s=>!["title","subtitle","author","mainImage"].includes(s)).map((s,l)=>e.jsxs("div",{className:"attachment-section",children:[e.jsx("h2",{className:"text-xl md:text-1xl lg:text-2xl font-bold text-[var(--black-color)] mt-6",children:t[s].title}),e.jsx("p",{className:"text-xl md:text-base lg:text-lg font-normal text-[var(--black-color)] mb-2 ",children:t[s].content}),t[s].quote&&e.jsx("blockquote",{className:"attachment-quote",children:t[s].quote}),t[s].reference&&e.jsxs("p",{className:"attachment-reference",children:["Reference: ",t[s].reference]})]},l))]}):null;function x(){const{quiz:t,quizDetails:s,quizQuestions:l}=i();return e.jsx(e.Fragment,{children:e.jsx("div",{className:"max-w-full mx-auto px-4 py-4",children:e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-4",children:[e.jsxs("div",{className:"hidden lg:flex lg:col-span-3 bg-slate-100 p-4 flex-col gap-8 rounded-xl lg:sticky lg:top-20 order-1 lg:order-3",style:{height:"max-content"},children:[e.jsx("h3",{className:"text-lg font-bold text-gray-900 text-center",children:"Related Quizzes"}),e.jsx(o,{})]}),e.jsx("div",{className:"lg:col-span-4 lg:sticky top-16 h-[450px] grid gap-6 rounded-[20px] bg-[var(--white-color)] order-2  lg:mt-0",children:e.jsx("div",{children:e.jsx(a,{quizQuestionsList:l})})}),e.jsx("div",{className:"lg:col-span-5 grid gap-6 rounded lg:sticky lg:top-20 order-3 lg:order-2 mt-10 lg:mt-0",children:e.jsx(m,{data:s})})]})})})}export{x as default};