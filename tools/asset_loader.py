import json
import os
import sys

"""
Run this script to automatically generate an 'assetConfig.js' file in the public/assets/ folder, based on the data contained therein
"""

# ------------
VERSION = "V1.01.190419"
CONFIG_FILE_NAME = "assetConfig.js"
MAP_FILE_NAME = "assetMap.js"
BASE_DIR = "assets"
IMAGE_DIR = "images"
# ------------


os.chdir(sys.argv[1])
print('> running asset_loader (%s)' % '.'.join(VERSION.split('.')[:-1]))
print('> working from %s' % os.getcwd())

with open(CONFIG_FILE_NAME, 'w+') as config_file:
    with open(MAP_FILE_NAME, 'w+') as map_file:
        config_data = {
            'baseDir': BASE_DIR,
            'imageDir': IMAGE_DIR,
            'imagePaths': [],
            'imageCount': 0
        }
        map_data = {}

        for root, dirs, files in os.walk(os.getcwd()):
            if root.split('/')[-1] == IMAGE_DIR:
                for img_file in files:
                    config_data['imagePaths'].append(img_file)
                    config_data['imageCount'] += 1

                    map_key = img_file.split('.')[0]
                    map_data[map_key] = map_key

        config_file.write("export default ")
        config_file.write(json.dumps(config_data))

        map_file.write("export default ")
        map_file.write(json.dumps(map_data))

print('> found %d image files\n' % config_data['imageCount'])
