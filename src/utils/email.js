export async function sendEmail(recipient, subject, message) {
    return new Promise((resolve) => {
        console.log(`Email sent to ${recipient}: ${subject} - ${message}`);
        setTimeout(resolve, 2000); // Simulate email delay
    });
}
