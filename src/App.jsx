import { Route, Routes, Navigate } from "react-router-dom"
import { path } from "./utils/constant"
import { Dashboard, Layout, Login, LibraryPlantList, LibraryPlantForm } from "./containers/public"

function App() {
  return (
    <div className="w-screen h-screen">
      <Routes>
        <Route path={path.LOGIN} element={<Login />} />
        <Route path={path.ADMIN} element={<Layout />}>
          <Route path={path.DASHBOARD} element={<Dashboard />} />
          <Route path={path.LIBRARY_PLANTS} element={<LibraryPlantList />} />
          <Route path={path.LIBRARY_PLANTS_ADD} element={<LibraryPlantForm />} />
          <Route path={path.LIBRARY_PLANTS_EDIT} element={<LibraryPlantForm />} />
        </Route>
        <Route path="/" element={<Navigate to={path.ADMIN + '/' + path.DASHBOARD} replace />} />
        <Route path="*" element={<Navigate to={path.ADMIN + '/' + path.DASHBOARD} replace />} />
      </Routes>
    </div>
  )
}

export default App
