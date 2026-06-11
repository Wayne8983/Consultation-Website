import FeaturedInsight from "../Insights/FeaturedInsight";
import InsightsGrid from "../Insights/InsightsGrid";
import InsightsHero from "../Insights/InsightsHero";
import Newsletter from "../Insights/Newsletter";


const Insights = () => {
  return (
    <main className="bg-[#0b0b10] overflow-hidden">
      <InsightsHero />
      <FeaturedInsight />
      <InsightsGrid />
      <Newsletter />
    </main>
  );
};

export default Insights;