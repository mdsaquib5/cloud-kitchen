"use client";

import React from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

const Profile = () => {
    return (
        <div className="inner-wrapper" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
            <div className="container" style={{ textAlign: "center" }}>
                <h1 style={{ fontSize: "2rem", marginBottom: "20px", color: "#111827" }}>My Profile</h1>
                <p style={{ color: "#4b5563", marginBottom: "30px", fontSize: "1.1rem" }}>
                    Welcome to your profile! Order history and account details will be displayed here soon.
                </p>
                
                <Link href="/foods" style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#f01543",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: "500"
                }}>
                    <FiArrowLeft /> Back to Menu
                </Link>
            </div>
        </div>
    );
};

export default Profile;
