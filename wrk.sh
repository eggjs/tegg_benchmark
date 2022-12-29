npx lerna run start

sleep 30

for port in 7001 7002 7003
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
