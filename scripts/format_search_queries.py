#!/usr/bin/env python3

import csv
import sys
import json

result = []
with open(sys.argv[1]) as f:
    reader = csv.reader(f, dialect='excel-tab')

    for row in reader:
        if len(row[0]) > 3:
            result.append({"queryText": row[0], "searchCount": row[1]})

print(json.dumps(result))