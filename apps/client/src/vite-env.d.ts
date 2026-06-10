/// <reference types="vite/client" />
declare module "*.css";
declare module "*.mp3";
declare module "*.wav";
declare module "*.ogg";
declare module "*.gif";
declare module "*.png";
declare module "lit";

declare global {
  interface Window {
    lobbyWebsocket?: any;
  }
}

export {};
