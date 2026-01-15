const { Transaction, Job, User, DriverProfile } = require('../models');
const { v4: uuidv4 } = require('uuid');

class PaymentService {
  constructor() {
    this.mtnApiUrl = process.env.MTN_API_URL || 'https://sandbox.momodeveloper.mtn.com';
    this.mtnApiKey = process.env.MTN_API_KEY;
    this.mtnSubscriptionKey = process.env.MTN_SUBSCRIPTION_KEY;
    this.environment = process.env.MTN_ENVIRONMENT || 'sandbox';
  }

  async getMTNAccessToken() {
    // In production, implement proper token caching
    // For now, return a mock token for sandbox
    if (this.environment === 'sandbox') {
      return 'sandbox_token_' + Date.now();
    }

    try {
      const authString = `${this.mtnApiKey}:${process.env.MTN_API_SECRET}`;
      const encodedAuth = Buffer.from(authString).toString('base64');

      const response = await fetch(`${this.mtnApiUrl}/collection/token/`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${encodedAuth}`,
          'Ocp-Apim-Subscription-Key': this.mtnSubscriptionKey
        }
      });

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('MTN token error:', error);
      throw new Error('Failed to get MTN access token');
    }
  }

  async initiatePayment(jobId, userId, phoneNumber) {
    try {
      const job = await Job.findByPk(jobId);

      if (!job) {
        throw new Error('Job not found');
      }

      if (job.payment_status === 'paid') {
        throw new Error('Job already paid');
      }

      // Create transaction record
      const transaction = await Transaction.create({
        job_id: jobId,
        user_id: userId,
        transaction_type: 'payment',
        amount: job.total_price,
        payment_method: 'mobile_money',
        payment_provider: 'mtn_momo',
        status: 'pending',
        metadata: {
          phone_number: phoneNumber,
          job_number: job.job_number
        }
      });

      // In production, call MTN API
      if (this.environment === 'production' && this.mtnApiKey) {
        const referenceId = uuidv4();
        const accessToken = await this.getMTNAccessToken();

        const response = await fetch(`${this.mtnApiUrl}/collection/v1_0/requesttopay`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'X-Reference-Id': referenceId,
            'X-Target-Environment': this.environment,
            'Ocp-Apim-Subscription-Key': this.mtnSubscriptionKey
          },
          body: JSON.stringify({
            amount: job.total_price.toString(),
            currency: 'NAD',
            externalId: jobId,
            payer: {
              partyIdType: 'MSISDN',
              partyId: phoneNumber.replace('+', '')
            },
            payerMessage: `Payment for EZMove job ${job.job_number}`,
            payeeNote: 'Logistics service payment'
          })
        });

        if (response.ok) {
          await transaction.update({
            provider_transaction_id: referenceId,
            status: 'processing'
          });

          return {
            success: true,
            transactionId: transaction.id,
            referenceId,
            message: 'Payment initiated. Please check your phone to approve.'
          };
        } else {
          const error = await response.json();
          throw new Error(error.message || 'Payment initiation failed');
        }
      }

      // Sandbox mode - simulate successful payment
      await transaction.update({
        provider_transaction_id: 'SANDBOX_' + uuidv4(),
        status: 'processing'
      });

      return {
        success: true,
        transactionId: transaction.id,
        message: 'SANDBOX MODE: Payment initiated successfully',
        sandbox: true
      };

    } catch (error) {
      console.error('Initiate payment error:', error);
      throw error;
    }
  }

  async checkPaymentStatus(transactionId) {
    try {
      const transaction = await Transaction.findByPk(transactionId);

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // In production, query MTN API
      if (this.environment === 'production' && this.mtnApiKey && transaction.provider_transaction_id) {
        const accessToken = await this.getMTNAccessToken();

        const response = await fetch(
          `${this.mtnApiUrl}/collection/v1_0/requesttopay/${transaction.provider_transaction_id}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'X-Target-Environment': this.environment,
              'Ocp-Apim-Subscription-Key': this.mtnSubscriptionKey
            }
          }
        );

        const data = await response.json();

        if (data.status === 'SUCCESSFUL') {
          await this.completePayment(transactionId);
        } else if (data.status === 'FAILED') {
          await transaction.update({
            status: 'failed',
            failure_reason: data.reason || 'Payment failed'
          });
        }

