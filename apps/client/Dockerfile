# 멀티스테이지 빌드
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# pnpm 설치 (package.json의 packageManager 의존)
RUN corepack enable && corepack prepare pnpm@10.29.2 --activate

# 모노레포 설정 및 락파일 복사
# pnpm install 시 워크스페이스 내의 모든 package.json이 필요합니다.
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/client/package.json ./apps/client/
COPY apps/websocket/package.json ./apps/websocket/
COPY packages/contract/package.json ./packages/contract/

# 의존성 설치
RUN pnpm install --frozen-lockfile --ignore-scripts

# 소스 코드 복사
COPY apps/client ./apps/client
COPY packages/contract ./packages/contract

# 공유 컨트랙트 빌드 및 클라이언트 빌드
RUN pnpm --filter @ttt/contract build
RUN pnpm --filter client build

# Stage 2: Nginx 서빙
FROM nginx:alpine

# 빌드 결과물 복사
COPY --from=builder /app/apps/client/dist /usr/share/nginx/html

# Nginx 설정 복사
COPY apps/client/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
