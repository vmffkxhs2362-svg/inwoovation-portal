import json
import os
import urllib.request

# Assuming script is run from project root: python scripts/mine_agtech_data.py
CROPS_DIR = "data/crops"
os.makedirs(CROPS_DIR, exist_ok=True)

def fetch_wiki_image(title):
    url = f"https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles={title}&pithumbsize=800"
    req = urllib.request.Request(url, headers={'User-Agent': 'AgriAtlasBot/1.0'})
    try:
        res = urllib.request.urlopen(req)
        data = json.loads(res.read())
        pages = data['query']['pages']
        return next(iter(pages.values()))['thumbnail']['source']
    except Exception as e:
        print(f"Failed to fetch image for {title}: {e}")
        return ""

def mine_strawberry_data():
    print("Mining Strawberry AgTech Data from Big 6 Nations...")
    
    # Simulate data aggregation from WUR, RDA (Korea), etc.
    img_url = fetch_wiki_image("Strawberry")
    
    strawberry_data = {
        "id": "strawberry",
        "title": "Strawberry (Fragaria × ananassa)",
        "image_url": img_url,
        "image_caption": "Greenhouse Strawberry Cultivation",
        "description": "Precision climate control and fertigation strategies for winter and day-neutral strawberries.",
        "overview": "Strawberries are high-value soft fruits that require meticulous climate control to prevent fungal diseases (like Botrytis) and ensure optimal fruit set. Unlike tomatoes, strawberries prefer much cooler temperatures and have different photoperiod requirements (Short-day vs Day-neutral).",
        "climate_strategy": [
            {
                "region": "South Korea (RDA Smart Farm)",
                "strategy": "Dominates the winter market (Dec-Apr) using single-span plastic houses. Heating is minimal, relying on multi-layer thermal screens. The primary challenge is extreme humidity at night, requiring precision dehumidification or morning heating bursts to prevent Botrytis cinerea.",
                "tech_level": "Medium (Multi-layer thermal screens, forced-air heaters)"
            },
            {
                "region": "The Netherlands (WUR)",
                "strategy": "Year-round production in high-tech glasshouses using supplemental LED lighting (Red/Blue/Far-Red spectrums). Precise VPD control ensures calcium transport to the fruit, preventing tip-burn on leaves and calyx.",
                "tech_level": "High (LEDs, active dehumidification, elevated gutters)"
            }
        ],
        "crop_steering": {
            "intro": "Strawberry steering focuses heavily on balancing the crown size (vegetative) with truss development (generative) using temperature strategies.",
            "vegetative_triggers": {
                "temperature_dif": "Higher average daily temperature (ADT), Warmer nights (12-14°C)",
                "vpd_target": "0.4 - 0.6 kPa (Encourages rapid leaf expansion)",
                "irrigation": "Frequent, lower EC (1.2 mS/cm) to build plant volume"
            },
            "generative_triggers": {
                "temperature_dif": "Strong DIF. Cool nights (8-10°C) to induce flowering",
                "vpd_target": "0.8 - 1.0 kPa (Enhances transpiration and calcium uptake)",
                "irrigation": "Higher EC (1.8 - 2.0 mS/cm) to improve fruit flavor (Brix)"
            }
        },
        "fertigation": {
            "intro": "Strawberries are extremely sensitive to salinity (high EC) compared to tomatoes.",
            "vegetative_phase": "Balanced N-P-K. Target EC: 1.2 mS/cm. Keep ammonium levels low to prevent pH drops in the substrate.",
            "generative_phase": "Increase Potassium (K) and Calcium (Ca) for fruit firmness. Target EC: 1.5 - 1.8 mS/cm. Maintain high drainage fraction (30%+) to prevent salt accumulation."
        }
    }
    
    out_path = os.path.join(CROPS_DIR, "strawberry.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(strawberry_data, f, indent=4, ensure_ascii=False)
        
    print(f"Successfully generated {out_path}")

if __name__ == "__main__":
    mine_strawberry_data()
