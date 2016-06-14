from bs4 import BeautifulSoup
import pandas as pd
import numpy as np
import urllib2

url = "http://www.realclearpolitics.com/epolls/latest_polls/pres_general/"
content = urllib2.urlopen(url).read()
soup = BeautifulSoup(content)
tables = soup.select('table')

#print tables
i=1
d = []
for table in tables:
    if i % 2 != 0:
        date = table.b.string.split(', ')[1]
        #print date
    if i % 2 == 0:
        #print table
        rows = table.find_all('tr')
        for row in rows:
            try:
                area = row.select('td.lp-race')[0].a.string.split(': ')[0]
                race = row.select('td.lp-race')[0].a.string.split(': ')[1]
                poll = row.select('td.lp-poll')[0].a.string
                candidate1 = row.select('td.lp-results')[0].a.string.split(', ')[0].split(' ')[0]
                result1 = row.select('td.lp-results')[0].a.string.split(', ')[0].split(' ')[1]
                candidate2 = row.select('td.lp-results')[0].a.string.split(', ')[1].split(' ')[0]
                result2 = row.select('td.lp-results')[0].a.string.split(', ')[1].split(' ')[1]
                winner = row.select('td.lp-spread')[0].string.split(' +')[0]
                spread = row.select('td.lp-spread')[0].string.split(' +')[1]

                t = {'order':i/2, 'date':date, 'area':area, 'race': race, 'poll':poll, 'candidate1':candidate1, 'result1':result1, 'candidate2':candidate2, 'result2':result2, 'winner':winner, 'spread': spread*1}
                d.append(t)
            except:
                #print 'error'
                continue
    i = i + 1

df = pd.DataFrame(d)

# Narrow to polls in that have both Sanders and Clinton vs Trump
df = df.loc[df['race'].isin(['Trump vs. Clinton', 'Trump vs. Sanders'])]
df['d_candidate'] = ''
df.loc[df['candidate1']=='Sanders','d_candidate'] = 'Sanders'
df.loc[df['candidate1']=='Clinton','d_candidate'] = 'Clinton'
df.loc[df['candidate2']=='Sanders','d_candidate'] = 'Sanders'
df.loc[df['candidate2']=='Clinton','d_candidate'] = 'Clinton'
df = df.set_index(['order','date','poll','area','d_candidate'])
df['dem_win'] = df.winner.apply(
    lambda x: (-1 if x == 'Trump' else 1))
df['spread'] = pd.to_numeric(df['spread'])
df['spread'] = df.spread * df.dem_win
df = df[['spread','dem_win']].unstack().dropna()['spread'].reset_index()
df['Sanders_up'] = df.Sanders - df.Clinton
df = df.sort_values('order',ascending=False)
df['c_avg'] = df['Clinton'].mean()
df['s_avg'] = df['Sanders'].mean()
df['diff_avg'] = df['Sanders_up'].mean()
df['c_loss'] = df[df.Clinton < 0].count()['Clinton']
df['s_loss'] = df[df.Sanders < 0].count()['Sanders']
df.reindex(index=df.index[::-1])

df.to_csv('spreads.csv',index_label='index')
print df
