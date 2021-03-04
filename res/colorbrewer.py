# Convert colorbrewer RGB into HEX list
# 
###########################################################################################
# License for ColorBrewer Schemes:
#
# Copyright (c) 2002 Cynthia Brewer, Mark Harrower, and The Pennsylvania State University.
#
# Licensed under the Apache License, Version 2.0 (the "License"); 
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed
# under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
# CONDITIONS OF ANY KIND, either express or implied. See the License for the
# specific language governing permissions and limitations under the License.
###########################################################################################

import pandas as pd
import os

cb = pd.read_csv(os.path.dirname(__file__) + "/colorbrewer.csv")
for col in ["R","G","B"]:
    cb[col] = cb[col].apply(hex).str[2:].str.zfill(2).str.upper()

cb['HEX'] = '#' + cb['R'] + cb['G'] + cb['B']

cb = cb.groupby('ColorType')['HEX'].apply(lambda x: x.str.cat(sep=',')).reset_index()

output_ = "{\n"
for l in cb.index.to_list():
    output_ += '\t\"' + cb['ColorType'][l] + "-\":\t\t[\"\", \"colormap\", \"" + cb['HEX'][l] + "\"],\n"
output_ += "}"

print(output_)