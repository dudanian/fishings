from bs4 import BeautifulSoup
import os
import json
import requests


URL = "https://animalcrossing.fandom.com/wiki/Fish_(New_Horizons)#Northern%20Hemisphere"


def filename(name):
    return name.lower().replace(' ', '_').replace('-', '_') + '.png'

def get_text(elem):
    return elem.get_text().strip()

def get_int(elem):
    return int(elem.get_text().strip())

def get_link(elem):
    return elem.a['href']

def get_months(elems):
    months = []
    for elem in elems:
        text = get_text(elem)
        if text == "✓":
            months.append(True)
        elif text == "-":
            months.append(False)
        else:
            raise Exception("not valid month")
    if len(months) != 12:
        raise Exception("not enough months")

    return months

def get_fish(elems):
    return {
        'name': get_text(elems[0]),
        'image': get_link(elems[1]),
        'price': get_int(elems[2]),
        'location': get_text(elems[3]),
        'season': get_text(elems[4]),
        'time': get_text(elems[5]),
        'months': get_months(elems[6:]),
    }


curdir = os.path.dirname(__file__)
pubdir = os.path.join(curdir, '..', 'public')
imgdir = os.path.join(pubdir, 'images')
os.makedirs(imgdir, exist_ok=True)

page = requests.get(URL)
soup = BeautifulSoup(page.text, 'html.parser')
tables = soup.find_all("div" ,class_="tabbertab")

data = {}
for table in tables:
    title = table['title']
    
    fishes = []
    # ignore first 2 entries
    for tr in table.find_all('tr')[2:]:
        fish = get_fish(tr.find_all('td'))

        imgname = filename(fish['name'])
        imgpath = os.path.join(imgdir, imgname)
        if not os.path.exists(imgpath):
            img = requests.get(fish['image'])
            with open(imgpath, 'wb') as outfile:
                outfile.write(img.content)

        fish['image'] = imgname
        fishes.append(fish)

    data[table['title']] = fishes

jsonpath = os.path.join(pubdir, 'fish.json')
with open(jsonpath, 'w') as outfile:
    json.dump(data, outfile, separators=(',', ':'))