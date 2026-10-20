# 初芽 · 新教师成长站 MVP V0.1

面向入职三年内中小学教师的工具与资源导航。使用 Next.js App Router、TypeScript、Tailwind CSS 和本地 JSON，无登录、数据库或外部 AI 调用。

## 本地启动

需要 Node.js 22+ 和 npm。当前环境已使用 Node.js 24 验证。

```bash
cd /workspace/Teacher-Compass
npm ci --cache /workspace/.npm-cache
npm run dev
```

开发服务默认使用 3000 端口。在自己的电脑上可用浏览器打开 http://localhost:3000；云端请使用平台支持的端口访问方式。本任务界面不提供 localhost 预览链接。

```bash
npm test          # 核心推荐逻辑测试
npm run typecheck # TypeScript 检查
npm run build     # 生产构建
npm start         # 构建后启动生产服务
```

## 文件说明

- `app/page.tsx`：首页及四个任务示例、四个场景入口。
- `app/recommend/page.tsx`：需求展示、条件识别、最多三个候选资源。
- `app/tools/page.tsx`、`components/Library.tsx`：关键词、学段与类别筛选。
- `app/tools/[id]/page.tsx`：工具详情、官方入口、限制及操作步骤。
- `components/TaskForm.tsx`：输入校验及推荐页面跳转。
- `components/ToolCard.tsx`：资源卡片及可展开指南。
- `data/tools.json`：12 条初始资源，修改这里即可维护工具库。
- `lib/recommend.ts`：规则匹配与未来 AI 的接口，独立于页面。
- `tests/recommend.test.ts`：推荐排序、空结果、输入限制和目录完整性测试。
- `app/globals.css`：响应式样式。

## 推荐规则与局限

每个匹配标签加 3 分，完整类别名称匹配加 4 分，按得分降序取前三个；同分按初始数据顺序，明确包含“简单”时优先入门工具。通过“小学/初中/高中”识别学段。当前学段数据为广泛候选覆盖，未经逐一验证，不能视为适用性认证。

费用资料全部标记待核验；不会承诺满足免费约束。难度为编辑初步判断，并非官方评级。未使用模型、不保存用户需求、不上传学生信息。操作指南为入门探索建议，具体产品界面和功能待核验。未添加虚构评价。

## 下一步接入 Dify 或 LLM

1. 在服务端新增推荐 API，实现 `RecommendationProvider`，保留规则实现作为降级路径。
2. 通过服务端环境变量管理密钥，不使用 `NEXT_PUBLIC_`，不写入 JSON 或 Git。
3. 模型只返回本地目录中存在的工具 ID；服务端验证结构和 ID，再读取真实链接和资料。
4. 加入超时、错误提示、调用限额与隐私告知；测试推荐相关性与不编造信息。

本版本无需 API Key，不会产生 AI 服务费用。接入前先核实工具数据及价格，取得调用服务所需账号和授权。
