import React from 'react'

function SectionTitle({ title }) {
    return (
        <div className="max-w-7xl mx-auto px-4 flex items-center py-6 lg:py-14 ">
            <h3 className="text-lg font-normal uppercase text-[var(--primary)]" style={{ fontFamily: "Luxurious Roman", fontWeight: 400, fontStyle: 'normal' }}>
                {title}
            </h3>
            <div className="flex-grow h-0.5 bg-[var(--sec-color)] ml-4"></div>
        </div>
    )
}

export default SectionTitle
