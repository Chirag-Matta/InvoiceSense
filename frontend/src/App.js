import React from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Dashboard />
      </ThemeProvider>
    </Provider>
  );
}

export default App;