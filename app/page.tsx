"use client";
import React, { ReactEventHandler, useEffect, useState } from "react";
import { Transaction } from "./generated/prisma/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { PieChart,Pie,Cell } from "recharts";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen,setIsOpen]=useState(true);
  const [editData,setEditData]=useState<Transaction|null>(null);

  const fetchdata = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    console.log("detchdata is ", data);
    setTransactions(data);
  };

  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ amount: Number(amount), type, category, description }),
    });
    setAmount("");
    setCategory("");
    setDescription("");
    setType("expense");
    fetchdata();
  };

  const deleteTransaction = async (id: string) => {
    await fetch("/api/transactions", {
      method: "DELETE",
      headers: {
        "content-type": "applicationjson/",
      },
      body: JSON.stringify({ id: id }),
    });

    fetchdata();
  };

  const handleEdit=(t:any)=>{
    setEditData(t);
    setIsOpen(true);
  }

  const handleUpdate=async ()=>{
    if(!editData) return;
      await fetch("/api/transactions", {
        method: "PUT",
        body: JSON.stringify({
          id: editData.id,
          amount: Number(editData?.amount),
          type: editData.type,
          category: editData.category,
          description: editData.description,
        }),
      });
      setIsOpen(false);
      fetchdata();
  }



  const totalIncome = transactions
    .filter((t: Transaction) => t.type === "income")
    .reduce((acc: any, t: Transaction) => acc + t.amount, 0);
  const totalExpenses = transactions
    .filter((t: Transaction) => t.type === "expense")
    .reduce((acc: any, t: Transaction) => acc + t.amount, 0);

  const chartData = [
    { name: "Income", value: totalIncome },
    { name: "Expenses", value: totalExpenses },
  ];


  const categoryTotals=Object.values( transactions.reduce((acc:any,t:Transaction)=>{
      if(t.type==="expense"){

        //create a new object for new category if it doesnt exist or else add amount in existing 
        if(!acc[t.category]){
          acc[t.category]={
            name:t.category,
            amount:0
          }
        }

        acc[t.category].amount+=t.amount;
      }

      return acc;
  },{})
)

const COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6"];


  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div>
      <h1>Trackify Moeny tracker </h1>

      <form onSubmit={handlesubmit}>
        <input
          required
          type="number"
          value={amount}
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-blue-400"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2  "
          required
        >
          <option value="" disabled className="bg-gray-100 text-black">
            Select category
          </option>
          <option value="food" className="bg-gray-500 text-black">
            Food
          </option>
          <option value="travel" className="bg-gray-500 text-black">
            Travel
          </option>
          <option value="shopping" className="bg-gray-500 text-black">
            Shopping
          </option>
          <option value="academics" className="bg-gray-500 text-black">
            Academics
          </option>
          <option value="other" className="bg-gray-500 text-black">
            Other
          </option>
        </select>

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2"
        />

        <button className="bg-gray-800/40  text-white px-4 py-2 w-full cursor-pointer mt-2">
          Add Transaction
        </button>
      </form>

      {isOpen &&editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-700 p-6 rounded-lg w-80 space-y-3">
            <h2 className="text-lg font-semibold">Edit Transaction</h2>

            <input
              type="number"
              value={editData.amount}
              onChange={(e) =>
                setEditData({ ...editData, amount: Number(e.target.value) })
              }
              className="w-full border p-2"
            />

            <select
              value={editData.type}
              onChange={(e) =>
                setEditData({ ...editData, type: e.target.value })
              }
              className="w-full border p-2"
            >
              <option value="expense" className="bg-gray-500">Expense</option>
              <option value="income" className="bg-gray-500">Income</option>
            </select>

            <select
              value={editData.category}
              onChange={(e) =>
                setEditData({ ...editData, category: e.target.value })
              }
              className="w-full border p-2"
            >
              <option value="food" className="bg-gray-500">Food</option>
              <option value="travel" className="bg-gray-500">Travel</option>
              <option value="shopping" className="bg-gray-500">Shopping</option>
              <option value="academics" className="bg-gray-500">Academics</option>
              <option value="other" className="bg-gray-500">Other</option>
            </select>

            <input
              type="text"
              value={editData.description || ""}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              className="w-full border p-2"
              placeholder="Description"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="bg-blue-800 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2>Transaction History</h2>

        {transactions.map((t: Transaction) => {
          return (
            <div
              key={t.id}
              className="border w-[25%] h-16 flex gap-4 items-center"
            >
              <span>{t.category}</span>
              <span>{t.type}</span>
              <span
                className={`${t.type === "income" ? "text-green-500" : "text-red-500"}`}
              >
                ₹{t.amount}
              </span>
              <span>{t.description}</span>

             
              <button
                onClick={() => handleEdit(t)}
                className="ml-2 bg-yellow-500 rounded-md h-6 w-14 cursor-pointer"
              >
                Edit
              </button>

              <button
                onClick={() => deleteTransaction(t.id)}
                className="ml-4 bg-blue-500 rounded-md h-6 w-14 cursor-pointer"
              >
                Delete{" "}
              </button>
            </div>
          );
        })}
      </div>

      <div className="ml-[400px]">
        <h2>Analytics</h2>
        <div>
          <h1>Total Income: ₹{totalIncome}</h1>
          <h1>Total Expenses: ₹{totalExpenses}</h1>
          <h1>Balance: ₹{totalIncome - totalExpenses}</h1>
        </div>
      </div>

      {/* 
  const chartData=[
  {name:"Income", value:totalIncome},
  {name:"Expenses", value:totalExpenses}
] */}

      <div>
        <h2>Bar Chart </h2>
        <BarChart width={300} height={300} data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </div>

      <div>
        {categoryTotals.length > 0 && <h2>Pie Chart</h2>}
        {categoryTotals.length > 0 && (
          <PieChart width={400} height={400} className="bg-red-300">
            <Pie
              data={categoryTotals}
              dataKey="amount"
              nameKey="name"
              outerRadius={80}
            >
              {categoryTotals.map((entry: any, index: number) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
      </div>
    </div>
  );
}
