#!/bin/bash
###### Constants
destination=
interactive=
###### End Constants
function build_app {
    export PATH=/usr/local/bin:$PATH
    rm -rf node_modules
    npm cache clean
    npm prune
    npm install
    rm -rf app/bower_components
    bower --allow-root cache clean
    bower --allow-root prune
    bower --allow-root install
    grunt build
}
function usage {
    echo "usage: build.sh [[[-d destination ] [-i]] | [-h]]"
}
while [ "$1" != "" ]; do
    case $1 in
        -d | --dest )           shift
                                destination=${1%/}
                                destination="${destination/#\~/$HOME}"
                                ;;
        -i | --interactive )    interactive=1
                                ;;
        -h | --help )           usage
                                exit
                                ;;
        * )                     usage
                                exit 1
    esac
    shift
done
if [ "$interactive" = "1" ]; then

    response=

    echo -n "Enter the destination path [$destination] > "
    read response
    if [ -n "$response" ]; then
        destination=${response%/}
        destination="${destination/#\~/$HOME}"
    fi

    if [ -d $destination ]; then
        echo -n "Replace files in destination directory? (y/n) > "
        read response
        if [ "$response" != "y" ]; then
            echo "Exiting program."
            exit 1
        else 
            echo "Removing any files or folders from [$destination]"
            rm -rf "$destination"/*
            build_app
            unzip public/SecAwarenessQuiz.zip -d "$destination"/
        fi
    else
        echo "Destination does not exist! Make sure the destination exists!"
        exit 1
    fi
else    
    rm -rf "$destination"/*
    build_app
    unzip public/SecAwarenessQuiz.zip -d "$destination"/
fi