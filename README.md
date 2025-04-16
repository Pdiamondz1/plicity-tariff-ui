# 🚀 Plicity: Tariff-Aware AI Pricing Assistant (UI)

**Plicity** is a real-time, AI-powered interface built to help industrial distributors navigate tariff-induced cost changes and protect their profit margins. This full-stack application leverages OpenAI, prompt engineering, and Retrieval-Augmented Generation (RAG) principles to provide instant, business-friendly insights per SKU.

---

## 🧠 What It Does

- 🔍 Accepts an industrial **SKU** as input
- 🧠 Uses OpenAI + pre-built **prompts** to analyze tariff impacts
- 💬 Returns **natural language pricing recommendations**
- 📊 Supports multiple insight types:
  - Price explanation
  - Customer-facing messages
  - Pricing update scan

---

## ✨ Key Features

- ⚡ React + Flask full-stack application
- 🧠 Dynamic prompt selection via dropdown
- 🔐 Secure `.env` OpenAI key integration
- 💡 Business-ready output
- 📁 Modular and scalable codebase

---

## 🖥️ Screenshot

> (Add yours later)
![Plicity UI Screenshot](./screenshots/demo.png)

---

## ⚙️ Tech Stack

| Layer        | Technology          |
|--------------|----------------------|
| Frontend     | React + Tailwind CSS |
| Backend API  | Flask (Python)       |
| AI Engine    | OpenAI GPT-4         |
| Prompt Engine| Custom Prompt Catalog|
| Deployment   | (Optional: Vercel / Render) |

---

## 🚀 Getting Started

### 📁 Folder Structure

```
plicity-tariff-ui/
├── client/      # React UI
├── server/      # Flask API + Prompt Templates
├── .gitignore
├── README.md
├── requirements.txt
```

---

### 🔧 1. Clone the Repo

```bash
git clone https://github.com/YOUR_USERNAME/plicity-tariff-ui.git
cd plicity-tariff-ui
```

---

### 🔌 2. Set Up the Backend (Flask API)

```bash
cd server
python -m venv venv
venv\Scripts\activate         # On Windows
pip install -r ../requirements.txt
```

#### 🔑 Create a `.env` file:

Create a new file named `.env` inside `/server` with this content:

```env
OPENAI_API_KEY=your-real-openai-key-here
```

> 🔐 Never commit your real key. Keep this file in `.gitignore`.

---

#### ▶️ Run the Flask Server

```bash
flask run
```

✅ Server runs at: [http://localhost:5000](http://localhost:5000)

---

### 🖼️ 3. Set Up the Frontend (React UI)

```bash
cd ../client
npm install
npm run dev
```

✅ React app runs at: [http://localhost:5173](http://localhost:5173)

---

### 📩 4. Use the UI

1. Enter a SKU (e.g. `VALL-3434-M14X2`)
2. Select a prompt type:
   - Price Explanation
   - Customer Message
   - Risk Scan
3. Click “Get Insight”
4. Result is generated using OpenAI and shown in-browser

---

## 🧾 Prompt Templates (Flask Side)

Prompts are stored in:

```
server/prompts/
```

| Prompt Key             | Description                             |
|------------------------|-----------------------------------------|
| `sku_cost_change.txt`      | Explains why SKU pricing changed     |
| `customer_explanation.txt` | Generates customer-facing reason     |
| `sku_tariff_scan.txt`      | Lists SKUs affected by tariffs       |

---

## 🔐 .gitignore (Important!)

Ensure your `.gitignore` includes:
```
server/.env
venv/
__pycache__/
node_modules/
```

This prevents API keys and virtual environments from being pushed to GitHub.

---

## 🌐 Deployment (Optional)

- 🖥️ Deploy frontend with **Vercel**, **Netlify**, or **GitHub Pages**
- ⚙️ Deploy Flask backend with **Render**, **Railway**, or **Fly.io**
- 📦 Use `build/` output from React for static hosting

---

## 💬 Future Features (Planned)

- 📥 Export to PDF/CSV
- 🗃️ Save query history
- 🔒 Admin login for pricing teams
- 🏢 ERP pricing sync module

---

## 🏢 About

**Developed by:** Harbormill Automation Inc.  

---

## 📫 Contact

Want to collaborate, invest, or license Plicity?

📧 Email us at: `info@harbormill.net'

---

## 🛑 Disclaimer

**This project is in active development.**  
Ensure all secrets and keys are secured properly before using in production.
