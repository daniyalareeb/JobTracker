from fastapi import APIRouter, Query
from database import get_db

router = APIRouter()

POPULAR = [
    {"id": "google", "name": "Google", "domain": "google.com"},
    {"id": "meta", "name": "Meta", "domain": "meta.com"},
    {"id": "apple", "name": "Apple", "domain": "apple.com"},
    {"id": "microsoft", "name": "Microsoft", "domain": "microsoft.com"},
    {"id": "amazon", "name": "Amazon", "domain": "amazon.com"},
    {"id": "netflix", "name": "Netflix", "domain": "netflix.com"},
    {"id": "tesla", "name": "Tesla", "domain": "tesla.com"},
    {"id": "openai", "name": "OpenAI", "domain": "openai.com"},
    {"id": "anthropic", "name": "Anthropic", "domain": "anthropic.com"},
    {"id": "stripe", "name": "Stripe", "domain": "stripe.com"},
    {"id": "shopify", "name": "Shopify", "domain": "shopify.com"},
    {"id": "airbnb", "name": "Airbnb", "domain": "airbnb.com"},
    {"id": "uber", "name": "Uber", "domain": "uber.com"},
    {"id": "lyft", "name": "Lyft", "domain": "lyft.com"},
    {"id": "linkedin", "name": "LinkedIn", "domain": "linkedin.com"},
    {"id": "salesforce", "name": "Salesforce", "domain": "salesforce.com"},
    {"id": "adobe", "name": "Adobe", "domain": "adobe.com"},
    {"id": "nvidia", "name": "NVIDIA", "domain": "nvidia.com"},
    {"id": "intel", "name": "Intel", "domain": "intel.com"},
    {"id": "ibm", "name": "IBM", "domain": "ibm.com"},
    {"id": "oracle", "name": "Oracle", "domain": "oracle.com"},
    {"id": "spotify", "name": "Spotify", "domain": "spotify.com"},
    {"id": "slack", "name": "Slack", "domain": "slack.com"},
    {"id": "dropbox", "name": "Dropbox", "domain": "dropbox.com"},
    {"id": "zoom", "name": "Zoom", "domain": "zoom.us"},
    {"id": "coinbase", "name": "Coinbase", "domain": "coinbase.com"},
    {"id": "palantir", "name": "Palantir", "domain": "palantir.com"},
    {"id": "bytedance", "name": "ByteDance", "domain": "bytedance.com"},
    {"id": "tiktok", "name": "TikTok", "domain": "tiktok.com"},
    {"id": "figma", "name": "Figma", "domain": "figma.com"},
    {"id": "notion", "name": "Notion", "domain": "notion.so"},
    {"id": "github", "name": "GitHub", "domain": "github.com"},
    {"id": "atlassian", "name": "Atlassian", "domain": "atlassian.com"},
    {"id": "twilio", "name": "Twilio", "domain": "twilio.com"},
    {"id": "mongodb", "name": "MongoDB", "domain": "mongodb.com"},
    {"id": "databricks", "name": "Databricks", "domain": "databricks.com"},
    {"id": "snowflake", "name": "Snowflake", "domain": "snowflake.com"},
    {"id": "cloudflare", "name": "Cloudflare", "domain": "cloudflare.com"},
    {"id": "hubspot", "name": "HubSpot", "domain": "hubspot.com"},
    {"id": "doordash", "name": "DoorDash", "domain": "doordash.com"},
    {"id": "instacart", "name": "Instacart", "domain": "instacart.com"},
    {"id": "robinhood", "name": "Robinhood", "domain": "robinhood.com"},
    {"id": "discord", "name": "Discord", "domain": "discord.com"},
    {"id": "reddit", "name": "Reddit", "domain": "reddit.com"},
    {"id": "pinterest", "name": "Pinterest", "domain": "pinterest.com"},
    {"id": "snap", "name": "Snap", "domain": "snap.com"},
    {"id": "paypal", "name": "PayPal", "domain": "paypal.com"},
    {"id": "samsung", "name": "Samsung", "domain": "samsung.com"},
    {"id": "qualcomm", "name": "Qualcomm", "domain": "qualcomm.com"},
    {"id": "amd", "name": "AMD", "domain": "amd.com"},
    {"id": "deloitte", "name": "Deloitte", "domain": "deloitte.com"},
    {"id": "mckinsey", "name": "McKinsey", "domain": "mckinsey.com"},
    {"id": "pwc", "name": "PwC", "domain": "pwc.com"},
    {"id": "accenture", "name": "Accenture", "domain": "accenture.com"},
    {"id": "twitch", "name": "Twitch", "domain": "twitch.tv"},
    {"id": "roblox", "name": "Roblox", "domain": "roblox.com"},
    {"id": "epic-games", "name": "Epic Games", "domain": "epicgames.com"},
    {"id": "riot-games", "name": "Riot Games", "domain": "riotgames.com"},
    {"id": "square", "name": "Square", "domain": "squareup.com"},
    {"id": "arm", "name": "Arm", "domain": "arm.com"},
    {"id": "vercel", "name": "Vercel", "domain": "vercel.com"},
    {"id": "linear", "name": "Linear", "domain": "linear.app"},
    {"id": "airtable", "name": "Airtable", "domain": "airtable.com"},
    {"id": "asana", "name": "Asana", "domain": "asana.com"},
]


def _logo(domain: str) -> str:
    return f"https://logo.clearbit.com/{domain}"


@router.get("/companies/search")
def search_companies(q: str = Query(..., min_length=1)):
    q_lower = q.lower()

    db = get_db()
    try:
        result = (
            db.table("companies")
            .select("id, name, logo_url")
            .ilike("name", f"%{q}%")
            .limit(10)
            .execute()
        )
        db_results = result.data or []
    except Exception:
        db_results = []

    seen_ids = {c["id"] for c in db_results}
    suggestions = [
        {"id": c["id"], "name": c["name"], "logo_url": c["logo_url"] or _logo(f"{c['id']}.com")}
        for c in db_results
    ]

    for p in POPULAR:
        if q_lower in p["name"].lower() and p["id"] not in seen_ids:
            suggestions.append({"id": p["id"], "name": p["name"], "logo_url": _logo(p["domain"])})
            seen_ids.add(p["id"])

    return suggestions[:8]
