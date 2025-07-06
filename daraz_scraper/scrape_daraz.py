import requests
from bs4 import BeautifulSoup
from fake_useragent import UserAgent
import random
import datetime
import json

# Fake reviewer data generator
def generate_review():
    reviewers = [
        ("Alice Smith", "alice.smith@x.dummyjson.com"),
        ("John Doe", "john.doe@x.dummyjson.com"),
        ("Emily Johnson", "emily.johnson@x.dummyjson.com"),
        ("Nicholas Bailey", "nicholas.bailey@x.dummyjson.com"),
    ]
    names = random.choice(reviewers)
    return {
        "rating": random.randint(1, 5),
        "comment": random.choice(["Very satisfied!", "Poor quality!", "Would buy again!"]),
        "date": datetime.datetime.utcnow().isoformat(),
        "reviewerName": names[0],
        "reviewerEmail": names[1]
    }

# Scrape function
def scrape_daraz(query):
    url = f"https://www.daraz.pk/catalog/?q={query.replace(' ', '+')}"
    headers = {
        "User-Agent": UserAgent().random
    }

    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, "html.parser")
    items = []

    for item in soup.select("div[data-qa-locator='product-item']")[:10]:  # limit to first 10 results
        title = item.select_one("div.title--wFj93").text.strip() if item.select_one("div.title--wFj93") else "Unknown Product"
        price = item.select_one(".price--NVB62").text.strip().replace("Rs.", "").replace(",", "") if item.select_one(".price--NVB62") else "0"
        img = item.select_one("img")["src"] if item.select_one("img") else ""
        rating = random.randint(1, 5)
        barcode = str(random.randint(1000000000000, 9999999999999))

        product = {
            "item": title,
            "rating": rating,
            "comment": generate_review()["comment"],
            "date": datetime.datetime.utcnow().isoformat(),
            "reviewerName": generate_review()["reviewerName"],
            "reviewerEmail": generate_review()["reviewerEmail"],
            "returnPolicy": "7 days return policy",
            "minimumOrderQuantity": random.choice([1, 5, 10, 20]),
            "meta": {
                "createdAt": datetime.datetime.utcnow().isoformat(),
                "updatedAt": datetime.datetime.utcnow().isoformat(),
                "barcode": barcode,
                "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
            },
            "images": [img],
            "thumbnail": img
        }

        items.append(product)

    return items

# Example
query = "laptop"
products = scrape_daraz(query)

# Print formatted
print(json.dumps(products, indent=2)) 