import React, { useState, useMemo, useEffect } from 'react';
import styled from "styled-components";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import bg from './img/bg.png';
import { MainLayout } from './styles/Layouts';
import Orb from './Components/Orb/Orb';
import Navigation from './Components/Navigation/Navigation';
import Dashboard from './Components/Dashboard/Dashboard';
import Income from './Components/Income/Income';
import Expenses from './Components/Expenses/Expenses';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import PrivateRoute from './Components/Routing/PrivateRoute';
import { useGlobalContext } from './context/globalContext';

function App() {
  const { loadUser } = useGlobalContext();

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orbMemo = useMemo(() => {
    return <Orb />;
  }, []);

  return (
    <AppStyled bg={bg} className="App">
      {orbMemo}
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <MainApp />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </AppStyled>
  );
}

// We create a new component for the main application layout
function MainApp() {
  const [active, setActive] = useState(1);

  const displayData = () => {
    switch (active) {
      case 1:
        return <Dashboard />;
      case 2:
        return <Dashboard />; // View Transactions can also show Dashboard
      case 3:
        return <Income />;
      case 4:
        return <Expenses />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <MainLayout>
      <Navigation active={active} setActive={setActive} />
      <main>
        {displayData()}
      </main>
    </MainLayout>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${props => props.bg});
  position: relative;
  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default App;