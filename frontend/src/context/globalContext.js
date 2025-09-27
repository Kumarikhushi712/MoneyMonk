import React, { useContext, useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import setAuthToken from "../utils/setAuthToken";

const BASE_URL = "http://localhost:5000/api/v1/";

const GlobalContext = React.createContext();

// This function will run once when the app starts
if (localStorage.token) {
    setAuthToken(localStorage.token);
}

export const GlobalProvider = ({ children }) => {
    // Auth State
    const [user, setUser] = useState(null);
    // We remove the unused setToken from here
    const [token] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // Transaction State
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setAuthToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setIncomes([]);
        setExpenses([]);
        window.location.href = '/login'; 
    }, []);

    const loadUser = useCallback(async () => {
        if (localStorage.token) {
            setAuthToken(localStorage.token);
            try {
                const decoded = jwtDecode(localStorage.token);
                setUser({ id: decoded.user.id, name: decoded.user.name });
                setIsAuthenticated(true);
            } catch (err) {
                console.error('Token decoding failed', err);
                logout();
            }
        }
        setIsAuthLoading(false);
    }, [logout]);
    
    // Load user on component mount
    useEffect(() => {
        loadUser();
    }, [loadUser]); // We add loadUser as a dependency

    // --- AUTH ACTIONS ---
    const register = async (userData) => {
        try {
            const res = await axios.post(`${BASE_URL}register`, userData);
            localStorage.setItem('token', res.data.token);
            setAuthToken(res.data.token);
            await loadUser();
            window.location.href = '/'; 
        } catch (err) {
            console.error('FULL REGISTER ERROR FROM BACKEND:', err.response?.data);
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const login = async (userData) => {
        try {
            const res = await axios.post(`${BASE_URL}login`, userData);
            localStorage.setItem('token', res.data.token);
            setAuthToken(res.data.token);
            await loadUser();
            window.location.href = '/'; 
        } catch (err) {
            console.error('FULL LOGIN ERROR FROM BACKEND:', err.response?.data);
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    // --- TRANSACTION ACTIONS ---
    const getIncomes = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`);
            setIncomes(response.data);
        } catch(err) {
             console.error("GET INCOMES FAILED:", err.response?.data);
             setError(err.response?.data?.message || 'Could not fetch incomes');
        }
    }, []);

    const addIncome = async (income) => {
        try {
            await axios.post(`${BASE_URL}add-income`, income);
            getIncomes();
        } catch (err) {
            console.error("ADD INCOME FAILED:", err.response?.data);
            setError(err.response?.data?.message || 'Could not add income');
        }
    };

    const deleteIncome = async (id) => {
        await axios.delete(`${BASE_URL}delete-income/${id}`);
        getIncomes();
    };
    
    const getExpenses = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-expenses`);
            setExpenses(response.data);
        } catch(err) {
             console.error("GET EXPENSES FAILED:", err.response?.data);
             setError(err.response?.data?.message || 'Could not fetch expenses');
        }
    }, []);

    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}add-expense`, expense);
            getExpenses();
        } catch (err) {
            console.error("ADD EXPENSE FAILED:", err.response?.data);
            setError(err.response?.data?.message || 'Could not add expense');
        }
    };
    
    const deleteExpense = async (id) => {
        await axios.delete(`${BASE_URL}delete-expense/${id}`);
        getExpenses();
    };

    // --- Calculations ---
    const totalIncome = () => {
        return incomes.reduce((total, income) => total + income.amount, 0);
    };
    const totalExpenses = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    };
    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };
    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice(0, 3);
    };

    return (
        <GlobalContext.Provider value={{
            user, token, isAuthenticated, isAuthLoading, loadUser, register, login, logout, addIncome, getIncomes, incomes, deleteIncome, expenses, totalIncome, addExpense, getExpenses, deleteExpense, totalExpenses, totalBalance, transactionHistory, error, setError
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};