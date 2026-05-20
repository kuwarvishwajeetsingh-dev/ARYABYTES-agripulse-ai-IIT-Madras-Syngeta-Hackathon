from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

from pydantic import BaseModel

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# LOAD DATASETS
retailers_df = pd.read_csv("../datasets/retailers.csv")
sales_df = pd.read_csv("../datasets/retailer_pos.csv")
inventory_df = pd.read_csv("../datasets/retailer_inventory_weekly.csv")


@app.get("/")
def home():
    return {"message": "Agri AI Backend Running"}


# NORMAL RETAILERS API
@app.get("/retailers")
def get_retailers():

    df = pd.read_csv("../datasets/retailers.csv")

    return df.head(20).to_dict(orient="records")


@app.get("/priority-retailers")
def get_priority_retailers():

    sales_df = pd.read_csv("../datasets/retailer_pos.csv")
    inventory_df = pd.read_csv("../datasets/retailer_inventory_weekly.csv")

    # Total sales per retailer
    sales_summary = sales_df.groupby("retailer_id").agg({
        "sku_qty": "sum",
        "sku_price": "sum"
    }).reset_index()

    sales_summary.columns = [
        "retailer_id",
        "total_quantity",
        "total_sales"
    ]

    # Inventory summary
    inventory_summary = inventory_df.groupby("retailer_id").agg({
        "sku_qty": "sum"
    }).reset_index()

    inventory_summary.columns = [
        "retailer_id",
        "inventory_stock"
    ]

    # Merge datasets
    merged = pd.merge(
        sales_summary,
        inventory_summary,
        on="retailer_id"
    )

    # AI Priority Score
    merged["priority_score"] = (
        merged["total_sales"] / (merged["inventory_stock"] + 1)
    )

    # Sort highest priority
    merged = merged.sort_values(
        by="priority_score",
        ascending=False
    )

    # Add risk label
    merged["priority_level"] = merged["priority_score"].apply(
        lambda x: "HIGH" if x > 5000 else "MEDIUM"
    )

    return merged.head(20).to_dict(orient="records")
@app.get("/weather-risk")
def weather_risk():

    weather_df = pd.read_csv("../datasets/agri weather dataset.csv")

    high_risk = weather_df[
        (weather_df["rainfall_mm"] > 200) |
        (weather_df["humidity_percent"] > 80)
    ]

    result = high_risk.groupby("district").agg({
        "rainfall_mm": "mean",
        "temperature_c": "mean",
        "humidity_percent": "mean"
    }).reset_index()

    return result.head(10).to_dict(orient="records")
@app.get("/sales-prediction")
def sales_prediction():

    predictions = []

    base_sales = 520

    for week in range(1, 11):

        predicted = base_sales + (week * 15)

        predictions.append({
            "future_week": week,
            "predicted_sales": predicted
        })

    return predictions
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str


@app.post("/chatbot")
def chatbot(request: ChatRequest):

    msg = request.message.lower()

    # WEATHER AI
    if (
        "rainfall" in msg
        or "weather" in msg
        or "humidity" in msg
    ):

        return {
            "reply":
            "AI Analysis: High rainfall and humidity risk detected in Nashik, Patna, and Jalgaon districts."
        }

    # FUNGICIDE AI
    elif (
        "fungicide" in msg
        or "crop disease" in msg
        or "monsoon" in msg
    ):

        return {
            "reply":
            "AI Recommendation: Increase fungicide inventory and monitor crop leaf infections during monsoon season."
        }

    # SALES AI
    elif (
        "sales" in msg
        or "forecast" in msg
        or "prediction" in msg
    ):

        return {
            "reply":
            "AI Forecast: Agricultural chemical sales may increase by 18% over the next quarter."
        }

    # RETAILER AI
    elif (
        "retailer" in msg
        or "inventory" in msg
        or "stock" in msg
    ):

        return {
            "reply":
            "AI Retail Insight: Several retailers show low inventory with increasing demand patterns."
        }

    # DEFAULT AI
    else:

        return {
            "reply":
            "Agri AI Assistant processed your agricultural query successfully."
        }