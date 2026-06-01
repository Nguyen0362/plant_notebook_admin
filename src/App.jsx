import { Route, Routes } from "react-router-dom"
import { path } from "./utils/constant"
import { Dashboard, Layout, Product, Login, AddProduct, GeminiKeys } from "./containers/public"

function App() {
  return (
    <div className="w-screen h-screen">
      <Routes>
        <Route path={path.LOGIN} element={<Login />} />
        <Route path={path.ADMIN} element={<Layout />}>
          <Route path={path.DASHBOARD} element={<Dashboard />} />
          <Route path={path.PRODUCT} element={<Product />} />
          <Route path={path.PRODUCT_ADD} element={<AddProduct />} />
          <Route path={path.GEMINI_KEY} element={<GeminiKeys />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
