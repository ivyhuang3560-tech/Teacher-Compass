import type {Metadata} from 'next';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import './globals.css';
export const metadata:Metadata={title:'初芽 · 新教师成长站',description:'查教育动态，找成长活动，发现适合新教师的工具与方法。'};
export default function Layout({children}:{children:React.ReactNode}){
  return <html lang="zh-CN"><body><a className="skip-link" href="#main-content">跳到主要内容</a><SiteNav/><main id="main-content" tabIndex={-1}>{children}</main><footer><div className="footer-brand">初芽 · 陪伴每一次教学初尝试<p>工具是起点，教师的判断才是关键。</p></div><div><span>MVP V0.2 · 本地内容与规则导航</span><p>动态与活动为 DEMO · 工具信息待核验</p><Link href="/search">全站查找 ↗</Link></div></footer></body></html>;
}
