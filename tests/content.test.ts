import test from 'node:test';
import assert from 'node:assert/strict';
import {updates,activities,filterUpdates,filterActivities,activityStatus,todayShanghai,searchError,toolReturnPath,canDisplayActivityDates} from '../lib/content';
import {topics,updateTypes,activityCategories,type DevelopmentActivity,type ContentSource} from '../lib/content-types';
import {tools,recommend} from '../lib/recommend';
import {filterTools} from '../lib/tool-filters';

function checkSource(source:ContentSource){
  if(source.mode==='demo'){
    assert.equal(source.originalUrl,null);assert.equal(source.publisher,null);assert.equal(source.checkedAt,null);
    assert.equal(source.verification,'演示数据');assert.ok(source.note.includes('演示'));
  }else{
    assert.ok(source.publisher);assert.match(source.checkedAt,/^\d{4}-\d{2}-\d{2}$/);
    assert.equal(new URL(source.originalUrl).protocol,'https:');
  }
}
test('content identities are unique and every source has honest metadata',()=>{
  assert.equal(new Set(updates.map(x=>x.id)).size,updates.length);
  assert.equal(new Set(activities.map(x=>x.id)).size,activities.length);
  for(const item of [...updates,...activities]){
    checkSource(item.source);
    assert.ok(item.title&&item.summary);
    if(item.source.mode==='demo')assert.match(item.title,/^DEMO/);
  }
});
test('all six topics and three information types are represented without forcing exclusive topics',()=>{
  assert.equal(topics.length,6);
  for(const topic of topics)assert.ok(updates.some(x=>x.topics.includes(topic)),topic);
  for(const type of updateTypes)assert.ok(updates.some(x=>x.type===type),type);
  assert.ok(updates.some(x=>x.topics.length>1));
  for(const item of updates){
    assert.ok(item.topics.every(t=>topics.includes(t)));
    if(item.type==='教育新闻/资讯')assert.equal('legalStatus' in item,false);
    else assert.ok(item.legalStatus);
    if(item.source.mode==='demo')assert.equal(item.publishedAt,null);
  }
});
test('education filters combine topic, type and region and preserve multi-topic matches',()=>{
  const result=filterUpdates({topics:['教师权益与职业保障'],type:'法律法规',region:'广东省'});
  assert.ok(result.length>0);
  assert.ok(result.every(x=>x.type==='法律法规'&&x.topics.includes('教师权益与职业保障')&&['全国','广东省'].includes(x.region)));
  const union=filterUpdates({topics:['教师权益与职业保障','教育数字化与人工智能']});
  assert.ok(union.some(x=>x.id==='rights')&&union.some(x=>x.id==='digital'));
  assert.ok(filterUpdates({q:'我想了解教师权益相关法律'}).every(x=>x.type==='法律法规'&&x.topics.includes('教师权益与职业保障')));
  assert.ok(filterUpdates({q:'我想了解教师权益相关法律'}).length>0);
  assert.equal(filterUpdates({q:'火星航线不存在'}).length,0);
});
test('all activity categories support relevant filtering with stage and subject constraints',()=>{
  for(const category of activityCategories)assert.ok(activities.some(x=>x.category===category));
  const result=filterActivities({category:'教学竞赛与公开课',stage:'小学',subject:'语文',region:'北京市'});
  assert.equal(result.length,1);assert.equal(result[0].id,'lesson');
  assert.equal(filterActivities({q:'帮我找小学语文公开课'})[0]?.id,'lesson');
  assert.ok(filterActivities({q:'我想参加教师培训'}).every(x=>x.category==='培训研修与讲座'));
  assert.equal(filterActivities({q:'火星航线不存在'}).length,0);
});
test('shipped demo activities never appear open or provide real registration dates',()=>{
  assert.equal(filterActivities({status:'报名中'}).length,0);
  for(const item of activities){
    assert.equal(item.source.mode,'demo');assert.equal(activityStatus(item,'2030-01-01'),'待核验');
    assert.equal(item.datesVerified,false);
    for(const key of ['startsAt','endsAt','registrationDeadline','registrationOpensAt'] as const)assert.equal(item[key],null);
  }
});
// 隔离测试夹具，不会出现在产品内容或报名列表中。
function fixture(overrides:Partial<DevelopmentActivity>={}):DevelopmentActivity{
  return {...activities[0],source:{mode:'real',publisher:'测试夹具机构（非产品数据）',originalUrl:'https://example.com/fixture',checkedAt:'2026-10-20',verification:'已核验',note:'测试夹具'},datesVerified:true,registrationOpensAt:'2026-10-01',registrationDeadline:'2026-10-25',startsAt:'2026-11-01',endsAt:'2026-11-02',...overrides};
}
test('date state uses verified windows and handles deadlines inclusively',()=>{
  assert.equal(activityStatus(fixture(),'2026-10-21'),'报名中');
  assert.equal(activityStatus(fixture(),'2026-10-25'),'报名中');
  assert.equal(activityStatus(fixture(),'2026-10-26'),'即将开始');
  assert.equal(activityStatus(fixture(),'2026-11-03'),'已结束');
  assert.equal(activityStatus(fixture(),'2026-11-01'),'待核验');
  assert.equal(activityStatus(fixture({registrationOpensAt:null}),'2026-10-21'),'待核验');
  assert.equal(activityStatus(fixture({datesVerified:false}),'2026-10-21'),'待核验');
});
test('malformed, inconsistent and unverified activity dates fail closed',()=>{
  for(const override of [{startsAt:'2026-02-30'},{endsAt:'2026-10-01'},{registrationDeadline:'2026-09-01'},{registrationDeadline:'2026-12-01'}]){
    assert.equal(activityStatus(fixture(override),'2026-10-21'),'待核验');
  }
  const item=fixture();
  assert.equal(activityStatus({...item,source:{...item.source,verification:'待核验'}} as DevelopmentActivity,'2026-10-21'),'待核验');
  assert.equal(activityStatus({...item,source:{...item.source,checkedAt:'2026-10-22'}} as DevelopmentActivity,'2026-10-21'),'待核验');
});
test('date boundary follows Asia/Shanghai, not UTC',()=>{
  assert.equal(todayShanghai(new Date('2026-10-20T16:01:00Z')),'2026-10-21');
  assert.equal(todayShanghai(new Date('2026-10-20T15:59:00Z')),'2026-10-20');
});
test('input limits and return paths do not allow arbitrary external navigation',()=>{
  assert.ok(searchError('字'.repeat(201)));assert.ok(searchError('字'));assert.equal(searchError('法律'),'');
  assert.equal(filterUpdates({q:'字'.repeat(201)}).length,0);
  assert.equal(toolReturnPath('https://example.com'),'/tools');
  assert.equal(toolReturnPath('//example.com'),'/tools');
  assert.equal(toolReturnPath('/tools?category=课件制作'),'/tools?category=课件制作');
});
test('all original tools and safety priority remain functional',()=>{
  assert.equal(tools.length,32);
  assert.ok(filterTools({q:'obs',category:'多媒体处理',stage:'小学'}).some(x=>x.id==='obs'));
  assert.equal(filterTools({q:'不存在的工具987'}).length,0);
  const safety=recommend('学生之间发生肢体冲突');
  assert.ok(safety.safety);assert.deepEqual(safety.results.map(x=>x.tool.id),['moe','gov']);
});

test('date display cannot expose unverified, future-checked or inconsistent dates',()=>{
  assert.equal(canDisplayActivityDates(activities[0],'2026-10-21'),false);
  assert.equal(canDisplayActivityDates(fixture(),'2026-10-21'),true);
  assert.equal(canDisplayActivityDates(fixture({startsAt:'2026-02-30'}),'2026-10-21'),false);
  const item=fixture();
  assert.equal(canDisplayActivityDates({...item,source:{...item.source,verification:'待核验'}} as DevelopmentActivity,'2026-10-21'),false);
});
