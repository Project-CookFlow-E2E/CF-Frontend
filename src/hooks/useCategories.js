import { useState, useEffect } from "react";
import { categoryService } from "../services/categoryService";
import { useNavigate } from "react-router-dom";

const useCategories = (parentCategoryId = 0) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const TakeCategories = async () => {
        setLoading(true);
        try {
            let data;
            if (parentCategoryId === 0) {
                data = await categoryService.getAllParentCategories();
            } else {
                data = await categoryService.getChildCategoriesOfSpecificParent(parentCategoryId);
            }
            setCategories(data);
        } catch (err) {
            setError(err);
            console.error("Error fetching categories:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        TakeCategories();
    }, [parentCategoryId]);

    const toggleCategory = (categoryName) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryName) ? prev.filter((category) => category !== categoryName) : [...prev, categoryName]
        );
    };

    const handleSearchClick = () => {
        if (selectedCategories.length === 0) return;

        const mapped = selectedCategories.map((selectedName) => {
            const matched = categories.find((cat) => cat.name === selectedName);
            return matched?.slug || selectedName.toLowerCase();
        });

        const uniqueMapped = [...new Set(mapped)];
        navigate(`/search?category=${uniqueMapped.join(",")}`);
    };

    return {
        categories,
        selectedCategories,
        toggleCategory,
        loading,
        error,
        handleSearchClick,
    };
};

export default useCategories;
