import {notFound} from 'next/navigation';
import {activities,activityStatus,canDisplayActivityDates} from '@/lib/content';
import {BackLink,SourceDisclosure} from '@/components/ContentUI';
import {param,type QueryParams} from '@/lib/content-types';
export const dynamicParams = false;
export function generateStaticParams(){return activities.map(item=>({id:item.id}));}
export default async function ActivityDetail({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<QueryParams>}){
  const {id}=await params,item=activities.find(item=>item.id===id);if(!item)notFound();const query=await searchParams;
  return <div className="page detail"><BackLink section="/activities" label="发展活动" returnTo={param(query,'returnTo')}/><article><div className="summary"><span className="tag">{item.category}</span><h1>{item.title}</h1><p>{item.summary}</p><dl className="facts"><div><dt>活动状态</dt><dd>{activityStatus(item)}{item.source.mode==='demo'?' · 演示不可报名':''}</dd></div><div><dt>主办方</dt><dd>{item.source.publisher??'无真实主办方（DEMO）'}</dd></div><div><dt>地区 / 学段 / 学科</dt><dd>{item.region} / {item.stages.join('、')} / {item.subjects.join('、')}{item.source.mode==='demo'?'（演示条件）':''}</dd></div><div><dt>开始 / 结束 / 报名截止</dt><dd>{canDisplayActivityDates(item)?`${item.startsAt??'待核验'} / ${item.endsAt??'待核验'} / ${item.registrationDeadline??'待核验'}`:'未核验，不提供日期'}</dd></div><div><dt>核验日期</dt><dd>{item.source.checkedAt??'未核验'}</dd></div></dl></div><SourceDisclosure source={item.source}/><section className="detail-section"><h2>面向对象</h2><p>{item.audience}</p><h2>适用条件</h2><ul className="prose-list">{item.requirements.map(r=><li key={r}>{r}</li>)}</ul><h2>参加前请核对</h2><p>真实通知中的报名条件、主办方、日期、费用和学校审批要求。本站不会代报名，也不保证个人符合活动资格。</p></section></article></div>;
}
