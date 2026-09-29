import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ChildProvider } from './contexts/ChildContext';
import Games from './pages/child/Games';
import MemoryGamePage from './pages/child/MemoryGamePage';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import SelectChild from './pages/children/SelectChild';
import CreateChild from './pages/children/CreateChild';

import Dashboard from './pages/child/Dashboard';
import SubjectDetail from './pages/child/SubjectDetail';
import ExercisePlay from './pages/child/ExercisePlay';
import SubjectComplete from './pages/child/SubjectComplete';
import Achievements from './pages/child/Achievements';
import Ranking from './pages/child/Ranking';

import ParentPanel from './pages/parent/ParentPanel';
import ChildDetail from './pages/parent/ChildDetail';
import StarsGamePage from './pages/child/StarsGamePage';

import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSubjects from './pages/admin/AdminSubjects';
import AdminExercises from './pages/admin/AdminExercises';
import AdminUsers from './pages/admin/AdminUsers';
import WordSearchGamePage from './pages/child/WordSearchGamePage';
import Shop from './pages/child/Shop';
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChildProvider>
          <BrowserRouter>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rutas de tutor */}
              <Route path="/children" element={<SelectChild />} />
              <Route path="/children/new" element={<CreateChild />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/subjects/:id" element={<SubjectDetail />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/shop" element={<Shop />} />
              <Route
                path="/subjects/:id/exercises/:exerciseId"
                element={<ExercisePlay />}
              />
              <Route path="/subjects/:id/complete" element={<SubjectComplete />} />
              <Route path="/parent" element={<ParentPanel />} />
              <Route path="/parent/child/:id" element={<ChildDetail />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/memory" element={<MemoryGamePage />} />
              <Route path="/games/stars" element={<StarsGamePage />} />
              <Route path="/games/wordsearch" element={<WordSearchGamePage />} />

              {/* Rutas admin */}
              <Route
                path="/admin"
                element={
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/subjects"
                element={
                  <AdminLayout>
                    <AdminSubjects />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/exercises"
                element={
                  <AdminLayout>
                    <AdminExercises />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminLayout>
                    <AdminUsers />
                  </AdminLayout>
                }
              />
            </Routes>
          </BrowserRouter>
        </ChildProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;