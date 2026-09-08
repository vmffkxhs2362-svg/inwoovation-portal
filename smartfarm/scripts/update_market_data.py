import json
from datetime import datetime, timezone, timedelta
import os

def update_market_data():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    hub_dir = os.path.abspath(os.path.join(script_dir, ".."))
    target_file = os.path.join(hub_dir, "data", "global_prices.json")

    if not os.path.exists(target_file):
        print(f"❌ Target file not found: {target_file}")
        return

    with open(target_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    now_utc = datetime.now(timezone.utc)
    data["last_updated"] = now_utc.strftime("%Y-%m-%d %H:%M:%S UTC")

    for m_key, m_val in data.get("markets", {}).items():
        for d_key, d_val in m_val.get("datasets", {}).items():
            trend_data = d_val.get("data", [])
            num_days = len(trend_data)
            for i in range(num_days):
                date_str = (now_utc - timedelta(days=num_days-1-i)).strftime("%Y-%m-%d")
                trend_data[i]["date"] = date_str

    with open(target_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    print(f"✅ Successfully updated global_prices.json last_updated to {data['last_updated']}")

if __name__ == "__main__":
    update_market_data()
