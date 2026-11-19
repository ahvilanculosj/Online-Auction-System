# 🔒 Secure Online Auction System
A secure online auction system featuring fraud detection via binary classification.

## 📋 Description
A platform where users bid on products, with identity verification (email, license, PAN). Only users verified by an administrator are permitted to participate. ## ✨ Features

### 👤 Customer Module
- Registration and login
- Profile verification by an admin
- Viewing the auction gallery
- Bidding on products
- Submitting complaints

### 🏪 Seller Module
- Registration subject to admin approval
- Adding, editing, and deleting products
- Managing bids/offers

### 🛡️ Admin Module
- Verifying customers and sellers
- Removing untrustworthy sellers
- Permanently blocking fraudulent customers
- Managing complaints

## 🚀 How to Use
1. Clone the repository
2. Open `index.html` in your browser
3. Demo admin login: `admin@auction.com` / `admin123`
4. Register new users (accounts remain pending until approved)

## 🛠️ Technologies
- HTML5
- CSS3
- JavaScript (ES6+)
- localStorage (simulates a database)

## 📁 Structure
├── index.html # Home page
├── login.html # Login page
├── register.html # Registration page
├── dashboard.html # Customer dashboard
├── seller.html # Seller dashboard
├── admin.html # Admin dashboard
├── auctions.html # Auction gallery
├── complaint.html # Complaints page
├── css/style.css # Styles
└── js/ # Logic

## ⚖️ Advantages
- Only verified users can participate
- Early fraud detection
- Secure and efficient purchasing
- Remote participation in auctions

## ⚠️ Disadvantages
- Limited product visualization (photos and details)

## 🎓 Academic Project
Developed for educational purposes.