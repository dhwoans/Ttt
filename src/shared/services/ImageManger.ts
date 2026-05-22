import ticTacToe from "@assets/ticTacToe.webp";
import click from "@assets/click.webp";
import gameStart from "@assets/gameStart.webp";
import notFound404 from "@assets/404.webp";

import robot from "@assets/bots/Robot.webm";

import gear from "@assets/icons/Gear.webp";
import wavingHand from "@assets/icons/Waving_Hand.webm";
import chequeredFlag from "@assets/icons/ChequeredFlag.webm";
import joystick from "@assets/icons/Joystick.webp";
import horns from "@assets/icons/Horns.webm";
import thumbsDown from "@assets/icons/Thumbs_Down.webm";
import handshake from "@assets/icons/Handshake.webm";
import hourglassNotDone from "@assets/icons/Hourglass_Not_Done.webm";
import verse from "@assets/icons/verse.webp";
import thoughtBalloon from "@assets/icons/thoughtBalloon.webp";

import single from "@assets/backgrounds/single.webp"
import local from "@assets/backgrounds/local.webp"
import multi from "@assets/backgrounds/multi.webp"
import charater  from "@assets/backgrounds/charater.webp"
import spotlight  from "@assets/backgrounds/spotlight.png"
import toBeContinue from "@assets/backgrounds/toBeContinue.png";
import jojoEffect from "@assets/backgrounds/jojoEffect.png";

// 에셋 이미지 리소스 단일 진입점
export const ImageManager = {
  ticTacToe,
  click,
  gameStart,
  notFound404,
  robot,
  gear,
  wavingHand,
  chequeredFlag,
  joystick,
  horns,
  thumbsDown,
  handshake,
  hourglassNotDone,
  verse,
  single,
  local,
  multi,
  charater,
  spotlight,
  toBeContinue,
  jojoEffect,
  thoughtBalloon,
} as const;
