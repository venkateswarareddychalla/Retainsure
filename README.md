# Retainsure URL Shortener

A simple, production-ready **URL Shortener** built with React (frontend) and Express + SQLite (backend).  
Deployed seamlessly to [Vercel](https://vercel.com) with support for link analytics and custom API endpoints.

## 🌟 Features

- **Shorten URLs**: Instantly generate short links for any valid URL.
- **Redirect Support**: Easily share and open your short links—redirect works on any domain where deployed.
- **Link Analytics**: Track click counts and creation date for each short link.
- **Clipboard Integration**: One-click copy feature for generated short links.
- **Interactive UI**: Clean, minimal React UI—mobile and desktop friendly.
- **Serverless & Fast**: Runs on Vercel as serverless API endpoints.  
- **SQLite Persistence**: URLs and analytics are stored in a SQLite database.

## 🚀 Demo

Try the live app:  
[https://retainsure-ten.vercel.app](https://retainsure-ten.vercel.app)

## 🏗️ Project Structure

```
.
├── api/                # Express API handlers (Vercel Serverless Functions)
│   └── index.js
├── public/             # Static frontend assets
│   └── ...
├── src/                # React frontend
│   ├── App.js
│   └── ...
├── database.db         # SQLite database file
├── vercel.json         # Vercel routing/config
├── package.json        
└── README.md           # This file
```

## 🏃♂️ Quickstart

### 1. **Clone & Install**
```bash
git clone https://github.com/venkateswarareddychalla/Retainsure.git
cd Retainsure
npm install
```

### 2. **Run Locally**

#### Start Backend Locally
_(Requires Node.js and SQLite)_
```bash
cd api
node index.js
```

#### Start Frontend Locally
```bash
npm start
```

Frontend runs at `http://localhost:3000`  
API runs at `http://localhost:3000/api`

### 3. **Deploy to Vercel**

1. Push the repo to GitHub.
2. Import the project into Vercel (as “Other” framework).
3. (Optional) Set up your domain.
4. Hit “Deploy”!

Vercel will handle both static frontend hosting and serverless backend via API Routes.

## 📫 API Endpoints

| Endpoint                  | Method  | Description                     |
|---------------------------|---------|---------------------------------|
| `/api/shorten`            | POST    | Shorten a valid URL             |
| `/api/stats/:short_code`  | GET     | Get analytics for a short code  |
| `/:short_code`            | GET     | Redirect to the original URL    |

## 🔍 Technologies Used

- **Frontend**: React, CSS
- **Backend**: Express.js, SQLite, nanoid
- **Hosting**: Vercel (Serverless Functions)

## 📝 License

This project is licensed under the MIT License.  
Feel free to fork and use for personal or commercial projects!

## 🙏 Acknowledgements

Inspired by classic URL shorteners, with serverless deployment for modern cloud hosting.

**Made with ❤️ by venkateswarareddychalla**

[1] https://github.com/venkateswarareddychalla/Retainsure