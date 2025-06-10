import React from "react";
import TimerBadge from "../TimerBadge";
import ActionButton from "../buttons/ActionButton";
import OpenRecipeButton from "../buttons/OpenRecipeButton";

const RecipeCard = ({ recipe, onLike, onDislike }) => {
  return (
    <div
      className="flex flex-col items-center w-full px-4"
      style={{ backgroundColor: "#FDF3E8" }}
    >
      {/* Recipe Image */}
      <div className="relative w-full mb-4 aspect-[4/3] max-h-80">
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
      </div>

      {/* Content Section */}
      <div className="w-full mb-4 px-2">
        {/* Desktop Layout: Title and Timer on same line */}
        <div className="hidden sm:flex justify-between items-start mb-1">
          <h2 className="text-xl font-semibold text-gray-900 flex-1 mr-4">
            {recipe.name}
          </h2>
          <TimerBadge minutes={recipe.duration_minutes} />
        </div>

        {/* Desktop Layout: Description and Category on same line */}
        <div className="hidden sm:flex justify-between items-center">
          {recipe.description && (
            <p className="text-gray-600 text-base flex-1 mr-4">
              {recipe.description}
            </p>
          )}
          {recipe.category ? (
            <p className="text-[#F37A7E] text-sm font-medium whitespace-nowrap">
              {recipe.category}
            </p>
          ) : (
            <span />
          )}
        </div>

        {/* Mobile Layout: Title and Description centered, Category and Timer on edges */}
        <div className="sm:hidden">
          {/* Title centered */}
          <h2 className="text-lg font-semibold text-gray-900 mb-2 text-center">
            {recipe.name}
          </h2>

          {/* Description centered */}
          {recipe.description && (
            <p className="text-gray-600 text-sm mb-3 text-center">
              {recipe.description}
            </p>
          )}

          {/* Category and Timer on edges */}
          <div className="flex justify-between items-center">
            {recipe.category ? (
              <p className="text-[#F37A7E] text-xs font-medium whitespace-nowrap">
                {recipe.category}
              </p>
            ) : (
              <span />
            )}
            <TimerBadge minutes={recipe.duration_minutes} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center w-full mb-3 gap-20">
        <ActionButton
          icon="x"
          onClick={onDislike}
          ariaLabel="Dislike"
          size="lg"
        />
        <ActionButton
          icon="heart"
          onClick={onLike}
          ariaLabel="Like"
          size="lg"
        />
      </div>

      {/* Open Recipe Button */}
      <div className="w-full sm:max-w-[140px] mx-auto">
        <OpenRecipeButton
          onClick={() => (window.location.href = `/recipe/${recipe.id}`)}
        />
      </div>
    </div>
  );
};

export default RecipeCard;
