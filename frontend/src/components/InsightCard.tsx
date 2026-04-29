import "./styles/section-page-layout.css";

type InsightCardProps = {
    label: string;
    value: string | number;
};

function InsightCard({ label, value }: InsightCardProps) {
    return (
        <div className="section-insight-card">
            <span className="section-insight-label">{label}</span>
            <strong className="section-insight-value">{value}</strong>
        </div>
    );
}

export default InsightCard;