import { useNavigate } from "react-router-dom";
import axios from "axios";
import FilmCard from "./FilmCard";
import FilmSlider from "./FilmSlider";
import React, { useState, useEffect } from "react";

const ListFilm = ({
  category,
  limit,
  apiURL,
  page,
  onPageChange,
  DOMAIN_API,
}) => {
  const [filmList, setFilmList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    if (category) {
      const fetchData = async () => {
        console.log("Fetching data from URL:", apiURL);
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(apiURL);
          if (
            response.data &&
            response.data.data &&
            Array.isArray(response.data.data.items)
          ) {
            setFilmList(response.data.data.items);
            setTotalPages(
              Math.ceil(
                response.data.data.params.pagination.totalItems /
                  response.data.data.params.pagination.totalItemsPerPage
              ) || 1
            );
          } else {
            setFilmList([]);
            setError("Unexpected data format");
          }
        } catch (error) {
          setError("Error fetching data");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [apiURL, page, limit, category]);

  const goToPage = (pageNumber) => {
    onPageChange(pageNumber);
  };

  const handleFilmClick = (film) => {
    navigate(`/film/${film.slug}`);
  };

  const getPageNumbers = () => {
    let arr = [];

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (page === 1) {
      return [1, 2, 3, "...", totalPages];
    } else if (page >= totalPages) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    } else if (page <= totalPages / 2) {
      return [page - 1, page, page + 1, "...", totalPages];
    } else if (page > totalPages / 2) {
      return [1, "...", page - 1, page, page + 1];
    }
    return arr;
  };

  const fetchCategories = async () => {
    setLoading(true);
    const categories = [
      { name: "newReleases", url: `${DOMAIN_API}/v1/api/danh-sach/phim-moi` },
      { name: "movies", url: `${DOMAIN_API}/v1/api/danh-sach/phim-le` },
      { name: "series", url: `${DOMAIN_API}/v1/api/danh-sach/phim-bo` },
      { name: "animation", url: `${DOMAIN_API}/v1/api/danh-sach/hoat-hinh` },
      {
        name: "dubbed",
        url: `${DOMAIN_API}/v1/api/danh-sach/phim-thuyet-minh`,
      },
    ];

    try {
      const responses = await Promise.all(
        categories.map((category) => axios.get(category.url))
      );

      const filmsData = responses.reduce((acc, response, index) => {
        const categoryName = categories[index].name;
        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data.items)
        ) {
          acc[categoryName] = response.data.data.items;
        } else {
          acc[categoryName] = [];
        }
        return acc;
      }, {});

      setFilmList(filmsData);
      setLoading(false);
      setError(null);
    } catch (error) {
      setError("Error fetching data");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!category) {
      fetchCategories();
    }
  }, [DOMAIN_API, category]);

  const renderSlider = (title, films) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <FilmSlider films={films.slice(0, 15)} DOMAIN_API={DOMAIN_API} />
    </div>
  );

  const categories = [
    { name: "Phim Mới Cập Nhật", value: "newReleases" },
    { name: "Phim Lẻ", value: "movies" },
    { name: "Phim Bộ", value: "series" },
    { name: "Hoạt Hình", value: "animation" },
    { name: "Phim Thuyết Minh", value: "dubbed" },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!category) {
    return (
      <div className="bg-[#121111]">
        <br />
        <br />
        {renderSlider("Phim Mới Cập Nhật", filmList.newReleases)}
        {renderSlider("Phim Lẻ", filmList.movies)}
        {renderSlider("Phim Bộ", filmList.series)}
        {renderSlider("Hoạt Hình", filmList.animation)}
        {renderSlider("Phim Thuyết Minh", filmList.dubbed)}
      </div>
    );
  }

  return (
    <div className="bg-[#121111]">
      <br />
      <br />
      <h1 className="font-bold text-center text-zinc-50 text-4xl font-semibold ">
        {category}
      </h1>
      <br />
      <div className="flex justify-center border-solid-[#dba902]">
        <button
          className="flex-1 border-solid cursor-pointer p-3.5 m-6 rounded-md font-bold bg-gray-800 text-white "
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Trang Trước
        </button>
        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            disabled={pageNumber === "..."}
            onClick={() => {
              if (pageNumber !== "...") {
                goToPage(pageNumber);
              }
            }}
            className={
              "flex-1 border-solid cursor-pointer p-3.5 m-6 rounded-md font-bold " +
              (pageNumber === page
                ? "bg-[#dba902] text-black"
                : "bg-gray-800 text-white hidden md:block")
            }
          >
            {pageNumber}
          </button>
        ))}
        <button
          className="flex-1 border-solid cursor-pointer p-3.5 m-6 rounded-md font-bold bg-gray-800 text-white"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Trang Sau
        </button>
      </div>
      <div className="border-2 border-double border-amber-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.isArray(filmList) &&
            filmList.map((film) => (
              <FilmCard
                key={film._id}
                film={film}
                DOMAIN_API={DOMAIN_API}
                onClick={() => handleFilmClick(film)}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ListFilm;
