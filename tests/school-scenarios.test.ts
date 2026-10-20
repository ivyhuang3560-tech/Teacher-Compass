import test from 'node:test';
import assert from 'node:assert/strict';
import { schoolScenarios, identifySchoolScenario } from '../lib/school-scenarios';
import { recommend, tools } from '../lib/recommend';

test('all scenario examples resolve to their own guidance and valid resources',()=>{
  assert.equal(schoolScenarios.length,26);
  assert.equal(new Set(schoolScenarios.map(s=>s.id)).size,schoolScenarios.length);
  for(const scenario of schoolScenarios){
    assert.equal(identifySchoolScenario(scenario.example)?.id,scenario.id,scenario.example);
    const r=recommend(scenario.example);
    assert.equal(r.guidance?.id,scenario.id,scenario.example);
    assert.ok(r.results.length>0 && r.results.length<=3,scenario.id);
    for(const id of scenario.toolIds) assert.ok(tools.some(t=>t.id===id),id);
    assert.ok(scenario.steps.length>=3 && scenario.question.length>0);
  }
});
test('safety matters take priority over routine homework scenarios',()=>{
  for(const input of ['学生不交作业，还说不想活了','学生作业没完成，现在不见了']){
    const r=recommend(input);
    assert.equal(r.guidance?.priority,true);
    assert.ok(r.results.every(x=>x.tool.category==='政策信息'));
  }
});
test('common natural variants identify guidance without generic false positives',()=>{
  assert.equal(recommend('学生上课不听讲怎么办').guidance?.id,'attention');
  assert.equal(recommend('学生上课捣乱').guidance?.id,'discipline');
  assert.equal(recommend('家长投诉我讲课太快').guidance?.id,'parent-complaint');
  assert.equal(recommend('明天会不会下雨').guidance,null);
  assert.equal(recommend('我的电脑不见了').guidance,null);
  assert.equal(recommend('学生用PPT展示学习成果').guidance,null);
});
test('student conflict and injury still override routine tool recommendations',()=>{
  for(const q of ['学生不交作业发生肢体冲突','学生课堂上摔伤了']){
    const r=recommend(q);
    assert.ok(r.safety);
    assert.ok(r.results.every(x=>x.tool.category==='政策信息'));
    assert.equal(r.guidance,null);
  }
});
