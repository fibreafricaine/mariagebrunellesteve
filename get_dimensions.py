import os
import struct

def get_image_info(filepath):
    """Gets dimensions of a JPEG image without external libraries."""
    with open(filepath, 'rb') as f:
        # Check JPEG magic number
        if f.read(2) != b'\xff\xd8':
            return None
        
        while True:
            marker = f.read(2)
            if not marker:
                break
            # Markers starting with \xff
            if marker[0] != 0xff:
                break
            
            # Find SOF markers (Start Of Frame)
            # SOF0 (0xc0) to SOF15 (0xcf) except SOF4 (0xc4), SOF8 (0xc8), SOF12 (0xcc)
            if marker[1] in [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]:
                # Read length
                length = struct.unpack('>H', f.read(2))[0]
                # Read precision (1 byte)
                f.read(1)
                # Read height and width
                height, width = struct.unpack('>HH', f.read(4))
                return width, height
            else:
                # Read length and skip
                length = struct.unpack('>H', f.read(2))[0]
                f.seek(length - 2, 1)
    return None

images_dir = r"c:\Users\Admin\Downloads\Anti"
files = [f for f in os.listdir(images_dir) if f.lower().endswith(('.jpeg', '.jpg'))]

print("--- IMAGE DIMENSIONS ---")
for f in files:
    path = os.path.join(images_dir, f)
    info = get_image_info(path)
    if info:
        w, h = info
        aspect = w / h
        orientation = "Landscape" if aspect > 1 else "Portrait" if aspect < 1 else "Square"
        print(f"File: {f} | Width: {w} | Height: {h} | Aspect: {aspect:.2f} ({orientation})")
    else:
        print(f"File: {f} | Could not read dimensions")
