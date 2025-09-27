const IncomeSchema = require("../models/IncomeModel");

exports.addIncome = async (req, res) => {
    const { title, amount, category, description, date } = req.body;
    try {
        if (!title || !category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' });
        }
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number!' });
        }
        const income = IncomeSchema({
            user: req.user.id,
            title,
            amount,
            category,
            description,
            date,
        });
        await income.save();
        res.status(200).json({ message: 'Income Added' });
    } catch (error) {
        console.error("ADD INCOME ERROR:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getIncomes = async (req, res) => {
    try {
        const incomes = await IncomeSchema.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        console.error("GET INCOMES ERROR:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteIncome = async (req, res) => {
    const { id } = req.params;
    try {
        const income = await IncomeSchema.findOneAndDelete({ _id: id, user: req.user.id });
        if (!income) {
            return res.status(404).json({ message: 'Income not found or user not authorized' });
        }
        res.status(200).json({ message: 'Income Deleted' });
    } catch (error) {
        console.error("DELETE INCOME ERROR:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};