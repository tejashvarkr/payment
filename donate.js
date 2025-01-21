const cors = require('cors');
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());
app.use(cors());

const organizationEmail = 'tejashvarkr@gmail.com';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: organizationEmail,
    pass: 'jlfh bcus vjda beoh', // Replace with your Gmail App Password
  },
});

app.post('/donate', async (req, res) => {
  console.log("🔹 Received donation request:", req.body);

  const { name, email, amount, phone, reference } = req.body;

  // Validate input fields
  if (!name || !email || !amount || !phone || !reference) {
    console.log("❌ Missing required fields:", req.body);
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const mailOptionsToDonor = {
    from: organizationEmail,
    to: email,
    subject: 'Donation Confirmation',
    text: `Thank you, ${name}, for your generous donation of ₹${amount}. Your reference number is ${reference}.`,
  };

  const mailOptionsToOrganization = {
    from: organizationEmail,
    to: organizationEmail,
    subject: 'New Donation Received',
    text: `A new donation has been made:\nName: ${name}\nAmount: ₹${amount}\nPhone: ${phone}\nReference: ${reference}.`,
  };

  try {
    console.log("✅ Sending emails...");

    // Send both emails in parallel to prevent delays
    await Promise.all([
      transporter.sendMail(mailOptionsToDonor),
      transporter.sendMail(mailOptionsToOrganization),
    ]);

    console.log("✅ Emails sent successfully!");
    res.status(200).json({ message: 'Emails sent successfully.' });

  } catch (error) {
    console.error("❌ Error sending emails:", error);
    res.status(500).json({ message: 'Failed to send emails.', error: error.message });
  }
});

//const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
module.exports = app;
