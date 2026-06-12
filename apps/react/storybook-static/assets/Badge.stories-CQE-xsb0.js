import{j as s}from"./iframe-xmOcUHRk.js";import"./preload-helper-PPVm8Dsz.js";const i=({children:n,color:c="text-white"})=>s.jsx("span",{className:`px-3 py-1 bg-black rounded-lg text-sm font-bold ${c} transition-opacity duration-200 group-hover:opacity-0`,children:n});i.__docgenInfo={description:"",methods:[],displayName:"Badge",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},color:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"text-white"',computed:!1}}}};function p({text:n,color:c,disabled:d,interactionState:l}){return s.jsxs("div",{"data-state":l,className:`inline-flex rounded-lg ${d?"opacity-40 pointer-events-none":""}`,children:[s.jsx("style",{children:`
          [data-state="hover"] span { opacity: 0.25; }
          [data-state="active"] span { transform: scale(0.96); }
        `}),s.jsx(i,{color:c,children:n})]})}const g={title:"Core/Badge",component:p,tags:["autodocs"],args:{text:"Waiting",color:"text-white",disabled:!1,interactionState:"default"},argTypes:{text:{control:"text"},color:{control:{type:"select"},options:["text-white","text-yellow-300","text-lime-300","text-red-300"]},disabled:{control:"boolean"},interactionState:{control:{type:"inline-radio"},options:["default","hover","active"]}}},e={args:{interactionState:"default"}},t={args:{interactionState:"hover"}},a={args:{interactionState:"active"}},r={args:{disabled:!0}},o={args:{text:"Host",color:"text-yellow-300"}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    interactionState: "default"
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    interactionState: "hover"
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    interactionState: "active"
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    text: "Host",
    color: "text-yellow-300"
  }
}`,...o.parameters?.docs?.source}}};const x=["Default","Hover","Active","Disabled","Variation"];export{a as Active,e as Default,r as Disabled,t as Hover,o as Variation,x as __namedExportsOrder,g as default};
