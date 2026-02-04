# Claude Code と Cursor を使ってミニアプリ作成してみた

## 概要

📚 書籍管理アプリ（Book Manager）実装
学習用のフルスタック CRUD アプリケーション。

**使用技術**

Java 21 / Spring Boot / React / PostgreSQL / Docker

---

## 🏗️ プロジェクト構成

```
/
├── backend/                    # Spring Boot アプリケーション
│   ├── src/main/java/com/example/bookmanager/
│   │   ├── config/            # Spring Security 設定
│   │   ├── controller/        # REST API
│   │   ├── dto/               # リクエスト / レスポンス DTO
│   │   ├── entity/            # JPA エンティティ
│   │   ├── repository/        # JPA リポジトリ
│   │   ├── service/           # ビジネスロジック
│   │   └── BookManagerApplication.java
│   ├── src/main/resources/
│   │   └── application.yml
│   ├── build.gradle
│   └── Dockerfile
│
├── frontend/                   # React アプリケーション
│   ├── src/
│   │   ├── components/        # UI コンポーネント
│   │   ├── pages/             # ページコンポーネント
│   │   ├── services/          # API 呼び出し
│   │   ├── types/             # TypeScript 型定義
│   │   └── App.tsx
│   ├── package.json
│   └── Dockerfile
│
└── docker-compose.yml

```

---

## 🧰 技術スタック詳細

### バックエンド

- Java 21
- Spring Boot 3.2.x
- Spring Security（JWT 認証）
- Spring Data JPA
- PostgreSQL Driver
- Gradle

### フロントエンド

- React 18
- TypeScript
- Vite（ビルドツール）
- Axios（HTTP クライアント）
- React Router（ルーティング）

### インフラ

- Docker / Docker Compose
- PostgreSQL 16

## 開発補助ツール

- Claude Code（設計・実装補助）
- Cursor

---

## 🗃️ データモデル

### User（ユーザー）

| カラム    | 型            | 説明                       |
| --------- | ------------- | -------------------------- |
| id        | Long          | 主キー                     |
| email     | String        | メールアドレス（ユニーク） |
| password  | String        | パスワード（ハッシュ化）   |
| name      | String        | ユーザー名                 |
| createdAt | LocalDateTime | 作成日時                   |

### Book（書籍）

| カラム        | 型            | 説明                        |
| ------------- | ------------- | --------------------------- |
| id            | Long          | 主キー                      |
| title         | String        | タイトル                    |
| author        | String        | 著者                        |
| isbn          | String        | ISBN                        |
| publishedDate | LocalDate     | 出版日                      |
| description   | String        | 説明                        |
| userId        | Long          | 所有ユーザー ID（外部キー） |
| createdAt     | LocalDateTime | 作成日時                    |
| updatedAt     | LocalDateTime | 更新日時                    |

---

## 🔌 API エンドポイント

### 認証

- `POST /api/auth/register`：ユーザー登録
- `POST /api/auth/login`：ログイン（JWT トークン発行）
- `POST /api/auth/logout`：ログアウト

### 書籍（認証必須）

- `GET /api/books`：書籍一覧取得（自分の書籍のみ）
- `GET /api/books/{id}`：書籍詳細取得
- `POST /api/books`：書籍登録
- `PUT /api/books/{id}`：書籍更新
- `DELETE /api/books/{id}`：書籍削除

---

## 🛠️ 実装ステップ

### Step 1：プロジェクト基盤

1. バックエンド（Spring Boot）プロジェクト作成
2. フロントエンド（React + Vite）プロジェクト作成
3. Docker Compose 設定

### Step 2：バックエンド（エンティティ・リポジトリ）

1. User エンティティ
2. Book エンティティ
3. JPA リポジトリ

### Step 3：バックエンド（認証）

1. Spring Security 設定
2. JWT 生成・検証サービス
3. 認証コントローラー

### Step 4：バックエンド（CRUD API）

1. 書籍サービス
2. 書籍コントローラー
3. DTO 定義

### Step 5：フロントエンド（基盤）

1. ルーティング設定
2. API クライアント設定
3. 認証コンテキスト

### Step 6：フロントエンド（画面）

1. ログイン・登録画面
2. 書籍一覧画面
3. 書籍登録・編集画面

---

## ✅ 検証方法

1. `docker-compose up -d` でアプリ起動
2. [http://localhost:3000](http://localhost:3000/) にアクセス
3. ユーザー登録 → ログイン → 書籍 CRUD 操作を確認

---

## 🎯 学習ポイント

- Spring Security：JWT 認証の実装パターン
- JPA：エンティティ設計・リレーション
- React：状態管理・API 連携
- Docker：マルチコンテナ構成
