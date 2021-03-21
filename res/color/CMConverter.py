# Convert PGFPlots colormap string into HTML HEX string
#

import re
import pandas as pd

_cmstr = ""
print("PGFPlots colormap string (end with #)> ")
for line in iter(input, '#'):
    _cmstr += line + '\n'

# get the name of the colormap
matchDict = re.search(r'colormap=\{(?P<name>[A-Za-z0-9]+)\}\{(?P<info>.*)\}',_cmstr,re.M|re.S).groupdict()
name = matchDict['name']
_cmstr = matchDict['info']

# PGFPlots uniform the grid,
# which is not relevent to HTML displaying
#
# uniform_grid = re.findall(r'\[.*cm\]',_cmstr,re.M)
# if(len(uniform_grid)>0):
#     uniform_grid = int(uniform_grid[0].replace('[','').replace('cm]',''))
# else:
#     uniform_grid = 0

_cmstr = re.sub(r'\[.*cm\]','',_cmstr).replace(';',' ')
colors = _cmstr.split( )
colorArray = []
portion = False
for i in range(0,len(colors)):
    matchObj = re.search(r'rgb255((\((?P<L>[0-9]+)cm\))?)=\((?P<R>[0-9]+),(?P<G>[0-9]+),(?P<B>[0-9]+)\)',colors[i]).groupdict()
    if matchObj['L']:
        portion = True
    colorArray.append([matchObj['R'],matchObj['G'],matchObj['B'],matchObj['L']])

colorDf = pd.DataFrame(colorArray,columns=['R','G','B','L'])
colormapStr_ = ""

def getHexCol(df):
    for col in ['R', 'G', 'B']:
        df[col] = df[col].apply(int).apply(hex).str[2:].str.zfill(2).str.upper()
    df['HEX'] = '#' + df['R'] + df['G'] + df['B']

getHexCol(colorDf)

output_ = "\t\"" + name + "\":\t\t" + "[\"\",\"colormap\",\""

if portion:
    Lm = int(colorDf['L'].max())
    colorDf['L'] = colorDf['L'].apply(lambda x: str(int(float(x) / Lm * 100)) + '%')
    for l in colorDf.index.to_list():
        output_ += colorDf['HEX'][l] + ' ' + colorDf['L'][l] + ','
    output_ = output_[:-1] + '\"],'
else:
    for l in colorDf.index.to_list():
        output_ += colorDf['HEX'][l] + ','
    output_ = output_[:-1] + "\"],"

print(output_)