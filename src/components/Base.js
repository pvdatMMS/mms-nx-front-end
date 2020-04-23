import React from 'react';
import Header from './Header';
import Footer from './Footer';
const Base = ({ children }) => {
    return (
        <>
            <Header />
            {
                children
            }
            <Footer />
        </>
    )
}
export default Base;