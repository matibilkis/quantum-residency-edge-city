const nodemailer = require('nodemailer');

/**
 * Email Service for Quredge Form Notifications
 * Sends email notification when someone submits the interest form
 */

class EmailService {
  constructor() {
    this.transporter = null;
    this.enabled = false;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Check if email is configured
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('📧 Email notifications disabled - EMAIL credentials not configured');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      this.enabled = true;
      console.log('✅ Email service initialized successfully');
    } catch (error) {
      console.error('❌ Email service initialization failed:', error.message);
      this.enabled = false;
    }
  }

  async sendFormSubmissionNotification(formData) {
    // If email not configured, skip silently
    if (!this.enabled) {
      return { success: false, message: 'Email not configured' };
    }

    const recipientEmail = process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">🎉 New Quredge Interest Form Submission</h2>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Participant Details</h3>
          
          <p><strong>Name:</strong><br/>${formData.name}</p>
          
          <p><strong>Email:</strong><br/><a href="mailto:${formData.email}">${formData.email}</a></p>
          
          <p><strong>What are they curious about?</strong><br/>${formData.curiosity}</p>
          
          <p><strong>Participation Type:</strong><br/>${formData.participation}</p>
          
          ${formData.institution ? `<p><strong>Institution:</strong><br/>${formData.institution}</p>` : ''}
          
          <p><strong>Submitted:</strong><br/>${new Date().toLocaleString()}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #dbeafe; border-radius: 8px;">
          <p style="margin: 0;">
            <strong>📊 View all submissions:</strong><br/>
            <a href="https://quantum-residency-edge-city-production.up.railway.app/admin.html" 
               style="color: #2563eb;">Go to Admin Dashboard</a>
          </p>
        </div>
        
        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
          This email was sent automatically by the Quredge landing page.<br/>
          To stop receiving these notifications, remove the EMAIL configuration from Railway.
        </p>
      </div>
    `;

    const emailText = `
New Quredge Interest Form Submission

Name: ${formData.name}
Email: ${formData.email}
Curiosity: ${formData.curiosity}
Participation: ${formData.participation}
${formData.institution ? `Institution: ${formData.institution}` : ''}

Submitted: ${new Date().toLocaleString()}

View all submissions: https://quantum-residency-edge-city-production.up.railway.app/admin.html
    `;

    const mailOptions = {
      from: `"Quredge Landing Page" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `🎯 New Quredge Submission from ${formData.name}`,
      text: emailText,
      html: emailHtml
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email notification sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send email notification:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Test email configuration
  async sendTestEmail(recipientEmail) {
    if (!this.enabled) {
      return { success: false, message: 'Email not configured' };
    }

    const mailOptions = {
      from: `"Quredge Landing Page" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: '✅ Quredge Email Service Test',
      text: 'This is a test email from Quredge landing page. Email service is working correctly!',
      html: '<h2>✅ Email Service Test</h2><p>This is a test email from Quredge landing page. Email service is working correctly!</p>'
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Test email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send test email:', error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();

