import Link from 'next/link';
import TaskForm from '@/components/TaskForm';
import ToolCard from '@/components/ToolCard';
import { schoolScenarios } from '@/lib/school-scenarios';
import { recommend, validateTask } from '@/lib/recommend';

export default async function Page({ searchParams }: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';
  const error = validateTask(q);
  const result = error ? null : recommend(q);
  return <div className="page">
    <Link className="text-link" href="/tools">← 返回工具导航</Link><div className="eyebrow">TASK TO TOOLS</div>
    <h1>为你的下一步，找到方向</h1>
    <p className="intro">通过本地情境规则、关键词和学段筛选识别需求，最多推荐 3 个资源；不调用大模型。</p>
    <TaskForm key={q} initialValue={q} />
    <details className="scenario-browser">
      <summary>浏览 {schoolScenarios.length + 2} 类常见校园情境，点击示例试试</summary>
      <p>覆盖常见事件及两类受伤、肢体冲突提示，不代表穷尽。请勿输入学生姓名等个人信息。</p>
      {[...new Set(schoolScenarios.map(s => s.group))].map(group => <section key={group}>
        <h3>{group}</h3><div className="scenario-links">
          {schoolScenarios.filter(s=>s.group===group).map(s=><Link key={s.id} href={'/recommend?q='+encodeURIComponent(s.example)}>{s.example} ↗</Link>)}
        </div>
      </section>)}
      <div className="scenario-links">{['学生之间发生肢体冲突','我的学生在课堂上受伤了'].map(example=><Link key={example} href={'/recommend?q='+encodeURIComponent(example)}>{example} ↗</Link>)}</div>
    </details>
    {q && error ? <p role="alert" className="notice">{error}</p> : null}
    {result ? <>
      <section className="summary">
        <span className="tag">规则匹配结果</span>
        <h2>你的需求：{q}</h2>
        <p>识别任务：{result.task}</p>
        <p>条件与约束：{result.constraints.join('；') || '未识别到明确学段、费用或难度约束'}</p>
        <p className="small">学段来自关键词；工具覆盖待核验。免费要求暂无法可靠筛选。推荐顺序不代表质量评级或用户评价。</p>
      </section>
      {result.safety && <section className="safety-panel" aria-labelledby="safety-heading">
        <span className="tag">{result.safety.preparation ? '安全教育准备' : '先救助，再查资源'}</span>
        <h2 id="safety-heading">{result.safety.heading}</h2>
        <ol>{result.safety.steps.map(step => <li key={step}>{step}</li>)}</ol>
        <p>{result.safety.note}</p>
      </section>}
      {result.guidance && <section className={result.guidance.priority ? 'safety-panel' : 'guidance-panel'} aria-labelledby="guidance-heading">
        <span className="tag">{result.guidance.priority ? '优先核实安全与报告' : result.guidance.group}</span>
        <h2 id="guidance-heading">{result.guidance.heading}</h2>
        <ol>{result.guidance.steps.map(step=><li key={step}>{step}</li>)}</ol>
        <p><strong>还需了解：</strong>{result.guidance.question}</p>
        <p className="small">这是一般情境参考，未逐条核验政策依据。以学校流程及当地要求为准，不构成医疗、法律或心理诊断。规则可能遗漏或误判；如同时存在其他风险，请优先寻求现场支持。</p>
      </section>}
      {(result.safety || result.guidance?.priority) && <h2>后续政策查询入口</h2>}
      {result.guidance && !result.guidance.priority && <h2>可辅助后续工作的资源</h2>}
      {result.results.length ? <div className="tool-grid">
        {result.results.map((r, i) => <ToolCard key={r.tool.id} tool={r.tool} index={i} reason={r.reason} />)}
      </div> : <div className="empty">
        <h2>暂时没有匹配的资源</h2>
        <p>当前规则覆盖有限。可以补充具体情境，例如“学生不愿发言”“家长沟通”或“设计一节课”。</p>
        <Link className="text-link" href="/tools">前往资源库手动查找 ↗</Link>
      </div>}
      <p className="notice">请先核对资源信息与学校要求，再决定使用。规则识别可能遗漏情境；紧急事件应优先联系学校及专业人员。</p>
    </> : <div className="empty">输入至少 4 个字的教学需求，开始匹配资源。</div>}
  </div>;
}
