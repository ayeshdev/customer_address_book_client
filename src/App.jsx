import { useContext } from 'react'
import './App.css'
import { AppContext } from './Context/AppContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Pages/Layout';
import Home from './Pages/Home';
import Login from './Pages/Auth/Login';
import List from './Pages/Customers/List';
import Add from './Pages/Customers/Add';
import Update from './Pages/Customers/Update';
import UpdateProject from './Pages/Projects/UpdateProject';
import AddProject from './Pages/Projects/AddProject';

export default function App() {
  const { user } = useContext(AppContext);

  return <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='/login' element={user ? <Home /> : <Login />} />
        <Route path='/customers' element={user ? <List /> : <Login />} />
        <Route path='/customers/add' element={user ? <Add /> : <Login />} />
        <Route path='/customers/update/:id' element={user ? <Update /> : <Login />} />
        <Route path='/projects/add' element={user ? <AddProject/> : <Login />} />
        <Route path='/projects/update/:id' element={user ? <UpdateProject /> : <Login />} />
      </Route>
    </Routes>
  </BrowserRouter>
};

