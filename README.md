# 🛋️ LeetCode Lab

A clean, minimal contest tracker for LeetCode — showing past contests, problems, point values, and your solve status. Designed with simplicity in mind.

---

## ✨ Features

- 📆 Lists past Weekly & Biweekly contests
- 💡 Displays problem titles with point values
- ✅ Highlights solved problems in green
- ⚡ Fast with pagination
- 🎨 Simple, classy UI (dark mode coming soon)
- 🔧 Modular server with LeetCode GraphQL API

---

## 🧰 Tech Stack

- **Frontend**: HTML, CSS, JavaScript (React coming soon)
- **Backend**: Node.js, Express
- **Data Source**: LeetCode GraphQL API

---

## 🛠️ Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/harsh-dexter/leetcode-lab.git
cd leetcode-lab
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

In the root folder, create a file named `.env`:

```bash
touch .env
```

And add:

```
LEETCODE_SESSION="your_leetcode_session_token"
CSRF_TOKEN="your_csrf_token"
```

> 💡 **How to get these tokens?**
>
> - Log in to [leetcode.com](https://leetcode.com)
> - Open DevTools → Application → Cookies
> - Copy values for:
>   - `LEETCODE_SESSION`
>   - `csrftoken` (paste as `CSRF_TOKEN`)

### 4. Run the server

```bash
node server.js
```

The server will start at: `http://localhost:3000`

---

## 🌐 Project Structure

```
leetcode-lab/
├── server.js                 # Express server
├── routes/
│   └── contests.js          # API route for contests
├── utils/
│   └── isProblemSolved.js   # Check problem solve status
├── config/
│   └── constants.js         # Auth headers and constants
├── public/
│   ├── index.html           # Frontend page
│   └── script.js            # Frontend logic
└── .env                     # Auth tokens for LeetCode API
```

---

## 🚀 Deployment

- **Frontend**: Deploy `/public` to Vercel or Netlify
- **Backend**: Deploy Express server to Render or Railway

Make sure to:
- Add `.env` in your Render/Railway project settings
- Update frontend fetch URL to point to your deployed backend

---

## 💬 Contribute

Found a bug? Got ideas? Feel free to open issues or PRs!

---

## 📜 License

MIT — do whatever you want, just give some credit 😉
