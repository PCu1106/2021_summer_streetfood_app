import base64
import numpy as np
import cv2

def encode_64(img_name):
    # 指定圖片並編碼成base64
    with open(img_name, "rb") as f:
        img = f.read()
    img_encode = base64.b64encode(img)
    return img_encode

def decode_64(img_encode):
    # decode img from base64
    img_decode = base64.b64decode(img_encode)
    # turn into np.array
    img_array = np.fromstring(img_decode,np.uint8) 
    # convert BGR to RGB for opencv
    img = cv2.imdecode(img_array,cv2.COLOR_BGR2RGB)
    return img

def test_decoder(filename):
    with open(filename, "rb") as fid:
        data = fid.read()
    testp=cv2.imread("pic.JPG")
    # encode img to base64
    img_encode = base64.b64encode(data)
    img = decode_64(img_encode)
    cv2.imshow("img",img)
    cv2.waitKey()
