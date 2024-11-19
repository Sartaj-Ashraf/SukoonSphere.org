import React from 'react';

const Button = ({
    type = 'button',
    children,
    onClick,
    disabled = false,
    className = '',
    variant = 'primary',
    size = 'medium',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded focus:outline-none transition ease-in-out duration-150';

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700',
        success: 'bg-green-600 text-white hover:bg-green-700',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
        info: 'bg-teal-600 text-white hover:bg-teal-700',
    };

    const sizes = {
        small: 'px-3 py-1 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-6 py-3 text-lg',
    };

    const finalClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${finalClassName} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;


// UseCases
//  <Button onClick={ handleClick } variant = "primary" size = "medium" > Primary Button </ Button>
//  <Button onClick={handleClick} variant="danger" size="large" className="ml-4"> Danger Button </Button>
{/* <Button onClick={handleClick} variant="success" size="small" disabled className="ml-4">Disabled Button</Button> */ }
