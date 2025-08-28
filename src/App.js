import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link, useParams } from "react-router-dom";
import {
  AppBar, Box, Button, Card, CardActionArea, CardContent,
  CircularProgress, Container, IconButton, InputAdornment,
  Snackbar, TextField, Toolbar, Typography, Alert,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";

const AuthContext = createContext({ isAuthed: false, login: () => {}, logout: () => {} });
const AUTH_KEY = "demoapp:isAuthed";

function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(() => localStorage.getItem(AUTH_KEY) === "true");
  const login = (phone) => {
    const ok = phone.trim() === "+254712345678";
    if (ok) { localStorage.setItem(AUTH_KEY, "true"); setIsAuthed(true); }
    return ok;
  };
  const logout = () => { localStorage.removeItem(AUTH_KEY); setIsAuthed(false); };
  return <AuthContext.Provider value={{ isAuthed, login, logout }}>{children}</AuthContext.Provider>;
}
const useAuth = () => useContext(AuthContext);
const PrivateRoute = ({ children }) => useAuth().isAuthed ? children : <Navigate to="/login" replace />;

function AppShell({ title, children, showLogout = true }) {
  const { isAuthed, logout } = useAuth(); 
  const nav = useNavigate();
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "black", color: "red" }}>
      <AppBar position="static" sx={{ bgcolor: "black", borderBottom: "1px solid red" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, color: "red" }}>{title}</Typography>
          {showLogout && isAuthed && (
            <IconButton onClick={() => {logout(); nav("/login",{replace:true});}} sx={{ color: "red", "&:hover":{color:"white"} }}>
              <LogoutIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: 3, flex: 1, width: "100%", color: "red" }}>{children}</Container>
      <Box component="footer" sx={{ py: 2, textAlign: "center", borderTop: "1px solid red" }}>
        <Typography variant="caption" sx={{ color: "red" }}>
          JSONPlaceholder • React • MUI • Hooks • Router
        </Typography>
      </Box>
    </Box>
  );
}

function LoginPage() {
  const [phone, setPhone] = useState(""); const [error, setError] = useState(""); 
  const [toastOpen, setToastOpen] = useState(false); 
  const { login } = useAuth(); const nav = useNavigate();

  const validate = (val) => {
    if (!val) return "Phone is required.";
    if (!/^\+\d{6,15}$/.test(val)) return "Must start with country code (e.g., +254...)";
    return "";
  };
  const handleSubmit = (e) => {
    e.preventDefault(); 
    const err = validate(phone); setError(err); 
    if (err) return;
    if (login(phone)) { setToastOpen(true); setTimeout(()=>nav("/"),300); }
    else setError("Invalid credentials. Try +254712345678.");
  };

  return (
    <AppShell title="Login" showLogout={false}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display:"grid",gap:2,maxWidth:420,mx:"auto",mt:6 }}>
        <Typography variant="h5" sx={{ fontWeight:700,color:"red" }}>Welcome back</Typography>
        <TextField
          label="Phone number" placeholder="+254712345678"
          value={phone} onChange={(e)=>setPhone(e.target.value)}
          error={Boolean(error)} helperText={error||"Use +254712345678"}
          sx={{ input:{color:"red"}, label:{color:"red"}, "& .MuiOutlinedInput-root":{ "& fieldset":{borderColor:"red"}, "&:hover fieldset":{borderColor:"white"} } }}
        />
        <Button type="submit" variant="contained" size="large"
          sx={{ bgcolor:"red",color:"black","&:hover":{bgcolor:"white",color:"red"} }}>
          Log In
        </Button>
      </Box>
      <Snackbar open={toastOpen} autoHideDuration={1500} onClose={()=>setToastOpen(false)}>
        <Alert severity="success" variant="filled">Login successful!</Alert>
      </Snackbar>
    </AppShell>
  );
}

async function fetchJSON(url){const r=await fetch(url);if(!r.ok) throw new Error(`HTTP ${r.status}`);return await r.json();}

