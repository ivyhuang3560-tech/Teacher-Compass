import { tools } from './recommend';
export function filterTools({q='',category='',stage=''}:{q?:string;category?:string;stage?:string}) {
  const query=q.trim().toLowerCase();
  return tools.filter(t=>(!category||t.category===category)&&(!stage||t.stages.includes(stage))&&[t.name,t.category,t.description,...t.tags].join(' ').toLowerCase().includes(query));
}
