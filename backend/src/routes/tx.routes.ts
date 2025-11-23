import { Router } from 'express';
import Transaction from '../models/transactions.model'; // <--- verify actual filename (see note below)
import paymentService from '../services/payment.service';
import { requireAuth, requireRole, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();

// CREATE + HOLD FUNDS
router.post('/create', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { items = [], sellerId } = req.body;
    const amount = Array.isArray(items) ? items.reduce((sum: number, i: any) => sum + (i.qty || 0) * (i.unitPrice || 0), 0) : 0;

    const orderId = 'ORD-' + Date.now();
    const tx = await Transaction.create({
      orderId,
      buyerId: (req.user as any).id,
      sellerId,
      items,
      amount,
      currency: 'INR',
      status: 'PENDING_PAYMENT',
      history: [{ status: 'PENDING_PAYMENT', ts: new Date(), by: (req.user as any).id }]
    });

    const hold = await paymentService.holdFunds(tx._id.toString(), amount);

    tx.escrow = { escrowId: hold.escrowId, heldAt: hold.heldAt };
    tx.status = 'ESCROWED';
    tx.history.push({ status: 'ESCROWED', ts: new Date() });
    await tx.save();

    res.json({ success: true, transaction: tx });
  } catch (err) { next(err); }
});

// SELLER MARK SHIPPED
router.post('/:id/ship', requireAuth, requireRole('seller'), async (req: AuthRequest, res, next) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });

    tx.status = 'SHIPPED';
    tx.history.push({ status: 'SHIPPED', ts: new Date(), by: (req.user as any).id });
    await tx.save();

    res.json({ success: true, transaction: tx });
  } catch (err) { next(err); }
});

// BUYER CONFIRM DELIVERY → RELEASE FUNDS
router.post('/:id/confirm', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });

    const buyerIdStr = tx.buyerId.toString();
    const requesterId = (req.user as any).id;
    const requesterRole = (req.user as any).role;

    if (buyerIdStr !== requesterId && requesterRole !== 'admin')
      return res.status(403).json({ message: 'Not allowed' });

    await paymentService.releaseFunds(tx._id.toString(), tx.escrow?.escrowId || '');

    tx.status = 'COMPLETED';
    tx.escrow = { ...tx.escrow, releasedAt: new Date() };
    tx.history.push({ status: 'COMPLETED', ts: new Date(), by: (req.user as any).id });

    await tx.save();

    res.json({ success: true, transaction: tx });
  } catch (err) { next(err); }
});

// GET LIST (optional filters: sellerId, buyerId)
router.get('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { sellerId, buyerId } = req.query as any;
    const filter: any = {};
    if (sellerId) filter.sellerId = sellerId;
    if (buyerId) filter.buyerId = buyerId;

    const list = await Transaction.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, transactions: list });
  } catch (err) { next(err); }
});

// GET single transaction by id
router.get('/:id', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ success: true, transaction: tx });
  } catch (err) { next(err); }
});

export default router;
