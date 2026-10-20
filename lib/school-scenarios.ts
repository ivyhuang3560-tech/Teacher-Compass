import records from '../data/school-scenarios.json';
export const schoolScenarios = records;

// 以命中短语的具体程度排序，避免单个“学生/课堂”词触发所有情境。
// 优先处理安全事项；并列时保持目录顺序，规则与建议均可独立维护。
export function identifySchoolScenario(query: string) {
  return schoolScenarios.map(scenario => {
    const matches = scenario.phrases.filter(phrase => query.includes(phrase));
    const studentContext = /学生|孩子|同学/.test(query);
    if (studentContext && scenario.id === 'missing' && /不见了|联系不上|找不到了|下落不明|擅自离校/.test(query)) matches.push('学生去向不明');
    if (studentContext && scenario.id === 'illness' && /呕吐|发烧|发热|肚子疼|腹痛|身体不舒服/.test(query)) matches.push('学生身体不适');
    return { scenario, score: matches.reduce((sum, phrase) => sum + phrase.length, 0) };
  }).filter(item => item.score > 0)
    .sort((a, b) => Number(b.scenario.priority) - Number(a.scenario.priority) || b.score - a.score)[0]?.scenario ?? null;
}
