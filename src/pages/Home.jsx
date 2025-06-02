import React from 'react';
import Card from '../components/Card';

// Configurations 
const config = {
  categories: ['Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Dessert', 'Snack'],
  latestRecipes: [
    {
      id: 1,
      image: 'https://via.placeholder.com/300x200',
      name: 'Swamp Soup',
      category: 'Lunch',
      time: '20 min',
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/300x200',
      name: 'Banana Cream Pie',
      category: 'Dessert',
      time: '30 min',
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/300x200',
      name: 'Vegan Patty Melt',
      category: 'Dinner',
      time: '15 min',
    },
  ],
  footerLinks: [
    { text: 'Términos de servicio', href: '#' },
    { text: 'Políticas de privacidad', href: '#' },
  ],
};

const CheckboxCategoria = ({ name }) => (
  <button
    type="button"
    aria-label={`Filter by ${name}`}
    className="px-4 py-2 bg-accent text-white rounded-full text-sm hover:opacity-90 transition-opacity duration-200"
  >
    {name}
  </button>
);

const Section = ({ title, children, bgClass, className = '' }) => (
  <section className={`py-12 ${bgClass} ${className}`}>
    <div className="container mx-auto px-4">
      {title && (
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">{title}</h2>
      )}
      {children}
    </div>
  </section>
);

const Home = () => {
  return (
    <>
     {/* Header */}

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <Section bgClass="bg-background" className="pt-16 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
              <p className="text-gray-600 mb-2">Having trouble deciding?</p>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                What are you<br />
                in the mood for?
              </h1>

              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {config.categories.map((category) => (
                  <CheckboxCategoria key={category} name={category} />
                ))}
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img
                src="https://via.placeholder.com/600x400"
                alt="Assorted healthy dishes on a table"
                className="w-full max-w-sm sm:max-w-md lg:max-w-xl h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </Section>

        {/* Latest Recipes */}
        <Section title="Latest recipes" bgClass="bg-primary">
          <div className="flex flex-wrap justify-center gap-6">
            {config.latestRecipes.map((recipe) => (
              <Card key={recipe.id} {...recipe} />
            ))}
          </div>
        </Section>

        {/* Inspire Me Section */}
        <Section bgClass="bg-background" className="py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
              You don't know what to make yet?
            </h2>

            <button
              type="button"
              className="w-40 h-40 md:w-48 md:h-48 bg-accent rounded-full text-white font-semibold text-lg hover:opacity-90 transition-opacity duration-200"
            >
              Inspire me
            </button>
          </div>
        </Section>
      </main>

      {/* Footer */}
    </>
  );
};

export default Home;
