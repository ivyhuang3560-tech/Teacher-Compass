'use client';
import Link from 'next/link';
export default function Error({reset}:{reset:()=>void}){return <div className="page empty"><h1>页面暂时加载失败</h1><p>请重试；若问题持续，可返回首页重新查找。</p><button className="button" onClick={reset}>重新加载</button><p><Link className="text-link" href="/">返回首页</Link></p></div>}
