import updateData from '../data/updates.json';
import activityData from '../data/activities.json';
import { type EducationUpdate, type DevelopmentActivity, type ActivityStatus, topics, updateTypes, activityCategories } from './content-types';
// JSON 边界单独导出。测试负责逐条验证字段、来源及日期，展示层只处理明确模型。
export const updates = updateData as EducationUpdate[];
export const activities = activityData as DevelopmentActivity[];

const topicAliases = [
  /课程|教学|教材|课标|双减/, /学生|校园|学校|班级|安全/, /教研|培训|研修|成长|发展/,
  /资格|职称|评价|准入/, /权益|待遇|保障|工资|福利/, /数字|人工智能|ai|隐私/i,
];
export function updateIntent(q: string) {
  return {
    topics: topics.filter((_, index) => topicAliases[index].test(q)),
    types: updateTypes.filter(type => type === '政策文件' ? /政策|文件|通知/.test(q) : type === '法律法规' ? /法律|法规|教育法|教师法/.test(q) : /新闻|资讯/.test(q)),
  };
}
export function searchError(q: string) {
  return q.length > 200 ? '请输入不超过 200 字的需求。' : q.trim() && q.trim().length < 2 ? '请至少输入 2 个字。' : '';
}
export type UpdateFilters = { q?: string; topics?: string[]; type?: string; region?: string };
export function filterUpdates(filters: UpdateFilters) {
  const q = filters.q?.trim() ?? '';
  if (searchError(q)) return [];
  const intent = updateIntent(q);
  return updates.filter(item => {
    if (filters.topics?.length && !filters.topics.some(topic => item.topics.includes(topic as typeof topics[number]))) return false;
    if (filters.type && item.type !== filters.type) return false;
    // 选择某地区时同时保留全国适用条目；选择全国只显示全国条目。
    if (filters.region && item.region !== filters.region && item.region !== '全国') return false;
    if (!q) return true;
    const exact = [item.title,item.summary,...item.keywords,...item.topics].join(' ').toLowerCase().includes(q.toLowerCase());
    if (exact) return true;
    if (!intent.topics.length && !intent.types.length) return false;
    return (!intent.topics.length || intent.topics.some(topic=>item.topics.includes(topic))) && (!intent.types.length || intent.types.includes(item.type));
  });
}

const categoryPatterns = [/竞赛|比赛|赛课|公开课|观摩/,/培训|研修|讲座/,/课题|申报|成果/,/学术|交流|教研/];
export function activityIntent(q: string) {
  return activityCategories.filter((_, index) => categoryPatterns[index].test(q));
}
function dateOnly(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(value + 'T00:00:00Z');
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0,10) === value ? value : null;
}
export function todayShanghai(now: Date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
}
/** 缺字段、未核验、演示记录全部保守返回待核验。不能由一个未来截止日推断正在报名。 */
export function activityStatus(item: DevelopmentActivity, today = todayShanghai()): ActivityStatus {
  if (item.source.mode !== 'real' || item.source.verification !== '已核验' || !item.datesVerified) return '待核验';
  const checked = dateOnly(item.source.checkedAt);
  if (!checked || checked > today) return '待核验';
  const start = dateOnly(item.startsAt), end = dateOnly(item.endsAt);
  const open = dateOnly(item.registrationOpensAt), deadline = dateOnly(item.registrationDeadline);
  if (!start || !end || end < start) return '待核验';
  if (end < today) return '已结束';
  if (!open || !deadline || deadline < open || deadline > end || open > start) return '待核验';
  if (open <= today && today <= deadline) return '报名中';
  if (start > today) return '即将开始';
  // 没有单列“进行中”，也不能误标“即将开始”或开放报名。
  return '待核验';
}
export function canDisplayActivityDates(item: DevelopmentActivity, today = todayShanghai()) {
  if (item.source.mode !== 'real' || item.source.verification !== '已核验' || !item.datesVerified) return false;
  const checked=dateOnly(item.source.checkedAt), start=dateOnly(item.startsAt), end=dateOnly(item.endsAt);
  if (!checked || checked>today || !start || !end || end<start) return false;
  const open=dateOnly(item.registrationOpensAt), deadline=dateOnly(item.registrationDeadline);
  return !!open && !!deadline && open<=deadline && deadline<=end && open<=start;
}
export type ActivityFilters = {q?:string;category?:string;region?:string;stage?:string;subject?:string;status?:string};
export function filterActivities(filters: ActivityFilters, today = todayShanghai()) {
  const q = filters.q?.trim() ?? '';
  if (searchError(q)) return [];
  const intents = activityIntent(q);
  const stageNeed = ['小学','初中','高中'].filter(s=>q.includes(s));
  const subjectNeed = ['语文','数学','英语','综合'].filter(s=>q.includes(s));
  const regionNeed = ['北京市','上海市','广东省'].filter(s=>q.includes(s) || q.includes(s.slice(0,2)));
  return activities.filter(item => {
    if (filters.category && item.category !== filters.category) return false;
    if (filters.region && item.region !== filters.region && item.region !== '全国') return false;
    if (filters.stage && !item.stages.includes(filters.stage)) return false;
    if (filters.subject && !item.subjects.includes(filters.subject) && !item.subjects.includes('不限')) return false;
    if (filters.status && activityStatus(item,today) !== filters.status) return false;
    if (!q) return true;
    if (stageNeed.length && !stageNeed.some(s=>item.stages.includes(s))) return false;
    if (subjectNeed.length && !item.subjects.includes('不限') && !subjectNeed.some(s=>item.subjects.includes(s))) return false;
    if (regionNeed.length && item.region !== '全国' && !regionNeed.includes(item.region)) return false;
    if (intents.length) return intents.includes(item.category);
    const haystack=[item.title,item.summary,...item.keywords].join(' ').toLowerCase();
    return haystack.includes(q.toLowerCase()) || ((stageNeed.length>0 || subjectNeed.length>0 || regionNeed.length>0) && /活动|成长/.test(q));
  });
}
export function toolReturnPath(value?: string) {
  return value === '/tools' || value?.startsWith('/tools?') ? value : '/tools';
}
