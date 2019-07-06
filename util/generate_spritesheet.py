import os
import glob

# Requires spritesheet.js
# https://github.com/krzysztof-o/spritesheet.js/


def spritesheet(src, name="spritesheet", dst="../public/assets", selector="**/*.png"):
    imgs = glob.glob(src+"/"+selector, recursive=True)
    os.system("spritesheet-js -f pixi.js -n "+name+" -p "+dst+" --trim "+" ".join(imgs))

if __name__ == "__main__":
    spritesheet("../sprites")