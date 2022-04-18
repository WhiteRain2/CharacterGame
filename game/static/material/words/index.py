import requests
from bs4 import BeautifulSoup
import re
import os


def GetWords(path):
    words = []
    with open(path, 'r', encoding='utf-8') as pf:
        for line in pf:
            if line == '\n':
                continue
            words.append(line)
    for i in range(len(words)):
        words[i] = words[i].replace(' ', '')
        words[i] = words[i].replace('\n', '')
    return words


def GetUrl(word):
    images = []
    audio = []
    index = 'https://hanyu.baidu.com/zici/s?wd=' + word
    r = requests.get(index)
    soup = BeautifulSoup(r.text, 'html.parser')
    # audio
    aList = soup.select('#pinyin > span > a')
    for a in aList:
        audio.append(a.get('url'))
    # images
    url = soup.select('#header-img > div')
    url = url[0].get('style')
    url = url.replace('background-image: url(', '')
    url = url.replace(')', '')
    for _ in range(len(audio)):
        images.append(url)
    return images, audio


def GetContent(url):
    r = requests.get(url)
    return r.content


def ParseAndSave(images, audio, ct, path):
    for item in zip(images, audio):
        with open('{}/{}.png'.format(path, ct), 'wb') as pim:
            pim.write(GetContent(item[0]))
        with open('{}/{}.mp3'.format(path, ct), 'wb') as pa:
            pa.write(GetContent(item[1]))



def MainFile(fname):
    words = GetWords(fname)
    path = './difficult'
    if fname == 'wordsEasy.txt':
        path = './common'
    ct = 1
    for wordSame in words:
        for word in wordSame:
            images, audio = GetUrl(word)
            ParseAndSave(images, audio, ct, path)
            ct += 1
            if ct >= 2000:
                return


if __name__ == '__main__':
    MainFile('wordsEasy.txt')
    MainFile('wordsHard.txt')