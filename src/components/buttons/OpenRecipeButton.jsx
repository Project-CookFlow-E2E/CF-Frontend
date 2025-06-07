// buttons/OpenRecipeButton.jsx

const OpenRecipeButton = ({ onClick }) => (
  <button 
    onClick={onClick}
    className="w-full py-1.5 px-4 font-medium text-xs sm:text-sm border-2 border-[#F37A7E] text-[#F37A7E] rounded-full bg-transparent hover:bg-[#F37A7E] hover:text-white active:scale-95 transition-all duration-200 focus:outline-none"
    data-testid="open-recipe-button"
  >
    Open Recipe
  </button>
);

export default OpenRecipeButton;
