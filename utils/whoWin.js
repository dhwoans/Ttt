import { WINNING_COMBINATIONS } from "./winning-combinations.js";

const whoWin = (gameCells) => {
  // 각 승리 조합을 검사해서 세 칸이 모두 같고 빈칸이 아니면 승자 반환
  for (const comb of WINNING_COMBINATIONS) {
    const a = gameCells[comb[0].row][comb[0].column];
    const b = gameCells[comb[1].row][comb[1].column];
    const c = gameCells[comb[2].row][comb[2].column];
    if (a !== "" && a === b && b === c) {
      return a
    }
  }
  // 모든 조합 검사 후 승자가 없으면 -1 반환
  return -1;
};

export default whoWin;
