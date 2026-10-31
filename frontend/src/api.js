const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Không kết nối được tới máy chủ');
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(data?.message || 'Có lỗi xảy ra');
    err.details = data?.errors;
    throw err;
  }
  return data;
}

export const getDevices = (search = '') =>
  request(`/api/devices${search ? `?search=${encodeURIComponent(search)}` : ''}`);
export const getDevice = (id) => request(`/api/devices/${id}`);
export const createDevice = (body) =>
  request('/api/devices', { method: 'POST', body: JSON.stringify(body) });
export const updateDevice = (id, body) =>
  request(`/api/devices/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteDevice = (id) =>
  request(`/api/devices/${id}`, { method: 'DELETE' });