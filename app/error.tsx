'use client';
export default function Error({reset}:{reset:()=>void}){return <div className="page empty"><h1>页面暂时加载失败</h1><p>请重试，或刷新后重新输入需求。</p><button className="button" onClick={reset}>重新加载</button></div>}
