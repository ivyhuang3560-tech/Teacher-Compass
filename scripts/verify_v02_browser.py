"""可选浏览器验收：需要 Python Playwright 和 Chromium，不是运行网站的依赖。"""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='http://127.0.0.1:3010')
parser.add_argument('--chromium', default='/usr/bin/chromium')
parser.add_argument('--screenshots', default='docs/screenshots')
args = parser.parse_args()
base = args.base_url.rstrip('/')
output = Path(args.screenshots)
output.mkdir(parents=True, exist_ok=True)
errors = []
checks = []

def passed(text):
    checks.append(text)
    print('PASS', text, flush=True)

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=args.chromium, args=['--no-sandbox'])
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, locale='zh-CN')
    page = context.new_page()
    page.on('pageerror', lambda error: errors.append(str(error)))
    for path, title in [('/', '从教学难题出发'), ('/updates', '教育动态'), ('/activities', '发展活动'), ('/tools', '工具导航')]:
        response = page.goto(base+path, wait_until='networkidle')
        assert response.status == 200
        assert page.locator('h1').inner_text().find(title) >= 0
        nav = page.get_by_role('navigation', name='主导航')
        assert nav.get_by_role('link').all_text_contents() == ['首页','教育动态','发展活动','工具导航']
        assert nav.locator('[aria-current="page"]').count() == 1
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        page.screenshot(path=str(output / (('home' if path=='/' else path[1:])+'-desktop.png')), full_page=True)
    passed('four main pages, consistent active navigation and desktop screenshots')

    page.goto(base+'/updates', wait_until='networkidle')
    page.get_by_label('教师权益与职业保障', exact=True).check()
    page.get_by_label('信息类型', exact=True).select_option('法律法规')
    page.get_by_role('button', name='应用筛选').click()
    page.wait_for_load_state('networkidle')
    assert 'topic=' in page.url and 'type=' in page.url
    cards = page.locator('article.content-card')
    assert cards.count() == 1
    cards.first.get_by_role('link', name='查看内容与来源说明').click()
    page.get_by_role('link', name='返回教育动态').click()
    assert page.get_by_label('教师权益与职业保障', exact=True).is_checked()
    assert page.get_by_label('信息类型', exact=True).input_value() == '法律法规'
    passed('topic/type filtering and detail return preserve URL selections')

    page.goto(base+'/activities', wait_until='networkidle')
    page.get_by_label('活动状态', exact=True).select_option('报名中')
    page.get_by_role('button', name='应用筛选').click()
    assert page.locator('article.content-card').count() == 0
    assert page.get_by_role('heading', name='没有找到匹配内容').is_visible()
    page.get_by_role('link', name='重置条件，浏览全部').click()
    page.get_by_label('帮我找适合的成长活动', exact=True).fill('帮我找小学语文公开课')
    page.get_by_role('button', name='查找资源').click()
    page.wait_for_load_state('networkidle')
    assert page.locator('article.content-card').count() == 1
    assert 'DEMO' in page.locator('article.content-card').inner_text()
    assert page.get_by_role('link', name='报名', exact=True).count() == 0
    page.get_by_role('link', name='查看条件与来源说明').click()
    assert page.locator('.source-disclosure').inner_text().find('非真实内容') >= 0
    page.get_by_role('link', name='返回发展活动').click()
    assert page.get_by_label('帮我找适合的成长活动', exact=True).input_value() == '帮我找小学语文公开课'
    passed('activity matching, no fake signup and detail return preserves query')

    page.goto(base+'/tools', wait_until='networkidle')
    assert page.locator('article.card').count() == 32
    page.get_by_label('关键词搜索', exact=True).fill('OBS')
    page.get_by_role('button', name='应用筛选').click()
    assert page.locator('article.card').count() == 1
    page.get_by_role('link', name='查看详情与操作指南').click()
    page.get_by_role('link', name='返回工具导航').click()
    assert page.get_by_label('关键词搜索', exact=True).input_value() == 'OBS'
    passed('32 original resources and tool filter/detail return')

    page.goto(base+'/', wait_until='networkidle')
    page.get_by_label('全局自然语言检索', exact=True).fill('学生之间发生肢体冲突')
    page.get_by_role('button', name='查找资源').click()
    assert page.locator('.safety-panel').is_visible()
    page.get_by_role('link', name='查看完整情境建议与求助提示').click()
    assert '学生肢体冲突与校园安全处置' in page.locator('.summary').inner_text()
    assert '110' in page.locator('.safety-panel').inner_text()
    assert '120' in page.locator('.safety-panel').inner_text()
    passed('global search preserves safety priority and routes to full guidance')
    page.goto(base+'/updates?q='+('字'*201), wait_until='networkidle')
    assert page.locator('.error[role=alert]').is_visible()
    missing = page.goto(base+'/activities/not-found', wait_until='networkidle')
    assert missing.status == 404
    assert page.get_by_role('heading', name='暂未找到这个页面').is_visible()
    passed('oversized input error and unknown detail 404 state')

    mobile = context.new_page()
    mobile.set_viewport_size({'width':390,'height':844})
    mobile.on('pageerror', lambda error: errors.append(str(error)))
    for path in ['/', '/updates', '/activities', '/tools', '/recommend?q=学生之间发生肢体冲突']:
        mobile.goto(base+path, wait_until='networkidle')
        assert mobile.evaluate('document.documentElement.scrollWidth <= innerWidth'), path
        for link in mobile.get_by_role('navigation', name='主导航').get_by_role('link').all():
            assert link.is_visible()
    mobile.goto(base+'/', wait_until='networkidle')
    mobile.screenshot(path=str(output/'home-mobile.png'), full_page=True)
    mobile.goto(base+'/updates', wait_until='networkidle')
    mobile.screenshot(path=str(output/'updates-mobile.png'), full_page=True)
    passed('390px mobile layouts without horizontal overflow')

    page.goto(base+'/', wait_until='networkidle')
    page.keyboard.press('Tab')
    assert page.locator('.skip-link').evaluate('(el)=>el===document.activeElement')
    page.keyboard.press('Enter')
    assert page.locator('main').evaluate('(el)=>el===document.activeElement')
    passed('keyboard skip navigation')

    assert not errors, errors
    passed('no browser page errors')
    browser.close()
print(json.dumps({'checks':len(checks),'page_errors':errors}, ensure_ascii=False))
