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

  async sendVerificationEmail(email, token, pseudo = 'utilisateur') {
    const verificationUrl = `http://localhost:4200/verify/${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🎯 MOTUS V2 - Vérifiez votre compte',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px;">
            <h1 style="margin: 0; font-size: 28px;">🎯 MOTUS V2</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Bienvenue ${pseudo} !</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Activation de votre compte</h2>
            <p style="color: #555; line-height: 1.6;">
              Salut <strong>${pseudo}</strong> ! Merci de vous être inscrit sur MOTUS V2 ! 
              Pour commencer à jouer, veuillez activer votre compte :
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block;
                        font-weight: bold;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                ✅ ACTIVER MON COMPTE
              </a>
            </div>
            
            <p style="color: #777; font-size: 14px; text-align: center;">
              Ou copiez ce lien dans votre navigateur :<br>
              <code style="background: #e9ecef; padding: 5px; border-radius: 3px;">${verificationUrl}</code>
            </p>
          </div>
          
          <div style="text-align: center; color: #888; font-size: 12px;">
            <p>Si vous n'avez pas créé ce compte, ignorez cet email.</p>
            <p>© 2025 MOTUS V2 - Jeu de mots développé avec passion</p>
          </div>
        </div>
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('📧 Email de vérification envoyé:', result.messageId);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email, token) {
    const resetUrl = `http://localhost:4200/reset-password/${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔒 MOTUS V2 - Réinitialisation de mot de passe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); color: white; padding: 30px; border-radius: 10px;">
            <h1 style="margin: 0; font-size: 28px;">🔒 MOTUS V2</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Réinitialisation de mot de passe</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Mot de passe oublié ?</h2>
            <p style="color: #555; line-height: 1.6;">
              Vous avez demandé la réinitialisation de votre mot de passe. 
              Cliquez sur le bouton ci-dessous pour en créer un nouveau :
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block;
                        font-weight: bold;
                        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);">
                🔑 RÉINITIALISER MON MOT DE PASSE
              </a>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                ⚠️ <strong>Important :</strong> Ce lien expire dans 1 heure pour votre sécurité.
              </p>
            </div>
            
            <p style="color: #777; font-size: 14px; text-align: center;">
              Ou copiez ce lien dans votre navigateur :<br>
              <code style="background: #e9ecef; padding: 5px; border-radius: 3px;">${resetUrl}</code>
            </p>
          </div>
          
          <div style="text-align: center; color: #888; font-size: 12px;">
            <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
            <p>© 2025 MOTUS V2 - Jeu de mots développé avec passion</p>
          </div>
        </div>
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('📧 Email de réinitialisation envoyé:', result.messageId);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      return false;
    }
  }
}

module.exports = new EmailService();