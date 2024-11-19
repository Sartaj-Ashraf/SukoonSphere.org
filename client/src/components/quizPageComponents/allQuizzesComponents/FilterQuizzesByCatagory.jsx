import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { RxReset } from 'react-icons/rx';
import { Form, Link, useLoaderData } from 'react-router-dom';

function FilterQuizzesByCategory() {
    const { allCategories } = useLoaderData();

    return (
        <div className="py-4 max-w-4xl ">
            <Form className="grid gap-6 grid-cols-1 md:grid-cols-3 items-center">
                <div className="flex flex-col justify-center">
                    <select
                        name="category"
                        id="category"
                        className="bg-transparent border-b-2 border-[var(--primary)] rounded-lg p-2 focus:border-[var(--secondary)] focus:outline-none focus:ring-0"
                    >
                        <option value="" disabled selected>
                            Filter by a category
                        </option>
                        {allCategories.map((tag) => (
                            <option key={tag} value={tag} className='text-[var(--primary)]'>
                                {tag}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex  md:flex-row gap-4 md:col-span-2 size-2 items-start">
                    <button
                        type="submit"
                        className=" btn btn-outline btn-[red] btn-sm"
                    >
                        <FaSearch className="text-[var(--primary)] text-6 hover:text-[var(--ternery)] size-5" />
                    </button>
                    <Link
                        to="/all-quizzes"
                        className="  btn btn-outline btn-[red] btn-sm"
                    >
                        <RxReset className="font-extrabold text-[var(--primary)] text-6 hover:text-[var(--ternery)] size-6" />
                    </Link>
                </div>
            </Form>
        </div>
    );
}

export default FilterQuizzesByCategory;
