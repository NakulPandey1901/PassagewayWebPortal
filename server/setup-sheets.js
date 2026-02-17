const { google } = require('googleapis');
const path = require('path');

const SPREADSHEET_ID = '1aRAlvCpyJE87znYYwzuFAVSw0WiVAYoNK082OhDp4-0';
const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'service-account.json');

async function getSheetsService() {
    const auth = new google.auth.GoogleAuth({
        keyFile: SERVICE_ACCOUNT_FILE,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const client = await auth.getClient();
    return google.sheets({ version: 'v4', auth: client });
}

async function formatSheet(sheets, title, headers) {
    try {
        console.log(`Processing sheet: ${title}...`);

        // 1. Get Sheet ID
        const metadata = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
        let sheet = metadata.data.sheets.find(s => s.properties.title === title);

        // Create if missing
        if (!sheet) {
            console.log(`Sheet ${title} missing. Creating...`);
            const createRes = await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                resource: { requests: [{ addSheet: { properties: { title } } }] }
            });
            sheet = createRes.data.replies[0].addSheet;
        }

        const sheetId = sheet.properties.sheetId;

        // 2. Write Headers
        console.log(`Writing headers for ${title}...`);
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${title}!A1`,
            valueInputOption: 'USER_ENTERED',
            resource: { values: [headers] }
        });

        // 3. Apply Formatting (Bold, Size 12)
        console.log(`Formatting headers for ${title}...`);
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            resource: {
                requests: [
                    {
                        repeatCell: {
                            range: {
                                sheetId: sheetId,
                                startRowIndex: 0,
                                endRowIndex: 1,
                                startColumnIndex: 0,
                                endColumnIndex: headers.length
                            },
                            cell: {
                                userEnteredFormat: {
                                    textFormat: {
                                        bold: true,
                                        fontSize: 12
                                    },
                                    horizontalAlignment: "CENTER"
                                }
                            },
                            fields: "userEnteredFormat(textFormat,horizontalAlignment)"
                        }
                    },
                    // Freeze first row
                    {
                        updateSheetProperties: {
                            properties: {
                                sheetId: sheetId,
                                gridProperties: {
                                    frozenRowCount: 1
                                }
                            },
                            fields: "gridProperties.frozenRowCount"
                        }
                    }
                ]
            }
        });
        console.log(`Success: ${title} configured.`);

    } catch (error) {
        console.error(`Error processing ${title}:`, error);
    }
}

async function run() {
    try {
        const sheets = await getSheetsService();
        await formatSheet(sheets, 'BOT', ['Timestamp', 'Email', 'Interest', 'Specific Interest', 'Source', 'Page']);
        await formatSheet(sheets, 'Contact', ['Timestamp', 'Name', 'Email', 'Company', 'Message']);
        console.log('Done!');
    } catch (error) {
        console.error('Setup failed:', error);
    }
}

run();
