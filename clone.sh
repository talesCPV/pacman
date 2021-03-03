#!/bin/bash
# Clone files to Github - https://github.com/talesCPV/pacman.git


read -p "Deseja realmente clonar pacman do GitHub? S/ ->" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Ss]$ ]]
then
   
    git init

    git clone https://github.com/talesCPV/pacman.git 

    FILE=PJ21/pages

    if [ -d "$FILE" ]; then
        echo ATUALIZANDO SISTEMA DE PASTAS
        rm -rf ../pages/
        mv PJ21/pages/ ../
        rm -rf ./PJ21/

    else

        echo NAO FOI POSSIVEL BAIXAR OS ARQUIVOS, VERIFIQUE A SUA REDE.

    fi


fi