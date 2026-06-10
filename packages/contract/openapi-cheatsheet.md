# OpenAPI 3.1 CheatSheet

## 🔷 최상위 구조 (Root Object)

```yaml
openapi: 3.1.0          # 버전 (필수)
info: ...               # API 메타정보 (필수)
servers: [...]          # 서버 목록
paths: ...              # 엔드포인트 정의 (필수)
components: ...         # 재사용 컴포넌트
tags: [...]             # 태그 목록
security: [...]         # 전역 보안 정책
```

---

## 🔷 info

```yaml
info:
  title: My API          # API 이름 (필수)
  version: 1.0.0         # API 버전 (필수)
  description: |         # 설명 (Markdown 가능)
    여러 줄 설명
  contact:
    name: 담당자
    email: dev@example.com
  license:
    name: MIT
```

---

## 🔷 servers

```yaml
servers:
  - url: https://api.example.com/v1
    description: 운영 서버
  - url: http://localhost:3000
    description: 로컬 개발 서버
  - url: https://{env}.example.com   # 변수 사용
    variables:
      env:
        default: dev
        enum: [dev, staging, prod]
```

---

## 🔷 paths — 엔드포인트 정의

```yaml
paths:
  /users/{id}:
    get:
      operationId: getUser    # 고유 식별자 (코드 생성 시 사용)
      summary: 사용자 조회
      description: 상세 설명
      tags: [User]
      parameters:
        - name: id
          in: path            # path | query | header | cookie
          required: true
          schema:
            type: string
      responses:
        "200":
          description: 성공
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"
```

---

## 🔷 parameters

```yaml
parameters:
  - name: page
    in: query
    required: false
    schema:
      type: integer
      default: 1
      minimum: 1
  - name: Authorization
    in: header
    required: true
    schema:
      type: string
      example: Bearer token123
```

---

## 🔷 requestBody

```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: "#/components/schemas/CreateUserRequest"
      examples:
        basic:
          summary: 기본 예시
          value:
            name: 홍길동
        admin:
          summary: 관리자 계정
          value:
            name: 관리자
            role: admin
```

---

## 🔷 responses

```yaml
responses:
  "200":
    description: 성공
    content:
      application/json:
        schema:
          $ref: "#/components/schemas/User"
  "400":
    description: 잘못된 요청
    content:
      application/json:
        schema:
          $ref: "#/components/schemas/ErrorResponse"
  "401":
    description: 인증 필요
  "404":
    description: 리소스 없음
  "500":
    description: 서버 오류
```

---

## 🔷 components/schemas — 타입 정의

```yaml
components:
  schemas:
    User:
      type: object
      required: [id, name]        # 필수 필드 목록
      properties:
        id:
          type: string
          example: user-123
        name:
          type: string
          maxLength: 50
        age:
          type: integer
          minimum: 0
          maximum: 150
        role:
          type: string
          enum: [user, admin]      # 허용 값 제한
        tags:
          type: array
          items:
            type: string
        address:
          $ref: "#/components/schemas/Address"
```

---

## 🔷 Schema 주요 타입 & 속성

| 타입 | 속성 |
|------|------|
| `string` | `minLength`, `maxLength`, `pattern`, `format`, `enum` |
| `integer` / `number` | `minimum`, `maximum`, `multipleOf` |
| `boolean` | — |
| `array` | `items`, `minItems`, `maxItems`, `uniqueItems` |
| `object` | `properties`, `required`, `additionalProperties` |

```yaml
# format 예시
type: string
format: date-time   # date, time, date-time, email, uri, uuid, password
```

---

## 🔷 $ref — 참조

```yaml
# 같은 파일 내
$ref: "#/components/schemas/User"

# 외부 파일
$ref: "./schemas/user.yaml#/User"
$ref: "./paths/users.yaml"
```

---

## 🔷 조합 키워드 (Composition)

```yaml
# 여러 스키마 모두 만족
allOf:
  - $ref: "#/components/schemas/Base"
  - type: object
    properties:
      extra: { type: string }

# 하나 이상 만족
anyOf:
  - $ref: "#/components/schemas/Cat"
  - $ref: "#/components/schemas/Dog"

# 정확히 하나만 만족
oneOf:
  - $ref: "#/components/schemas/Success"
  - $ref: "#/components/schemas/Error"
```

