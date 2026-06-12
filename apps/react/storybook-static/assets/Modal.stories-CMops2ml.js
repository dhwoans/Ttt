import{j as e}from"./iframe-xmOcUHRk.js";import"./preload-helper-PPVm8Dsz.js";function g({open:c,title:i,description:l,confirmLabel:d,cancelLabel:p,variant:u,disabled:t,interactionState:m}){const x={info:"bg-white text-black",success:"bg-lime-300 text-black",danger:"bg-red-500 text-white"},b={default:"",hover:"translate-x-[5px] translate-y-[5px] shadow-none",active:"translate-x-[5px] translate-y-[5px] shadow-none scale-95"};return c?e.jsxs("div",{className:"w-[min(92vw,560px)] rounded-2xl border-4 border-black bg-[#f7f2d2] p-5 text-black shadow-[8px_8px_0_0_#000]",children:[e.jsx("h3",{className:"text-xl font-black",children:i}),e.jsx("p",{className:"mt-3 text-sm",children:l}),e.jsxs("div",{className:"mt-5 flex justify-end gap-3",children:[e.jsx("button",{type:"button",disabled:t,className:`rounded-lg border-4 border-black bg-white px-4 py-2 text-sm font-bold shadow-[5px_5px_0_0_#000] ${t?"opacity-50 cursor-not-allowed":"cursor-pointer"}`,children:p}),e.jsx("button",{type:"button",disabled:t,className:`rounded-lg border-4 border-black px-4 py-2 text-sm font-bold shadow-[5px_5px_0_0_#000] transition-transform ${x[u]} ${b[m]} ${t?"opacity-50 cursor-not-allowed":"cursor-pointer"}`,children:d})]})]}):e.jsx("div",{className:"rounded-xl border-4 border-black bg-white px-5 py-4 text-black shadow-[5px_5px_0_0_#000]",children:"Modal is closed. Enable the `open` control to preview it."})}const f={title:"Core/Modal",component:g,tags:["autodocs"],args:{open:!0,title:"Leave Game?",description:"If you leave now, the current match progress will be lost.",confirmLabel:"Leave",cancelLabel:"Stay",variant:"danger",disabled:!1,interactionState:"default"},argTypes:{open:{control:"boolean"},title:{control:"text"},description:{control:"text"},confirmLabel:{control:"text"},cancelLabel:{control:"text"},variant:{control:{type:"inline-radio"},options:["info","success","danger"]},disabled:{control:"boolean"},interactionState:{control:{type:"inline-radio"},options:["default","hover","active"]}}},a={args:{interactionState:"default"}},r={args:{interactionState:"hover"}},o={args:{interactionState:"active"}},s={args:{disabled:!0}},n={args:{variant:"success",title:"Match Completed",description:"Great game. Save this result and return to the lobby?",confirmLabel:"Save & Exit"}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    interactionState: "default"
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    interactionState: "hover"
  }
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    interactionState: "active"
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "success",
    title: "Match Completed",
    description: "Great game. Save this result and return to the lobby?",
    confirmLabel: "Save & Exit"
  }
}`,...n.parameters?.docs?.source}}};const S=["Default","Hover","Active","Disabled","Variation"];export{o as Active,a as Default,s as Disabled,r as Hover,n as Variation,S as __namedExportsOrder,f as default};
