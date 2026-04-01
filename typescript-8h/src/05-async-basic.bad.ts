async function getPosts() { const res = await fetch('/api/posts'); return res.json(); }