function MainPage(){
  const [query,setQuery]=useState(""); const [posts,setPosts]=useState([]); 
  const [loading,setLoading]=useState(true); const [error,setError]=useState("");

  useEffect(()=>{let alive=true; setLoading(true);
    fetchJSON("https://jsonplaceholder.typicode.com/posts")
      .then(d=>{if(!alive)return; setPosts(d); setError("");})
      .catch(e=>{if(!alive)return; setError(e.message||"Failed");})
      .finally(()=>alive&&setLoading(false));
    return()=>alive=false;
  },[]);

  const filtered=useMemo(()=>{const q=query.trim().toLowerCase();
    if(!q)return posts;
    return posts.filter(p=>p.title.toLowerCase().includes(q)||p.body.toLowerCase().includes(q));
  },[posts,query]);

  return (
    <AppShell title="Posts">
      <Box sx={{ display:"grid",gap:2 }}>
        <TextField value={query} onChange={(e)=>setQuery(e.target.value)}
          placeholder="Search posts…" InputProps={{ startAdornment:(<InputAdornment position="start"><SearchIcon sx={{color:"red"}}/></InputAdornment>) }}
          sx={{ input:{color:"red"}, label:{color:"red"}, "& .MuiOutlinedInput-root":{ "& fieldset":{borderColor:"red"}, "&:hover fieldset":{borderColor:"white"} } }}
        />

        {loading && <Box sx={{textAlign:"center",py:4}}><CircularProgress sx={{color:"red"}}/><Typography>Loading…</Typography></Box>}
        {error && <Alert severity="error" sx={{color:"red"}}>{error}</Alert>}
        {!loading && !error && filtered.length===0 && <Alert severity="info" sx={{color:"red"}}>No results</Alert>}

        {!loading && !error && filtered.map(p=>(
          <Card key={p.id} sx={{bgcolor:"black",color:"red",border:"1px solid red","&:hover":{boxShadow:"0 0 12px red"}}}>
            <CardActionArea component={Link} to={`/detail/${p.id}`}>
              <CardContent>
                <Typography variant="subtitle2">Post #{p.id}</Typography>
                <Typography variant="h6">{p.title}</Typography>
                <Typography variant="body2">{p.body.slice(0,120)}…</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </AppShell>
  );
}

function DetailPage(){
  const {id}=useParams(); const [post,setPost]=useState(null);
  const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  useEffect(()=>{let a=true; setLoading(true);
    fetchJSON(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then(d=>{if(!a)return;setPost(d);setError("");})
      .catch(e=>{if(!a)return;setError(e.message||"Failed");})
      .finally(()=>a&&setLoading(false));
    return()=>a=false;
  },[id]);

  return (
    <AppShell title="Post Details">
      {loading&&<Box sx={{textAlign:"center",py:4}}><CircularProgress sx={{color:"red"}}/><Typography>Loading…</Typography></Box>}
      {error&&<Alert severity="error" sx={{color:"red"}}>{error}</Alert>}
      {post&&<Box sx={{display:"grid",gap:2}}>
        <Typography variant="overline">Post #{post.id}</Typography>
        <Typography variant="h4">{post.title}</Typography>
        <Typography variant="body1">{post.body}</Typography>
        <Box sx={{display:"flex",gap:1}}>
          <Button component={Link} to="/" variant="outlined"
            sx={{color:"red",borderColor:"red","&:hover":{bgcolor:"red",color:"black"}}}>
            Back
          </Button>
          <Button component={Link} to={`/detail/${Number(id)+1}`} variant="contained"
            sx={{bgcolor:"red",color:"black","&:hover":{bgcolor:"white",color:"red"}}}>
            Next
          </Button>
        </Box>
      </Box>}
    </AppShell>
  );
}

export default function App(){
  return(
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/" element={<PrivateRoute><MainPage/></PrivateRoute>}/>
          <Route path="/detail/:id" element={<PrivateRoute><DetailPage/></PrivateRoute>}/>
          <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
