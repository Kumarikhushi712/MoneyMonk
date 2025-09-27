const ExpenseSchema = require("../models/ExpenseModel");

exports.addExpense = async (req, res) => {
    const { title, amount, category, description, date } = req.body;
    try {
        if (!title || !category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' });
        }
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number!' });
        }
        const expense = ExpenseSchema({
            user: req.user.id,
            title,
            amount,
            category,
            description,
            date,
        });
        await expense.save();
        res.status(200).json({ message: 'Expense Added' });
    } catch (error) {
        console.error("ADD EXPENSE ERROR:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getExpense = async (req, res) => {
    try {
        const expenses = await ExpenseSchema.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        console.error("GET EXPENSES ERROR:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        const expense = await ExpenseSchema.findOneAndDelete({ _id: id, user: req.user.id });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found or user not authorized'});
        }
        res.status(200).json({ message: 'Expense Deleted' });
    } catch (error) {
        console.error("DELETE EXPENSE ERROR:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};