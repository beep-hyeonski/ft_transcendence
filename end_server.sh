docker-compose down
sleep 5
docker rm $(docker ps --filter status=exited -q)
docker rmi $(docker images -a -q)
