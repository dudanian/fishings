# -*- coding: utf-8 -*-
from bs4 import BeautifulSoup
import os
import json
import requests
from collections import OrderedDict


FISH_URL = "https://animalcrossing.fandom.com/wiki/Fish_(New_Horizons)"
BUGS_URL = "https://animalcrossing.fandom.com/wiki/Bugs_(New_Horizons)"

## helper functions
def format_time(time):
    def int_val(time):
        return int(''.join(filter(str.isdigit, time)))

    def pm_offset(time):
        return 12 if 'pm' in time.lower() else 0

    if '-' in time:
        return tuple([int_val(x)+pm_offset(x) for x in time.split('-')])
    else:
        # all day
        return (0, 24)

def format_name(name):
    return name.lower().replace(' ', '_').replace('-', '_')

def get_text(elem):
    def deduplicate_spaces(text):
        return ' '.join(text.split())

    return deduplicate_spaces(elem.get_text(strip=True))

def get_int(elem):
    return int(get_text(elem))

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

    if entry['location'] == 'Sea(while raining)':
        entry['location'] = 'Sea (Raining)'

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

## filepaths
curdir = os.path.dirname(__file__)
pubdir = os.path.join(curdir, '..', 'public')
imgdir = os.path.join(pubdir, 'images')
os.makedirs(imgdir, exist_ok=True)

## parse tables
def get_entries(url):
    page = requests.get(url)
    soup = BeautifulSoup(page.text, 'html.parser')
    tables = soup.find_all("div" ,class_="tabbertab")

    data = OrderedDict()

    for table in tables:
        hemisphere = table['title'].split()[0]

        for tr in table.find_all('tr'):
            elems = tr.find_all('td')
            entry = None
            if len(elems) == 18:
                entry = get_fish(elems)
            elif len(elems) == 17:
                entry = get_bug(elems)
            else:
                # ignore other rows
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

write_json(get_entries(FISH_URL), 'fish.json')
write_json(get_entries(BUGS_URL), 'bugs.json')
