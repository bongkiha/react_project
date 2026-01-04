import { useState, useEffect } from 'react';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({ type: '', category: '' });

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/summary');
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleAddTransaction = async (transactionData) => {
    try {
      const response = await fetch('http://localhost:5001/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      });
      const newTransaction = await response.json();
      setTransactions([...transactions, newTransaction]);
      fetchSummary();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleUpdateTransaction = async (id, transactionData) => {
    try {
      const response = await fetch(`http://localhost:5001/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      });
      const updatedTransaction = await response.json();
      setTransactions(transactions.map(t => t._id === id ? updatedTransaction : t));
      fetchSummary();
      setEditingTransaction(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await fetch(`http://localhost:5001/api/transactions/${id}`, {
        method: 'DELETE'
      });
      setTransactions(transactions.filter(t => t._id !== id));
      fetchSummary();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter.type && t.type !== filter.type) return false;
    if (filter.category && t.category !== filter.category) return false;
    return true;
  });

  return (
    <div className="app">
      <header className="app-header">
        <h1>ZZB-财务追踪器</h1>
        <button className="add-btn" onClick={() => {
          setEditingTransaction(null);
          setShowForm(true);
        }}>
          + 添加交易
        </button>
      </header>

      {summary && <Dashboard summary={summary} transactions={transactions} />}

      {showForm && (
        <TransactionForm
          onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
          onCancel={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
          editingTransaction={editingTransaction}
        />
      )}

      <TransactionList
        transactions={filteredTransactions}
        onEdit={handleEdit}
        onDelete={handleDeleteTransaction}
        filter={filter}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}

export default App;
