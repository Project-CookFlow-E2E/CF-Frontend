import React from 'react'
import Card from '../components/Card'
// import { useParams } from 'react-router-dom';
import useRecipe from '../hooks/useRecipe';

const Home = () => {
  
  // const { id } = useParams();         
  // const { recipe, loading } = useRecipe(id);

  const { recipe, loading } = useRecipe(1); 

  if (loading) return <p>Loading…</p>;
  if (!recipe) return <p>Recipe not found 😢</p>;

  return <Card {...recipe} />
}

export default Home
