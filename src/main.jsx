import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PersistGate } from "redux-persist/es/integration/react";
import { Provider } from 'react-redux';
import reduxStore from './redux.jsx';
import { BrowserRouter } from 'react-router-dom'

const { store, persistor } = reduxStore();

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
