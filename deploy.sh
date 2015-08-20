#!/usr/bin/env bash

grunt platon

scp build/platon/olmm.js root@10.0.12.240:/home/deploy/sdn/olmm/olmm.js