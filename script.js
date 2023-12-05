let videosData = {};
let currentCategoryId = null;
let sortByViews = false;

const handleCategory = async () => {
    const response = await fetch(
        "https://openapi.programming-hero.com/api/videos/categories"
    );
    const data = await response.json();
    const btnContainer = document.getElementById("btn-container");

    data.data.forEach((category) => {
        const div = document.createElement("div");
        div.innerHTML = `<button onclick="handleLoadVideos('${category.category_id}')" class="btn btn-xs hover:bg-[#FF1F3D] hover:text-white sm:btn-sm md:btn-md lg:btn-lg">${category.category}</button>`;

        btnContainer.appendChild(div);
    });

    if (data.data.length > 0) {
        handleLoadVideos(data.data[0].category_id);
    }

    const sortButton = document.querySelector(".sort-button");
    sortButton.addEventListener("click", toggleSortByViews);
};

const toggleSortByViews = () => {
    sortByViews = !sortByViews;
    renderVideos();
};

const handleLoadVideos = async (categoryId) => {
    const response = await fetch(
        `https://openapi.programming-hero.com/api/videos/category/${categoryId}`
    );
    const data = await response.json();

    videosData[categoryId] = data.data || [];
    currentCategoryId = categoryId;

    renderVideos();
};

const renderVideos = () => {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";

    const currentCategoryVideos = videosData[currentCategoryId];

    if (sortByViews) {
        currentCategoryVideos.sort((a, b) => {
            const viewCountA = parseFloat(a.others.views.replace("K", ""));
            const viewCountB = parseFloat(b.others.views.replace("K", ""));
            return viewCountB - viewCountA;
        });
    }

    if (currentCategoryVideos.length === 0) {
        const noDataContainer = document.getElementById("video-container");
        noDataContainer.style.display = "block";
    } else {
        const noDataContainer = document.getElementById("video-container");
        noDataContainer.style.display = "none";
    }

    currentCategoryVideos.forEach((videos) => {
        const div = document.createElement("div");
        div.className = "card w-[18rem] glass";

        div.innerHTML = `
            <figure><img class="w-[420px] h-48" src="${videos?.thumbnail}"/></figure>
            <div class="card-body flex flex-row">
                <div class="avatar align-middle">
                    <div class="w-14 h-14 rounded-full">
                        <img src="${videos.authors[0].profile_picture}"/>
                    </div>
                </div>
                <p class="font-bold text-base">${videos?.title}</p>
            </div>
            <div class="flex flex-row gap-4 px-8">
                <p>${videos.authors[0].profile_name}</p>
                ${
                    videos.authors[0].verified
                        ? '<img class="w-5 h-5" src="./images/badge.png" alt="Verified Badge">'
                        : ''
                }
            </div>
            <p class="px-8 mb-10">Views: ${videos.others.views}</p>
        `;

        cardContainer.appendChild(div);
    });
};

handleCategory();
