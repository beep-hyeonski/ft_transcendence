#!/bin/bash
docker cp ./user.sql db:/tmp/user.sql
docker exec db psql -U postgres -d ft_transcendence -f /tmp/user.sql
docker cp ./follow_block.sql db:/tmp/follow_block.sql
docker exec db psql -U postgres -d ft_transcendence -f /tmp/follow_block.sql