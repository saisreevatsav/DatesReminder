# AdyayAvat

A personal offline Android app to track and get notified about important dates — insurance renewals, card expiries, payments, and more.

---

## Features

- Track dates across 10 built-in categories
- Custom category for anything else
- Color-coded status badges (expired, due soon, safe)
- Local Android notifications with custom advance reminder days per record
- Fully offline — all data stored on device using AsyncStorage
- No login, no internet required

---

## Categories

| Category | What it tracks |
|---|---|
| Cards Expiry | Debit/Credit card expiry dates |
| LIC Payments | Policy premiums and due dates |
| Medical Insurance | Health insurance renewal dates |
| Antivirus | Software license expiry |
| Pollution Certificate | PUC certificate expiry per vehicle |
| Vehicle Insurance | Vehicle insurance renewal dates |
| PPF Payments | PPF deposit due dates |
| SSY Payments | Sukanya Samriddhi Yojana deposit dates |
| Mobile Plans | Recharge/plan expiry dates |
| Custom | Any other date you want to track |

---

## Project Structure

```
DatesReminder/
├── App.js                          # Entry point, requests notification permissions
├── app.json                        # Expo config, Android permissions
└── src/
    ├── config/
    │   └── categories.js           # All category definitions and their fields
    ├── navigation/
    │   └── AppNavigator.js         # Bottom tabs + stack navigators
    ├── screens/
    │   ├── HomeScreen.js           # Dashboard — all records sorted by urgency
    │   ├── CategoriesScreen.js     # Grid of all categories
    │   ├── CategoryRecordsScreen.js# Records list for a single category
    │   ├── AddEditRecordScreen.js  # Add / edit a record with dynamic fields
    │   ├── RecordDetailScreen.js   # Full detail view of a record
    │   └── SettingsScreen.js       # Reschedule notifications
    └── utils/
        ├── storage.js              # AsyncStorage CRUD operations
        ├── notifications.js        # Schedule / cancel local notifications
        └── dateHelpers.js          # Days remaining, formatting, status colors
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or above
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Android phone or emulator

### Install dependencies

```bash
cd DatesReminder
npm install
```

### Run on your phone (quick test)

1. Install the **Expo Go** app on your Android phone from the Play Store
2. Run:
```bash
npx expo start
```
3. Scan the QR code shown in the terminal with Expo Go

---

## Build a Standalone APK

To install the app directly on your phone without Expo Go:

```bash
npx eas build -p android --profile preview
```

- Requires a free [Expo account](https://expo.dev/signup)
- EAS Build free tier gives you 30 builds/month
- Downloads a `.apk` file you can install directly on any Android device

---

## Notification Behaviour

- When you add or edit a record, a local notification is scheduled automatically
- You choose how many days in advance to be notified (1, 3, 7, 15, or 30 days)
- Notification fires at 9:00 AM on the chosen day
- If a date has already passed, no notification is scheduled
- Use **Settings → Reschedule All Notifications** if notifications stop working after a phone restart

---

## Status Color Guide

| Color | Meaning |
|---|---|
| 🔴 Red | Expired or due within 7 days |
| 🟠 Orange | Due within 8–30 days |
| 🟢 Green | More than 30 days remaining |
| ⚫ Grey | No date set |

---

## Tech Stack

| Library | Purpose |
|---|---|
| React Native + Expo | App framework |
| @react-navigation | Screen navigation |
| AsyncStorage | Local offline storage |
| expo-notifications | Local push notifications |
| @expo/vector-icons | Icons (MaterialCommunityIcons) |
| @react-native-community/datetimepicker | Date picker |
