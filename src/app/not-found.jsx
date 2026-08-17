import React from "react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="inner-wrapper not-found-wrapper">
            <div className="container">
                <div className="not-found-content">
                    <div className="error-code">
                        <span className="digit-green">4</span>
                        <span className="digit-red">0</span>
                        <span className="digit-green">4</span>
                    </div>

                    <h1 className="error-title">WE’RE SORRY PAGE NOT FOUND</h1>

                    <Link href="/" className="back-home-btn">
                        <span>BACK TO HOME</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
