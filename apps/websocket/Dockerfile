# ----------------------------------------------------
# STAGE 1: 빌드 스테이지
# ----------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# pnpm 설치 (package.json의 packageManager 의존)
RUN corepack enable && corepack prepare pnpm@10.29.2 --activate

# 모노레포 설정 및 락파일 복사
# pnpm install 시 워크스페이스 내의 모든 package.json이 필요합니다.
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/websocket/package.json ./apps/websocket/
COPY apps/client/package.json ./apps/client/
COPY packages/contract/package.json ./packages/contract/

# 의존성 설치
RUN pnpm install --frozen-lockfile --ignore-scripts

# 소스 코드 복사
COPY apps/websocket ./apps/websocket
COPY packages/contract ./packages/contract

# 공유 컨트랙트 빌드 및 백엔드 빌드
RUN pnpm --filter @ttt/contract build
RUN pnpm --filter websocket build

# ----------------------------------------------------
# STAGE 2: 최종 실행 스테이지
# ----------------------------------------------------
FROM node:20-alpine AS production
WORKDIR /app

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@10.29.2 --activate

# 필요한 파일 복사 (프로덕션 의존성 설치용)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/websocket/package.json ./apps/websocket/
COPY apps/client/package.json ./apps/client/
COPY packages/contract/package.json ./packages/contract/

# 프로덕션 의존성만 설치
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# 빌드된 결과물 복사
COPY --from=builder /app/apps/websocket/dist ./apps/websocket/dist
COPY --from=builder /app/packages/contract/dist ./packages/contract/dist

EXPOSE 8080

# 작업 디렉토리 이동 후 실행
WORKDIR /app/apps/websocket
CMD ["node", "dist/app.js"]
