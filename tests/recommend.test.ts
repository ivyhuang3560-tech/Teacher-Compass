import test from 'node:test';
import assert from 'node:assert/strict';
import {recommend,validateTask,tools} from '../lib/recommend';
test('rejects empty, short and overly long input',()=>{assert.ok(validateTask('  '));assert.ok(validateTask('课件'));assert.ok(validateTask('字'.repeat(501)));assert.equal(validateTask('我想制作课件'),'');});
test('matches PPT case-insensitively and caps candidates at three',()=>{const r=recommend('小学 ppt 课件');assert.ok(r.results.length>0);assert.ok(r.results.length<=3);assert.equal(r.results[0].tool.id,'wps');assert.ok(r.constraints.includes('小学'));});
test('policy task yields policy resources',()=>{const r=recommend('查询教育政策法规');assert.ok(r.results.length);assert.ok(r.results.every(x=>x.tool.category==='政策信息'));});
test('unknown task has a true empty result',()=>{assert.equal(recommend('今天的天气怎么样').results.length,0);});
test('free constraint never invents verified pricing',()=>{const r=recommend('免费试卷');assert.ok(r.constraints.some(c=>c.includes('无法保证')));assert.ok(r.results.every(x=>x.tool.fee.includes('待核验')));});
test('ranking is deterministic and reasons explain keyword match',()=>{assert.deepEqual(recommend('初中试题练习'),recommend('初中试题练习'));assert.match(recommend('初中试题练习').results[0].reason,/试题/);});
test('catalog preserves original tools and has unique HTTPS records with guides',()=>{assert.ok(tools.length>=32);assert.equal(new Set(tools.map(t=>t.id)).size,tools.length);for(const id of ['wps','canva','smartedu','moe','gov']) assert.ok(tools.some(t=>t.id===id));for(const t of tools){assert.equal(new URL(t.url).protocol,'https:');assert.ok(t.steps.length>=3);assert.ok(t.limitations);}});
test('student injury prioritizes safety and only offers policy follow-up',()=>{
  const r=recommend('我的学生在课堂上受伤了');
  assert.equal(r.task,'学生受伤与校园应急处置');
  assert.equal(r.safety?.preparation,false);
  assert.ok(r.safety?.steps.some(s=>s.includes('120')));
  assert.deepEqual(r.results.map(x=>x.tool.id),['moe','gov']);
});
test('emergency overrides ordinary classroom and PPT keyword matches',()=>{
  const r=recommend('小学课堂互动时学生摔伤流血了，正在展示PPT');
  assert.ok(r.safety);
  assert.ok(r.results.every(x=>x.tool.category==='政策信息'));
});
test('safety lesson is identified as preparation rather than a live event',()=>{
  const r=recommend('我想做预防学生受伤的安全教育课件');
  assert.equal(r.safety?.preparation,true);
  assert.equal(r.task,'校园安全教育与应急准备');
});
test('natural-language classroom tasks resolve through explicit aliases',()=>{
  assert.ok(recommend('我的学生上课都不愿发言').results.some(x=>x.tool.category==='课堂互动'));
  assert.ok(recommend('我想设计一节课').results.some(x=>x.tool.category==='教学设计'));
  assert.ok(recommend('学生经常不交作业怎么办').results.some(x=>x.tool.category==='班级管理'));
});
test('unrelated injuries do not become a student emergency',()=>{
  assert.equal(recommend('我的电脑外壳摔伤了').safety,null);
  assert.equal(recommend('小学数学PPT课件').safety,null);
});
test('new resource scenarios return relevant candidates',()=>{
  for (const [input,category] of [['我想录制微课','多媒体处理'],['想找教师培训课程','教师成长'],['我想查文献写论文','学术科研'],['用卡片帮助学生背单词','教育辅助']]) {
    const result=recommend(input);
    assert.ok(result.results.length>0,input);
    assert.equal(result.results[0].tool.category,category,input);
    assert.ok(result.results.length<=3);
  }
});
test('expanded records retain provenance and unverified pricing',()=>{
  for(const t of tools.filter(t=>t.sources.length)){
    assert.equal(t.sources[0].url,'https://www.edutoolbox.org.cn/');
    assert.match(t.sources[0].type,/未独立核验/);
    assert.match(t.fee,/待核验/);
  }
  assert.equal(new Set(tools.map(t=>t.url)).size,tools.length);
});
test('tool name search gives exact resource priority',()=>{
  assert.equal(recommend('我想用 OBS Studio 录课').results[0].tool.id,'obs');
  assert.equal(recommend('想用 Notion 整理工作').results[0].tool.id,'notion');
});
test('student physical conflict is recognized without injury keywords',()=>{
  for(const q of ['学生之间发生肢体冲突','班里两个学生打架了','同学在走廊互相推搡','学生打起来了']){
    const r=recommend(q);
    assert.equal(r.task,'学生肢体冲突与校园安全处置',q);
    assert.equal(r.safety?.preparation,false,q);
    assert.ok(r.safety.steps.some(s=>s.includes('学校安保')));
    assert.ok(r.safety.steps.some(s=>s.includes('110')&&s.includes('120')));
    assert.deepEqual(r.results.map(x=>x.tool.id),['moe','gov']);
  }
});
test('conflict prevention is distinguished from active incidents',()=>{
  const r=recommend('准备一个预防学生打架的主题班会');
  assert.equal(r.task,'学生冲突预防与安全教育');
  assert.equal(r.safety?.preparation,true);
});
test('injury during conflict retains medical escalation guidance',()=>{
  const r=recommend('学生打架受伤了，大量出血');
  assert.equal(r.safety?.preparation,false);
  assert.ok(r.safety?.steps.some(s=>s.includes('120')));
});
test('active injury or fighting takes priority over lesson material words',()=>{
  assert.equal(recommend('正在展示课件，学生打起来了').safety?.preparation,false);
  assert.equal(recommend('安全教育课上学生受伤了').safety?.preparation,false);
});
test('unrelated conflict terms do not trigger school violence guidance',()=>{
  assert.equal(recommend('安装软件发生版本冲突').safety,null);
  assert.equal(recommend('学生的PPT颜色冲突怎么改').safety,null);
});
