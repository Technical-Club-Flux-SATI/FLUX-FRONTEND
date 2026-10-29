# MongoDB Atlas Integration & Setup Guide

This guide details how to create and connect your **MongoDB Atlas** database with the Technovision registration system.

---

## 1. Create a MongoDB Atlas Cluster (Free Tier)
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign in (or create a free account).
2. Click **"Create a Deployment"** or **"New Cluster"**.
3. Select the **M0 Free** cluster tier (Shared).
4. Choose your preferred Cloud Provider and Region (e.g. AWS / `ap-south-1` Mumbai).
5. Name your cluster (e.g., `Cluster0` or `FluxTechnovision`) and click **"Create"**.

---

## 2. Create Database User (Authentication)
1. In the left navigation menu under **Security**, click **"Database Access"**.
2. Click **"Add New Database User"**.
3. Authentication Method: **Password**.
4. Set a **Username** (e.g., `flux_admin`) and a secure **Password**.
   *(Note down the password — special characters should be URL-encoded if needed).*
5. Under **Database User Privileges**, select **"Read and write to any database"** (or custom database `flux_db`).
6. Click **"Add User"**.

---

## 3. Configure Network Access (IP Allowlist)
1. In the left navigation menu under **Security**, click **"Network Access"**.
2. Click **"Add IP Address"**.
3. For local development and server deployment, select **"Allow Access from Anywhere"** (`0.0.0.0/0`) or enter your specific server/static IP.
4. Click **"Confirm"**. It will take about 1 minute to transition to **Active**.

---

## 4. Get the Connection String
1. In the left navigation menu under **Deployment**, click **"Database"**.
2. On your cluster card, click the **"Connect"** button.
3. Choose **"Drivers"** (Node.js).
4. Copy the connection string format:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Specify the database name after the slash:
   ```text
   mongodb+srv://flux_admin:YourPassword123@cluster0.xxxxx.mongodb.net/flux_db?retryWrites=true&w=majority
   ```

---

## 5. Add to `.env` File
Open `/disk/ayush /college project/flux/FLUX-FRONTEND/.env` and update:
```env
MONGODB_URI=mongodb+srv://flux_admin:YourPassword123@cluster0.xxxxx.mongodb.net/flux_db?retryWrites=true&w=majority
```

---

## 6. Start / Restart Backend Server
Start the backend server in terminal:
```bash
node technovision/server.cjs
```
You should see:
```text
🚀 Technovision Backend Server running at http://localhost:5000/api
🔑 Admin Passkey: flux2026
🗄️ Database: MongoDB Atlas configured (mongodb+srv://flux_admin:******@cluster0.xxxxx.mongodb.net/flux_db?retryWrites=true&w=majority)
[MongoDB Atlas] ✅ Connected successfully.
```

To verify the connection status at any time, run:
```bash
curl http://localhost:5000/api/technovision/db-status
```

---

## 7. View Saved Registrations in MongoDB Atlas
1. Open [MongoDB Atlas Dashboard](https://cloud.mongodb.com/).
2. Navigate to **Deployment > Database**.
3. Click **"Browse Collections"**.
4. Under database `flux_db`, select the collection **`technovision_registrations`**.
5. Every registration will show all participant data, team details, formatted `applicationId` (e.g. `TV26-ROC-B3B4H`), status, and timestamp history.

