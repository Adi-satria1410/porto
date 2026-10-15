// Run: node tests/browser-qa.mjs
// Requires .qa-tools/playwright-core and an installed Chrome; only mocks are mutated.
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
let browserTools;
try { browserTools = await import('../.qa-tools/node_modules/playwright-core/index.mjs'); }
catch { browserTools = await import('../.qa-tools/playwright-core/index.mjs'); }
const { chromium } = browserTools;

const root = path.resolve(process.argv.includes('--built') ? 'dist' : '.');
const mime = { '.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.png':'image/png' };
const server = createServer(async (req,res) => {
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
    if(!file.startsWith(root+path.sep)) { res.writeHead(403).end();return; }
    res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(await readFile(file));
  }catch {res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
let browser;
await mkdir('tests/artifacts',{recursive:true});
try {
  browser=await chromium.launch({executablePath:process.env.QA_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  const errors=[];
  if (process.argv.includes('--live-readonly')) {
    const page=await context.newPage();
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(base+'/admin/login.html');
    await page.locator('#login-fields:not([disabled])').waitFor();
    console.log('PASS: actual CDN SDK initializes login with configured Supabase');
    await page.goto(base+'/admin/index.html');await page.waitForURL('**/admin/login.html');
    console.log('PASS: actual anonymous session redirects admin to login');
    await page.goto(base+'/index.html#contoh-project');
    await page.locator('#published-projects[aria-busy="false"]').waitFor();
    assert.equal(await page.locator('#collection-retry').isVisible(),false);
    console.log('PASS: actual public gallery loads from Supabase');
    assert.deepEqual(errors,[]);
    await page.screenshot({path:'tests/artifacts/live-gallery-desktop.png',fullPage:true});
  } else {
  await context.route('**/js/supabase-client.js',route=>route.fulfill({contentType:'text/javascript',path:'tests/fixtures/supabase-browser.mjs'}));
  // No requests to a live backend or remote scripts are allowed in mock QA.
  await context.route('**/*',route=>new URL(route.request().url()).origin===base ? route.fallback() : route.abort());
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  let cancelProjectDelete = false;
  page.on('dialog',dialog=>cancelProjectDelete && dialog.message().startsWith('Hapus permanen project') ? dialog.dismiss() : dialog.accept());
  const check=async(label,fn)=>{await fn();console.log('PASS:',label);};
  const visible=async selector=>page.locator(selector).waitFor({state:'visible'});
  async function screenshot(name){
    await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo({top:0,behavior:'instant'});});
    await page.screenshot({path:`tests/artifacts/${name}.png`,fullPage:true,animations:'disabled'});
  }
  async function noOverflow(){assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal page overflow');}

  await check('unauthenticated admin redirects to login',async()=>{
    await page.goto(base+'/admin/index.html');await page.waitForURL('**/admin/login.html');await page.locator('#email').waitFor({state:'visible'});
  });
  await screenshot('login-desktop');
  await check('wrong password and non-admin denied',async()=>{
    await page.locator('#email').fill('reader@example.test');await page.locator('#password').fill('wrong');await page.locator('#login-submit').click();
    await page.getByText('Login gagal.',{exact:false}).waitFor();
    await page.locator('#password').fill('test-password');await page.locator('#login-submit').click();
    await page.getByText('Akun ini tidak memiliki akses admin portfolio.').waitFor();
    await page.goto(base+'/admin/index.html');await page.getByText('Akun ini tidak memiliki akses admin portfolio.').waitFor();assert.equal(await page.locator('#dashboard').isVisible(),false);
  });
  await check('admin login and create draft',async()=>{
    await page.goto(base+'/admin/login.html');await page.locator('#email').fill('owner@example.test');await page.locator('#password').fill('test-password');await page.locator('#login-submit').click();
    await page.waitForURL('**/admin/index.html');await page.getByRole('link',{name:'+ Tambah project'}).click();
    await visible('#editor');await page.locator('#title').fill('QA Website');await page.locator('#description').fill('Contoh screenshot website untuk pengujian lokal.');
    await page.locator('#technologies').fill('HTML, CSS, JavaScript');await page.locator('#demo-url').fill('https://example.com');
    await page.getByRole('button',{name:'Simpan draft'}).click();await page.getByText('Draft berhasil disimpan.',{exact:false}).waitFor();
  });
  const draftUrl=page.url();
  await check('draft hidden from public gallery even with admin session',async()=>{
    const tab=await context.newPage();await tab.goto(base+'/index.html#contoh-project');await tab.getByText('Segera hadir. Belum ada project yang dipublikasikan.').waitFor();await tab.close();
  });
  const png=Buffer.from(await page.evaluate(()=>{
    const c=document.createElement('canvas');c.width=960;c.height=640;const x=c.getContext('2d');
    x.fillStyle='#121212';x.fillRect(0,0,960,640);x.fillStyle='#f2efe9';x.font='bold 60px sans-serif';x.fillText('QA WEBSITE',70,180);x.font='24px sans-serif';x.fillText('Local screenshot fixture',70,240);x.fillStyle='#ee3824';x.fillRect(70,310,300,90);return c.toDataURL('image/png').split(',')[1];
  }),'base64');
  await check('upload, cover and preview dialog',async()=>{
    await page.locator('#screenshot-file').setInputFiles({name:'test.png',mimeType:'image/png',buffer:png});
    await page.getByText('Preview lokal siap.',{exact:false}).waitFor();await page.locator('#screenshot-alt').fill('Desktop website');await page.getByRole('button',{name:'Upload screenshot',exact:true}).click();
    await page.getByText('1 screenshot tersimpan.',{exact:false}).waitFor();await page.getByRole('button',{name:'Jadikan gambar utama'}).click();await page.getByText('Gambar utama diperbarui.').waitFor();
    await page.getByRole('button',{name:'Preview project'}).click();await visible('#preview-dialog');assert.equal(await page.locator('#preview-title').textContent(),'QA Website');
    await page.keyboard.press('Escape');assert.equal(await page.locator('#preview-dialog').isVisible(),false);
  });
  await screenshot('editor-desktop');
  await check('editor mobile widths 320/390/768',async()=>{
    for(const width of [320,390,768]){await page.setViewportSize({width,height:900});await noOverflow();if(width===390)await screenshot('editor-mobile');}
  });
  await check('publish displays project on homepage and lightbox',async()=>{
    await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/admin/index.html');await page.getByRole('button',{name:'Publish project'}).click();await page.getByRole('button',{name:'Kembalikan ke draft'}).waitFor();
    await page.getByRole('link',{name:'Lihat portfolio'}).click();await page.waitForURL('**/index.html#contoh-project');await page.getByRole('heading',{name:'QA Website'}).waitFor();await page.locator('.gallery-cover img').waitFor();await screenshot('gallery-desktop');
    await page.getByRole('button',{name:'Lihat 1 screenshot QA Website'}).click();await visible('#gallery-image');await page.keyboard.press('Escape');assert.equal(await page.locator('#gallery-lightbox').isVisible(),false);
    for(const width of [320,390,768]){await page.setViewportSize({width,height:900});await noOverflow();if(width===390)await screenshot('gallery-mobile');}
  });
  await check('public connection failure and retry',async()=>{
    await page.evaluate(()=>localStorage.setItem('qa-offline','1'));await page.reload();await page.getByRole('button',{name:'Coba lagi',exact:true}).waitFor();
    await page.evaluate(()=>localStorage.removeItem('qa-offline'));await page.getByRole('button',{name:'Coba lagi',exact:true}).click();await page.getByRole('heading',{name:'QA Website'}).waitFor();
  });
  await check('old gallery URL redirects to homepage collection',async()=>{
    await page.goto(base+'/contoh-project.html');await page.waitForURL('**/index.html#contoh-project');
    await page.getByRole('heading',{name:'QA Website'}).waitFor();
  });
  await check('long homepage collection stays visible and paginates on mobile',async()=>{
    await page.evaluate(()=>{
      const db=JSON.parse(localStorage.getItem('qa-db'));
      for(let i=1;i<=9;i++) db.projects.push({...db.projects[0],id:`gallery-${i}`,title:`Gallery ${i}`,sort_order:i,description:'Responsive project description. '.repeat(40)});
      localStorage.setItem('qa-db',JSON.stringify(db));
    });
    await page.setViewportSize({width:320,height:900});await page.reload();
    await page.getByText('10 project dipublikasikan.').waitFor();
    await page.locator('#contoh-project').scrollIntoViewIfNeeded();
    await page.locator('#projects.is-revealed').waitFor();await noOverflow();
    assert.equal(await page.locator('.published-card').count(),9);
    await page.locator('#collection-next').click();await page.getByText('2 / 2',{exact:true}).waitFor();
    assert.equal(await page.locator('.published-card').count(),1);
    await page.locator('#collection-previous').click();await page.getByText('1 / 2',{exact:true}).waitFor();
    await page.evaluate(()=>{
      const db=JSON.parse(localStorage.getItem('qa-db'));
      db.projects=db.projects.filter(p=>!p.id.startsWith('gallery-'));
      localStorage.setItem('qa-db',JSON.stringify(db));
    });
  });
  await check('unpublish hides project and allows editing again',async()=>{
    await page.goto(base+'/admin/index.html');await page.getByRole('button',{name:'Kembalikan ke draft'}).click();await page.getByRole('link',{name:'Edit draft'}).waitFor();
    await page.goto(base+'/index.html#contoh-project');await page.getByText('Segera hadir. Belum ada project yang dipublikasikan.').waitFor();
    await page.goto(draftUrl);await visible('#editor');assert.equal(await page.locator('#title').inputValue(),'QA Website');
  });
  await check('delete screenshot removes file and metadata',async()=>{
    await page.getByRole('button',{name:'Hapus screenshot'}).click();await page.getByText('Screenshot dihapus.').waitFor();
    assert.equal(await page.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('qa-db')).files).length),0);
  });
  await check('dashboard filters and pagination on mobile',async()=>{
    await page.evaluate(()=>{
      const db=JSON.parse(localStorage.getItem('qa-db'));
      for(let i=0;i<12;i++) db.projects.push({...db.projects[0],id:crypto.randomUUID(),title:`Fixture ${i}`,sort_order:i+1});
      localStorage.setItem('qa-db',JSON.stringify(db));
    });
    await page.goto(base+'/admin/index.html');await page.getByText('13 project ditemukan.').waitFor();
    await page.getByRole('button',{name:'Berikutnya',exact:true}).click();await page.getByText('Halaman 2 / 2').waitFor();
    assert.equal(await page.locator('.project-item').count(),1);
    await page.locator('#search').fill('QA Website');await page.getByRole('button',{name:'Terapkan'}).click();await page.getByText('1 project ditemukan.').waitFor();
    await page.locator('#status').selectOption('published');await page.getByRole('button',{name:'Terapkan'}).click();await page.getByText('Tidak ada project yang cocok dengan pencarian ini.').waitFor();
    await page.locator('#status').selectOption('draft');await page.getByRole('button',{name:'Terapkan'}).click();await page.getByText('1 project ditemukan.').waitFor();
    await page.setViewportSize({width:390,height:844});await noOverflow();await screenshot('dashboard-mobile');
  });
  await check('cancel project deletion does not change data',async()=>{
    await page.evaluate(base64=>{
      const db=JSON.parse(localStorage.getItem('qa-db'));const id=crypto.randomUUID();const other=crypto.randomUUID();
      const seed={title:'Project Hapus',description:'Delete fixture',technologies:['HTML'],status:'published',sort_order:0,created_at:new Date().toISOString(),updated_at:new Date().toISOString()};
      db.projects.push({...seed,id},{...seed,id:other,title:'Project Tetap'});
      db.project_images.push({id:crypto.randomUUID(),project_id:id,storage_path:`${id}/linked.png`,alt_text:'Delete fixture',sort_order:0,is_cover:true});
      for(const p of [`${id}/linked.png`,`${id}/orphan.png`,`${other}/keep.png`])db.files[p]={base64,type:'image/png'};
      localStorage.setItem('qa-delete-id',id);localStorage.setItem('qa-other-id',other);localStorage.setItem('qa-db',JSON.stringify(db));
    },png.toString('base64'));
    await page.goto(base+'/admin/index.html');await visible('#dashboard');
    await page.locator('#search').fill('Project Hapus');await page.getByRole('button',{name:'Terapkan'}).click();await page.getByText('1 project ditemukan.').waitFor();
    cancelProjectDelete=true;await page.getByRole('button',{name:'Hapus project',exact:true}).click();cancelProjectDelete=false;
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('qa-db')).projects.find(p=>p.id===localStorage.getItem('qa-delete-id')).status),'published');
  });
  await check('storage failure retains draft, retry deletes project and all its files only',async()=>{
    await page.evaluate(()=>localStorage.setItem('qa-remove-fail','1'));
    await page.getByRole('button',{name:'Hapus project',exact:true}).click();await page.getByText('Project tetap draft',{exact:false}).waitFor();
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('qa-db')).projects.find(p=>p.id===localStorage.getItem('qa-delete-id')).status),'draft');
    await page.evaluate(()=>localStorage.removeItem('qa-remove-fail'));
    await page.getByRole('button',{name:'Hapus project',exact:true}).click();await page.getByText('Project dan seluruh screenshot berhasil dihapus.').waitFor();
    assert.deepEqual(await page.evaluate(()=>{
      const db=JSON.parse(localStorage.getItem('qa-db'));const id=localStorage.getItem('qa-delete-id');const other=localStorage.getItem('qa-other-id');
      return {project:db.projects.some(p=>p.id===id),images:db.project_images.some(i=>i.project_id===id),files:Object.keys(db.files).filter(p=>p.startsWith(id+'/')).length,other:Boolean(db.files[`${other}/keep.png`])};
    }),{project:false,images:false,files:0,other:true});
    await screenshot('delete-project-mobile');
  });
  await check('empty draft deletion and last-page pagination recovery',async()=>{
    await page.locator('#search').fill('QA Website');await page.getByRole('button',{name:'Terapkan'}).click();await page.getByText('1 project ditemukan.').waitFor();
    await page.getByRole('button',{name:'Hapus project',exact:true}).click();await page.getByText('Project dan seluruh screenshot berhasil dihapus.').waitFor();
    await page.goto(base+'/admin/index.html');await page.getByText('13 project ditemukan.').waitFor();
    await page.getByRole('button',{name:'Berikutnya',exact:true}).click();await page.getByText('Halaman 2 / 2').waitFor();
    assert.equal(await page.locator('.project-item').count(),1);
    await page.getByRole('button',{name:'Hapus project',exact:true}).click();await page.getByText('Project dan seluruh screenshot berhasil dihapus.').waitFor();
    await page.getByText('Halaman 1 / 1').waitFor();assert.equal(await page.locator('.project-item').count(),12);
  });
  await check('logout then Back protects admin',async()=>{
    await page.goto(base+'/admin/index.html');await page.getByRole('button',{name:'Keluar',exact:true}).click();await page.waitForURL('**/admin/login.html');
    await page.goBack();await page.waitForURL('**/admin/login.html');await page.setViewportSize({width:390,height:844});await noOverflow();await screenshot('login-mobile');
  });
  assert.deepEqual(errors,[]);console.log('PASS: no uncaught browser JavaScript errors');
  }
} finally { await browser?.close();await new Promise(resolve=>server.close(resolve)); }
