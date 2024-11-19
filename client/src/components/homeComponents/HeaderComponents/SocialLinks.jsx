import { SectionWrapper } from '@/assets/styles/HomeLayout';
import { FaTwitter, FaFacebook, FaLinkedin, FaRss, FaSearch, FaPhone } from 'react-icons/fa';
const SocialLinks = () => (
    <div className='w-full bg-black bg-opacity-60z'>
        <SectionWrapper>
            <div className="hidden lg:flex justify-between items-center ">
                <div className='hidden lg:flex justify-between items-center space-x-4 py-3'>
                    <a href="https://twitter.com/scholarlykitchn" target="_blank" rel="noopener noreferrer" className="text-[var(--light)] hover:text-gray-400">
                        <FaTwitter />
                    </a>
                    <a href="https://www.facebook.com/SocietyforScholarlyPublishing" target="_blank" rel="noopener noreferrer" className="text-[var(--light)] hover:text-gray-400">
                        <FaFacebook />
                    </a>
                    <a href="https://www.linkedin.com/company/10215117" target="_blank" rel="noopener noreferrer" className="text-[var(--light)] hover:text-gray-400">
                        <FaLinkedin />
                    </a>
                </div>
                <div className='flex items-center space-x-4'>
                    {/* <input
                        autoFocus='true'
                        type="text"
                        placeholder='Search anything...'
                        className="bg-transparent border-l-2 border-l-neutral-500 pl-2 text-white placeholder-grey focus:outline-none"
                        style={{ width: "10rem" }}
                    />
                    <FaSearch className="ml-2 text-[var(--heaven)]" /> */}
                    <FaPhone className="ml-2 text-[var(--heaven)]" />
                    <h1 className='text-base text-white'>+91 7889780598</h1>

                </div>
            </div>
        </SectionWrapper>
    </div >
);
export default SocialLinks