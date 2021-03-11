# convert viridis colormap from rgb into HEX code
#
#############################################################################
# License for viridis colormap pattern
#
# New matplotlib colormaps by Nathaniel J. Smith, Stefan van der Walt,
# and (in the case of viridis) Eric Firing.
#
# This file and the colormaps in it are released under the CC0 license /
# public domain dedication. We would appreciate credit if you use or
# redistribute these colormaps, but do not impose any legal restrictions.
#
# To the extent possible under law, the persons who associated CC0 with
# mpl-colormaps have waived all copyright and related or neighboring rights
# to mpl-colormaps.
#
# You should have received a copy of the CC0 legalcode along with this
# work.  If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
##############################################################################

import pandas as pd
import os

def getColormapString(df):
    for col in ['r', 'g', 'b']:
        df[col] = df[col].apply(lambda x:x*255).apply(int).apply(hex).str[2:].str.zfill(2).str.upper()
    df['HEX'] = '#' + df['r'] + df['g'] + df['b']
    output_ = "\t\t[\"\",\"colormap\",\"" + ("".join(i + ',' for i in df['HEX']))[:-1] + "\"]"
    print(output_)

_viridis_data = pd.read_csv(os.path.dirname(__file__) + '/viridis.csv')
_viridis_degrade_data = pd.read_csv(os.path.dirname(__file__) + '/viridis.csv', skiprows=lambda x: x > 0 and (x-1) % 20 != 0)

getColormapString(_viridis_data)
getColormapString(_viridis_degrade_data)
