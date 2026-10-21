import Link from 'next/link';
import type {ContentSource, QueryParams} from '@/lib/content-types';

export function PageHeading({eyebrow,title,children}:{eyebrow:string;title:string;children:React.ReactNode}){
  return <div className="page-heading"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="intro">{children}</p></div>;
}
export function EmptyState({title='没有找到匹配内容',children,href}:{title?:string;children:React.ReactNode;href:string}){
  return <section className="empty"><span className="empty-icon" aria-hidden="true">⌕</span><h2>{title}</h2><p>{children}</p><Link className="text-link" href={href}>重置条件，浏览全部 ↗</Link></section>;
}
export function SourceDisclosure({source}:{source:ContentSource}){
  return <aside className="source-disclosure"><strong>{source.mode==='demo'?'DEMO · 非真实内容':source.verification==='已核验'?'来源已核验':'来源待核验'}</strong><p>{source.note}</p>
    {source.mode==='real'?<><p>来源机构：{source.publisher} · 核验日期：{source.checkedAt}</p><a className="text-link" href={source.originalUrl} target="_blank" rel="noopener noreferrer">打开原始来源 ↗</a></>:<p>无原始文件、发布机构或核验日期；不可据此作政策判断或报名。</p>}
  </aside>;
}
export function DemoNotice({activities=false}:{activities?:boolean}){
  return <aside className="demo-notice"><span className="demo-badge">DEMO</span><p>{activities?'当前活动均为演示样例，没有真实主办方、日期或报名入口，不可报名。地区、学段与学科仅演示筛选。':'当前教育动态均为演示样例，不是真实政策、法律或新闻，也不代表近期发布。真实内容待核验后收录。'}本站未接入联网 AI 或自动更新服务。</p></aside>;
}
export function NaturalSearch({action,label,placeholder,initialValue='',params={}}:{action:string;label:string;placeholder:string;initialValue?:string;params?:QueryParams}){
  return <form action={action} className="natural-search" role="search">
    <label htmlFor={'natural-'+action.replaceAll('/','')}>{label}</label>
    <div className="search-input-row"><input id={'natural-'+action.replaceAll('/','')} type="search" name="q" defaultValue={initialValue} placeholder={placeholder} minLength={2} maxLength={200}/><button className="button" type="submit">查找资源 <span aria-hidden="true">↗</span></button></div>
    {Object.entries(params).filter(([key])=>key!=='q').flatMap(([key,value])=>(Array.isArray(value)?value:[value]).filter(v=>typeof v==='string'&&v).map(v=><input type="hidden" key={key+v} name={key} value={v}/>))}
    <p className="small">智能导航 / 关键词匹配（演示版）· 不调用大模型 · 请勿输入学生个人信息</p>
  </form>;
}
export function SelectFilter({label,name,options,value=''}:{label:string;name:string;options:readonly string[];value?:string}){
  return <label htmlFor={"filter-"+name}><span id={"filter-label-"+name}>{label}</span><select id={"filter-"+name} aria-labelledby={"filter-label-"+name} name={name} defaultValue={value}><option value="">全部</option>{options.map(v=><option key={v} value={v}>{v}</option>)}</select></label>;
}
export function BackLink({section,label,returnTo}:{section:string;label:string;returnTo?:string}){
  const href=returnTo===section||returnTo?.startsWith(section+'?')?returnTo:section;
  return <Link href={href} className="text-link">← 返回{label}</Link>;
}
export function listReturnUrl(path:string,params:QueryParams){
  const query=new URLSearchParams();
  Object.entries(params).forEach(([key,value])=>(Array.isArray(value)?value:[value]).forEach(v=>{if(v)query.append(key,v);}));
  return path+(query.size?'?'+query.toString():'');
}
