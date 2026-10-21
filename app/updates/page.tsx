import Link from 'next/link';
import {PageHeading,NaturalSearch,DemoNotice,SelectFilter,EmptyState,listReturnUrl} from '@/components/ContentUI';
import {UpdateCard} from '@/components/ContentCards';
import {filterUpdates,searchError,updateIntent} from '@/lib/content';
import {topics,updateTypes,regions,param,values,type QueryParams} from '@/lib/content-types';
export default async function UpdatesPage({searchParams}:{searchParams:Promise<QueryParams>}){
  const params=await searchParams,q=param(params,'q'),selected=values(params,'topic');
  const type=param(params,'type'),region=param(params,'region');
  const invalid=selected.some(t=>!topics.includes(t as typeof topics[number])) || (type&&!updateTypes.includes(type as typeof updateTypes[number])) || (region&&!regions.includes(region as typeof regions[number]));
  const error=searchError(q)||(invalid?'筛选条件无效，请重置后选择。':'');
  const results=error?[]:filterUpdates({q,topics:selected,type,region});
  const intent=updateIntent(q),returnTo=listReturnUrl('/updates',params);
  return <div className="page"><PageHeading eyebrow="EDUCATION UPDATES" title="教育动态">围绕教师需要整理信息，区分政策、法律与资讯，回到原始来源做判断。</PageHeading><DemoNotice/>
    <NaturalSearch action="/updates" label="智能查找政策、法律与资讯" placeholder="例如：教师权益相关法律、人工智能政策" initialValue={q} params={params}/>
    <form action="/updates" className="filter-panel"><input type="hidden" name="q" value={q}/>
      <fieldset className="topic-fieldset"><legend>六大教师需求专题 · 可多选（任一匹配）</legend><div className="topic-options">{topics.map(topic=><label key={topic}><input type="checkbox" name="topic" value={topic} defaultChecked={selected.includes(topic)}/><span>{topic}</span></label>)}</div></fieldset>
      <div className="filters"><SelectFilter name="type" label="信息类型" options={updateTypes} value={type}/><SelectFilter name="region" label="适用地区" options={regions} value={region}/><button type="submit" className="button">应用筛选</button><Link className="reset" href="/updates">重置全部</Link></div>
    </form>
    {error&&<p className="error" role="alert">{error}</p>}
    {q&&!error&&<p className="match-explanation">规则识别：{intent.topics.join('、')||'按输入关键词'}{intent.types.length?'；类型：'+intent.types.join('、'):''}。仅在本地演示目录查找，没有联网检索。</p>}
    <p className="result-count" aria-live="polite">{results.length} 条结果 · DEMO 样例不代表真实发文 · 按本地目录顺序展示</p>
    {results.length?<div className="tool-grid">{results.map(item=><UpdateCard key={item.id} item={item} returnTo={returnTo}/>)}</div>:<EmptyState href="/updates">可更换关键词或减少筛选。本地目录没有结果不表示现实中不存在相关信息。</EmptyState>}
  </div>;
}
