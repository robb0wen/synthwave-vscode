#!/bin/bash

code --install-extension ~/synthwave-vscode-0.1.14.vsix

if [ $? -ne 0 ]; then
    echo "An error occured while installing the extension."
else
    echo "Deleting temporary vsix install file."
    rm ~/synthwave-vscode-0.1.14.vsix
fi

echo "Install script done."
