import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";
export const userFollowersLoader = async ({ params }) => {

    try {
        const { data } = await customFetch.get(`/user/followers/${params.id}`);
        return data;
    } catch (error) {
        console.error("Error fetching followers:", error);
        toast.error(error.response?.data?.msg || "Error fetching followers");
        return { success: false, followers: [] };
    }
};