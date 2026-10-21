import Link from 'next/link';
export default function NotFound(){return <div className="page empty"><h1>暂未找到这个页面</h1><p>链接可能不存在，请返回首页继续浏览。</p><Link className="button" href="/">返回首页</Link></div>}
