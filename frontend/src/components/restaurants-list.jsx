import { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link, useSearchParams } from "react-router-dom";

const RestaurantsList = (props) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [restaurants, setRestaurants] = useState([]);
	const [searchName, setSearchName] = useState("");
	const [searchZip, setSearchZip] = useState("");
	const [searchCuisine, setSearchCuisine] = useState("");
	const [cuisines, setCuisines] = useState(["All Cuisines"]);
	const [maxPage, setMaxPage] = useState(null);

	useEffect(() => {
		const query = searchParams.get("query") || "";
		const by = searchParams.get("by") || "name";
		const page = searchParams.get("page") || 0;

		// Update the state based on URL parameters
		if (by === "name") {
			setSearchName(query);
		}
		if (by === "zipcode") {
			setSearchZip(query);
		}
		if (by === "cuisine") {
			setSearchCuisine(query);
		}
		find(query, by, page);
		retrieveCuisines();
	}, [searchParams]);

	const retrieveRestaurants = (page) => {
		RestaurantDataService.getAll(page)
			.then((response) => {
				console.log(response.data);
				console.log(response.data.total_results);

				setRestaurants(response.data.restaurants);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const retrieveCuisines = () => {
		RestaurantDataService.getCuisines()
			.then((response) => {
				// console.log(response.data);
				setCuisines(["All Cuisines"].concat(response.data));
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const refreshList = () => {
		retrieveRestaurants();
		setSearchParams({});
	};

	const find = (query, by, page) => {
		RestaurantDataService.find(query, by, page)
			.then((response) => {
				console.log(response.data);
				setRestaurants(response.data.restaurants);
				setMaxPage(Math.ceil(response.data.total_results / 21));
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const findAndUpdateSearchParams = (
		searchValue,
		byValue,
		pageValue,
		setParamsFunction
	) => {
		setParamsFunction({ query: searchValue, by: byValue, page: pageValue });
		// const updatedSearchParams = new URLSearchParams({
		// 	query: searchValue,
		// 	by: byValue,
		// 	page: pageValue,
		// });

		// const query = updatedSearchParams.get("query") || "";
		// const by = updatedSearchParams.get("by") || "name";
		// const page = updatedSearchParams.get("page") || 0;

		// find(query, by, page);
	};

	const findByName = () => {
		findAndUpdateSearchParams(searchName, "name", 0, setSearchParams);
	};

	const findByZip = () => {
		findAndUpdateSearchParams(searchZip, "zipcode", 0, setSearchParams);
	};

	const findByCuisine = () => {
		if (searchCuisine === "All Cuisines") {
			refreshList();
		} else {
			findAndUpdateSearchParams(searchCuisine, "cuisine", 0, setSearchParams);
		}
	};

	const nextPage = () => {
		const query = searchParams.get("query") || "";
		const by = searchParams.get("by") || "name";
		let page = parseInt(searchParams.get("page")) || 0;

		if (maxPage === null || (page <= maxPage - 2 && maxPage !== null)) {
			page = page + 1;
			console.log("page" + page);
		}

		findAndUpdateSearchParams(query, by, page, setSearchParams);
	};

	const previousPage = () => {
		const query = searchParams.get("query") || "";
		const by = searchParams.get("by") || "name";
		let page = parseInt(searchParams.get("page")) || 0;
		if (page > 0) {
			page = page - 1;
			console.log("page" + page);
		}
		findAndUpdateSearchParams(query, by, page, setSearchParams);
	};
	const onChangeSearchName = (e) => {
		const searchName = e.target.value;
		setSearchName(searchName);
	};

	const onChangeSearchZip = (e) => {
		const searchZip = e.target.value;
		setSearchZip(searchZip);
	};

	const onChangeSearchCuisine = (e) => {
		const searchCuisine = e.target.value;
		setSearchCuisine(searchCuisine);
	};

	return (
		<div>
			<div className="row pb-1" display="flex">
				<div className="col-md-4">
					<div className="input-group">
						<input
							type="text"
							className="form-control"
							placeholder="Search by name"
							value={searchName}
							onChange={onChangeSearchName}
						/>
						<div className="input-group-append">
							<button
								className="btn btn-outline-secondary"
								type="button"
								onClick={findByName}
							>
								Search
							</button>
						</div>
					</div>
				</div>
				<div className="col-md-4">
					<div className="input-group">
						<input
							type="text"
							className="form-control"
							placeholder="Search by zip"
							value={searchZip}
							onChange={onChangeSearchZip}
						/>
						<div className="input-group-append">
							<button
								className="btn btn-outline-secondary"
								type="button"
								onClick={findByZip}
							>
								Search
							</button>
						</div>
					</div>
				</div>
				<div className="col-md-4">
					<div className="input-group">
						<select onChange={onChangeSearchCuisine}>
							{cuisines.map((cuisine) => {
								return (
									<option key={cuisine} value={cuisine}>
										{" "}
										{cuisine.substr(0, 20)}{" "}
									</option>
								);
							})}
						</select>
						<div className="input-group-append">
							<button
								className="btn btn-outline-secondary"
								type="button"
								onClick={findByCuisine}
							>
								Search
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				{restaurants.map((restaurant) => {
					const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`;
					return (
						<div key={restaurant._id} className="col-lg-4 pb-1">
							<div className="card">
								<div className="card-body">
									<h5 className="card-title">{restaurant.name}</h5>
									<p className="card-text">
										<strong>Cuisine: </strong>
										{restaurant.cuisine}
										<br />
										<strong>Address: </strong>
										{address}
									</p>
									<div className="row">
										<Link
											to={"/restaurants/" + restaurant._id}
											className="btn btn-primary col-lg-5 mx-1 mb-1"
										>
											View Reviews
										</Link>
										<a
											target="_blank"
											rel="noreferrer"
											href={"https://www.google.com/maps/place/" + address}
											className="btn btn-primary col-lg-5 mx-1 mb-1"
										>
											View Map
										</a>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
			<nav aria-label="Page navigation example">
				<ul className="pagination">
					<li className="page-item">
						<a className="page-link" onClick={previousPage}>
							Previous
						</a>
					</li>
					<li className="page-item">
						<a className="page-link">{searchParams.get("page") || 0}</a>
					</li>
					<li className="page-item">
						<a className="page-link" onClick={nextPage}>
							Next
						</a>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default RestaurantsList;
