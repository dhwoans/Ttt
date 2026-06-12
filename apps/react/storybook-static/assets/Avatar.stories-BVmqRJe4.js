import{j as o}from"./iframe-xmOcUHRk.js";import"./preload-helper-PPVm8Dsz.js";const p={small:{container:"h-15 w-15 text-3xl",marker:"text-3xl"},large:{container:"h-50 w-50 text-8xl",marker:"text-8xl"}};function d({size:n,children:i}){const c=n==="small"?"small":"large",{container:l}=p[c];return o.jsx("div",{className:`relative grid place-items-center ${l} rounded-full bg-white overflow-hidden`,children:o.jsx("div",{className:"flex items-center justify-center text-center",children:i})})}d.__docgenInfo={description:"",methods:[],displayName:"Avatar",props:{size:{required:!1,tsType:{name:"union",raw:'"small" | "large"',elements:[{name:"literal",value:'"small"'},{name:"literal",value:'"large"'}]},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""}}};function u({size:n,marker:i,disabled:c,interactionState:l}){const m={default:"",hover:"scale-105",active:"scale-95"};return o.jsx("div",{className:`${m[l]} transition-transform ${c?"opacity-35 grayscale":""}`,children:o.jsx(d,{size:n,children:i})})}const f={title:"Core/Avatar",component:u,tags:["autodocs"],args:{size:"small",marker:"🐱",disabled:!1,interactionState:"default"},argTypes:{size:{control:{type:"inline-radio"},options:["small","large"]},marker:{control:"text"},disabled:{control:"boolean"},interactionState:{control:{type:"inline-radio"},options:["default","hover","active"]}}},e={args:{interactionState:"default"}},a={args:{interactionState:"hover"}},r={args:{interactionState:"active"}},t={args:{disabled:!0}},s={args:{size:"large",marker:"🤖"}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    interactionState: "default"
  }
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    interactionState: "hover"
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    interactionState: "active"
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    size: "large",
    marker: "🤖"
  }
}`,...s.parameters?.docs?.source}}};const x=["Default","Hover","Active","Disabled","Variation"];export{r as Active,e as Default,t as Disabled,a as Hover,s as Variation,x as __namedExportsOrder,f as default};
