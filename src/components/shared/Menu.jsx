import Image from "next/image";
import Link from "next/link";
import {
    FaHome,
    FaUtensils,
    FaFire,
    FaLeaf,
    FaDrumstickBite,
    FaPhoneAlt,
    FaChevronDown,
    FaMotorcycle,
} from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { CATEGORIES } from "@/constant/product";

const Menu = ({ isMenuOpen, setIsMenuOpen, isDropdownOpen, setIsDropdownOpen }) => {
    return (
        <div className={`menu-bars ${isMenuOpen ? "active" : ""}`}>
            <div className="drawer-header">
                <div className="drawer-logo">
                    <Link href="/" onClick={() => setIsMenuOpen(false)}>
                        <Image src="/logo.png" alt="Your's Kitchen" width={504} height={197} />
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

                    <li className={`has-dropdown ${isDropdownOpen ? "open" : ""}`}>
                        <button
                            type="button"
                            className="nav-link dropdown-toggle-btn"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsDropdownOpen(!isDropdownOpen);
                            }}
                        >
                            <FaUtensils className="nav-icon" />
                            <span>Menu</span>
                            <FaChevronDown className="arrow-icon" />
                        </button>
                        <div className="dropdown-menu">
                            {CATEGORIES.slice(0, 7).map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={cat.href}
                                    className="dropdown-item"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span>{cat.title}</span>
                                </Link>
                            ))}
                        </div>
                    </li>

                    <li>
                        <Link href="/menu/todays-special" className="nav-link special-link" onClick={() => setIsMenuOpen(false)}>
                            <FaFire className="nav-icon fire-icon" />
                            <span>Today's Special</span>
                            <span className="badge-hot">HOT</span>
                        </Link>
                    </li>

                    <li>
                        <Link href="/menu/veg" className="nav-link veg-link" onClick={() => setIsMenuOpen(false)}>
                            <FaLeaf className="nav-icon veg-icon" />
                            <span>Veg Foods</span>
                        </Link>
                    </li>

                    <li>
                        <Link href="/menu/non-veg" className="nav-link non-veg-link" onClick={() => setIsMenuOpen(false)}>
                            <FaDrumstickBite className="nav-icon non-veg-icon" />
                            <span>Non-Veg Foods</span>
                        </Link>
                    </li>

                    <li>
                        <Link href="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                            <FaPhoneAlt className="nav-icon" />
                            <span>Contact</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Menu;