import { useState, useEffect } from "react";
import UseLoadP from "../../Hooks/useLoadP";
import useAuth from "../../Hooks/useAuth";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import Swal from 'sweetalert2'
import 'animate.css';
import useCarts from "../../Hooks/useCarts";

const Products = () => {
    const [products, productPending] = UseLoadP();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
    const [selectedColor, setSelectedColor] = useState("");
    let {user} = useAuth();
    let axiosPrivate = useAxiosPrivate();
    let [,, refetch] = useCarts();

    useEffect(() => {
        if (!productPending) {
            let filtered = products;

            // Filter by search query
            if (searchQuery) {
                filtered = filtered.filter(product =>
                    product.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            // Filter by category
            if (selectedCategory) {
                filtered = filtered.filter(product => product.category === selectedCategory);
            }

            // Filter by price range
            filtered = filtered.filter(
                product =>
                    product.price >= priceRange.min &&
                    product.price <= priceRange.max
            );

            // Filter by color
            if (selectedColor) {
                filtered = filtered.filter(product => product.color === selectedColor);
            }

            setFilteredProducts(filtered);
        }
    }, [products, searchQuery, selectedCategory, priceRange, selectedColor, productPending]);

    if (productPending) {
        return <p>Loading products...</p>;
    }

    const handleAddtoCart =async (id)=>{
        let cart = {
            productId: id,
            email:user?.email
        }
        let res = await axiosPrivate.post('/api/add-to-cart', cart);
        if(res.data.result){
            refetch();
            Swal.fire({
                title: "Product added successfully",
                showClass: {
                  popup: `
                    animate__animated
                    animate__fadeInUp
                    animate__faster
                  `
                },
                hideClass: {
                  popup: `
                    animate__animated
                    animate__fadeOutDown
                    animate__faster
                  `
                }
              });


        }else{
            Swal.fire({
                title: "Product already exist in carts",
                showClass: {
                  popup: `
                    animate__animated
                    animate__fadeInUp
                    animate__faster
                  `
                },
                hideClass: {
                  popup: `
                    animate__animated
                    animate__fadeOutDown
                    animate__faster
                  `
                }
              });
              refetch();
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Left Side: Filters */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Filters</h2>

                    {/* Search by Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="search">
                            Search by Name
                        </label>
                        <input
                            id="search"
                            type="text"
                            placeholder="Enter product name"
                            className="w-full p-2 border rounded"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Filter by Category */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="category">
                            Filter by Category
                        </label>
                        <select
                            id="category"
                            className="w-full p-2 border rounded"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="electronics">Electronics</option>
                            <option value="fashion">Fashion</option>
                            <option value="home_appliances">Home Appliances</option>
                            <option value="beauty">Beauty</option>
                            <option value="sports">Sports</option>
                        </select>
                    </div>

                    {/* Filter by Price Range */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="price-range">
                            Filter by Price
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                className="w-1/2 p-2 border rounded"
                                onChange={(e) =>
                                    setPriceRange((prev) => ({
                                        ...prev,
                                        min: e.target.value ? parseFloat(e.target.value) : 0,
                                    }))
                                }
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                className="w-1/2 p-2 border rounded"
                                onChange={(e) =>
                                    setPriceRange((prev) => ({
                                        ...prev,
                                        max: e.target.value
                                            ? parseFloat(e.target.value)
                                            : Infinity,
                                    }))
                                }
                            />
                        </div>
                    </div>

                    {/* Filter by Color */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="color">
                            Filter by Color
                        </label>
                        <select
                            id="color"
                            className="w-full p-2 border rounded"
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                        >
                            <option value="">All Colors</option>
                            <option value="red">Red</option>
                            <option value="blue">Blue</option>
                            <option value="green">Green</option>
                            <option value="black">Black</option>
                            <option value="white">White</option>
                        </select>
                    </div>
                </div>

                {/* Right Side: Products */}
                <div className="col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="card bg-base-100 w-full shadow-xl"
                                >
                                    <figure className="px-10 pt-10">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="rounded-xl w-full h-48 object-cover"
                                        />
                                    </figure>
                                    <div className="card-body items-center text-center">
                                        <h2 className="card-title text-lg font-semibold">
                                            {product.name}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            Color: {product.color}
                                        </p>
                                        <p className="text-sm font-bold text-gray-800">
                                            Price: ${product.price}
                                        </p>
                                        <div className="card-actions flex justify-center gap-2 mt-4">
                                            <button className="btn btn-primary">
                                                View Details
                                            </button>
                                            <button onClick={()=>handleAddtoCart(product.id)} className="btn btn-secondary">
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center col-span-3">
                                No products match the selected filters.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
