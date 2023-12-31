// RestaurantsList.jsx
import React, { useState, useEffect } from "react";
import RestaurantsListDisplay from "./fragments/RestaurantListDisplay";
import * as RestaurantsListFunctions from "./fragments/RestaurantListFunction";
import { useParams, useSearchParams } from "react-router-dom";

const RestaurantsList = (props) => {
	const { page } = useParams();
	const [restaurants, setRestaurants] = useState([]);
	const [searchName, setSearchName] = useState("");
	const [searchZip, setSearchZip] = useState("");
	const [searchCuisine, setSearchCuisine] = useState("");
	const [cuisines, setCuisines] = useState(["All Cuisines"]);
	const [currentPage, setCurrentPage] = useState(0);
	const [maxPage, setMaxPage] = useState(null);
	const pageParam = searchParams.get(page);
	const searchParams = useSearchParams();
	const minPage = 0;
	console.log(page);
	useEffect(() => {
		RestaurantsListFunctions.retrieveRestaurants(
			page,
			setRestaurants,
			setMaxPage
		);
		RestaurantsListFunctions.retrieveCuisines(setCuisines);
	}, [page]);

	const findByName = () => {
		RestaurantsListFunctions.findByName(
			searchName,
			currentPage,
			setRestaurants,
			setMaxPage
		);
	};

	const findByZip = () => {
		RestaurantsListFunctions.findByZip(
			searchZip,
			currentPage,
			setRestaurants,
			setMaxPage
		);
	};

	const findByCuisine = () => {
		RestaurantsListFunctions.findByCuisine(
			searchCuisine,
			currentPage,
			setRestaurants,
			setMaxPage
		);
	};

	const nextPage = () => {
		RestaurantsListFunctions.nextPage(currentPage, maxPage, setCurrentPage);
	};

	const previousPage = () => {
		RestaurantsListFunctions.previousPage(currentPage, minPage, setCurrentPage);
	};

	return (
		<RestaurantsListDisplay
			setSearchParams={setSearchParams}
			restaurants={restaurants}
			currentPage={currentPage}
			previousPage={previousPage}
			nextPage={nextPage}
			cuisines={cuisines}
			onChangeSearchName={(e) =>
				RestaurantsListFunctions.onChangeSearchName(e, setSearchName)
			}
			onChangeSearchZip={(e) =>
				RestaurantsListFunctions.onChangeSearchZip(e, setSearchZip)
			}
			onChangeSearchCuisine={(e) =>
				RestaurantsListFunctions.onChangeSearchCuisine(e, setSearchCuisine)
			}
			searchName={searchName}
			searchZip={searchZip}
			searchCuisine={searchCuisine}
			findByName={findByName}
			findByZip={findByZip}
			findByCuisine={findByCuisine}
		/>
	);
};

export default RestaurantsList;
