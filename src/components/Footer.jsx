import { Utensils, PlusCircle, ShoppingBasket, Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const Footer = () => {
  const location = useLocation()
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-footer border-t border-gray-200 flex justify-around py-2 z-50">
       <Link
        to="/search"
        className={`flex flex-col items-center ${location.pathname === '/search' ? 'text-primary' : 'text-gray-100'}`}
      >
       <Search className="w-6 h-6" />
       <span className="text-sm font-semibold">Buscar</span>
      </Link>
      <Link
        to="/add-recipe"
        className={`flex flex-col items-center ${location.pathname === '/add-recipe' ? 'text-primary' : 'text-gray-100'}`}
      >
        <PlusCircle className="w-6 h-6" />
        <span className="text-sm font-semibold">Nueva Receta</span>
      </Link>
     
      <Link
        to="/shopping-list"
        className={`flex flex-col items-center ${location.pathname === '/shopping-list' ? 'text-primary' : 'text-gray-100'}`}
      >
        <ShoppingBasket className="w-6 h-6" />
        <span className="text-sm font-semibold">Cesta</span>
      </Link>
      
    </footer>
  )
}

export default Footer