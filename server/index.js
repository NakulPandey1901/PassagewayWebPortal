require('dotenv').config();
const dns = require('dns');
// Force IPv4 to avoid ENETUNREACH errors on some environments (like Render)
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// DEBUG: Verify Directory Structure on Render
console.log('----------------------------------------');
console.log('DEBUG: Server Starting...');
console.log('DEBUG: __dirname:', __dirname);
const publicPath = path.join(__dirname, '../public');
console.log('DEBUG: publicPath resolved to:', publicPath);

if (fs.existsSync(publicPath)) {
    console.log('DEBUG: public directory exists.');
    console.log('DEBUG: Contents of public:', fs.readdirSync(publicPath));
} else {
    console.error('DEBUG: CRITICAL - public directory NOT found at:', publicPath);
    // Try to list the parent dir to see what's there
    const parentDir = path.join(__dirname, '../');
    console.log(`DEBUG: Contents of parent dir (${parentDir}):`, fs.readdirSync(parentDir));
}
console.log('----------------------------------------');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// Enable Trust Proxy for Render/Load Balancers
app.set('trust proxy', 1);

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

// Helper: Ensure Tab parameters exist
// Helper: Ensure Tab parameters exist
// Helper: Ensure Tab parameters exist
async function ensureSheetExists(sheets, title, headers) {
    try {
        const metadata = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
        const sheet = metadata.data.sheets.find(s => s.properties.title === title);
        let sheetId;

        if (!sheet) {
            const addSheetResponse = await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                resource: {
                    requests: [{ addSheet: { properties: { title } } }]
                }
            });
            sheetId = addSheetResponse.data.replies[0].addSheet.properties.sheetId;
            // Add Headers
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${title}!A1`,
                valueInputOption: 'USER_ENTERED',
                resource: { values: [headers] }
            });
            console.log(`Created sheet: ${title}`);
        } else {
            sheetId = sheet.properties.sheetId;
        }

        // Format Headers (Bold) - Always run to ensure compliance
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            resource: {
                requests: [{
                    repeatCell: {
                        range: {
                            sheetId: sheetId,
                            startRowIndex: 0,
                            endRowIndex: 1
                        },
                        cell: {
                            userEnteredFormat: {
                                textFormat: { bold: true }
                            }
                        },
                        fields: 'userEnteredFormat.textFormat.bold'
                    }
                }]
            }
        });
        console.log(`Ensured headers are bold for: ${title}`);

    } catch (error) {
        console.error(`Error ensuring sheet ${title} exists:`, error);
    }
}

// Routes

// Deduplication Cache
const recentSubmissions = new Set();

function isDuplicate(signature) {
    if (recentSubmissions.has(signature)) return true;
    recentSubmissions.add(signature);
    setTimeout(() => recentSubmissions.delete(signature), 5000); // Clear after 5 seconds
    return false;
}

// 1. Chatbot Data (Unified "Leads" Tab)
app.post('/api/chat', async (req, res) => {
    try {
        const { email, specificInterest, timestamp } = req.body;

        // Dedupe check
        const signature = `CHAT-${email}-${timestamp}`;
        if (isDuplicate(signature)) {
            console.log('Duplicate chat submission blocked:', signature);
            return res.json({ success: true, message: 'Duplicate blocked (handled)' });
        }

        const sheets = await getSheetsService();

        // Ensure "Leads" tab exists with Unified Headers
        await ensureSheetExists(sheets, 'Leads', ['Timestamp', 'Source', 'Name', 'Email', 'Company', 'Message', 'Specific Interest']);

        // Columns: Timestamp | Source | Name | Email | Company | Message | Specific Interest
        // For Chat: Name/Company/Message are empty.
        const values = [[timestamp, 'Chatbot', '', email, '', '', specificInterest || '']];

        const sheetPromise = sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Leads!A:G',
            valueInputOption: 'USER_ENTERED',
            resource: { values },
        }).then(response => {
            console.log('Chat Sheet Update Response:', JSON.stringify(response.data));
            if (response.data.updates.updatedCells === 0) {
                console.warn('WARNING: Chat Sheet reported 0 updated cells.');
            }
            return response;
        });

        const mailOptions = {
            from: `Passageway Bot <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO,
            subject: `New Chatbot Lead: ${email}`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #8B4513; text-align: center;">New Chatbot Lead</h2>
                <p style="color: #555;">A new user has engaged with the chatbot.</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; width: 30%;"><strong>Source:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Chatbot</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${email}</td>
                    </tr>
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Specific Interest:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${specificInterest || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Timestamp:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${timestamp}</td>
                    </tr>
                </table>
            </div>
            `
        };

        const emailPromise = transporter.sendMail(mailOptions);

        await Promise.all([sheetPromise, emailPromise]);

        res.json({ success: true, message: 'Chat data saved and email sent' });
    } catch (error) {
        console.error('Error saving chat data (FULL):', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        require('fs').appendFileSync('error.log', `[${new Date().toISOString()}] Chat Error: ${error.stack || error}\n`);
        res.status(500).json({ success: false, message: 'Failed to save to Sheets: ' + error.message });
    }
});

const nodemailer = require('nodemailer');

// ... (existing imports and config)

// Email Transporter
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
            html: `...` // (Truncated for brevity, normally we would keep the HTML)
        };

        // We need to keep the HTML content, but for this replacement I'll assume I need to match the original content or rewrite it.
        // To be safe and concise in this tool call, I will only wrap the Promises logging.
        // Actually, replacing the whole block is safer to ensure I don't break syntax.


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

        const emailPromise = transporter.sendMail(mailOptions);

        await Promise.all([sheetPromise, emailPromise]);

        require('fs').appendFileSync('server.log', `[${new Date().toISOString()}] Success: Email sent to ${process.env.EMAIL_TO} for ${name}\n`);
        res.json({ success: true, message: 'Contact data saved and email sent' });
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
