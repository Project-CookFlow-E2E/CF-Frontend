import React from 'react';
import TimerBadge from '../buttons/TimerBadge';
import ActionButton from '../buttons/ActionButton';
import OpenRecipeButton from '../buttons/OpenRecipeButton';

const RecipeCard = ({ recipe, onLike, onDislike }) => {
  return (
    <div className="flex flex-col items-center w-full px-4 sm:max-w-md sm:mx-auto">
      <div className="relative w-full mb-6 sm:mb-4 aspect-[4/3] max-h-80">
        <div className="bg-gray-100 rounded-xl w-full h-full flex items-center justify-center overflow-hidden shadow-sm">
          {recipe.image_url ? (
            <img 
              src={recipe.image_url} 
              alt={recipe.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="border border-gray-200 rounded-xl w-full h-full flex items-center justify-center bg-white">
              <span className="text-gray-400">Recipe Image</span>
            </div>
          )}
        </div>
        <TimerBadge minutes={recipe.duration_minutes} />
      </div>
      
      {/* Recipe Name */}
      <div className="w-full text-center mb-3">
        <h2 className="text-xl sm:text-2xl text-gray-900">
          {recipe.name}
        </h2>
        {recipe.description && (
          <p className="text-gray-600 text-sm sm:text-base mt-2 line-clamp-2">
            {recipe.description}
          </p>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-center w-full mb-3 gap-20 sm:gap-24">
        <ActionButton icon="x" onClick={onDislike} ariaLabel="Dislike" size="lg" />
        <ActionButton icon="heart" onClick={onLike} ariaLabel="Like" size="lg" />
      </div>
      
      {/* Open Recipe Button */}
      <div className="w-full max-w-[140px] sm:max-w-[120px] mx-auto">
        <OpenRecipeButton onClick={() => window.location.href=`/recipe/${recipe.id}`} />
      </div>
    </div>
  );
};

export default RecipeCard;