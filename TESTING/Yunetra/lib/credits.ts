import connectToDatabase from './mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import mongoose from 'mongoose';

/**
 * Creates a "pending" transaction where credits are held until the session completes.
 * The learner has NOT lost the credits permanently, nor has the teacher gained them yet.
 */
export async function earnCredits(
    toUserId: string,
    fromUserId: string,
    amount: number,
    sessionId: string,
    description: string
) {
    await connectToDatabase();
    const tx = new Transaction({
        toUserId,
        fromUserId,
        amount,
        type: 'pending',
        sessionId,
        description,
        status: 'pending',
    });
    return await tx.save();
}

/**
 * Finds the pending transaction for a session, marks it "completed", and increments the teacher's balance.
 */
export async function releaseCredits(sessionId: string) {
    await connectToDatabase();
    const tx = await Transaction.findOne({ sessionId, status: 'pending' });
    if (!tx) throw new Error('No pending transaction found for this session');

    tx.status = 'completed';
    tx.type = 'earned';
    await tx.save();

    await User.findByIdAndUpdate(
        tx.toUserId,
        { $inc: { skillCredits: tx.amount } }
    );

    return tx;
}

/**
 * Spends credits immediately. Checks balance, creates a "spent" transaction, and deducts from user model.
 */
export async function spendCredits(
    userId: string,
    amount: number,
    sessionId: string,
    description: string
) {
    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    if (user.skillCredits < amount) {
        throw new Error('Insufficient credits');
    }

    const tx = new Transaction({
        fromUserId: userId,
        amount,
        type: 'spent',
        sessionId,
        description,
        status: 'completed',
    });
    await tx.save();

    await User.findByIdAndUpdate(
        userId,
        { $inc: { skillCredits: -amount } }
    );

    return tx;
}

/**
 * Finds a spent or pending transaction by session ID and reverses the balance deduction.
 */
export async function refundCredits(sessionId: string) {
    await connectToDatabase();
    const tx = await Transaction.findOne({ sessionId, status: { $in: ['completed', 'pending'] } });
    if (!tx) throw new Error('Transaction not found or already refunded');

    tx.status = 'refunded';
    tx.type = 'refunded';
    await tx.save();

    if (tx.fromUserId) {
        await User.findByIdAndUpdate(
            tx.fromUserId,
            { $inc: { skillCredits: tx.amount } }
        );
    }

    return tx;
}

/**
 * Retrieves the current user's available balance and latest transactions
 */
export async function getBalanceAndHistory(userId: string) {
    await connectToDatabase();
    const user = await User.findById(userId).lean();
    if (!user) throw new Error('User not found');

    const history = await Transaction.find({
        $or: [{ fromUserId: userId }, { toUserId: userId }],
    })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

    return {
        balance: user.skillCredits,
        history,
    };
}
