// utils.ts

import { User, Item, Order, PaymentInfo } from './models';

// Utility function to format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

// Utility function to validate email format
export function validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Utility function to hash a password (using bcrypt)
import bcrypt from 'bcrypt';
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

// Utility function to compare passwords
export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

// Utility function to generate a unique order ID
import { v4 as uuidv4 } from 'uuid';
export function generateOrderId(): string {
    return uuidv4();
}

// Utility function to calculate total price from a list of items
export function calculateTotal(items: Item[]): number {
    return items.reduce((total, item) => total + item.price, 0);
}

// Utility function to send an email (mocked)
export async function sendEmail(to: string, subject: string, body: string): Promise<void> {
    // Implement email sending logic here
    console.log(`Sending email to ${to} with subject ${subject}`);
    console.log(`Body: ${body}`);
}

// Utility function to validate credit card number (using Luhn's algorithm)
export function validateCreditCardNumber(number: string): boolean {
    const sanitizedNumber = number.replace(/\D/g, '');
    let sum = 0;
    let shouldDouble = false;

    for (let i = sanitizedNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(sanitizedNumber.charAt(i), 10);

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return (sum % 10 === 0);
}

// Utility function to generate a secure random token (e.g., for password reset)
import crypto from 'crypto';
export function generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
}

// Utility function to anonymize user data
export function anonymizeUser(user: User): Partial<User> {
    return {
        id: user.id,
        email: user.email,
        // Exclude sensitive information
    };
}

// Utility function to process payment (mocked)
export async function processPayment(paymentInfo: PaymentInfo): Promise<boolean> {
    // Implement payment processing logic here
    console.log(`Processing payment for ${paymentInfo.amount} ${paymentInfo.currency}`);
    return true; // Assume payment is successful
}

// Utility function to fetch item details from an API (mocked)
export async function fetchItemDetails(itemId: string): Promise<Item> {
    // Implement API fetching logic here
    console.log(`Fetching details for item ID ${itemId}`);
    return {
        id: itemId,
        name: 'Sample Item',
        price: 100,
        description: 'A rare sample item',
        imageUrl: 'http://example.com/sample.jpg',
    };
}

// Utility function to get user order history (mocked)
export async function getUserOrderHistory(userId: string): Promise<Order[]> {
    // Implement logic to fetch order history
    console.log(`Fetching order history for user ID ${userId}`);
    return [
        {
            orderId: '12345',
            items: [{ id: '1', name: 'Rare Item 1', price: 50 }],
            totalAmount: 50,
            orderDate: new Date(),
        },
    ];
}

// Utility function to validate input fields for sign-up form
export function validateSignUpForm(email: string, password: string, retypePassword: string): boolean {
    return validateEmail(email) && password.length >= 6 && password === retypePassword;
}
