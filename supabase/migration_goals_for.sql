-- Add goals_for column to team_stats and seed group-stage values from screenshots.
-- Run this once in the Supabase SQL editor.

alter table team_stats add column if not exists goals_for integer default 0;

update team_stats set goals_for = case team_name
  when 'Mexico'         then 6
  when 'South Africa'   then 2
  when 'South Korea'    then 2
  when 'Czech Republic' then 2
  when 'Switzerland'    then 7
  when 'Canada'         then 8
  when 'Bosnia'         then 5
  when 'Qatar'          then 2
  when 'Brazil'         then 7
  when 'Morocco'        then 6
  when 'Scotland'       then 1
  when 'Haiti'          then 2
  when 'USA'            then 8
  when 'Australia'      then 2
  when 'Paraguay'       then 2
  when 'Turkey'         then 3
  when 'Germany'        then 10
  when 'Ivory Coast'    then 4
  when 'Ecuador'        then 2
  when 'Curacao'        then 1
  when 'Netherlands'    then 10
  when 'Japan'          then 7
  when 'Sweden'         then 7
  when 'Tunisia'        then 2
  when 'Belgium'        then 6
  when 'Egypt'          then 5
  when 'Iran'           then 3
  when 'New Zealand'    then 4
  when 'Spain'          then 5
  when 'Cape Verde'     then 2
  when 'Uruguay'        then 3
  when 'Saudi Arabia'   then 1
  when 'France'         then 10
  when 'Norway'         then 8
  when 'Senegal'        then 8
  when 'Iraq'           then 1
  when 'Argentina'      then 8
  when 'Austria'        then 6
  when 'Algeria'        then 5
  when 'Jordan'         then 3
  when 'Colombia'       then 4
  when 'Portugal'       then 6
  when 'DR Congo'       then 4
  when 'Uzbekistan'     then 2
  when 'England'        then 6
  when 'Croatia'        then 5
  when 'Ghana'          then 2
  when 'Panama'         then 0
end
where team_name in (
  'Mexico','South Africa','South Korea','Czech Republic',
  'Switzerland','Canada','Bosnia','Qatar',
  'Brazil','Morocco','Scotland','Haiti',
  'USA','Australia','Paraguay','Turkey',
  'Germany','Ivory Coast','Ecuador','Curacao',
  'Netherlands','Japan','Sweden','Tunisia',
  'Belgium','Egypt','Iran','New Zealand',
  'Spain','Cape Verde','Uruguay','Saudi Arabia',
  'France','Norway','Senegal','Iraq',
  'Argentina','Austria','Algeria','Jordan',
  'Colombia','Portugal','DR Congo','Uzbekistan',
  'England','Croatia','Ghana','Panama'
);
