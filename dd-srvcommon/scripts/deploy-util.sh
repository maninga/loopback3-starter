#!/usr/bin/env bash

set +x

#set -o errexit
set -o nounset
set -o pipefail

function usage
{
	cat <<EOF
Usage:
    $0 <<Option>>
Options:
 -a, --application   application-name
 -b, --branch        branch-name
 -h, --help          display this help and exit
EOF
}

getopt --test > /dev/null
if [[ $? -ne 4 ]]; then
    echo "May you need to check the support for getopt on your machine."
    exit 1
fi
SHORT=a:b:h
LONG=application:,branch:,help

PARSED=`getopt --options $SHORT --longoptions $LONG --name "$0" -- "$@"`
if [[ $? -ne 0 ]]; then
    exit 2
fi
eval set -- "$PARSED"
while true; do
    case "$1" in
        -a|--application)
            curr_app=$2
            shift 2
            ;;
        -b|--branch)
            curr_branch=$2
            shift 2
            ;;
        --)
            shift
            break
            ;;
        *)
            usage
            exit 3
            ;;
    esac
done

if [ ! "$curr_app" ] || [ ! "$curr_branch" ]; then
    usage
    exit 4
fi

if [[ ${curr_branch} == "integration" ]]; then
	ALL_CONTAINERS='blog-int blog1-int'
elif [[ ${curr_branch} == "preprod" ]]; then
	ALL_CONTAINERS='staging'
elif [[ ${curr_branch} == "production" ]]; then
	ALL_CONTAINERS='dd'
fi

for ENV in $ALL_CONTAINERS
do
	rsync -aHXxczhmC --executability --stats --delete --force -e "ssh -T -c arcfour -o Compression=no -x -o StrictHostKeyChecking=no" ${PWD}/ root@${curr_app}-${ENV}:dd/
	ssh root@${curr_app}-${ENV} "cd dd && npm run stopp || true"
	sleep 5
done
