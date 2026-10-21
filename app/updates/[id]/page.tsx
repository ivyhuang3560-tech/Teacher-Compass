import {notFound} from 'next/navigation';
import Link from 'next/link';
import {updates} from '@/lib/content';
import {BackLink,SourceDisclosure} from '@/components/ContentUI';
import {param,type QueryParams} from '@/lib/content-types';
export const dynamicParams = false;
export function generateStaticParams(){return updates.map(item=>({id:item.id}));}
export default async function UpdateDetail({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<QueryParams>}){
  const {id}=await params,item=updates.find(item=>item.id===id);if(!item)notFound();
  const query=await searchParams;
  return <div className="page detail"><BackLink section="/updates" label="教育动态" returnTo={param(query,'returnTo')}/><article><div className="summary"><span className="tag">{item.type}</span><h1>{item.title}</h1><p className="intro">{item.summary}</p><dl className="facts"><div><dt>发布日期</dt><dd>{item.publishedAt??'无真实发布日期（DEMO）'}</dd></div><div><dt>来源机构</dt><dd>{item.source.publisher??'无真实机构（DEMO）'}</dd></div><div><dt>适用地区</dt><dd>{item.region}{item.source.mode==='demo'?'（筛选示例）':''}</dd></div><div><dt>{item.type==='教育新闻/资讯'?'信息性质':'效力状态'}</dt><dd>{item.type==='教育新闻/资讯'?'资讯不是法律依据':item.legalStatus}</dd></div></dl><div className="topic-tags">{item.topics.map(t=><Link key={t} href={'/updates?topic='+encodeURIComponent(t)}>{t}</Link>)}</div></div><SourceDisclosure source={item.source}/><section className="detail-section"><h2>内容说明</h2>{item.paragraphs.map(p=><p key={p}>{p}</p>)}</section></article></div>;
}
