# -*- coding: utf-8 -*-
from bs4 import BeautifulSoup
import os
import json
import requests
from collections import OrderedDict


FISH_URL = "https://animalcrossing.fandom.com/wiki/Fish_(New_Horizons)"
BUGS_URL = "https://animalcrossing.fandom.com/wiki/Bugs_(New_Horizons)"
CREATURES_URL = "https://animalcrossing.fandom.com/wiki/Deep-sea_creatures_(New_Horizons)"

## helper functions
def format_time(raw_time):
    # time got really complicated to parse
    return raw_time

def format_name(name):
    return name.lower().replace(' ', '_').replace('-', '_')

def get_text(elem):
    return elem.get_text().strip()

def get_int(elem):
    return int(get_text(elem).replace(",", ""))

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
    entry = {
        'name': get_text(elems[0]).title(),
        'image': get_link(elems[1]),
        'price': get_int(elems[2]),
        'location': get_text(elems[3]),
        'shadow': get_text(elems[4]),
        'time': format_time(get_text(elems[5])),
        'months': get_months(elems[6:]),
    }

    # XXX not sure if this is right
    # but I don't want to include 'River (Clifftop) Pond'
    if entry['location'] == 'River (Clifftop) Pond':
        entry['location'] = 'River (Clifftop)'

    return entry

def get_bug(elems):
    entry = {
        'name': get_text(elems[0]).title(),
        'image': get_link(elems[1]),
        'price': get_int(elems[2]),
        'location': get_text(elems[3]),
        'time': format_time(get_text(elems[4])),
        'months': get_months(elems[5:]),
    }
    return entry

def get_creature(elems):
    entry = {
        'name': get_text(elems[0]).title(),
        'image': get_link(elems[1]),
        'price': get_int(elems[2]),
        'shadow': get_text(elems[3]),
        'pattern': get_text(elems[4]),
        'time': format_time(get_text(elems[5])),
        'months': get_months(elems[6:]),
    }
    return entry

## filepaths
curdir = os.path.dirname(__file__)
pubdir = os.path.join(curdir, '..', 'public')
imgdir = os.path.join(pubdir, 'images')
os.makedirs(imgdir, exist_ok=True)

## parse tables
def get_entries(url, getter):
    page = requests.get(url)
    soup = BeautifulSoup(page.text, 'html.parser')
    tables = soup.find_all("div" ,class_="wds-tab__content")

    assert len(tables) == 2

    data = OrderedDict()

    for i, table in enumerate(tables):
        hemisphere = "Northern" if i == 0 else "Southern"

        for tr in table.find_all('tr'):
            elems = tr.find_all('td')
            entry = None
            try:
                entry = getter(elems)
            except:
                # ignore errors, probably just an empty row
                continue
            
            name = format_name(entry['name'])

            # insert (or join)
            months = entry['months']
            if not name in data:
                data[name] = entry
                entry['months'] = {}
            data[name]['months'][hemisphere] = months

            # download image if necessary
            imgpath = os.path.join(imgdir, name+'.png')
            if not os.path.exists(imgpath):
                img = requests.get(entry['image'])
                with open(imgpath, 'wb') as outfile:
                    outfile.write(img.content)
            entry['image'] = name

    return data

def write_json(data, filename):
    jsonpath = os.path.join(pubdir, filename)
    with open(jsonpath, 'w') as outfile:
        json.dump(list(data.values()), outfile, separators=(',', ':'))

write_json(get_entries(FISH_URL, get_fish), 'fish.json')
write_json(get_entries(BUGS_URL, get_bug), 'bugs.json')
write_json(get_entries(CREATURES_URL, get_creature), 'creatures.json')
