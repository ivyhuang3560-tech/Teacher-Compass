import records from '../data/tools.json';
import { identifySchoolScenario } from './school-scenarios';
import { identifySafetyScenario, taskAliases } from './scenarios';
export const tools = records;
export type Tool = typeof records[number];
export const categories = ['课件制作','教学设计','试题资源','课堂互动','班级管理','政策信息','教育辅助','教师成长','多媒体处理','学术科研'];
export const stages = ['小学','初中','高中'];
export function validateTask(input: string) {
  if (input.trim().length < 4) return '请至少输入 4 个字，描述具体教学任务。';
  if (input.trim().length > 500) return '需求请控制在 500 字以内。';
  return '';
}
// 确定性的关键词评分，不调用大模型。价格未核验时绝不保证“免费”。
export function recommend(input: string) {
  const query = input.trim().toLowerCase();
  const stage = stages.find(s => query.includes(s));
  const constraints = [stage, /免费|预算|不花钱/.test(query) ? '希望免费：当前费用未核验，无法保证满足' : '', /简单|新手|容易/.test(query) ? '偏好低门槛' : ''].filter(Boolean) as string[];
  const safety = identifySafetyScenario(query);
  const matchedScenario = identifySchoolScenario(query);
  const guidance = safety && !matchedScenario?.priority ? null : matchedScenario;
  const intents = Object.entries(taskAliases)
    .filter(([, aliases]) => aliases.some(alias => query.includes(alias)))
    .map(([category]) => category);
  const ranked = tools.map(tool => {
    const matched = tool.tags.filter(tag => query.includes(tag.toLowerCase()));
    const intentMatch = intents.includes(tool.category);
    const nameMatch = query.includes(tool.name.toLowerCase());
    const score = (nameMatch ? 12 : 0) + matched.length * 3 + (query.includes(tool.category) ? 4 : 0) + (intentMatch ? 4 : 0);
    return {tool, score, reason: `匹配“${nameMatch ? tool.name : matched.join('、') || tool.category}”；${tool.description}`};
  }).filter(item => item.score > 0 && (!stage || item.tool.stages.includes(stage)))
    .sort((a,b) => b.score-a.score || (query.includes('简单') ? Number(a.tool.difficulty !== '入门')-Number(b.tool.difficulty !== '入门') : 0));
  // 受伤及冲突场景优先展示安全提示，不把课件或沟通工具作为处置建议。
  const results = safety ? tools.filter(tool => ['moe', 'gov'].includes(tool.id)).map(tool => ({
    tool, score: 0, reason: '校园安全事件相关政策的事后查询入口；不是急救服务，也未定位到具体文件。',
  })) : guidance ? guidance.toolIds.flatMap((id, index) => {
    const tool = tools.find(tool => tool.id === id && (!stage || tool.stages.includes(stage)));
    return tool ? [{tool, score: guidance.toolIds.length - index,
      reason: `与“${guidance.example}”情境相关的辅助入口；不替代现场处置、学校流程或专业判断。`}] : [];
  }).slice(0,3) : ranked.slice(0,3);
  return { task: (guidance?.priority ? guidance.example : safety?.title || guidance?.example) || [...new Set(ranked.map(r => r.tool.category))].join(' / ') || '暂未识别', constraints, results, safety, guidance };
}
// 未来可用 Dify 或服务端 LLM 实现同一接口，页面不必依赖具体供应商。
export interface RecommendationProvider { recommend(input: string): Promise<ReturnType<typeof recommend>> }
export const ruleProvider: RecommendationProvider = { recommend: async input => recommend(input) };
