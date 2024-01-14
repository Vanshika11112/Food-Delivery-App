import React, { useEffect, useRef, useState } from "react";
import Cards from "../../components/Cards";
import {} from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";
const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const contentRef = useRef(null);

  const handleButtonClick = () => {
    // Scroll down to the content using the ref
    contentRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // loading data
  useEffect(() => {
    //fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:6001/menu");
        // const response = await fetch("/menu.json");
        const data = await response.json();
        // console.log(data);
        setMenu(data);
        setFilteredItems(data);
        setCurrentPage(1);
      } catch (error) {
        console.log("Error Fetching Data", error);
      }
    };
    // CAll The Function
    fetchData();
  }, []);

  //  Filtering Data Based On Category
  const filterItem = (category) => {
    const filtered =
      category === "all"
        ? menu
        : menu.filter((item) => item.category === category);
    setFilteredItems(filtered);
    setSelectedCategory(category);
  };
  // Show All Data
  const showAll = () => {
    setFilteredItems(menu);
    setSelectedCategory("all");
    setCurrentPage(1);
  };

  // sorting based on A-Z and Z-A , Low-High Pricing
  const handleSortChange = (option) => {
    setSortOption(option);
    let sortedItems = [...filteredItems];

    // logic
    switch (option) {
      case "A-Z":
        sortedItems.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Z-A":
        sortedItems.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "low-to-high":
        sortedItems.sort((a, b) => a.price - b.price);
        break;
      case "high-to-low":
        sortedItems.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    setFilteredItems(sortedItems);
    setCurrentPage(1);
  };

  //  Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div>
      <div className="section-container bg-gradient-to-r from-[#FAFAFA] from-0% to-[#FCFCFC] to-100%">
        <div className="py-48 flex flex-col  justify-center items-center gap-8">
          {/* Texts */}
          <div className="text-center space-y-7 px-4">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
              For The Love Of Delicious
              <span className="text-green"> Food</span>
            </h2>
            <p className="text-xl md:w-4/5 mx-auto text-[#4A4A4A]">
              Come With Family & feel the joy of mouthwatering food as Indian
              Food , Chinese Food and more for a moderate Cost
            </p>
            <button
              onClick={handleButtonClick}
              className="btn bg-green rounded-full px-8 py-3 font-semibold text-white"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
      {/* Menu Shop Section */}
      <div className="section-container">
        {/* Filtering And Sorting  */}
        <div
          ref={contentRef}
          className="flex flex-col md:flex-row flex-wrap md:justify-between items-center space-y-3 mb-8"
        >
          {/* all category button */}
          <div className="flex flex-row justify-start md:items-center md:gap-8  gap-4">
            <button
              onClick={showAll}
              className={selectedCategory == "all" ? "active" : ""}
            >
              All
            </button>
            <button
              onClick={() => filterItem("salad")}
              className={selectedCategory == "salad" ? "active" : ""}
            >
              Salad
            </button>
            <button
              onClick={() => filterItem("pizza")}
              className={selectedCategory == "pizza" ? "active" : ""}
            >
              Pizza
            </button>
            <button
              onClick={() => filterItem("soup")}
              className={selectedCategory == "soup" ? "active" : ""}
            >
              Soups
            </button>
            <button
              onClick={() => filterItem("dessert")}
              className={selectedCategory == "dessert" ? "active" : ""}
            >
              Desserts
            </button>
            <button
              onClick={() => filterItem("drinks")}
              className={selectedCategory == "drinks" ? "active" : ""}
            >
              Drinks
            </button>
          </div>
          {/* Sorting base  Filtering */}
          <div className="flex justify-end mb-4 rounded-sm">
            <div className="bg-black p-2">
              <FaFilter className="h-4 w-4 text-white" />
            </div>
            {/* Sorting Options */}
            <select
              name="sort"
              id="sort"
              onChange={(e) => handleSortChange(e.target.value)}
              value={sortOption}
              className="bg-black text-white px-2 py-1"
            >
              <option value="default">Default</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
              <option value="low-to-high">Low To High</option>
              <option value="high-to-low">High To Low</option>
            </select>
          </div>
        </div>
        {/* Product Card */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 ">
          {currentItems.map((item) => (
            <Cards key={item._id} item={item} />
          ))}
        </div>
      </div>
      {/* Pagination Section */}
      <div className="flex justify-center my-8">
        {Array.from({
          length: Math.ceil(filteredItems.length / itemsPerPage),
        }).map((_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-3 py-1 rounded-full ${
              currentPage == index + 1 ? "bg-green text-white" : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Menu;
