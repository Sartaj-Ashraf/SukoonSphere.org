import { FilterQuizByCatagory, HeaderImg, QuizIntro, QuizList } from '@/components'
import React from 'react'
import bgImg from '../../assets/images/bg_podcast.jpg'
import { Quizzes } from '@/utils/Quizzes';
import { useLoaderData } from "react-router-dom";



// export const AllQuizzesLoader = async ({ request }) => {
//     const url = new URL(request.url);
//     const searchParams = Object.fromEntries(url.searchParams.entries());

//     const {
//         category: selectedCategory = "",
//     } = searchParams;
//     let filteredQuizzes = JSON.parse(JSON.stringify(Quizzes[0].quizCategories));
//     if (selectedCategory) {
//         filteredQuizzes = filteredQuizzes.filter((category) =>
//             category.category.toLowerCase().includes(selectedCategory.toLowerCase())
//         );
//     }
//     const allCategories = Quizzes[0].quizCategories.map(category => category.category);
//     return { data: filteredQuizzes, allCategories };
// };
function AllQuizzes() {
    const { data: quizCategories, allCategories } = useLoaderData();
    return (
        <>
            {/* <HeaderImg currentPage="All Quizzes" bgImg={bgImg} /> */}
            <div className='max-w-7xl mx-auto p-4 space-y-4 '>
                <QuizIntro title={"Quizzes"} description={"A quiz can't tell you everything you need to know about yourself, but it can help provide insight into some of your personality traits, behaviors, and how you view and respond to the world around you. If you're curious about a particular aspect of your personality or something that's going on in your life and relationships, try out one of our quizzes below to find out more about what your thoughts and feelings may say about you."} />
                <FilterQuizByCatagory categories={quizCategories} />
                <QuizList quizCategories={quizCategories} />
            </div>
        </>
    )
}

export default AllQuizzes
