import csv
import json
from collections import defaultdict

input_file = "guests.csv"
output_file = "guests.json"

tables = defaultdict(list)

with open(input_file, "r", encoding="utf-8-sig", newline="") as f:
    reader = csv.reader(f)

    for row in reader:
        if len(row) < 2:
            continue

        name = row[0].strip()
        table = row[1].strip()

        if not name or not table:
            continue

        # Skip header row if there is one
        if name.lower() in ["name", "guest", "guest name"] or table.lower() in ["table", "table number"]:
            continue

        tables[table].append(name)

result = []

special_order = {
    "R": 31,
    "U": 32,
    "D": 33,
    "O": 34
}

def table_sort_key(table):
    if table.isdigit():
        return int(table)

    return special_order.get(table, 999)

for table in sorted(tables.keys(), key=table_sort_key):
    guests = sorted(
        tables[table],
        key=lambda name: (name.split()[-1].lower(), name.split()[0].lower())
    )

    result.append({
        "table": f"Table {table}",
        "guests": guests
    })

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(result, f, indent=4)

print(f"Created {output_file}")