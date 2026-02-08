# Repository Guidelines

## 项目概述
该项目是基于 Next.js App Router 的管理后台，提供管理员登录/权限、词书管理、单词导入等功能，并通过 Drizzle ORM 连接 MySQL 数据库。

## 安装与运行
1. 环境变量：在项目根目录创建 `.env`，至少包含 `DATABASE_URL`。\n   示例：`DATABASE_URL=mysql://user:pass@host:3306/dbname`\n2. 安装依赖：`pnpm install`\n3. 本地开发：`pnpm dev`\n4. 生产构建：`pnpm build`\n5. 生产启动：`pnpm start`\n6. 代码检查：`pnpm lint`\n7. 数据库同步：`pnpm dlx drizzle-kit push`

## 目录结构与路由/API
- 前端页面：`app/`（App Router）\n  - 认证：`app/(auth)/signin`、`app/(auth)/signup`\n  - 后台：`app/(dashboard)/books`、`app/(dashboard)/admin-users`\n- 服务器 API：`app/api/`\n  - `app/api/words/upload`: 上传 JSONL 单词文件\n  - `app/api/signout`: 登出并清理会话\n- 数据库：`drizzle/`（`drizzle/schema.ts`）\n- 业务工具：`lib/`（`auth.ts`, `db.ts`, `password.ts`）\n- 脚本：`scripts/`（如 `scripts/import-words.js`）

## 技术栈与依赖
- Next.js 16 + React 19\n- TailwindCSS（UI 样式）\n- Drizzle ORM + mysql2（数据库访问）\n- TypeScript（类型与构建）

## 其他说明
- 会话使用 `admin_session` Cookie（服务端设置），7 天有效。\n- 导入单词支持 JSONL（每行一个 JSON 对象）。\n- 修改数据库结构后，使用 `pnpm dlx drizzle-kit push` 同步到远程 MySQL。
