// Browser-only fake, substituted by the QA runner. Never imported by production.
const read = () => JSON.parse(localStorage.getItem('qa-db') || '{"projects":[],"project_images":[],"files":{}}');
const write = db => localStorage.setItem('qa-db', JSON.stringify(db));
const session = () => JSON.parse(localStorage.getItem('qa-session') || 'null');
const callbacks = [];
const emit = event => callbacks.forEach(callback => callback(event));
function createClient(isPublic = false) {
  const client = {
    auth: {
      async getSession() { return { data: { session: session() } }; },
      async getUser() { return { data: { user: session() } }; },
      async signInWithPassword({ email, password }) {
        if (password !== 'test-password') return { error: true };
        localStorage.setItem('qa-session', JSON.stringify({ id: email, email }));
        emit('SIGNED_IN'); return { data: { user: session() } };
      },
      async signOut() { localStorage.removeItem('qa-session'); emit('SIGNED_OUT'); return {}; },
      onAuthStateChange(callback) { callbacks.push(callback); },
    },
    async rpc() { return { data: session()?.email === 'owner@example.test' }; },
    from(table) {
      let action = 'select', payload, filters = [], sort = [], start = 0, end = Infinity, fields = '';
      const q = {
        select(value = '*') { fields = value; return q; },
        insert(value) { action = 'insert'; payload = value; return q; },
        update(value) { action = 'update'; payload = value; return q; },
        delete() { action = 'delete'; return q; },
        eq(key, value) { filters.push(row => row[key] === value); return q; },
        ilike(key, value) { const term = value.slice(1,-1).replace(/\\([%_\\])/g,'$1').toLowerCase(); filters.push(row => row[key].toLowerCase().includes(term)); return q; },
        order(key) { sort.push(key); return q; },
        range(a,b) { start=a;end=b;return q; },
        async single() { const r = await run(); return { ...r, data: r.data?.length === 1 ? r.data[0] : null, error: r.error || r.data?.length !== 1 }; },
        async maybeSingle() { const r = await run(); return { ...r, data: r.data?.[0] || null }; },
        then(resolve,reject) { return run().then(resolve,reject); },
      };
      async function run() {
        if (localStorage.getItem('qa-offline')) return { error: true };
        const db = read();
        const admin = !isPublic && session()?.email === 'owner@example.test';
        if (action !== 'select' && !admin) return { error: true };
        let rows = db[table].filter(row => filters.every(f => f(row)));
        if (!admin) rows = rows.filter(row => table === 'projects' ? row.status === 'published' : db.projects.some(p => p.id === row.project_id && p.status === 'published'));
        if (action === 'insert') {
          rows = [{ id: crypto.randomUUID(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), is_cover: false, ...payload }]; db[table].push(...rows);
        }
        if (action === 'update') rows.forEach(row => Object.assign(row,payload, table === 'projects' ? { updated_at: new Date().toISOString() } : {}));
        if (action === 'delete') {
          db[table] = db[table].filter(row => !rows.includes(row));
          if (table === 'projects') db.project_images = db.project_images.filter(img => !rows.some(row => row.id === img.project_id));
        }
        write(db);
        rows.sort((a,b) => { for(const key of sort) { if(a[key] < b[key]) return -1;if(a[key] > b[key]) return 1; } return 0; });
        const count = rows.length;
        rows = rows.slice(start,end+1);
        if (table === 'projects' && fields.includes('project_images(')) rows = rows.map(row => ({ ...row, project_images: db.project_images.filter(img => img.project_id === row.id) }));
        return { data: rows, count };
      }
      return q;
    },
    storage: { from: () => ({
      async list(folder,{limit=100,offset=0}={}) {
        const names=Object.keys(read().files).filter(key=>key.startsWith(folder+'/')).map(key=>key.slice(folder.length+1)).sort();
        return {data:names.slice(offset,offset+limit).map(name=>({id:name,name}))};
      },
      async upload(path,file) {
        const db=read();const bytes=new Uint8Array(await file.arrayBuffer());
        db.files[path]={base64:btoa(Array.from(bytes,b=>String.fromCharCode(b)).join('')),type:file.type};write(db);return {};
      },
      async download(path) {
        const db=read(); const file=db.files[path];
        const permitted = (!isPublic && session()?.email === 'owner@example.test') || db.project_images.some(i=>i.storage_path===path && db.projects.some(p=>p.id===i.project_id && p.status==='published'));
        return file && permitted ? { data:new Blob([Uint8Array.from(atob(file.base64),c=>c.charCodeAt(0))],{type:file.type}) } : {error:true};
      },
      async remove(paths) {
        if (localStorage.getItem('qa-remove-fail')) return {error:true};
        const db=read();paths.forEach(path=>delete db.files[path]);write(db);return {};
      },
    }) },
  };
  return client;
}
export async function getSupabase() { return createClient(); }
export async function getPublicSupabase() { return createClient(true); }
