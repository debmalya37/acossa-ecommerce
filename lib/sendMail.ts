import nodemailer from 'nodemailer';


interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
}

interface MailResponse {
    success: boolean;
    message: string;
    error?: unknown;
}

export const sendMail = async (
    subject: string, 
    receiver: string, 
    body: string
): Promise<MailResponse> => {
    const transporter = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: Number(process.env.NODEMAILER_PORT),
        secure: false,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    });

    const options: MailOptions = {
        from: `"Saree Ecommerce" <${process.env.NODEMAILER_EMAIL}>`,
        to: receiver,
        subject: subject,
        html: body,
    };

    try {
        await transporter.sendMail(options);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        return { success: false, message: 'Error sending email', error };
    }
};