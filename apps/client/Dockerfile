# 멀티스테이지 빌드
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@10.29.2 --activate

# 모노레포 설정 및 락파일 복사
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
# 모든 패키지의 package.json 복사 (의존성 설치용)
COPY apps/client/package.json ./apps/client/
COPY apps/websocket/package.json ./apps/websocket/
COPY packages/contract/package.json ./packages/contract/
COPY packages/core/package.json ./packages/core/
COPY packages/ui/package.json ./packages/ui/

# 의존성 설치
RUN pnpm install --frozen-lockfile --ignore-scripts

# 소스 코드 복사
COPY packages/contract ./packages/contract
COPY packages/core ./packages/core
COPY packages/ui ./packages/ui
COPY apps/client ./apps/client

# 의존성 패키지 빌드
RUN pnpm --filter @ttt/contract build
RUN pnpm --filter @ttt/core build
RUN pnpm --filter @ttt/ui build

# 클라이언트 빌드
RUN pnpm --filter client build

# Stage 2: Nginx 서빙
FROM nginx:alpine

# 빌드 결과물 복사
COPY --from=builder /app/apps/client/dist /usr/share/nginx/html

# Nginx 설정 복사
COPY apps/client/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
