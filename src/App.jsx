// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { 
//   AddRecipe, AdminDashboard, Home, InspireMe, Login, Profile, Recipe, Search, SignUp, ShoppingList, Landing 
// } from './pages';
// import { Header } from './components';
// import { Footer } from './components';

// function App() {
//   return (
//     <BrowserRouter>
//       <Header />
//       <Routes>
//         <Route path="/" element={<Landing />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/admin-dashboard" element={<AdminDashboard />} />
//         {/* Otras rutas */}
//       </Routes>
//       <Footer />
//     </BrowserRouter>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { 
  AddRecipe, AdminDashboard, Home, InspireMe, Login, Profile, Recipe, Search, SignUp, ShoppingList, Landing 
} from './pages';
import { Header } from './components';
import { Footer } from './components';

function App() {
  return (
    <BrowserRouter>
      <Header />
      {/* Aplicamos la clase bg-background al contenedor principal del contenido */}
      <div className="min-h-screen bg-background"> 
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          {/* Otras rutas */}
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;