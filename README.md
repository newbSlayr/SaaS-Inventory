# Inventory Management System for SMBs 

This is a cloud-based inventory management system designed for small to medium businesses. Developed as part of my final year Synoptic Project, it demonstrates how SaaS-based platforms can reduce operational overhead and improve inventory accuracy without enterprise-level complexity.

---

## Live Demo

Deployed via Docker to Google Cloud Run:  
**URL:** https://nextjs-app-640515661608.europe-west1.run.app/dashboard

---

## Tech Stack

- **Frontend:** Next.js 15  + Tailwind CSS
- **Backend:** Firebase Firestore 
- **Deployment:** Docker + Google Cloud Run
- **Cloud Build:** Used for containerisation
---

## Features

- Real-time stock updates
- Dashboard with item count, stock value, and category breakdowns
- Low-stock alert logic
- Add, edit, and delete inventory items
- Containerised via Docker 

---

## Setup Instructions

### 1. Download the repository
```bash
git clone https://github.com/newbSlayr/SaaS-Inventory.git
cd app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your `.env.local` file in root with Firebase config

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run locally

```bash
npm run dev
```

---

## Deploy to Google Cloud Run 

### 1. Login to Google Cloud 
```bash 
gcloud auth login
```

### 2. Create Google cloud Project (If not already done so)
```bash 
gcloud projects create your-project-id --name="Inventory System"
```
Then set it as your active project:
```bash
gcloud config set project your-project-id
```
### 3. Enable Required APIs
```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```
### 4. Set your GCP Project
```bash
gcloud config set project <your-project-id>
```

### 5.Configure `
Within the deploy.sh script add your project id from GCP
```bash
PROJECT_ID="your_project_id"
```
Save and run 
```bash
./deploy.sh
```

Cloud Run will build, push, and deploy the container using the latest Dockerfile.

---

## Project Origin

Created as part of the final-year Synoptic Project at Manchester Metropolitan University.
#
**Research Question:**  
*“How does SaaS-based inventory management impact inventory efficiency and operational cost for SMBs?”*

---

## Author

Hilton Man-Tim Coong  
[Email](212428731@stu.mmu.ac.uk)

---

