import './Dashboard.css';

function Dashboard({ summary, transactions }) {
  const categories = Object.keys(summary.categorySummary || {});

  return (
    <div className="dashboard">
      <div className="dashboard-cards">
        <div className="card income-card">
          {/* <div className="card-icon">📈</div> */}
          <div className="card-content">
            <h3>总收入</h3>
            <p className="amount">¥{summary.totalIncome.toFixed(2)}</p>
          </div>
        </div>

        <div className="card expense-card">
          {/* <div className="card-icon">📉</div> */}
          <div className="card-content">
            <h3>总支出</h3>
            <p className="amount">¥{summary.totalExpense.toFixed(2)}</p>
          </div>
        </div>

        <div className="card balance-card">
          {/* <div className="card-icon">💳</div> */}
          <div className="card-content">
            <h3>余额</h3>
            <p className={`amount ${summary.balance >= 0 ? 'positive' : 'negative'}`}>
              ¥{summary.balance.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="category-breakdown">
        <h3>分类统计</h3>
        <div className="category-list">
          {categories.map(category => {
            const catData = summary.categorySummary[category];
            const maxAmount = Math.max(...categories.map(c => 
              summary.categorySummary[c].income + summary.categorySummary[c].expense
            ));
            const total = catData.income + catData.expense;
            const percentage = (total / maxAmount) * 100;

            return (
              <div key={category} className="category-item">
                <div className="category-info">
                  <span className="category-name">{category}</span>
                  <span className="category-amount">¥{total.toFixed(2)}</span>
                </div>
                <div className="category-bar">
                  <div 
                    className="bar-fill income" 
                    style={{ width: `${(catData.income / total) * percentage}%` }}
                  ></div>
                  <div 
                    className="bar-fill expense" 
                    style={{ width: `${(catData.expense / total) * percentage}%` }}
                  ></div>
                </div>
                <div className="category-details">
                  <span className="income-text">收入: ¥{catData.income.toFixed(2)}</span>
                  <span className="expense-text">支出: ¥{catData.expense.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
