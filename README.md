# 初芽 · 新教师成长站 MVP V0.2

面向入职三年内中小学教师的本地信息与资源导航。基于原 Next.js App Router / TypeScript / Tailwind 项目增量开发，不需要登录、数据库或外部 AI API Key。

本轮对应 [Issue #1](https://github.com/ivyhuang3560-tech/Teacher-Compass/issues/1)，在 `feat/issue-1-mvp-v02` 分支实施，已创建 [PR #2](https://github.com/ivyhuang3560-tech/Teacher-Compass/pull/2) 供审阅；尚未合并 main 或公开上线。

产品需求、迭代原因、技术证据、风险及体验反馈见 [CHANGELOG.md](CHANGELOG.md)。每轮按“明确指标 → 开发与技术验证 → 负责人体验 → 提问并确认反馈 → 记录 → 讨论下一步”推进。未收到确认的体验不记为验收通过。

## 启动

需要 Node.js 22+ 与 npm，云端使用 Node.js 24 验证。

```bash
# 在包含 package.json 的项目目录中执行
npm ci
npm run dev
```

在自己的电脑上，打开浏览器访问 `http://localhost:3000`；以终端实际显示端口为准。保持终端开启，Ctrl+C 可停止。本任务界面不提供云端 localhost 预览链接。

云端如默认缓存目录不可写，可执行 `npm ci --cache /workspace/.npm-cache`。

```bash
npm test
npm run typecheck
npm run build
npm start
```

Windows 从已有 V0.1 更新：先停止服务并备份自己修改过的文件，确认使用本次功能分支的代码；更新 `app`、`components`、`data`、`lib`、`tests` 以及 package.json、package-lock.json 和文档。没有新增 npm 依赖，可保留已运行成功的 node_modules，不要用 main 的旧压缩包覆盖本分支。首次安装若存在 Windows 本地编译组件错误，需要单独排查，不能仅凭 Ready 判断页面成功。

## 四个主栏目与检索

| 路由 | 功能 |
| --- | --- |
| `/` | 品牌、全局自然语言查找、三栏目入口、动态和活动内容预览、工具选取 |
| `/updates` | 六大教师需求专题，多专题标签；政策文件、法律法规、教育新闻/资讯；地区和关键词筛选 |
| `/updates/[id]` | 摘要、发布日期、机构、原始链接/缺失说明、地区、专题及法律/政策效力状态 |
| `/activities` | 四类发展活动，地区、学段、学科、日期状态及规则需求匹配 |
| `/activities/[id]` | 主办方、对象、适用条件、核验和日期信息，不提供 DEMO 报名 |
| `/tools` | 原有 32 条资源，关键词/类别/学段筛选，嵌入情境推荐 |
| `/tools/[id]` | 工具详情、来源、费用/难度/限制和上手步骤 |
| `/search` | 在三个栏目本地查找；安全情境优先显示提示，链接到完整建议 |
| `/recommend` | 保留原有工具与 28 类情境推荐，不作为独立主导航 |

筛选使用 GET URL 参数。详情返回链接保留对应列表的 URL 条件，浏览器前进/后退也可恢复。地区筛选包含该地区和全国条目；多选专题按“任一匹配”处理。自然语言入口使用关键词与意图规则，显示本地匹配/空结果，不是联网 AI。

## 数据与核验边界

- `data/tools.json`：原有 32 条完全保留，不改变费用、来源和待核验标记。工具外部入口及功能仍待逐项核验。
- `data/school-scenarios.json`：原有 26 类情境保留，加受伤及肢体冲突共 28 类；安全优先级继续生效。
- `data/updates.json`：8 条明确标为 DEMO 的信息结构样例，覆盖六个专题及三种类型。
- `data/activities.json`：6 条明确标为 DEMO 的活动结构样例，覆盖四类活动。

**本轮教育部及中国政府网访问受云端网络策略阻挡，未取得可独立核验的文章原文。因此动态与活动没有真实条目，也没有已核实的近期内容或可报名活动。** 不编造政策、新法、发文日期、主办方或报名截止日；DEMO 原始 URL、真实机构、日期和核验日期均为 null，页面显示不存在/待核验，绝不拿 DEMO 作为法律依据。

`lib/content-types.ts` 区分 DEMO/真实来源、法律/政策/新闻。新闻类型没有法律效力字段；法律/政策必须提供效力状态。后续真实条目应有 HTTPS 原始文章链接、真实机构、实际核验日期和内容依据；仅知道机构主页不能视为核验完成。

活动状态按北京时间日期计算，截止日当天包含在报名窗口内。只有真实且已核验的来源、完整有效并已核验的日期才可能显示“报名中”；未核验、演示、日期矛盾均保守显示“待核验”，已过结束日的真实记录显示“已结束”。进行中但不在报名窗口内不伪装“即将开始”，当前归入待核验，未来可扩展状态。报名中也不等于个人满足参加条件。

未来录入真实数据的流程：找到原始文章 → 核对身份、日期、正文、适用范围/条件 → 法律政策核对效力 → 填写 source 和日期核验字段 → 运行测试 → 人工复核。没有自动抓取、自动审核或自动核验服务。

## 代码结构

- `app/`：页面、详情及加载/错误状态。
- `components/SiteNav.tsx`：四个主导航与选中态。
- `components/ContentUI.tsx`：搜索、筛选、来源说明、空状态等通用组件。
- `components/ContentCards.tsx`：资讯及活动卡片。
- `components/Library.tsx`、`ToolCard.tsx`、`TaskForm.tsx`：复用工具库及需求输入。
- `lib/content-types.ts`：内容类型与筛选枚举。
- `lib/content.ts`：动态/活动筛选、意图规则、日期状态和返回链接约束。
- `lib/tool-filters.ts`：从展示中分离的工具筛选逻辑。
- `lib/recommend.ts`、`scenarios.ts`、`school-scenarios.ts`：原有推荐、安全及情境规则。
- `tests/`：原有推荐与情境回归，以及新增的来源、分类、筛选、日期边界测试。
- `scripts/verify_v02_browser.py`：可选浏览器检查及截图，需要额外已有的 Python Playwright 与 Chromium；不是产品运行依赖。
- `docs/VALIDATION-V0.2.md`：技术验证、截图及待负责人体验的任务。
- `docs/PR-V0.2.md`：用于本次 PR 的可审阅描述。

浏览器检查（可选，开发者使用）：先启动网站，然后在已安装浏览器测试工具的环境执行：

```bash
python scripts/verify_v02_browser.py --base-url http://127.0.0.1:3000 --chromium /usr/bin/chromium
```

截图输出到 `docs/screenshots/`。普通 Windows 使用者无需运行或安装这套工具。

## 明确不在 V0.2 范围内

收藏/书签、我的资源库、账户、个人中心、用户偏好与个性化推荐；RSS、爬虫、定时任务、订阅通知、后台管理；真实 LLM/RAG、付费服务与自动核验。

V0.3 仅预留建议：当前资源均有稳定的栏目内 ID。未来可用 `{kind: 'update' | 'activity' | 'tool', id}` 标识收藏目标，筛选函数继续接收显式条件。偏好应与内容分离并经用户同意后使用，不在本轮提前储存用户信息或新增认证后端。这些是接口建议，不是已实现功能或下一轮批准事项。

## 已知限制与下一步

规则可能遗漏自然表达、否定、假设和多情境；一般安全建议不替代现场专业支持或学校流程。网址查询参数可能进入浏览器历史和访问日志，请勿输入学生身份或敏感材料。Windows 原有 SWC 警告及 npm 曾报告的依赖风险仍需要单独排查，本轮没有将其宣称修复。

本轮技术通过后，仍需产品负责人在自己的 Windows 环境体验四栏目、筛选返回、DEMO 边界和安全推荐。我会围绕验收指标提问，复述并确认反馈后更新日志，再共同决定下一轮方向。真实内容核验及公开部署仍是未完成事项。
