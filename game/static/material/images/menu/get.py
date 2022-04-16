import requests


url = 'https://s1.ax1x.com/2022/04/15/LGu34K.gif'
r = requests.get(url)
with open('MenuBackground.gif', 'wb') as pf:
    pf.write(r.content)

