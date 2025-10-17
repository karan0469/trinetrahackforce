const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send report to authority
exports.sendReportToAuthority = async (report, authority, user) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('Email credentials not configured. Skipping email send.');
      return { success: false, message: 'Email not configured' };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"Good Citizen Platform" <${process.env.EMAIL_USER}>`,
      to: authority.email,
      subject: `New Verified Report: ${report.category}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">New Verified Report</h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Report ID:</strong> ${report._id}</p>
            <p><strong>Category:</strong> ${report.category}</p>
            <p><strong>Description:</strong> ${report.description}</p>
            <p><strong>Location:</strong> ${report.location.address || 'Coordinates: ' + report.location.coordinates.join(', ')}</p>
            <p><strong>Reported by:</strong> ${user.name} (${user.email})</p>
            <p><strong>Date:</strong> ${new Date(report.createdAt).toLocaleString()}</p>
          </div>

          <div style="margin: 20px 0;">
            <p><strong>Photo Evidence:</strong></p>
            <img src="${report.photoUrl}" alt="Report Evidence" style="max-width: 100%; border-radius: 8px;" />
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              This is an automated message from the Good Citizen Platform. 
              Please take appropriate action on this report.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email to new user
exports.sendWelcomeEmail = async (user) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return { success: false, message: 'Email not configured' };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"Good Citizen Platform" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Welcome to Good Citizen! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Welcome to Good Citizen, ${user.name}!</h2>
          
          <p>Thank you for joining our community of responsible citizens.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>How it works:</h3>
            <ol>
              <li>Report civic violations with photos and location</li>
              <li>Get your reports verified by moderators</li>
              <li>Earn 10 points for each verified report</li>
              <li>Redeem points for rewards and coupons</li>
            </ol>
          </div>

          <p>Let's make our community better together!</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};
