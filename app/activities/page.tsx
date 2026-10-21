import Link from 'next/link';
import {PageHeading,NaturalSearch,DemoNotice,SelectFilter,EmptyState,listReturnUrl} from '@/components/ContentUI';
import {ActivityCard} from '@/components/ContentCards';
import {filterActivities,searchError,activityIntent} from '@/lib/content';
import {activityCategories,activityStatuses,regions,contentStages,subjects,param,type QueryParams} from '@/lib/content-types';
export default async function ActivitiesPage({searchParams}:{searchParams:Promise<QueryParams>}){
  const params=await searchParams,q=param(params,'q');
  const filters={q,category:param(params,'category'),region:param(params,'region'),stage:param(params,'stage'),subject:param(params,'subject'),status:param(params,'status')};
  const invalid=([[filters.category,activityCategories],[filters.region,regions],[filters.stage,contentStages],[filters.subject,subjects],[filters.status,activityStatuses]] as [string,readonly string[]][]).some(([v,options])=>v&&!options.includes(v));
  const error=searchError(q)||(invalid?'筛选条件无效，请重置后选择。':'');
  const results=error?[]:filterActivities(filters),intents=activityIntent(q),returnTo=listReturnUrl('/activities',params);
  return <div className="page"><PageHeading eyebrow="GROW AT YOUR OWN PACE" title="发展活动">公开课、培训、课题与教研交流，按你的需要找方向。能否参加，以真实通知和个人条件为准。</PageHeading><DemoNotice activities/>
    <NaturalSearch action="/activities" label="帮我找适合的成长活动" placeholder="例如：小学语文公开课、广东省教师培训" initialValue={q} params={params}/>
    <form action="/activities" className="filter-panel"><input type="hidden" name="q" value={q}/><div className="filters activity-filters">
      <SelectFilter label="活动类别" name="category" options={activityCategories} value={filters.category}/><SelectFilter label="适用地区" name="region" options={regions} value={filters.region}/><SelectFilter label="学段" name="stage" options={contentStages} value={filters.stage}/><SelectFilter label="学科" name="subject" options={subjects} value={filters.subject}/><SelectFilter label="活动状态" name="status" options={activityStatuses} value={filters.status}/>
      <button className="button" type="submit">应用筛选</button><Link className="reset" href="/activities">重置全部</Link>
    </div></form><p className="small">选择地区时同时展示全国条目。当前所有 DEMO 记录均为待核验；即将开始、已结束或待核验均不表示开放报名。</p>
    {error&&<p className="error" role="alert">{error}</p>}{q&&!error&&<p className="match-explanation">规则识别：{intents.join('、')||'按关键词、学段或学科匹配'}。结果仅演示条件匹配，不判断你的真实报名资格。</p>}
    <p className="result-count" aria-live="polite">{results.length} 条结果 · 未核验日期不显示 · 不提供 DEMO 报名</p>
    {results.length?<div className="tool-grid">{results.map(item=><ActivityCard key={item.id} item={item} returnTo={returnTo}/>)}</div>:<EmptyState href="/activities">没有符合当前条件的本地条目。若选择“报名中”，空结果表示当前没有已核实开放报名的活动。</EmptyState>}
  </div>;
}
