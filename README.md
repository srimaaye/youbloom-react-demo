# React Demo App – Technical Interview Task

A small React app built for a technical interview task.

- **Tech stack:** React (Hooks), React Router, Material UI  
- **API:** JSONPlaceholder (https://jsonplaceholder.typicode.com)  
- **Pages:**  
  - Login (mock phone login)  
  - Main (list + search)  
  - Detail (post view)  
- **Auth:** Accepts only `+254712345678` as valid login, state stored in `localStorage`  
- **Theme:** Black background, red text, interactive hover effects  

---

## Features

-  **Login Page** – phone number validation & mock login  
-  **Main Page** – fetches posts from JSONPlaceholder, live search  
-  **Detail Page** – full post view with back/next navigation  
-  **UI** – styled with Material UI, dark/red theme, hover effects  
-  **Extras** – loading spinners, error handling, persistent auth  

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (comes with Node)

### Setup
```bash
# Clone the repo
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

# Install dependencies
npm install

# Run development server
npm start
