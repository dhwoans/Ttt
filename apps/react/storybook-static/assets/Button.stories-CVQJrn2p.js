import{j as d}from"./iframe-xmOcUHRk.js";import{B as p}from"./Button-18TyIRRL.js";import"./preload-helper-PPVm8Dsz.js";function m({label:s,interactionState:n,className:i,...c}){const l={default:"",hover:"translate-x-[5px] translate-y-[5px] shadow-none",active:"translate-x-[5px] translate-y-[5px] shadow-none scale-95"};return d.jsx(p,{className:`${l[n]} ${i??""}`.trim(),...c,children:s})}const S={title:"Core/Button",component:m,tags:["autodocs"],args:{label:"Play",variant:"primary",size:"md",disabled:!1,interactionState:"default"},argTypes:{label:{control:"text"},variant:{control:{type:"inline-radio"},options:["primary","secondary","danger"]},size:{control:{type:"inline-radio"},options:["sm","md","lg"]},disabled:{control:"boolean"},interactionState:{control:{type:"inline-radio"},options:["default","hover","active"]}}},e={args:{interactionState:"default"}},a={args:{interactionState:"hover"}},r={args:{interactionState:"active"}},t={args:{disabled:!0}},o={args:{variant:"danger",label:"Delete"}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "danger",
    label: "Delete"
  }
}`,...o.parameters?.docs?.source}}};const f=["Default","Hover","Active","Disabled","Variation"];export{r as Active,e as Default,t as Disabled,a as Hover,o as Variation,f as __namedExportsOrder,S as default};
