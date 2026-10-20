'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {validateTask} from '@/lib/recommend';
export default function TaskForm(){const [value,setValue]=useState('');const [error,setError]=useState('');const router=useRouter();return <form onSubmit={e=>{e.preventDefault();const message=validateTask(value);setError(message);if(!message)router.push('/recommend?q='+encodeURIComponent(value.trim()));}}><label className="sr-only" htmlFor="task">描述你的教学任务</label><textarea id="task" value={value} onChange={e=>{setValue(e.target.value);setError('');}} maxLength={501} placeholder="例如：我是小学新教师，想做一份有互动练习的语文课件，操作简单一些。" aria-describedby="task-error"/><div className="form-bottom"><span>无需注册 · 规则匹配 · 不上传学生个人信息</span><button className="button" type="submit">帮我找资源 <span>↗</span></button></div><p id="task-error" role="alert" className="error">{error}</p></form>}
