const fs = require("fs");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
app.use(cors());

const adminEmail = "kfirhason342@gmail.com"; // 📩 Change to your email

app.get("/track", (req, res) => {
    const email = req.query.email;

    if (email) {
        const logEntry = `${email} clicked at ${new Date().toISOString()}\n`;
        fs.appendFileSync("log.txt", logEntry);
        console.log(logEntry);

        // 📧 Send Notification to Admin
        const mailOptions = {
            from: "no-reply@phishingservice.net",
            to: adminEmail, 
            subject: "🚨 Phishing Test Alert!",
            text: `User ${email} clicked the phishing link at ${new Date().toISOString()}.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending notification:", error);
            } else {
                console.log("Admin notified:", info.response);
            }
        });
    }

    // Redirect to training page
    res.redirect("https://your-training-page.com");
});

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "kfirhason342@gmail.com",
        pass: "vxwt enkb tvly wdpc" // Use the generated App Password YJz5Jf63hBQx
    }
});

app.post("/api/start-phishing-test", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    const trackingUrl = `http://localhost:3000/track?email=${encodeURIComponent(email)}`;

    const mailOptions = {
        from: "no-reply@phishingservice.net",
        to: email,
        subject: "🚨 Important Security Notification",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #d9534f;">🔒 Security Alert</h2>
                <p>We detected unusual login activity on your account.</p>
                <p>Please verify your account immediately to avoid suspension:</p>
                <a href="${trackingUrl}" style="display: inline-block; background-color: #d9534f; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
                    Verify Account Now
                </a>
                <p style="color: gray; font-size: 12px;">If you did not request this, please ignore this message.</p>
            </div>
        `
    };
    

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Phishing test email sent!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

// 🎯 Track Who Clicked the Link
app.get("/track", (req, res) => {
    const email = req.query.email;

    if (email) {
        const logEntry = `${email} clicked at ${new Date().toISOString()}\n`;
        fs.appendFileSync("log.txt", logEntry);
        console.log(logEntry);
    }

    // Redirect to a training page or warning page
    res.redirect("https://your-training-page.com");
});

// Start the Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));