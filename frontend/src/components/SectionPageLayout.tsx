import "./styles/section-page-layout.css";
import type { ReactNode } from "react";

type SectionPageLayoutProps = {
    eyebrow: string;
    title: string;
    description: string;
    actions?: ReactNode;
    insights?: ReactNode;
    children: ReactNode;
    pageClassName?: string;
};

function SectionPageLayout({
    eyebrow,
    title,
    description,
    actions,
    insights,
    children,
    pageClassName = "",
}: SectionPageLayoutProps) {
    return (
        <main className={`section-page ${pageClassName}`.trim()}>
            <section className="section-page-hero">
                <div className="section-page-hero-text">
                    <p className="section-page-eyebrow">{eyebrow}</p>
                    <h1 className="section-page-title">{title}</h1>
                    <p className="section-page-description">{description}</p>
                </div>

                {actions && (
                    <div className="section-page-actions">
                        {actions}
                    </div>
                )}
            </section>

            {insights && (
                <section className="section-page-insights">
                    {insights}
                </section>
            )}

            {children}
        </main>
    );
}

export default SectionPageLayout;