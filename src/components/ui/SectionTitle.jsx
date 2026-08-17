import React from "react";

const SectionTitle = ({ subtitle, title, description, align = "center" }) => {
    return (
        <div className={`section-title-wrap text-${align}`}>
            {subtitle && <span className="section-subtitle">{subtitle}</span>}
            <h2 className="section-main-title">
                <span className="title-dash">—</span> {title} <span className="title-dash">—</span>
            </h2>
            {description && <p className="section-description">{description}</p>}
        </div>
    );
};

export default SectionTitle;
