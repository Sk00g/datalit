import json
import os
import sys

"""
Run this script to automatically generate an 'assetConfig.js' file in the public/assets/ folder, based on the data contained therein
"""

# ------------
VERSION = "V1.02.190503"
CONFIG_FILE = "assetConfig.js"
IMAGE_MAP_FILE = "imageMap.js"
THEME_MAP_FILE = "themeMap.js"
BASE_DIR = "assets"
IMAGE_DIR = "images"
THEME_DIR = "themes"
# ------------


os.chdir(sys.argv[1])
print('> running asset_loader (%s)' % '.'.join(VERSION.split('.')[:-1]))
print('> working from %s' % os.getcwd())

with open(CONFIG_FILE, 'w+') as config_file:
    config_data = {
        'baseDir': BASE_DIR,
        'imageDir': IMAGE_DIR,
        'imagePaths': [],
        'imageCount': 0,
        'themeDir': THEME_DIR,
        'themePaths': [],
        'themeBase': "",
        'themeCount': 0,
    }

    with open(IMAGE_MAP_FILE, 'w+') as map_file:
        map_data = {}

        for root, dirs, files in os.walk(os.getcwd()):
            if root.split('/')[-1] == IMAGE_DIR:
                for img_file in files:
                    config_data['imagePaths'].append(img_file)
                    config_data['imageCount'] += 1

                    map_key = img_file.split('.')[0]
                    map_data[map_key] = map_key

        map_file.write("export default ")
        map_file.write(json.dumps(map_data))

        print('> found %d image files\n' % config_data['imageCount'])

    with open(THEME_MAP_FILE, 'w+') as map_file:
        map_data = {}

        for root, dirs, files in os.walk(os.getcwd()):
            if root.split('/')[-1] == THEME_DIR:
                for data_file in files:
                    # Open file to check if it's the base or not
                    print(os.path.join(root, data_file))
                    with open(os.path.join(root, data_file), 'r') as file:
                        data = json.load(file)
                        if "isBase" in data and data["isBase"]:
                            config_data['themeBase'] = data_file

                    config_data['themePaths'].append(data_file)
                    config_data['themeCount'] += 1

                    map_key = data_file.split('.')[0]
                    map_data[map_key] = map_key

        map_file.write('export default ')
        map_file.write(json.dumps(map_data))

        print('> found %d theme files\n' % config_data['themeCount'])

    config_file.write("export default ")
    config_file.write(json.dumps(config_data))
