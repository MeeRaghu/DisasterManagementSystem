// Server-side: approvalController.js
const nodemailer = require('nodemailer');
const sendApprovalEmail = (req, res) => { 
    try {
        const { email, status ,userName} = req.body;

        // Check if email, status, and userName are provided
        if (!email || !status || !userName) {
            return res.status(400).json({ error: 'Email, status, and user name are required' });
        }

        // Nodemailer configuration
        const transporter = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
                user: 'adef07255@gmail.com', 
                pass: 'gvejzmyacwbbnvmu', 
            },
        });

        let subject = '';
        let htmlContent = '';

        // Define email subject and content based on status
        if (status === 'approved') {
            subject = 'Resource Request Approved';
            htmlContent = `
            <p>Hello ${req.body.userName},</p><!-- Include user's name -->
                <p>Your resource request has been approved.</p>
                <p>If you have any questions, feel free to contact us.</p>
            `;
        } else if (status === 'rejected') {
            subject = 'Resource Request Rejected';
            htmlContent = `
            <p>Hello ${req.body.userName},</p><!-- Include user's name -->
                <p>We regret to inform you that your resource request has been rejected due to insufficient resources.</p>
                <p>If you have any questions, feel free to contact us .</p>
            `;
        } else {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const mailOptions = {
            from: 'adef07255@gmail.com',
            to: email,
            subject: subject,
            html: htmlContent,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending approval email:", error);
                return res.status(500).json({ error: 'Error sending approval email' });
            } else {
                console.log("Approval Email sent successfully");
                return res.status(200).json({ message: 'Approval email sent successfully' });
            }
        });
    } catch (error) {
        console.error("Error sending approval email:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    sendApprovalEmail
};
