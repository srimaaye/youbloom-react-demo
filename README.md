# youbloom-react-demo
README.md
React Demo App – Technical Interview Task (MUI + Router)
A small React app that satisfies the interview brief:
Pages: Login → Main (list + live search) → Detail
Tech: React (hooks), React Router, Material UI
Data: JSONPlaceholder (https://jsonplaceholder.typicode.com)
Auth: Mock login (accepts +254712345678), state persisted to localStorage
Theme: Black background with red text & hover effects
Features
Login Page
Phone number validation (+ + country code, 6–15 digits)
Mock credential: +254712345678
Redirects to Main on success; shows helpful error text otherwise
Main Page
Fetches posts from JSONPlaceholder
Live search across post titles & bodies
Click a card to open the Detail page
Detail Page
Shows full post details
Back to list + Next navigation
Nice-to-haves
Loading and error states for fetches
Dark/Red UI with interactive hover styles
