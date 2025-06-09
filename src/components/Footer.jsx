import { PlusCircle, ShoppingBasket, Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const Footer = () => {
  const location = useLocation()
  return (
    <footer
      className="fixed bottom-0 left-0 w-full bg-footer border-t border-gray-200 flex justify-around py-2 z-50"
      data-testid="footer"
    >
      <Link
        to="/search"
        className={`flex flex-col items-center ${location.pathname === '/search' ? 'text-primary' : 'text-gray-100'}`}
        data-testid="footer-link-search"
      >
        <Search className="w-6 h-6" data-testid="footer-icon-search" />
        <span className="text-sm font-semibold" data-testid="footer-label-search">Buscar</span>
      </Link>

      <Link
        to="/add-recipe"
        className={`flex flex-col items-center ${location.pathname === '/add-recipe' ? 'text-primary' : 'text-gray-100'}`}
        data-testid="footer-link-add-recipe"
      >
        <PlusCircle className="w-6 h-6" data-testid="footer-icon-add-recipe" />
        <span className="text-sm font-semibold" data-testid="footer-label-add-recipe">Nueva Receta</span>
      </Link>

      <Link
        to="/shopping-list"
        className={`flex flex-col items-center ${location.pathname === '/shopping-list' ? 'text-primary' : 'text-gray-100'}`}
        data-testid="footer-link-shopping-list"
      >
        <ShoppingBasket className="w-6 h-6" data-testid="footer-icon-shopping-list" />
        <span className="text-sm font-semibold" data-testid="footer-label-shopping-list">Cesta</span>
      </Link>
    </footer>
  )
}

export default Footer