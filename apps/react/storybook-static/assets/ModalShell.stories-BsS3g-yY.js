import{j as e}from"./iframe-xmOcUHRk.js";import{B as p}from"./Button-18TyIRRL.js";import"./preload-helper-PPVm8Dsz.js";const u="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full h-full flex items-center justify-center bg-transparent p-0 border-0",g="bg-white rounded-2xl p-8 w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate__animated animate__bounceIn relative z-10";function m({className:o,dialogClassName:i,children:c}){return e.jsxs("dialog",{open:!0,className:`${u} ${i??""}`.trim(),children:[e.jsx("div",{className:"fixed inset-0 bg-black/50 -z-10"}),e.jsx("div",{className:`${g} ${o??""}`.trim(),children:c})]})}m.__docgenInfo={description:"",methods:[],displayName:"ModalShell",props:{className:{required:!1,tsType:{name:"string"},description:""},dialogClassName:{required:!1,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};function h({title:o,description:i,panelWidth:c,interactionState:l,variant:x}){const d={default:"",hover:"translate-x-[5px] translate-y-[5px] shadow-none",active:"translate-x-[5px] translate-y-[5px] shadow-none scale-95",disabled:"opacity-50 pointer-events-none"};return e.jsx("div",{className:"w-[min(92vw,760px)] h-105 relative",children:e.jsxs(m,{className:c,children:[e.jsx("h3",{className:"text-2xl font-black text-center mb-4 text-black",children:o}),e.jsx("p",{className:"text-center text-black mb-6",children:i}),e.jsxs("div",{className:"flex gap-4 justify-center",children:[e.jsx(p,{variant:"secondary",className:d[l],children:"취소"}),e.jsx(p,{variant:x==="danger"?"danger":"primary",className:d[l],children:"확인"})]})]})})}const S={title:"Core/ModalShell",component:h,tags:["autodocs"],args:{title:"나가시겠습니까?",description:"현재 진행 상태가 저장되지 않을 수 있습니다.",panelWidth:"max-w-md",interactionState:"default",variant:"default"},argTypes:{title:{control:"text"},description:{control:"text"},panelWidth:{control:{type:"inline-radio"},options:["max-w-md","max-w-lg"]},interactionState:{control:{type:"inline-radio"},options:["default","hover","active","disabled"]},variant:{control:{type:"inline-radio"},options:["default","danger"]}}},a={},t={args:{interactionState:"hover"}},r={args:{interactionState:"active"}},s={args:{interactionState:"disabled"}},n={args:{variant:"danger",panelWidth:"max-w-lg",title:"정말 삭제할까요?",description:"이 작업은 되돌릴 수 없습니다."}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:"{}",...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    interactionState: "hover"
  }
}`,...t.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    interactionState: "active"
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    interactionState: "disabled"
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "danger",
    panelWidth: "max-w-lg",
    title: "정말 삭제할까요?",
    description: "이 작업은 되돌릴 수 없습니다."
  }
}`,...n.parameters?.docs?.source}}};const y=["Default","Hover","Active","Disabled","Variation"];export{r as Active,a as Default,s as Disabled,t as Hover,n as Variation,y as __namedExportsOrder,S as default};
