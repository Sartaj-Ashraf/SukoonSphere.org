import { videos } from "@/utils/Vidoes/AllVidoes";

export const AllVideosLoader = async ({ request }) => {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    const {
        search = "",
        category: selectedCategory = "",
    } = searchParams;

    let filteredVideos = [...videos]

    if (search) {
        filteredVideos = filteredVideos.filter((video) =>
            video.title.toLowerCase().includes(search.toLowerCase() || video.category.toLowerCase().includes(search.toLowerCase()))
        );
    }

    if (selectedCategory) {
        filteredVideos = filteredVideos.filter((video) =>
            video.category.includes(selectedCategory)
        );
    }
    const allTags = videos.flatMap((video) => video.category);
    const category = Array.from(new Set(allTags));

    return { data: filteredVideos, category };
};