        return data.status;
      }

      // Sandbox mode
      return transaction.status;

    } catch (error) {
      console.error('Check payment status error:', error);
      throw error;
    }
  }

  async completePayment(transactionId) {
    try {
      const transaction = await Transaction.findByPk(transactionId, {
        include: [{ model: Job, as: 'job' }]
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (transaction.status === 'completed') {
        return { success: true, message: 'Already completed' };
      }

      // Update transaction
      await transaction.update({
        status: 'completed'
      });

      // Update job payment status
      if (transaction.job_id) {
        const job = await Job.findByPk(transaction.job_id);
        await job.update({
          payment_status: 'paid',
          paid_at: new Date(),
          payment_method: transaction.payment_method,
          payment_reference: transaction.provider_transaction_id
        });
      }

      return {
        success: true,
        message: 'Payment completed successfully'
      };

    } catch (error) {
      console.error('Complete payment error:', error);
      throw error;
    }
  }

  async processDriverPayout(driverId, amount) {
    try {
      const driver = await User.findByPk(driverId, {
        include: [{ model: DriverProfile, as: 'driverProfile' }]
      });

      if (!driver || driver.user_type !== 'driver') {
        throw new Error('Driver not found');
      }

      // Create payout transaction
      const transaction = await Transaction.create({
        user_id: driverId,
        transaction_type: 'payout',
        amount,
        payment_method: 'mobile_money',
        payment_provider: 'mtn_momo',
        status: 'pending',
        metadata: {
          phone_number: driver.phone,
          driver_name: driver.full_name
        }
      });

      // In production, call MTN Disbursement API
      if (this.environment === 'production' && this.mtnApiKey) {
        const referenceId = uuidv4();
        const accessToken = await this.getMTNAccessToken();

        const response = await fetch(`${this.mtnApiUrl}/disbursement/v1_0/transfer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'X-Reference-Id': referenceId,
            'X-Target-Environment': this.environment,
            'Ocp-Apim-Subscription-Key': this.mtnSubscriptionKey
          },
          body: JSON.stringify({
            amount: amount.toString(),
            currency: 'NAD',
            externalId: `PAYOUT-${driverId}-${Date.now()}`,
            payee: {
              partyIdType: 'MSISDN',
              partyId: driver.phone.replace('+', '')
            },
            payerMessage: 'EZMove driver earnings payout',
            payeeNote: `Payout for completed jobs`
          })
        });

        if (response.ok) {
          await transaction.update({
            provider_transaction_id: referenceId,
            status: 'completed'
          });

          return {
            success: true,
            transactionId: transaction.id,
            message: 'Payout completed successfully'
          };
        } else {
          const error = await response.json();
          throw new Error(error.message || 'Payout failed');
        }
      }

      // Sandbox mode
      await transaction.update({
        provider_transaction_id: 'SANDBOX_PAYOUT_' + uuidv4(),
        status: 'completed'
      });

      return {
        success: true,
        transactionId: transaction.id,
        message: 'SANDBOX MODE: Payout processed successfully',
        sandbox: true
      };

    } catch (error) {
      console.error('Process payout error:', error);
      throw error;
    }
  }

  async getTransactionHistory(userId, type = null) {
    try {
      const where = { user_id: userId };

      if (type) {
        where.transaction_type = type;
      }

      const transactions = await Transaction.findAll({
        where,
        include: [
          {
            model: Job,
            as: 'job',
            attributes: ['id', 'job_number', 'status']
          }
        ],
        order: [['created_at', 'DESC']],
        limit: 50
      });

      return transactions.map(t => ({
        id: t.id,
        type: t.transaction_type,
        amount: t.amount,
        status: t.status,
        paymentMethod: t.payment_method,
        provider: t.payment_provider,
        referenceId: t.provider_transaction_id,
        job: t.job,
        createdAt: t.created_at
      }));

    } catch (error) {
      console.error('Get transaction history error:', error);
      throw error;
    }
  }

  async refundPayment(transactionId, reason) {
    try {
      const transaction = await Transaction.findByPk(transactionId);

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (transaction.transaction_type !== 'payment') {
        throw new Error('Can only refund payments');
      }

      if (transaction.status !== 'completed') {
        throw new Error('Can only refund completed payments');
      }

      // Create refund transaction
      const refund = await Transaction.create({
        job_id: transaction.job_id,
        user_id: transaction.user_id,
        transaction_type: 'refund',
        amount: transaction.amount,
        payment_method: transaction.payment_method,
        payment_provider: transaction.payment_provider,
        status: 'completed',
        metadata: {
          original_transaction_id: transactionId,
          reason
        }
      });

      // Update original transaction
      await transaction.update({
        status: 'refunded',
        metadata: {
          ...transaction.metadata,
          refund_transaction_id: refund.id,
          refund_reason: reason
        }
      });

      // Update job payment status
      if (transaction.job_id) {
        await Job.update(
          { payment_status: 'refunded' },
          { where: { id: transaction.job_id } }
        );
      }

      return {
        success: true,
        refundId: refund.id,
        message: 'Refund processed successfully'
      };

    } catch (error) {
      console.error('Refund payment error:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();
