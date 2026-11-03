#!/bin/bash -e

if [ -s error_syntax.log ]; then
   echo "Hay errores de syntax, no se puede desplegar"; 
   cat error_syntax.log
   return 1
else
   echo "No hay errores de syntax, pruebas pasadas."; 
   rm error_syntax.log
fi
