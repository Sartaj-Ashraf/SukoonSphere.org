import React from 'react'
import { OurTeam } from '..'
import img_2 from "../../assets/images/About-usPage-img.png";
import { Link } from 'react-router-dom';
import { AiOutlineArrowRight } from "react-icons/ai";
import { FaLongArrowAltRight } from 'react-icons/fa';
function AboutUs() {
    const points = [
        { text: "We offer a personalized approach to mental health and wellness, recognizing that there’s no one-size-fits-all solution." },
        { text: "Our platform supports you in all aspects of life, from managing mental health conditions to everyday stress and relationships." },
        { text: "We provide engaging content on psychology theories, designed to help you grow and show up as your best self." },
        { text: " We stay up-to-date with the latest research and mental health trends, offering clear and actionable guidance." },
        { text: "Our content is reviewed by a team of experts, licensed therapists, and board-certified psychiatrists to ensure reliability." },
        { text: "We acknowledge that research alone cannot cover the full spectrum of mental health experiences." },
        { text: "Societal and cultural awareness is at the forefront of our approach to mental health conversations." },
        { text: " We commit to continuous learning and amplifying diverse voices to fill gaps in understanding and representation." },

    ]
    return (
        <>
            <div className="bg-[--body] md:px-4  flex flex-col items-center text-center " data-aos="fade" data-aos-duration="1500">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-around py-4 space-y-8 md:space-y-0">
                    {/* Left Window Image */}
                    <div className="hidden md:block w-full md:w-1/3">
                        <img
                            src="https://cdn.prod.website-files.com/626fcecbc824dd1c670451ba/62a805699c927d7302e20348_abt-window-leaves-right.png"
                            alt="Window Image loading..."
                            className="mx-auto"
                        />
                    </div>
                    {/* Text Content */}
                    <div className="w-full lg:w-1/2 px-4 flex flex-col items-center">
                        <h2 className="text-4xl font-bold text-[var(--grey--900)]  mb-4 text-[1.6rem] md:text-[3.5rem] sm:text-[3.5rem] sm:leading-[3.5rem]">
                            A Safe Place to Nurture Your Mind.
                        </h2>
                        <p className="text-lg text-[--grey--800] mb-8">
                            Our mission is to offer a safe, nurturing space where individuals can explore their mental health and find the support they need to grow.

                        </p>
                        <Link to={"/contact-us"} className="btn-1">
                            Contact Us
                            <FaLongArrowAltRight className='ml-2 size-5' />
                        </Link>
                    </div>
                </div>
                <div className='max-w-4xl flex flex-col md:flex-row md:space-y-0 my-4 md:my-24 gap-6 px-4 '>
                    <div className="w-full md:w-1/2 space-y-2 " data-aos="fade-up" >
                        <h2 className='font-bold text-[var(--grey--900)] text-[1.6rem] sm:text-[2.5rem] lg:text-[3.5rem] md:leading-[3.5rem]'>What we do? </h2>
                        <hr />
                        <p className='text-[var(--grey--800)] text-justify lg:text-center text-sm md:text-base'>We provide a safe space for individuals to access mental health resources, join supportive communities, and connect with professional guidance.</p>
                    </div>
                    <div className="w-full md:w-1/2 space-y-2" data-aos="fade-up" data-aos-delay="500">
                        <h2 className='font-bold text-[var(--grey--900)] text-[1.6rem] sm:text-[2.5rem] lg:text-[3.5rem] md:leading-[3.5rem]'>Why we do it?</h2>
                        <hr />
                        <p className='text-[var(--grey--800)] text-justify lg:text-center text-sm md:text-base'> Mental health is as essential as physical health, yet it often goes unnoticed. We believe everyone deserves to prioritize their well-being and feel supported on their journey.</p>
                    </div>

                </div>

                <div className=' max-w-7xl mx-auto px-4 md:px-0 bg-[--primary] text-white  rounded-[20px]' data-aos="fade-up">
                    <div className="flex flex-col md:flex-row items-center justify-between md:space-y-0 md:space-x-8">
                        <div className="md:w-1/2 md:space-y-6 md:px-4 py-8" data-aos="fade-up">
                            <div className="bg-[var(--grey--900)] text-[--gray-700] text-[12px] sm:text-sm inline-flex items-center py-2 px-3 rounded-full mb-4 glossy-effect-bar">
                                <span className="bg-[#01427a] text-white rounded-full w-4 h-4 flex items-center justify-center mr-2">N</span>
                                <Link to={"https://www.nhm.gov.in/index1.php?lang=1&level=2&sublinkid=1043&lid=359"} target='_blank' className='hover:text-[var(--ternery)]'>
                                    NMHP: National Mental Health Programme
                                </Link>
                            </div>
                            <h2 className=" font-extrabold text-[1.6rem] md:text-[2.5rem] lg:text-[3.5rem] sm:leading-[4rem]" data-aos="fade-up">Creating Spaces for Healing and Growth.</h2>
                            <p className="text-lg font-light mb-4 text-[var(--grey--600)] text-justify lg:text-center" >
                                Our mission is to create safe and supportive environments where individuals can heal, grow, and thrive mentally and emotionally.
                            </p>
                            <hr />
                        </div>

                        <div className="md:w-1/2 flex flex-col justify-start items-start p-12 m-4" data-aos="fade-left" data-aos-duration="1500">
                            <div
                                className="w-full h-16 bg-contain bg-center flex justify-center items-center sm:h-[30rem]"
                            >
                                <img src={img_2} alt="" />
                            </div>
                        </div>

                    </div>
                    <div className='md:px-6 py-8 text-left mt-2' data-aos="fade-up">
                        <h2 className="text-[1.6rem] md:text-[2.5rem] lg:text-[3rem] sm:leading-[4rem] font-bold mb-4 text-[var(--white-color)]" data-aos="fade-up">Our mission is to help you prioritize your mental health and find balance.</h2>
                        <ol className="text-[var(--grey--600)] text-left space-y-4 text-base" data-aos="fade-up" data-aos-duration="1500">
                            {points.map((point) => {
                                return (
                                    <li key={point.text.split('').slice(0, 5)} className='flex gap-2 items-center '>
                                        <AiOutlineArrowRight /> {point.text}
                                    </li>
                                )
                            })}



                        </ol>

                    </div>
                </div>
            </div>
            <div>
                <div className='max-w-7xl mx-auto '>

                </div>
                <OurTeam></OurTeam>
            </div>
        </>
    )
}
export default AboutUs
