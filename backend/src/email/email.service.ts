import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    private isConfigured: boolean;

    constructor() {
        const host = process.env.SMTP_HOST;
        const port = parseInt(process.env.SMTP_PORT || '587');
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;

        this.isConfigured = !!(host && user && pass);

        if (this.isConfigured) {
            this.transporter = nodemailer.createTransport({
                host,
                port,
                secure: port === 465,
                auth: { user, pass },
            });
        }
    }

    private async sendMail(to: string, subject: string, html: string) {
        if (!this.isConfigured) {
            console.log(`📧 [Email Skipped - No SMTP] To: ${to} | Subject: ${subject}`);
            return;
        }

        try {
            await this.transporter.sendMail({
                from: `"GameLearn" <${process.env.SMTP_USER}>`,
                to,
                subject,
                html,
            });
            console.log(`📧 Email sent to ${to}: ${subject}`);
        } catch (error) {
            console.error(`❌ Email failed to ${to}:`, error.message);
        }
    }

    /**
     * Send level-up notification email
     */
    async sendLevelUpEmail(email: string, name: string, level: number) {
        const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head><meta charset="UTF-8"></head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0a1a; color: #fff; padding: 40px; direction: rtl;">
      <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 20px; padding: 40px; border: 1px solid rgba(108,92,231,0.3);">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="font-size: 60px;">🎮</div>
          <h1 style="color: #6c5ce7; margin: 10px 0;">تهانينا! 🎉</h1>
        </div>
        <p style="font-size: 18px; text-align: center; color: #a29bfe;">
          مرحباً <strong>${name}</strong>!
        </p>
        <div style="background: rgba(108,92,231,0.2); border-radius: 15px; padding: 30px; text-align: center; margin: 20px 0;">
          <p style="font-size: 16px; color: #ddd; margin-bottom: 10px;">لقد وصلت إلى</p>
          <h2 style="font-size: 48px; color: #6c5ce7; margin: 0;">المستوى ${level}</h2>
          <p style="font-size: 14px; color: #a29bfe; margin-top: 10px;">🌟 استمر في التعلم والتقدم!</p>
        </div>
        <p style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
          GameLearn - منصة التعلم بالألعاب
        </p>
      </div>
    </body>
    </html>`;

        await this.sendMail(email, `🎮 تهانينا! وصلت للمستوى ${level}`, html);
    }

    /**
     * Send weekly progress summary
     */
    async sendWeeklySummary(email: string, name: string, stats: {
        weeklyPoints: number;
        quizzesPassed: number;
        rank: number;
    }) {
        const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head><meta charset="UTF-8"></head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0a1a; color: #fff; padding: 40px; direction: rtl;">
      <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 20px; padding: 40px; border: 1px solid rgba(108,92,231,0.3);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6c5ce7;">📊 ملخصك الأسبوعي</h1>
        </div>
        <p style="font-size: 18px; text-align: center; color: #a29bfe;">مرحباً <strong>${name}</strong>!</p>
        <div style="display: flex; gap: 15px; margin: 25px 0; justify-content: center;">
          <div style="background: rgba(108,92,231,0.2); border-radius: 12px; padding: 20px; text-align: center; flex: 1;">
            <div style="font-size: 32px; color: #6c5ce7; font-weight: bold;">${stats.weeklyPoints}</div>
            <div style="color: #a29bfe; font-size: 12px;">نقاط هذا الأسبوع</div>
          </div>
          <div style="background: rgba(0,206,201,0.2); border-radius: 12px; padding: 20px; text-align: center; flex: 1;">
            <div style="font-size: 32px; color: #00cec9; font-weight: bold;">${stats.quizzesPassed}</div>
            <div style="color: #81ecec; font-size: 12px;">اختبارات ناجحة</div>
          </div>
          <div style="background: rgba(253,203,110,0.2); border-radius: 12px; padding: 20px; text-align: center; flex: 1;">
            <div style="font-size: 32px; color: #fdcb6e; font-weight: bold;">#${stats.rank}</div>
            <div style="color: #ffeaa7; font-size: 12px;">ترتيبك العالمي</div>
          </div>
        </div>
        <p style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">GameLearn - منصة التعلم بالألعاب</p>
      </div>
    </body>
    </html>`;

        await this.sendMail(email, '📊 ملخصك الأسبوعي - GameLearn', html);
    }
}
