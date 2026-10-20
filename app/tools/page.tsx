import { tools } from '@/lib/recommend';
import Library from '@/components/Library';
export default async function Page({searchParams}:{searchParams:Promise<{category?:string}>}){const {category=''}=await searchParams;return <div className="page"><div className="eyebrow">A SMALL, USEFUL COLLECTION</div><h1>你的教学工具资源库</h1><p className="intro">{tools.length} 个工具与资源候选入口，从一个小任务开始探索。</p><Library initialCategory={category}/></div>}
