// Home.js
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils'; // Assuming utils.js is in the parent directory
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css';
import './Profile.js';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
        fetchProducts();
    }, []);

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    const handleBid = (productId, currentBid) => {
        const bidAmount = prompt('Enter your bid amount:');
        if (bidAmount && parseFloat(bidAmount) > currentBid) {
            // Implement bidding logic here (e.g., send a request to the backend)
            handleSuccess(`Bid of $${bidAmount} placed for product ${productId}`);
            // You'd typically update the product's bid on the backend and refetch the data.
        } else {
            handleError('Invalid bid amount.');
        }
    };

    const fetchProducts = async () => {
        try {
            const url = "https://deploy-mern-app-1-api.vercel.app/products"; // Replace with your API URL
            const token = localStorage.getItem('token');

            const response = await fetch(url, {
                headers: {
                    'Authorization': token,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                handleError(errorData.message || 'Failed to fetch products');
                return;
            }

            const result = await response.json();
            setProducts(result);
        } catch (err) {
            handleError(err.message || 'An error occurred');
        }
    };

    return (
        <div className="auction-page">
            <nav className="auction-nav">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/profile" className="nav-link">Profile</Link>
                <Link to="/my-bids" className="nav-link">My Bids</Link>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </nav>
            <header className="auction-header">
                <h1>Welcome to the Auction, {loggedInUser}!</h1>
            </header>
            <div className="auction-items">
                {products &&
                    products.map((item, index) => (
                        <div key={index} className="auction-item">
                            <img src={item.imageUrl} alt={item.name} className="item-image" />
                            <h3>{item.name}</h3>
                            <p>Current Bid: ${item.price}</p>
                            <button onClick={() => handleBid(item._id, item.price)}>Bid Now</button>
                        </div>
                    ))}
            </div>
            <ToastContainer />
        </div>
    );
}

export default Home;