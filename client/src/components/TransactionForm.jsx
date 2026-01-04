import { useState } from 'react';
import './TransactionForm.css';

function TransactionForm({ onSubmit, onCancel, editingTransaction }) {
  const [formData, setFormData] = useState({
    type: editingTransaction?.type || 'expense',
    amount: editingTransaction?.amount || '',
    category: editingTransaction?.category || '',
    description: editingTransaction?.description || '',
    date: editingTransaction?.date || new Date().toISOString().split('T')[0]
  });

  const categories = {
    income: ['工资', '投资', '兼职', '奖金', '其他'],
    expense: ['餐饮', '购物', '交通', '娱乐', '房租', '医疗', '教育', '其他']
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTransaction) {
      onSubmit(editingTransaction._id, formData);
    } else {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
        console.log('handleChange called:', { name, value, currentFormData: formData });
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      if (name === 'type') {
        newFormData.category = '';
      }
      return newFormData;
    });
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <h2>{editingTransaction ? '编辑交易' : '添加新交易'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>类型</label>
            <div className="type-selector">
              <button
                type="button"
                className={`type-btn ${formData.type === 'income' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: '' }))}
              >
                收入
              </button>
              <button
                type="button"
                className={`type-btn ${formData.type === 'expense' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: '' }))}
              >
                支出
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>金额</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              placeholder="请输入金额"
            />
          </div>

          <div className="form-group">
            <label>分类</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">请选择分类</option>
              {categories[formData.type].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>日期</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>描述</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="请输入描述（可选）"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              取消
            </button>
            <button type="submit" className="submit-btn">
              {editingTransaction ? '更新' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionForm;
