import { Picker } from '@react-native-picker/picker';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Button,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { auth, db } from '../../firebase';
import ChartSection from '../components/ChartSection'; // ✅ Chart import

export default function TransactionsScreen() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 });
  const [userId, setUserId] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchTransactions(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  const fetchTransactions = async (uid) => {
    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const loaded = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTransactions(loaded);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const handleSaveTransaction = async () => {
    if (!title || !amount || !type || !category || !date || !userId) return;

    const data = {
      title,
      amount: parseFloat(amount),
      type,
      category,
      date: date.toISOString(),
      createdAt: serverTimestamp(),
      userId,
    };

    try {
      if (editingId) {
        const docRef = doc(db, 'transactions', editingId);
        await updateDoc(docRef, data);
      } else {
        await addDoc(collection(db, 'transactions'), data);
      }

      fetchTransactions(userId);
      resetForm();
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleDeleteTransaction = async () => {
    try {
      await deleteDoc(doc(db, 'transactions', editingId));
      fetchTransactions(userId);
      resetForm();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setAmount('');
    setType('income');
    setCategory('');
    setDate(new Date());
  };

  useEffect(() => {
    let income = 0;
    let expenses = 0;
    transactions.forEach((t) => {
      if (t.type === 'income') income += parseFloat(t.amount);
      if (t.type === 'expense') expenses += parseFloat(t.amount);
    });
    setSummary({ income, expenses, balance: income - expenses });
  }, [transactions]);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const txMonth = t.date ? new Date(t.date).toISOString().slice(0, 7) : '';
    const matchesMonth = selectedMonth ? txMonth === selectedMonth : true;
    return matchesSearch && matchesMonth;
  });

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(i);
    return {
      label: date.toLocaleString('default', { month: 'long' }),
      value: `${date.getFullYear()}-${String(i + 1).padStart(2, '0')}`,
    };
  });

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Button title="Logout" onPress={() => signOut(auth)} />
            <Text style={styles.heading}>Transactions</Text>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>Income: ${summary.income.toFixed(2)}</Text>
              <Text style={styles.summaryText}>Expenses: ${summary.expenses.toFixed(2)}</Text>
              <Text style={styles.summaryText}>Balance: ${summary.balance.toFixed(2)}</Text>
            </View>

            <ChartSection income={summary.income} expenses={summary.expenses} />

            <TextInput style={styles.input} placeholder="Title" placeholderTextColor="#444" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Amount" placeholderTextColor="#444" value={amount} onChangeText={setAmount} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Category" placeholderTextColor="#444" value={category} onChangeText={setCategory} />
            <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD)" placeholderTextColor="#444" value={date.toISOString().split('T')[0]} onChangeText={(text) => setDate(new Date(text))} />

            <View style={styles.pickerWrapper}>
              <Picker selectedValue={type} onValueChange={(v) => setType(v)} style={styles.picker} dropdownIconColor="#000">
                <Picker.Item label="Income" value="income" color="#000" />
                <Picker.Item label="Expense" value="expense" color="#000" />
              </Picker>
            </View>

            <View style={styles.buttonWrapper}>
              <Button title={editingId ? 'Update Transaction' : 'Add Transaction'} onPress={handleSaveTransaction} />
              {editingId && <Button title="Delete Transaction" color="red" onPress={handleDeleteTransaction} />}
            </View>

            <TextInput style={styles.input} placeholder="Search by title" placeholderTextColor="#444" value={search} onChangeText={setSearch} />

            {/* ✅ Month Picker */}
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(value) => setSelectedMonth(value)}
                style={styles.picker}
                dropdownIconColor="#000"
              >
                {months.map((m, index) => (
                  <Picker.Item
                    key={index}
                    label={m.label}
                    value={m.value}
                    color="#000"
                  />
                ))}
              </Picker>
            </View>

            {filteredTransactions.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  setEditingId(item.id);
                  setTitle(item.title);
                  setAmount(String(item.amount));
                  setType(item.type);
                  setCategory(item.category);
                  setDate(new Date(item.date));
                }}
              >
                <View style={styles.transaction}>
                  <View>
                    <Text style={styles.transactionText}>{item.title}</Text>
                    <Text style={styles.transactionText}>{item.category}</Text>
                    <Text style={styles.transactionText}>{new Date(item.date).toLocaleDateString()}</Text>
                  </View>
                  <Text style={styles.transactionText}>${item.amount.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 80,
  },
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f7f7f7',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#111',
  },
  summaryBox: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 20,
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
    color: '#000',
  },
  pickerWrapper: {
    backgroundColor: '#eee',
    borderRadius: 6,
    marginBottom: 20,
  },
  picker: {
    color: '#000',
    paddingVertical: 8,
  },
  buttonWrapper: {
    marginBottom: 24,
  },
  transaction: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionText: {
    fontSize: 16,
    color: '#222',
  },
});
