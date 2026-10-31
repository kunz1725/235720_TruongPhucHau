import { useEffect, useState } from 'react';
import { getDevices, getDevice, createDevice, updateDevice, deleteDevice } from './api';
import DeviceForm from './DeviceForm';
import './App.css';

const statusClass = {
  'Đang sử dụng': 'ok',
  'Hư hỏng': 'bad',
  'Đang sửa chữa': 'fix',
  'Ngừng sử dụng': 'off',
};

export default function App() {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [view, setView] = useState('list'); // list | detail | form
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async (keyword = search) => {
    setLoading(true);
    setError('');
    try {
      setDevices(await getDevices(keyword));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(''); }, []);

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3000);
  };

  const openDetail = async (id) => {
    setError('');
    try {
      setSelected(await getDevice(id));
      setView('detail');
    } catch (e) {
      setError(e.message);
    }
  };

  const save = async (data) => {
    setSaving(true);
    setError('');
    try {
      if (selected) {
        await updateDevice(selected._id, data);
        flash('Cập nhật thiết bị thành công');
      } else {
        await createDevice(data);
        flash('Thêm thiết bị thành công');
      }
      setView('list');
      setSelected(null);
      await load();
    } catch (e) {
      setError([e.message, ...(e.details || [])].join(' - '));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (d) => {
    if (!window.confirm(`Xóa thiết bị ${d.name}?`)) return;
    try {
      await deleteDevice(d._id);
      flash('Đã xóa thiết bị');
      setView('list');
      setSelected(null);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="container">
      <h1>Quản lý thiết bị phòng học</h1>
      {notice && <div className="alert success">{notice}</div>}
      {error && <div className="alert error">{error}</div>}

      {view === 'form' && (
        <DeviceForm
          initial={selected}
          saving={saving}
          onSubmit={save}
          onCancel={() => { setView('list'); setSelected(null); setError(''); }}
        />
      )}

      {view === 'detail' && selected && (
        <div className="card">
          <h2>{selected.name}</h2>
          <p><b>Mã:</b> {selected.deviceId}</p>
          <p><b>Loại:</b> {selected.deviceType}</p>
          <p><b>Phòng:</b> {selected.room}</p>
          <p><b>Hãng / Model:</b> {selected.brand} / {selected.model}</p>
          <p><b>Số lượng:</b> {selected.quantity}</p>
          <p>
            <b>Tình trạng:</b>{' '}
            <span className={`badge ${statusClass[selected.status]}`}>{selected.status}</span>
          </p>
          <p>
            <b>Ngày mua:</b>{' '}
            {selected.purchaseDate ? new Date(selected.purchaseDate).toLocaleDateString('vi-VN') : '—'}
          </p>
          <p><b>Mô tả:</b> {selected.description}</p>
          <div className="actions">
            <button onClick={() => setView('form')}>Sửa</button>
            <button className="danger" onClick={() => remove(selected)}>Xóa</button>
            <button className="secondary" onClick={() => { setView('list'); setSelected(null); }}>
              Quay lại
            </button>
          </div>
        </div>
      )}

      {view === 'list' && (
        <>
          <div className="toolbar">
            <form onSubmit={(e) => { e.preventDefault(); load(search); }}>
              <input
                placeholder="Tìm theo mã, tên, loại, phòng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit">Tìm kiếm</button>
              <button type="button" className="secondary" onClick={() => { setSearch(''); load(''); }}>
                Xóa lọc
              </button>
            </form>
            <button onClick={() => { setSelected(null); setView('form'); }}>+ Thêm thiết bị</button>
          </div>

          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Mã</th><th>Tên</th><th>Loại</th><th>Phòng</th>
                  <th>SL</th><th>Tình trạng</th><th></th>
                </tr>
              </thead>
              <tbody>
                {devices.length === 0 && (
                  <tr><td colSpan="7">Không có thiết bị nào</td></tr>
                )}
                {devices.map((d) => (
                  <tr key={d._id}>
                    <td>{d.deviceId}</td>
                    <td>{d.name}</td>
                    <td>{d.deviceType}</td>
                    <td>{d.room}</td>
                    <td>{d.quantity}</td>
                    <td><span className={`badge ${statusClass[d.status]}`}>{d.status}</span></td>
                    <td className="actions">
                      <button onClick={() => openDetail(d._id)}>Chi tiết</button>
                      <button onClick={() => { setSelected(d); setView('form'); }}>Sửa</button>
                      <button className="danger" onClick={() => remove(d)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}