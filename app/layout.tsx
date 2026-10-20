import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css';
export const metadata: Metadata = {title:'初芽 · 新教师成长站',description:'从教学难题出发，找到适合你的工具和方法。'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body><header><div className="nav"><Link href="/" className="brand"><span className="brand-icon">芽</span><span>初芽<span className="brand-sub">新教师成长站</span></span></Link><nav aria-label="主导航"><Link href="/">首页</Link><Link href="/recommend">任务推荐</Link><Link href="/tools">工具资源库 ↗</Link></nav></div></header><main>{children}</main><footer><span>初芽 · 陪伴每一次教学初尝试</span><span>MVP V0.1 · 规则推荐实验版 · 资源信息待核验</span></footer></body></html>}
