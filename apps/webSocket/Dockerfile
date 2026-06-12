# ----------------------------------------------------
# STAGE 1: 빌드 스테이지
# ----------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build 

# ----------------------------------------------------
# STAGE 2: 최종 실행 스테이지
# ----------------------------------------------------
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist 
EXPOSE 8080
CMD ["npm","run" ,"dev"]