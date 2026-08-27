import Image from "next/image";
import Link from "next/link";
import {
    FaHome,
    FaUtensils,
    FaFire,
    FaLeaf,
    FaPercent,
    FaPhoneAlt,
    FaChevronDown,
} from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { CATEGORIES } from "@/constant/product";

const Menu = ({ isMenuOpen, setIsMenuOpen, isDropdownOpen, setIsDropdownOpen }) => {
    return (
        <div className={`menu-bars ${isMenuOpen ? "active" : ""}`}>
            <div className="drawer-header">
                <div className="drawer-logo">
                    <Link href="/" onClick={() => setIsMenuOpen(false)}>
                        <Image src="/logo.png" alt="Shree Shyam Fast Food" width={504} height={197} />
                    </Link>
                </div>
                <button
                    className="drawer-close-btn"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close Navigation"
                >
                    <FiX />
                </button>
            </div>

            <nav className="nav-menu">
                <ul>
                    <li>
                        <Link href="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                            <FaHome className="nav-icon" />
                            <span>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/#categories" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                            <FaUtensils className="nav-icon" />
                            <span>Items</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/#popular-foods" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                            <FaFire className="nav-icon" />
                            <span>Dishes</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/track-order" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                            <FaMotorcycle className="nav-icon" />
                            <span>Track Order</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Menu;