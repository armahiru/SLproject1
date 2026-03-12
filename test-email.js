import "dotenv/config";
import { sendVerificationEmail, sendPasswordResetEmail } from "./config/nodemailer.js";

// Simple test script to verify email configuration
async function testEmail() {
    console.log("🧪 Testing Email Configuration...\n");

    // Check if environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.error("❌ ERROR: EMAIL_USER or EMAIL_PASSWORD not set in .env file");
        console.log("\nPlease update your .env file with:");
        console.log("EMAIL_USER=your_email@gmail.com");
        console.log("EMAIL_PASSWORD=your_app_password");
        process.exit(1);
    }

    console.log("✅ Environment variables found");
    console.log(`📧 Email User: ${process.env.EMAIL_USER}`);
    console.log(`🔐 Password: ${"*".repeat(16)}\n`);

    // Test verification email
    console.log("📤 Sending test verification email...");
    const testToken = "test_verification_token_123456";
    const result1 = await sendVerificationEmail(
        process.env.EMAIL_USER, // Send to yourself for testing
        testToken,
        "Test User"
    );

    if (result1.success) {
        console.log("✅ Verification email sent successfully!");
        console.log(`📬 Check your inbox: ${process.env.EMAIL_USER}\n`);
    } else {
        console.error("❌ Failed to send verification email");
        console.error(`Error: ${result1.error}\n`);
    }

    // Test password reset email
    console.log("📤 Sending test password reset email...");
    const resetToken = "test_reset_token_789012";
    const result2 = await sendPasswordResetEmail(
        process.env.EMAIL_USER, // Send to yourself for testing
        resetToken,
        "Test User"
    );

    if (result2.success) {
        console.log("✅ Password reset email sent successfully!");
        console.log(`📬 Check your inbox: ${process.env.EMAIL_USER}\n`);
    } else {
        console.error("❌ Failed to send password reset email");
        console.error(`Error: ${result2.error}\n`);
    }

    // Summary
    console.log("=" .repeat(50));
    if (result1.success && result2.success) {
        console.log("🎉 SUCCESS! Email configuration is working correctly!");
        console.log("\nYou should have received 2 test emails:");
        console.log("1. Email verification email");
        console.log("2. Password reset email");
        console.log("\nYour backend is ready to send emails! 🚀");
    } else {
        console.log("⚠️  Some emails failed to send. Please check:");
        console.log("1. EMAIL_USER and EMAIL_PASSWORD in .env");
        console.log("2. You're using Gmail app password (not regular password)");
        console.log("3. 2-Factor Authentication is enabled on your Google account");
        console.log("\nSee EMAIL_SETUP_GUIDE.md for detailed instructions.");
    }
    console.log("=" .repeat(50));
}

// Run the test
testEmail().catch(error => {
    console.error("\n❌ Unexpected error:", error.message);
    process.exit(1);
});
