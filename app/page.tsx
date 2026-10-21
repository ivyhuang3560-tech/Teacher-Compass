import Link from 'next/link';
import {NaturalSearch} from '@/components/ContentUI';
import {UpdateCard,ActivityCard} from '@/components/ContentCards';
import ToolCard from '@/components/ToolCard';
import {updates,activities} from '@/lib/content';
import {tools} from '@/lib/recommend';
export default function Home(){
  return <>
    <section className="hero"><div className="hero-copy"><div className="eyebrow">A LITTLE SUPPORT. A NEW BEGINNING.</div><span className="pill">✦ 致正在成长的新教师</span><h1>从教学难题出发，<br/>找到适合你的<span>工具和方法</span></h1><p className="intro">看懂教育信息，找到成长机会，做好每一次课堂尝试。<br/>从你的真实需要开始，让下一步更清楚一点。</p></div><div className="growth-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="art-note note-one">✧ 每一份好奇，都有回响</div><div className="stem"/><div className="leaf leaf-one"/><div className="leaf leaf-two"/><div className="ground"/><div className="art-note note-two">向下扎根，向上生长 ↗</div><span className="spark">✦</span></div></section>
    <section className="task-panel"><div className="section-label"><span>从一个真实需求开始</span><span className="tag">本地规则导航</span></div><h2>今天，你想解决什么？</h2><NaturalSearch action="/search" label="全局自然语言检索" placeholder="例如：小学语文公开课、教师权益相关法律、录制微课"/>
      <div className="examples"><span>试试这些</span>{['教师权益相关法律','小学语文公开课','我想录制微课','学生之间发生肢体冲突'].map(q=><Link key={q} href={'/search?q='+encodeURIComponent(q)}>{q} ↗</Link>)}</div>
    </section>
    <section className="section"><div className="section-heading"><div><div className="eyebrow">THREE WAYS TO GROW</div><h2>教学路上，多一点支持</h2></div><span className="small">从看见，到行动</span></div><div className="entry-grid">{[
      ['/updates','01','教育动态','看懂政策与法律，关注教育信息','⌕'],
      ['/activities','02','发展活动','发现公开课、研修与教研机会','✧'],
      ['/tools','03','工具导航','找到适合任务的工具和资源','✎'],
    ].map(([href,no,title,desc,icon])=><Link key={href} href={href} className="category-card"><div className="category-top"><span className="category-icon">{icon}</span><span>{no}</span></div><h3>{title}<span>↗</span></h3><p>{desc}</p></Link>)}</div></section>
    <section className="section content-section"><div className="section-heading"><div><div className="eyebrow">EDUCATION UPDATES</div><h2>教育动态 · 内容预览</h2></div><Link className="text-link" href="/updates">浏览六大专题 ↗</Link></div><p className="section-description">当前为演示样例，不表示近期发布，也不构成法律依据。原始内容核验后再收录。</p><div className="tool-grid">{updates.slice(0,3).map(item=><UpdateCard key={item.id} item={item}/>)}</div></section>
    <section className="section content-section"><div className="section-heading"><div><div className="eyebrow">OPPORTUNITIES TO GROW</div><h2>发展活动 · 内容预览</h2></div><Link className="text-link" href="/activities">查找成长活动 ↗</Link></div><p className="section-description">当前没有已核验的近期活动，以下仅演示筛选和信息结构，不可报名。</p><div className="tool-grid">{activities.filter((_,i)=>[0,2,4].includes(i)).map(item=><ActivityCard key={item.id} item={item}/>)}</div></section>
    <section className="section content-section"><div className="section-heading"><div><div className="eyebrow">YOUR TEACHING TOOLKIT</div><h2>从一个小工具开始</h2></div><Link className="text-link" href="/tools">浏览全部 {tools.length} 条资源 ↗</Link></div><p className="section-description">编辑选取，不代表质量排名、官方认证或免费承诺。功能、费用与适用性待核验。</p><div className="tool-grid">{tools.filter(t=>['smartedu','canva','obs'].includes(t.id)).map(tool=><ToolCard key={tool.id} tool={tool}/>)}</div></section>
    <aside className="notice"><strong>清楚地标注来源，也保留判断的空间。</strong><span>本地内容不实时更新，规则匹配不是联网 AI。请核对原始来源、学校规定与学生情况，紧急事件优先寻求现场支持。</span></aside>
  </>;
}
