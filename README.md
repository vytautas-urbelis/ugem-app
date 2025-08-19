# 💎 uGem – Digital Loyalty Platform

![Imgur Image](https://imgur.com/a/ugem-app-demo-qVfZLt5)

<iframe src="https://imgur.com/a/ugem-app-demo-qVfZLt5.mp4"></iframe>

**uGem** is a cross-platform digital loyalty app designed to help businesses grow their customer base and retention through modern tools like digital stamp cards, promotion vouchers, and subscription-based features.

It includes:
- A **React Native** mobile app (iOS & Android)
- An **iOS App Clip** for quick access
- A **real-time Django backend** with WebSocket support

---

## ✨ Features

### 🧾 For Businesses
- Create and manage digital stamp cards and vouchers
- Track customer usage and redemptions in real time
- Subscription-based access to advanced tools

### 📱 For Customers
- Collect stamps and vouchers digitally
- Redeem offers via mobile app or App Clip
- Discover businesses and their promotions

### 🚀 Unique Capabilities
- Real-time updates via WebSockets
- Seamless cross-platform experience

---

## 🛠 Tech Stack

### 📱 Mobile App
- React Native
- Expo router, MMKV
- Expo
- Apple Sign-In, Google Sign-In
- iOS App Clip integration

### 🧠 Backend
- Python
- Django
- Django REST Framework
- Django Channels (WebSockets)
- Celery (task queues)
- Redis (real-time broker)

### 🌐 Web Dashboard
- React
- Tailwind CSS
- REST API integration

### ⚙️ DevOps & Tooling
- Docker
- GitLab CI/CD
- DigitalOcean (hosting)

---

## 🔐 Authentication

- Google Sign-In (OAuth 2.0)
- Apple Sign-In (iOS + App Clip)
- JWT-based authentication

---

## 💸 Monetization

- Business users subscribe via App Store / Play Store
- Regular customers use the app for free

---

## 🌍 Availability

- iOS & Android (worldwide)
- App Clip for iOS

---

## 📦 Project Structure

```text
ugem/
├── ios-app-clip/           # Swift-based iOS App Clip
├── react-native-app/       # Main mobile app (iOS & Android)
├── backend-frontend/       # Django + DRF + Channels  
│   └── frontend/           # Business dashboard (React)
