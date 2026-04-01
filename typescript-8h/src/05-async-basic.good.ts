type Post = { id: number; title: string };
async function getPosts(): Promise<Post[]> {
  const res = await fetch('/api/posts');
  return res.json();
}
