## 问题与最终行为

V0.1 只有工具目录与情境推荐，缺少独立的教育信息和成长活动结构。本次在原项目上增量升级为 MVP V0.2：统一首页、教育动态、发展活动、工具导航四个主导航；推荐保留在页面内，原 32 条工具和 28 类校园情境不变。

Refs #1。请在本分支审阅，不自动合并 main。

## 主要改动

- 首页提供全局自然语言查找、三栏目入口、动态/活动内容预览及工具选取，来源与演示边界明确。
- 教育动态支持六大教师需求专题、多专题标签、政策/法律/资讯类型、关键词与地区；详情区分来源、日期、地区与法律效力，新闻不作为法律依据。
- 发展活动支持四类活动、地区、学段、学科、状态和明示的规则需求匹配；状态按北京时间和核验后的日期推导，保守处理矛盾/缺失信息。
- 工具列表改用 URL 筛选，保留原详情、安全优先级和情境浏览；全局搜索遇到安全情境时优先引导完整提示。
- 通用卡片、筛选、来源说明、空/错误/加载状态，选中导航、键盘跳到内容及移动端响应式。
- 独立内容类型/筛选/日期状态函数，无登录、数据库或真实 AI API，无新增 npm 依赖。

## 数据真实程度与未完成

**8 条教育动态及 6 条活动均为显著 DEMO，没有真实条目、真实近期资讯或已核验可报名活动。** 教育部及中国政府网原文在本次环境请求中被代理返回 403，因此采用 Issue 允许的保守演示方案。所有 DEMO 原始链接、机构、日期及核验日期均为空，不虚构政策、新闻、赛事或截止日，页面不可报名。

32 条原有工具完全保留，功能、费用、入口等仍沿用待核验状态。安全及教育建议未完成专业评审。真实内容收录、Windows 原有编译组件警告与依赖风险仍需后续处理；本轮不声称已修复。

## 验证

- `npm test`：35 项通过（原有 24 项回归 + 新增 11 项）。
- `npm run typecheck`、`npm run build`：通过。
- Chromium 实际交互：四主页面、导航选中、专题/类型筛选、详情返回保留、活动规则匹配和报名空结果、32 条工具及详情返回、全局安全优先、过长输入/404、390px 无横向溢出、键盘跳过导航、无页面脚本错误。
- HTTP：46 个详情页可访问，三个不存在详情路由返回 404。
- 日期自动测试中的“报名中/已结束”使用隔离的测试夹具，不是产品真实数据。
- 说明与可复现方法：[验证卡](https://github.com/ivyhuang3560-tech/Teacher-Compass/blob/feat/issue-1-mvp-v02/docs/VALIDATION-V0.2.md)。
- **产品负责人 Windows 体验、教育/法律专业核验和目标用户验证尚未完成**；未记为用户验收通过。

## 截图

### 首页桌面

![首页桌面](https://raw.githubusercontent.com/ivyhuang3560-tech/Teacher-Compass/feat/issue-1-mvp-v02/docs/screenshots/home-desktop.png)

### 首页移动端

<img alt="首页移动端" width="300" src="https://raw.githubusercontent.com/ivyhuang3560-tech/Teacher-Compass/feat/issue-1-mvp-v02/docs/screenshots/home-mobile.png" />

其余截图：[教育动态桌面](https://github.com/ivyhuang3560-tech/Teacher-Compass/blob/feat/issue-1-mvp-v02/docs/screenshots/updates-desktop.png) · [发展活动桌面](https://github.com/ivyhuang3560-tech/Teacher-Compass/blob/feat/issue-1-mvp-v02/docs/screenshots/activities-desktop.png) · [工具导航桌面](https://github.com/ivyhuang3560-tech/Teacher-Compass/blob/feat/issue-1-mvp-v02/docs/screenshots/tools-desktop.png) · [教育动态移动端](https://github.com/ivyhuang3560-tech/Teacher-Compass/blob/feat/issue-1-mvp-v02/docs/screenshots/updates-mobile.png)。

## V0.3 接口预留建议（本轮不实施）

内容拥有稳定的栏目内 ID，可用 `{kind: 'update' | 'activity' | 'tool', id}` 作为未来收藏目标。筛选函数已接收显式条件，未来偏好可作为独立输入，并与内容存储分离。未添加收藏按钮、用户存储、认证后端或伪个性化；是否实施由负责人体验反馈后再决定。
