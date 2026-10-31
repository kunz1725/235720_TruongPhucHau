import { useState } from 'react';

const STATUSES = ['Đang sử dụng', 'Hư hỏng', 'Đang sửa chữa', 'Ngừng sử dụng'];

const empty = {
  deviceId: '', name: '', deviceType: '', room: '', brand: '',
  model: '', quantity: 1, status: 'Đang sử dụng', purchaseDate: '', description: '',
};

export default function DeviceForm({ initial, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(
    initial
      ? { ...empty, ...initial, purchaseDate: initial.purchaseDate ? initial.purchaseDate.slice(0, 10) : '' }
      : empty
  );

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      quantity: Number(form.quantity),
      purchaseDate: form.purchaseDate || undefined,
    });
  };

  const field = (name, label, type = 'text', required = false) => (
    <label>
      {label}{required && ' *'}
      <input
        name={name}
        type={type}
        value={form[name]}
        onChange={change}
        required={required}
        min={type === 'number' ? 0 : undefined}
      />
    </label>
  );

  return (
    <form className="card form" onSubmit={submit}>
      <h2>{initial ? 'Cập nhật thiết bị' : 'Thêm thiết bị'}</h2>
      {field('deviceId', 'Mã thiết bị', 'text', true)}
      {field('name', 'Tên thiết bị', 'text', true)}
      {field('deviceType', 'Loại thiết bị', 'text', true)}
      {field('room', 'Phòng học', 'text', true)}
      {field('brand', 'Hãng sản xuất')}
      {field('model', 'Model')}
      {field('quantity', 'Số lượng', 'number', true)}
      <label>
        Tình trạng
        <select name="status" value={form.status} onChange={change}>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      {field('purchaseDate', 'Ngày mua/tiếp nhận', 'date')}
      <label>
        Mô tả
        <textarea name="description" value={form.description} onChange={change} />
      </label>
      <div className="actions">
        <button type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
        <button type="button" className="secondary" onClick={onCancel}>Hủy</button>
      </div>
    </form>
  );
}