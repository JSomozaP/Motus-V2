const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({ 
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendVerificationEmail(email, token) {
    const verificationUrl = `http://localhost:4200/verify/${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🎯 MOTUS V2 - Vérifiez votre compte',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #007bff;">🎯 Bienvenue sur MOTUS V2 !</h1>
          <p>Merci de vous être inscrit ! Cliquez sur le bouton ci-dessous pour vérifier votre compte :</p>
          <a href="${verificationUrl}" 
             style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            ✅ Vérifier mon compte
          </a>
          <p><small>Ou copiez ce lien : ${verificationUrl}</small></p>
          <hr>
          <p><em>Si vous n'avez pas créé ce compte, ignorez cet email.</em></p>
        </div>
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('📧 Email envoyé:', result.messageId);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      return false;
    }
  }
}

module.exports = new EmailService();