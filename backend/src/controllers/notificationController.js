const notificationService = require('../services/notificationService');

class NotificationController {
  async getUserNotifications(req, res) {
    try {
      const userId = req.user.id;
      const { unread } = req.query;

      const notifications = await notificationService.getUserNotifications(
        userId,
        unread === 'true'
      );

      res.json({
        success: true,
        notifications: notifications.map(n => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          data: n.data,
          deliveryMethod: n.delivery_method,
          status: n.status,
          read: !!n.read_at,
          sentAt: n.sent_at,
          createdAt: n.created_at
        }))
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({ error: 'Failed to get notifications', message: error.message });
    }
  }

  async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await notificationService.getUnreadCount(userId);

      res.json({
        success: true,
        unreadCount: count
      });
    } catch (error) {
      console.error('Get unread count error:', error);
      res.status(500).json({ error: 'Failed to get count', message: error.message });
    }
  }

  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await notificationService.markAsRead(id, userId);

      res.json({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({ error: 'Failed to mark as read', message: error.message });
    }
  }

  async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;

      await notificationService.markAllAsRead(userId);

      res.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error) {
      console.error('Mark all as read error:', error);
      res.status(500).json({ error: 'Failed to mark all as read', message: error.message });
    }
  }
}

module.exports = new NotificationController();
