/**
 * Fix Empty Report Types
 * Updates reports with empty report_type to 'other'
 */

const { Report } = require('./models');

async function fixEmptyReportTypes() {
    try {
        console.log('🔍 Searching for reports with empty report_type...');

        // Find reports with empty report_type
        const emptyReports = await Report.findAll({
            where: { report_type: '' },
            attributes: ['id', 'title', 'report_type']
        });

        console.log(`Found ${emptyReports.length} report(s) with empty report_type`);

        if (emptyReports.length === 0) {
            console.log('✅ No reports to fix');
            process.exit(0);
        }

        // Update them to 'other'
        const [count] = await Report.update(
            { report_type: 'other' },
            { where: { report_type: '' } }
        );

        console.log(`✅ Updated ${count} report(s) with empty report_type to 'other'`);

        // Verify the fix
        const report23 = await Report.findByPk(23, {
            attributes: ['id', 'title', 'report_type']
        });

        if (report23) {
            console.log('📋 Report #23 after fix:', report23.toJSON());
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

fixEmptyReportTypes();
