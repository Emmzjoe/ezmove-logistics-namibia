const paymentService = require('../services/paymentService');

class PaymentController {
  async initiatePayment(req, res) {
    try {
      const { jobId, phoneNumber } = req.body;
      const userId = req.user.id;

      if (!jobId || !phoneNumber) {
        return res.status(400).json({ error: 'Job ID and phone number required' });
      }

      const result = await paymentService.initiatePayment(jobId, userId, phoneNumber);

      res.json(result);
    } catch (error) {
      console.error('Initiate payment error:', error);
      res.status(500).json({ error: 'Payment initiation failed', message: error.message });
    }
  }

  async checkPaymentStatus(req, res) {
    try {
      const { id } = req.params;

      const status = await paymentService.checkPaymentStatus(id);

      res.json({
        success: true,
        transactionId: id,
        status
      });
    } catch (error) {
      console.error('Check payment status error:', error);
      res.status(500).json({ error: 'Failed to check status', message: error.message });
    }
  }

  async completePayment(req, res) {
    try {
      const { id } = req.params;

      const result = await paymentService.completePayment(id);

      res.json(result);
    } catch (error) {
      console.error('Complete payment error:', error);
      res.status(500).json({ error: 'Payment completion failed', message: error.message });
    }
  }

  async getTransactionHistory(req, res) {
    try {
      const userId = req.user.id;
      const { type } = req.query;

      const transactions = await paymentService.getTransactionHistory(userId, type);

      res.json({
        success: true,
        transactions
      });
    } catch (error) {
      console.error('Get transaction history error:', error);
      res.status(500).json({ error: 'Failed to get history', message: error.message });
    }
  }

  async processDriverPayout(req, res) {
    try {
      const { driverId, amount } = req.body;

      if (req.user.user_type !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      if (!driverId || !amount) {
        return res.status(400).json({ error: 'Driver ID and amount required' });
      }

      const result = await paymentService.processDriverPayout(driverId, amount);

      res.json(result);
    } catch (error) {
      console.error('Process payout error:', error);
      res.status(500).json({ error: 'Payout failed', message: error.message });
    }
  }

  async refundPayment(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (req.user.user_type !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const result = await paymentService.refundPayment(id, reason);

      res.json(result);
    } catch (error) {
      console.error('Refund payment error:', error);
      res.status(500).json({ error: 'Refund failed', message: error.message });
    }
  }
}

module.exports = new PaymentController();
