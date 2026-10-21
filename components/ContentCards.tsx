import Link from 'next/link';
import type {EducationUpdate,DevelopmentActivity} from '@/lib/content-types';
import {activityStatus,canDisplayActivityDates} from '@/lib/content';
export function UpdateCard({item,returnTo='/updates'}:{item:EducationUpdate;returnTo?:string}){
  return <article className="card content-card"><div className="card-top"><span className="tag">{item.type}</span><span className="demo-badge">{item.source.mode==='demo'?'DEMO':item.source.verification}</span></div>
    <h3><Link href={'/updates/'+item.id+'?returnTo='+encodeURIComponent(returnTo)}>{item.title}</Link></h3><p>{item.summary}</p>
    <div className="topic-tags">{item.topics.map(t=><Link key={t} href={'/updates?topic='+encodeURIComponent(t)}>{t}</Link>)}</div>
    <p className="small">{item.region} · {item.publishedAt??'发布日期：无真实日期'}</p>
    <p className="small">{item.source.mode==='demo'?'来源：演示占位，无真实发布机构':'来源：'+item.source.publisher}</p>
    <p className="legal-note">{item.type==='教育新闻/资讯'?'资讯不是法律依据':'效力状态：'+item.legalStatus}</p>
    <Link className="text-link" href={'/updates/'+item.id+'?returnTo='+encodeURIComponent(returnTo)}>查看内容与来源说明 ↗</Link>
  </article>;
}
export function ActivityCard({item,returnTo='/activities'}:{item:DevelopmentActivity;returnTo?:string}){
  const status=activityStatus(item);
  return <article className="card content-card"><div className="card-top"><span className="tag">{item.category}</span><span className="demo-badge">{item.source.mode==='demo'?'DEMO · ':''}{status}</span></div>
    <h3><Link href={'/activities/'+item.id+'?returnTo='+encodeURIComponent(returnTo)}>{item.title}</Link></h3><p>{item.summary}</p>
    <div className="meta">{item.region} · {item.stages.join(' / ')} · {item.subjects.join(' / ')}</div>
    <p className="small">主办方：{item.source.mode==='real'?item.source.publisher:'无真实主办方（演示）'}</p>
    <p className="small">{canDisplayActivityDates(item)?`开始：${item.startsAt??'待核验'} · 结束：${item.endsAt??'待核验'} · 截止：${item.registrationDeadline??'待核验'}`:'活动与报名日期：未核验，不提供日期'}</p>
    <p className="small">核验日期：{item.source.checkedAt??'未核验'}</p>
    <Link className="text-link" href={'/activities/'+item.id+'?returnTo='+encodeURIComponent(returnTo)}>查看条件与来源说明 ↗</Link>
  </article>;
}
