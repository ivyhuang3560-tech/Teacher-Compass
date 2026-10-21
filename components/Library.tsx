import Link from 'next/link';
import {categories,stages} from '@/lib/recommend';
import {filterTools} from '@/lib/tool-filters';
import {searchError} from '@/lib/content';
import {SelectFilter,EmptyState,listReturnUrl} from './ContentUI';
import ToolCard from './ToolCard';
import {param,type QueryParams} from '@/lib/content-types';
export default function Library({params}:{params:QueryParams}){
  const category=param(params,'category'),stage=param(params,'stage'),q=param(params,'q');
  const error=searchError(q)||((category&&!categories.includes(category))||(stage&&!stages.includes(stage))?'筛选条件无效，请重置。':'');
  const filtered=error?[]:filterTools({q,category,stage});
  const returnTo=listReturnUrl('/tools',params);
  return <><form action="/tools" className="filter-panel"><div className="filters"><label>关键词搜索<input type="search" name="q" defaultValue={q} placeholder="工具名称或任务关键词" maxLength={200}/></label><SelectFilter label="资源类别" name="category" options={categories} value={category}/><SelectFilter label="适用学段" name="stage" options={stages} value={stage}/><button className="button" type="submit">应用筛选</button><Link className="reset" href="/tools">重置全部</Link></div></form>{error&&<p role="alert" className="error">{error}</p>}<p className="result-count" aria-live="polite">找到 {filtered.length} 条资源 · 费用、学段和功能待核验</p>{filtered.length?<div className="tool-grid">{filtered.map(tool=><ToolCard key={tool.id} tool={tool} returnTo={returnTo}/>)}</div>:<EmptyState href="/tools">请更换关键词或减少筛选，也可以使用上方情境推荐描述任务。</EmptyState>}</>;
}
