import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import User from '../models/user.model';
import Transaction from '../models/transactions.model';
import paymentService from '../services/payment.service';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI || '');
  console.log("Connected to DB");

  await User.deleteMany({});
  await Transaction.deleteMany({});

  const pass = await bcrypt.hash("pass123", 10);

  const buyer = await User.create({
    name: "Buyer One",
    email: "buyer@local",
    passwordHash: pass,
    role: "buyer"
  });

  const seller = await User.create({
    name: "Seller One",
    email: "seller@local",
    passwordHash: pass,
    role: "seller"
  });

  const admin = await User.create({
    name: "Admin User",
    email: "admin@local",
    passwordHash: pass,
    role: "admin"
  });

  const items = [{ sku: "SKU1", name: "Sample Item", qty: 1, unitPrice: 500 }];

  const tx = await Transaction.create({
    orderId: "ORD-SEED-1",
    buyerId: buyer._id,
    sellerId: seller._id,
    items,
    amount: 500,
    currency: "INR",
    status: "PENDING_PAYMENT",
    history: [{ status: "PENDING_PAYMENT", ts: new Date(), by: buyer._id }]
  });

  const hold = await paymentService.holdFunds(tx._id.toString(), tx.amount);
  tx.escrow = { escrowId: hold.escrowId, heldAt: hold.heldAt };
  tx.status = "ESCROWED";
  tx.history.push({ status: "ESCROWED", ts: new Date() });
  await tx.save();

  console.log("Seed complete!");
  console.log("buyer@local / pass123");
  console.log("seller@local / pass123");
  console.log("admin@local / pass123");

  process.exit(0);
}

run();
