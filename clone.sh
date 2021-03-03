#!/bin/bash
# Clone files to Github - https://github.com/talesCPV/pacman.git

read -p "Deseja realmente clonar pacman do GitHub? S/ ->" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Ss]$ ]]
then

    cd ..

    rm -rf pacman/

    git init

    git clone https://github.com/talesCPV/pacman.git 

    echo ATUALIZANDO SISTEMA DE PASTAS

fi