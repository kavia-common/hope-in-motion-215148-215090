#!/bin/bash
cd /home/kavia/workspace/code-generation/hope-in-motion-215148-215090/evobike_shortfilm_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

