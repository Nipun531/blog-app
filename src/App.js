import './App.css';
import Post from "./post";
import Header from "./Header";
import {Route,Routes} from "react-router-dom";
import Layout from "./Layout";
import IndexPage from './Index pages/IndexPage';
import LoginPage from './Index pages/LoginPage';
import RegisterPage from './Index pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import CreatePost from './Index pages/CreatePost';
import PostPage from './Index pages/PostPage';
import EditPost from './Index pages/EditPost';
import ProfilePage from './Index pages/ProfilePage';

function App() {
  return (
    <UserContextProvider>
      <Routes>
      <Route path='/' element={<Layout />}>
        
        <Route index element ={  <IndexPage /> } />
        <Route path='/Login' element ={ <LoginPage />} /> 
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/create' element={<CreatePost/>} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/edit/:id" element={<EditPost />}/>
        <Route path="/profile/:id" element={<ProfilePage />} />

      </Route>                 
    </Routes>
    </UserContextProvider>
    
    
  );
}

export default App;
