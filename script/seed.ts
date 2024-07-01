import {config} from "dotenv";
import {subDays} from "date-fns";
import {drizzle} from "drizzle-orm/neon-http";
import {neon} from "@neondatabase/serverless";
import { categories, accounts, transactions } from "@/db/schema";

config({path: ".env.local"});

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const SEED_USER_ID = "user_2iD8cpYIyTnm8gIFLiwoaX4lxNP";
const SEED_CATEGORIES = [
    {id: "category_1", name: "Food", userId: SEED_USER_ID, plaidId: null},
    {id: "category_2", name: "Travel", userId: SEED_USER_ID, plaidId: null},
    {id: "category_3", name: "Entertainment", userId: SEED_USER_ID, plaidId: null},
    {id: "category_4", name: "Salary", userId: SEED_USER_ID, plaidId: null},
    {id: "category_5", name: "Rent", userId: SEED_USER_ID, plaidId: null},
]

const SEED_ACCOUNTS = [
    {id: "account_1", name: "Bank of America", userId: SEED_USER_ID, plaidId: null},
    {id: "account_2", name: "American Express", userId: SEED_USER_ID, plaidId: null},
]

const defaultTo = new Date();
const defaultFrom = subDays(defaultTo, 90);

const SEED_TRANSACTIONS: typeof transactions.$inferSelect[] = [];

import { eachDayOfInterval, format } from "date-fns";
import { convertAmountToMiliUnits } from "@/lib/utils";

const generateRandomAmount = (category: typeof categories.$inferInsert) => {
    switch(category.name){
        case "Rent":
            return Math.random() * 400 + 90
        
        case "Food":
            return Math.random() * 200 + 50;
        
        case "Travel":
            return Math.random() * 20 + 50;
        
        case "Entertainment":
            return Math.random() * 100 + 50;
        
        case "Salary":
            return Math.random() * 1000 + 50;
        default:
            return Math.random() * 100 + 50;

    }
}

const generateTransactionsForDay = (day: Date) => {
    const numTransactions = Math.floor(Math.random() * 4) + 1;

    for(let i = 0; i < numTransactions; i++) {
        const category = SEED_CATEGORIES[Math.floor(Math.random() * SEED_CATEGORIES.length)];
        const isExpense = Math.random() > 0.6;
        const amount = generateRandomAmount(category);
        const formattedAmount = convertAmountToMiliUnits(isExpense ? -amount : amount);

        SEED_TRANSACTIONS.push({
            id: `transaction_${format(day, "yyyy-MM-dd")}_${i}`,
            accountId: SEED_ACCOUNTS[0].id,
            categoryId: category.id,
            date: day,
            amount: formattedAmount,
            payee: "Merchant",
            notes: "Random Transaction"
        });
    };
};

const generateTransactions = () => {
    const days = eachDayOfInterval({start: defaultFrom, end: defaultTo});
    days.forEach(day => generateTransactionsForDay(day));
}

generateTransactions();

const main = async () => {
    try{
        //Reset database
        await db.delete(transactions).execute();
        await db.delete(accounts).execute();
        await db.delete(categories).execute();

        //Seed categories
        await db.insert(categories).values(SEED_CATEGORIES).execute();

        //Seed accounts
        await db.insert(accounts).values(SEED_ACCOUNTS).execute();

        //Seed transactions
        await db.insert(transactions).values(SEED_TRANSACTIONS).execute();
    }catch(error) {
        console.error("Error during seed:", error);
        process.exit(1);
    }
};

main();