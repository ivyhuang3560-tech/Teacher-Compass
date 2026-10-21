import Link from 'next/link';
import {tools} from '@/lib/recommend';
import {PageHeading} from '@/components/ContentUI';
import Library from '@/components/Library';
import TaskForm from '@/components/TaskForm';
import type {QueryParams} from '@/lib/content-types';
export default async function ToolsPage({searchParams}:{searchParams:Promise<QueryParams>}){
  const params=await searchParams;
  return <div className="page"><PageHeading eyebrow="YOUR TEACHING TOOLKIT" title="工具导航">保留 {tools.length} 条工具与资源，从教学任务出发找到方法。费用、适用性与产品入口均待核验。</PageHeading>
    <section className="task-panel compact-panel"><div className="section-label"><span>按任务找工具</span><span className="tag">规则匹配 · 非大模型分析</span></div><h2>说说你遇到的教学情境</h2><TaskForm/><div className="examples">{['我想录制微课','学生之间发生肢体冲突','第一次备课，不知道怎么设计教学活动'].map(q=><Link key={q} href={'/recommend?q='+encodeURIComponent(q)}>{q} ↗</Link>)}</div><Link className="text-link" href="/recommend">浏览 28 类校园情境 ↗</Link></section>
    <Library params={params}/>
  </div>;
}