---

## 🔷 security — 인증

```yaml
# 전역 또는 operation 레벨
security:
  - BearerAuth: []

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
    ApiKey:
      type: apiKey
      in: header
      name: X-API-Key
    OAuth2:
      type: oauth2
      flows:
        authorizationCode:
          authorizationUrl: https://example.com/oauth/authorize
          tokenUrl: https://example.com/oauth/token
          scopes:
            read: 읽기 권한
```

---

## 🔷 현재 프로젝트 구조 패턴

```
contract/
├── openapi.yaml              # 루트 (info, servers, paths/$ref, components/$ref)
├── paths/
│   └── ticket.yaml           # operation 단위로 파일 분리
└── schemas/
    ├── rest.yaml             # REST 스키마
    ├── common.yaml           # 공통 스키마
    ├── socket-client.yaml    # 소켓 클라이언트 스키마
    └── socket-server.yaml    # 소켓 서버 스키마
```

> `$ref`로 파일을 분리하면 스키마/경로를 모듈처럼 관리할 수 있어 유지보수가 용이합니다.

---

## 🔷 HTTP 요청 → OpenAPI YAML 작성 예시

HTTP 요청을 보고 OpenAPI YAML을 어떻게 작성하는지 대응 예시입니다.

---

### GET — 목록 조회 (query parameter)

```http
GET http://localhost:3000/users?page=1&limit=20
```

```yaml
paths:
  /users:
    get:
      summary: 사용자 목록 조회
      operationId: getUsers
      tags: [User]
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        "200":
          description: 성공
          content:
            application/json:
              schema:
                type: object
                properties:
                  items:
                    type: array
                    items:
                      $ref: "#/components/schemas/User"
                  total:
                    type: integer
```

---

### GET — 단건 조회 (path parameter)

```http
GET http://localhost:3000/users/user-123
```

```yaml
paths:
  /users/{id}:
    get:
      summary: 사용자 단건 조회
      operationId: getUserById
      tags: [User]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            example: user-123
      responses:
        "200":
          description: 성공
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"
        "404":
          description: 사용자 없음
```

---

### POST — 생성 (request body)

```http
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "홍길동",
  "age": 30,
  "role": "user"
}
```

```yaml
paths:
  /users:
    post:
      summary: 사용자 생성
      operationId: createUser
      tags: [User]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name]
              properties:
                name:
                  type: string
                  example: 홍길동
                age:
                  type: integer
                  example: 30
                role:
                  type: string
                  enum: [user, admin]
                  default: user
            example:
              name: 홍길동
              age: 30
              role: user
      responses:
        "201":
          description: 생성 성공
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"
        "400":
          description: 잘못된 요청
```

---

### PUT — 전체 수정 (path parameter + request body)

```http
PUT http://localhost:3000/users/user-123
Content-Type: application/json

{
  "name": "홍길동",
  "age": 31,
  "role": "admin"
}
```

```yaml
paths:
  /users/{id}:
    put:
      summary: 사용자 전체 수정
      operationId: updateUser
      tags: [User]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, age, role]
              properties:
                name:
                  type: string
                age:
                  type: integer
                role:
                  type: string
                  enum: [user, admin]
            example:
              name: 홍길동
              age: 31
              role: admin
      responses:
        "200":
          description: 수정 성공
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"
        "404":
          description: 사용자 없음
```

---

### DELETE — 삭제 (path parameter)

```http
DELETE http://localhost:3000/users/user-123
```

```yaml
paths:
  /users/{id}:
    delete:
      summary: 사용자 삭제
      operationId: deleteUser
      tags: [User]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        "204":
          description: 삭제 성공 (본문 없음)
        "404":
          description: 사용자 없음
```

---

### 📌 in: 위치 한눈에 비교

| HTTP 위치 | OpenAPI `in` 값 | 예시 |
|-----------|----------------|------|
| URL 경로 `/users/{id}` | `path` | `in: path` |
| URL 쿼리 `?page=1` | `query` | `in: query` |
| 요청 헤더 | `header` | `in: header` |
| 쿠키 | `cookie` | `in: cookie` |
| 요청 바디 `{ ... }` | `requestBody` | (parameter 아님) |

---

## 🔷 현재 프로젝트 구조 패턴
