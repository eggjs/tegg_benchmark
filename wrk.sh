#!/bin/bash

set -e

npx lerna run start

sleep 30

for port_count in "7001 1" "7002 10" "7003 100" "7004 1000" "7005 10000"
do
  port_count=($port_count)
  port=${port_count[0]}
  count=${port_count[1]}
 for touch in "" "=true"
 do
   echo "wrk -c 25 -d 60 -t 25 http://127.0.0.1:${port}/hello${count}?touch${touch}"
   wrk -c 25 -d 60 -t 25 http://127.0.0.1:${port}/hello${count}?touch${touch}
 done
done

for port in 7006 7007
do
 for touch in "" "=true"
 do
   for count in 1 10 100 1000 10000
   do
     echo "wrk -c 25 -d 60 -t 25 http://127.0.0.1:${port}/hello${count}?touch${touch}"
     wrk -c 25 -d 60 -t 25 http://127.0.0.1:${port}/hello${count}?touch${touch}
   done
 done
done

npx lerna run stop
