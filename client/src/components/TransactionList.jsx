import './TransactionList.css';

function TransactionList({ transactions, onEdit, onDelete, filter, onFilterChange }) {
  const categories = ['工资', '投资', '兼职', '奖金', '餐饮', '购物', '交通', '娱乐', '房租', '医疗', '教育', '其他'];

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="transaction-list">
      <div className="list-header">
        <h2>交易记录</h2>
        <div className="filters">
          <select
            value={filter.type}
            onChange={(e) => onFilterChange({ ...filter, type: e.target.value })}
          >
            <option value="">全部类型</option>
            <option value="income">收入</option>
            <option value="expense">支出</option>
          </select>
          <select
            value={filter.category}
            onChange={(e) => onFilterChange({ ...filter, category: e.target.value })}
          >
            <option value="">全部分类</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {sortedTransactions.length === 0 ? (
        <div className="empty-state">
          <p>暂无交易记录</p>
        </div>
      ) : (
        <div className="transactions">
          {sortedTransactions.map(transaction => (
            <div key={transaction._id} className={`transaction-item ${transaction.type}`}>
              {/* <div className="transaction-icon">
                {transaction.type === 'income' ? '📈' : '📉'}
              </div> */}
              <div className="transaction-info">
                <div className="transaction-header">
                  <h3>{transaction.category}</h3>
                  <span className={`amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}¥{transaction.amount.toFixed(2)}
                  </span>
                </div>
                <p className="description">{transaction.description || '无描述'}</p>
                <p className="date">{new Date(transaction.date).toLocaleDateString('zh-CN')}</p>
              </div>
              <div className="transaction-actions">
                <button className="edit-btn" onClick={() => onEdit(transaction)}>
                  编辑
                </button>
                <button className="delete-btn" onClick={() => onDelete(transaction._id)}>
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionList;
