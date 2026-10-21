import Link from 'next/link';
import {PageHeading,NaturalSearch,EmptyState} from '@/components/ContentUI';
import {UpdateCard,ActivityCard} from '@/components/ContentCards';
import ToolCard from '@/components/ToolCard';
import {filterUpdates,filterActivities,searchError} from '@/lib/content';
import {param,type QueryParams} from '@/lib/content-types';
import {recommend} from '@/lib/recommend';
export default async function SearchPage({searchParams}:{searchParams:Promise<QueryParams>}){
  const params=await searchParams,q=param(params,'q'),error=searchError(q);
  const result=q&&!error?recommend(q):null;
  const updateResults=q&&!error?filterUpdates({q}).slice(0,3):[];
  const activityResults=q&&!error?filterActivities({q}).slice(0,3):[];
  const toolResults=result?.results??[];
  return <div className="page"><PageHeading eyebrow="START WITH YOUR NEED" title="从需求出发，全站查找">跨教育动态、发展活动和工具导航进行本地规则检索，不联网、不调用大模型。</PageHeading><NaturalSearch action="/search" label="你想查找什么？" initialValue={q} placeholder="描述教学任务、政策主题或成长活动"/>
    {error&&<p className="error" role="alert">{error}</p>}
    {result&&(result.safety||result.guidance)&&<aside className={result.safety||result.guidance?.priority?'safety-panel':'guidance-panel'}><h2>{result.safety?.heading||result.guidance?.heading}</h2><p>{result.safety?.steps[0]||result.guidance?.steps[0]}</p><Link className="text-link" href={'/recommend?q='+encodeURIComponent(q)}>查看完整情境建议与求助提示 ↗</Link></aside>}
    <aside className="demo-notice"><span className="demo-badge">内容说明</span><p>动态和活动均为 DEMO，不代表真实政策、资讯或可报名活动。工具资料待核验；无结果不表示现实中不存在相关资源。</p></aside>
    {q&&!error?<><p className="result-count">以下各栏目最多展示 3 条本地匹配结果。</p><section className="search-section"><div className="section-heading"><h2>教育动态</h2><Link className="text-link" href={'/updates?q='+encodeURIComponent(q)}>查看全部匹配 ↗</Link></div>{updateResults.length?<div className="tool-grid">{updateResults.map(item=><UpdateCard key={item.id} item={item}/>)}</div>:<p className="inline-empty">本地教育动态暂无匹配，可调整关键词。</p>}</section><section className="search-section"><div className="section-heading"><h2>发展活动</h2><Link className="text-link" href={'/activities?q='+encodeURIComponent(q)}>查看全部匹配 ↗</Link></div>{activityResults.length?<div className="tool-grid">{activityResults.map(item=><ActivityCard key={item.id} item={item}/>)}</div>:<p className="inline-empty">本地活动暂无匹配，当前没有已核实开放报名的活动。</p>}</section><section className="search-section"><div className="section-heading"><h2>工具与方法</h2><Link className="text-link" href={'/recommend?q='+encodeURIComponent(q)}>查看情境推荐 ↗</Link></div>{toolResults.length?<div className="tool-grid">{toolResults.map((r,index)=><ToolCard key={r.tool.id} tool={r.tool} reason={r.reason} index={index}/>)}</div>:<p className="inline-empty">本地工具暂无匹配，试试具体任务词或前往工具导航。</p>}</section></>:!error&&<EmptyState title="从一个问题开始" href="/">输入至少 2 个字，例如“教师权益法律”“小学公开课”或“录制微课”。</EmptyState>}
  </div>;
}
