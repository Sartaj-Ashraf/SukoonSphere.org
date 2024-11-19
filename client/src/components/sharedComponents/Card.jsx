import React from 'react';
import LinkButton from './Buttons/LinkButton'; // Assuming LinkButton is a component for the button
import PropTypes from 'prop-types';

const Card = ({ icon: Icon, headingHelper, title, content, buttonLabel }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-72 p-4">
            <div className="flex items-center mb-4">
                {Icon && <Icon className="text-3xl text-gray-600" />}
            </div>
            <p className="text-gray-500 text-sm mb-1">{headingHelper}</p>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 mb-4">{content}</p>
            <div>
                <LinkButton to="#" variant="primary" size="medium" className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition">
                    {buttonLabel} <span className="ml-2">→</span>
                </LinkButton>
            </div>
        </div>
    );
};

Card.propTypes = {
    icon: PropTypes.elementType,
    headingHelper: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    buttonLabel: PropTypes.string.isRequired,
};

Card.defaultProps = {
    icon: null,
};

export default Card;
