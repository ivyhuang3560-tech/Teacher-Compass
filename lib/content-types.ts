/** 内容身份和核验分开：有 URL 不等于事实、效力或报名资格已经核验。 */
export const topics = [
  '教育教学与课程实施', '学生管理与学校事务', '教师教研与专业发展',
  '教师职业准入与评价', '教师权益与职业保障', '教育数字化与人工智能',
] as const;
export type Topic = typeof topics[number];
export const updateTypes = ['政策文件', '法律法规', '教育新闻/资讯'] as const;
export const activityCategories = ['教学竞赛与公开课','培训研修与讲座','课题申报与成果评选','学术交流与教研活动'] as const;
export const activityStatuses = ['报名中','即将开始','已结束','待核验'] as const;
export type ActivityStatus = typeof activityStatuses[number];
export const regions = ['全国','北京市','上海市','广东省'] as const;
export const subjects = ['不限','语文','数学','英语','综合'] as const;
export const contentStages = ['小学','初中','高中'] as const;

type DemoSource = { mode: 'demo'; publisher: null; originalUrl: null; checkedAt: null; verification: '演示数据'; note: string };
type OriginalSource = { mode: 'real'; publisher: string; originalUrl: string; checkedAt: string; verification: '已核验' | '待核验'; note: string };
export type ContentSource = DemoSource | OriginalSource;
type UpdateBase = {
  id: string; title: string; summary: string; topics: Topic[]; region: string;
  publishedAt: string | null; keywords: string[]; paragraphs: string[]; source: ContentSource;
};
// 新闻不允许挂“有效法律依据”字段。法律/政策也必须明确效力核验状态。
export type EducationUpdate = UpdateBase & (
  { type: '政策文件' | '法律法规'; legalStatus: '现行有效' | '已失效' | '待核验' } |
  { type: '教育新闻/资讯'; legalStatus?: never }
);
export type DevelopmentActivity = {
  id: string; title: string; category: typeof activityCategories[number]; summary: string;
  region: string; stages: string[]; subjects: string[]; audience: string; requirements: string[];
  startsAt: string | null; endsAt: string | null; registrationDeadline: string | null;
  registrationOpensAt: string | null; datesVerified: boolean;
  source: ContentSource; keywords: string[];
};
export type QueryParams = Record<string, string | string[] | undefined>;
export function param(params: QueryParams, key: string) {
  const value = params[key]; return typeof value === 'string' ? value : '';
}
export function values(params: QueryParams, key: string) {
  const value = params[key]; return typeof value === 'string' ? [value] : value ?? [];
}
