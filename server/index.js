// Rate Limiting REMOVED for production stability
// const limiter = rateLimit({ ... });
// app.use(limiter);

console.log("DEPLOYMENT UPDATE: RATE LIMITER COMPLETELY REMOVED");

// Google Sheets Config
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
if (!SPREADSHEET_ID) {
    console.error('CRITICAL: SPREADSHEET_ID is not defined in .env file');
}
const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'service-account.json');

async function getSheetsService() {
    let auth;
    if (process.env.GOOGLE_CREDENTIALS) {
        // Production: Load from Environment Variable
        auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
    } else {
        // Local: Load from File
        auth = new google.auth.GoogleAuth({
            keyFile: SERVICE_ACCOUNT_FILE,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
    }

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    return sheets;
}

// ... (Helper functions remain unchanged)

// Email Transporter (Reverted to standard config)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 2. Contact Form Data (Unified "Leads" Tab)
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, company, message, timestamp } = req.body;

        // Dedupe check
        const signature = `CONTACT-${email}-${timestamp}-${message.substring(0, 10)}`;
        if (isDuplicate(signature)) {
            console.log('Duplicate contact submission blocked:', signature);
            return res.json({ success: true, message: 'Duplicate blocked (handled)' });
        }

        const sheets = await getSheetsService();

        // Ensure "Leads" tab exists with Unified Headers
        await ensureSheetExists(sheets, 'Leads', ['Timestamp', 'Source', 'Name', 'Email', 'Company', 'Message', 'Specific Interest']);

        // Columns: Timestamp | Source | Name | Email | Company | Message | Specific Interest
        const values = [[timestamp, 'Contact Form', name, email, company, message, '']];

        // Parallel Execution: Save to Sheets AND Send Email
        console.log('DEBUG: Starting Parallel Operations...');

        const sheetPromise = sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Leads!A:G',
            valueInputOption: 'USER_ENTERED',
            resource: { values },
        }).then(response => {
            console.log('DEBUG: Sheet Update Success. Response:', JSON.stringify(response.data));
            require('fs').appendFileSync('server.log', `[${new Date().toISOString()}] Sheet API Response: ${JSON.stringify(response.data)}\n`);
            return response;
        }).catch(err => {
            console.error('DEBUG: Sheet Update FAILED:', err.message);
            throw err;
        });

        const mailOptions = {
            from: `Passageway Contact <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO,
            subject: `New Contact Form Submission from ${name}`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #8B4513; text-align: center;">New Contact Submission</h2>
                <p style="color: #555;">You have received a new message from the website contact form.</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; width: 30%;"><strong>Name:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${email}</td>
                    </tr>
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Company:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${company}</td>
                    </tr>
                    <tr>
                        <td style="vertical-align: top; padding: 10px; border-bottom: 1px solid #ddd;"><strong>Message:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #333;">${message.replace(/\n/g, '<br>')}</td>
                    </tr>
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Timestamp:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${timestamp}</td>
                    </tr>
                </table>
            </div>
            `
        };

        // Fire-and-Forget Email
        transporter.sendMail(mailOptions).then(info => {
            console.log('Background Email Sent:', info.response);
            require('fs').appendFileSync('server.log', `[${new Date().toISOString()}] Success: Email sent\n`);
        }).catch(err => {
            console.warn('Background Email Skipped (Likely Blocked by Render):', err.code || err.message);
            require('fs').appendFileSync('server.log', `[${new Date().toISOString()}] Email Blocked/Failed: ${err.message}\n`);
            // Non-critical error
        });

        // Only wait for Sheets (Critical Data)
        await sheetPromise;

        res.json({ success: true, message: 'Contact data saved' });
    } catch (error) {
        console.error('Error handling contact data:', error);
        require('fs').appendFileSync('server.log', `[${new Date().toISOString()}] Contact Error: ${error.stack || error}\n`);
        res.status(500).json({ success: false, message: 'Failed to process submission: ' + error.message });
    }
});

// Serve Static Assets (Frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Catch-all route to serve basic index.html for any unmatched routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
