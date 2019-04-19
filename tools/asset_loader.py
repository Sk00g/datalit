import json
import os
import sys

"""
Run this script to automatically generate an 'assetConfig.js' file in the public/assets/ folder, based on the data contained therein
"""

# ------------
VERSION = "V1.01.190419"
FILE_NAME = "assetConfig.js"
BASE_DIR = "assets"
IMAGE_DIR = "images"
# ------------


os.chdir(sys.argv[1])
print('> running asset_loader (%s)' % '.'.join(VERSION.split('.')[:-1]))
print('> working from %s' % os.getcwd())

with open(FILE_NAME, 'w+') as file:
    data = {
        'baseDir': BASE_DIR,
        'imageDir': IMAGE_DIR,
        'imagePaths': [],
        'imageCount': 0
    }

    for root, dirs, files in os.walk(os.getcwd()):
        if root.split('/')[-1] == IMAGE_DIR:
            for img_file in files:
                data['imagePaths'].append(img_file)
                data['imageCount'] += 1

    file.write("export default ")
    file.write(json.dumps(data))

print('> found %d image files\n' % data['imageCount'])
