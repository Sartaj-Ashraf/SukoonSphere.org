import { FaHome } from "react-icons/fa";

export const adminNavLinks = [
    {
        name: "Home",
        address: "/admin/home",
        icon: FaHome,
    },
    {
        name: "Articles & Resources",
        address: '',
        // icon: <MdArticle />,
        sublinks: [
            {
                name: "Articles",
                address: '/admin/articles',
            },

        ],
    },
    {
        name: 'Debates & Discussions',
        address: "",
        // icon: <BsChatDots />,
        sublinks: [
            // {
            //     name: "QA-Section",
            //     address: "QA-Section",
            //     description: "Question and answer forum",
            //     // icon: <BiQuestionMark />,
            // },
            {
                name: "Stories",
                address: '/admin/view-all-posts',
                // icon: <BsChatDots />,
            },
        ],
    },
    // {
    //     name: 'Media Libraries',
    //     address: "",
    //     // icon: <MdVideoLibrary />,
    //     description: "Audio-visual resources",
    //     sublinks: [
    //         {
    //             name: "Podcasts",
    //             address: "podcast/playlists",
    //             description: "Audio-based discussions",
    //             // icon: <GiPodium />,
    //         },
    //         {
    //             name: "Videos",
    //             address: 'media/all-videos',
    //             description: "Visual media content",
    //             // icon: <MdVideoLibrary />,
    //         },
    //     ],
    // },
    // {
    //     name: 'Contact & Help',
    //     address: "",
    //     // icon: <AiOutlineMail />,
    //     description: "Get support or learn more",
    //     sublinks: [
    //         {
    //             name: "Contact Us",
    //             address: "contact-us",
    //             description: "Get in touch with support",
    //             // icon: <AiOutlineMail />,
    //         },
    //         {
    //             name: "About Us",
    //             address: 'about-us',
    //             description: "Learn about our mission",
    //             // icon: <AiOutlineInfoCircle />,
    //         },
    //         {
    //             name: "Mental Health",
    //             address: 'about/mental-health',
    //             description: "Mental health resources",
    //             // icon: <FaBrain />,
    //         },
    //         {
    //             name: "Our Review Board",
    //             address: '/about/our-team',
    //             description: "Meet our expert team",
    //             // icon: <FiUsers />,
    //         },
    //     ],
    // },
];
