'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
const items=[['/','首页'],['/updates','教育动态'],['/activities','发展活动'],['/tools','工具导航']];
export default function SiteNav(){
  const path=usePathname();
  return <header className="site-header"><div className="nav">
    <Link href="/" className="brand" aria-label="初芽，新教师成长站首页"><span className="brand-icon" aria-hidden="true">芽</span><span>初芽<span className="brand-sub">新教师成长站</span></span></Link>
    <nav aria-label="主导航">{items.map(([href,label])=>{
      const active=href==='/'?path==='/':path.startsWith(href);
      return <Link key={href} href={href} aria-current={active?'page':undefined} className={active?'nav-active':''}>{label}</Link>;
    })}</nav>
    <span className="version-pill">MVP V0.2</span>
  </div></header>;
}
