
#import sys
#!{sys.executable} -m pip install TbaApi3

#import TbaApi3
import pandas as pd

# Sets Plot styling.
# https://tonysyu.github.io/raw_content/matplotlib-style-gallery/gallery.html for list of styles
#plt.style.use('fivethirtyeight')

df = pd.read_excel('/Users/erikapilpre/code/scouting-app/test.xlsx')
df = df.drop(['Timestamp', 'Match Number', 'Other Tags', 'Final Match Score for Alliance'], axis = 1)
df = df.drop(['Cargo Ship Cargo (use slashes to count. teleop only)', 'Rocket Cargo (use slashes to count. teleop only)'], axis = 1)
df = df.drop(df.index[32])
df = df.drop(['Auto Start Level', 'Auto Performance', 'Climb', 'Rocket Hatch (use slashes to count. teleop only)'], axis = 1)
#df['Team Number / Name'] = pd.to_numeric(df['Team Number / Name'], downcast='integer')
df.rename(columns={'Cargo Ship Hatch (use slashes to count. teleop only)': 'CargoShipHatch','Team Number / Name': 'Team' }, inplace=True)
#df = df.sort_values(by='Team', ascending=True)
df = df.fillna(0)
df['CargoShipHatch'] = df['CargoShipHatch'].replace(['none', 'None','/', '/ ', '//', '///', '////', '/////', '//////'], ['0', '0', '1','1', '2', '3', '4', '5', '6'])
df['Team'] = pd.to_numeric(df['Team'], downcast='integer')
df['CargoShipHatch'] = pd.to_numeric(df['CargoShipHatch'], downcast='integer')

df['mean'] = df.groupby('Team')['CargoShipHatch'].transform('mean')

# df.sort_values(by=['mean'], ascending=False, inplace=True)
# print(df)

group_by_team = df.groupby('Team', sort=False).CargoShipHatch.mean()

group_by_team.sort_index(ascending=False, inplace=True)
group_by_team = group_by_team.drop([0, 65])
s = group_by_team.reset_index().sort_values(['CargoShipHatch'], ascending=False).set_index(['Team'])

print(s)
#print(df)
