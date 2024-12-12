import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";
export const userFollowingLoader = async ({ params }) => {
    try {
        const { data } = await customFetch.get(`/user/following/${params.id}`);
        return data;
    } catch (error) {
        console.error("Error fetching following:", error);
        toast.error(error.response?.data?.msg || "Error fetching following");
        return { success: false, following: [] };
    }
};