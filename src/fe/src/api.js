// URL relative — funziona sia in dev (grazie al proxy Vite) che in produzione
const BASE = "";

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

export const getRecords   = ()         => request("GET",    "/records");
export const createRecord = (data)     => request("POST",   "/records", data);
export const updateRecord = (id, data) => request("PUT",    `/records/${id}`, data);
export const deleteRecord = (id)       => request("DELETE", `/records/${id}`);

export const getTags      = ()         => request("GET",    "/tags");
export const createTag    = (name)     => request("POST",   "/tags", { name });
export const deleteTag    = (name)     => request("DELETE", `/tags/${name}`);

export const getBackup    = ()         => request("GET",    "/backup");
export const postRestore  = (data)     => request("POST",   "/restore", data);

export async function loadAll() {
  const [records, tags] = await Promise.all([getRecords(), getTags()]);
  return { records, tags: tags.map(t => t.name) };
}
