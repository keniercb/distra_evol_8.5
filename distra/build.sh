#!/bin/bash

#~VARIABLES

BRANCH="nada"
FECHA=$(date +%Y-%m-%d-%H-%M)

DIR_CONF="configuracion"
DIR_CLIP="clientesyproveedores"
DIR_NOMD="/logistica/nomdinamicos"
DIR_NOMG="/logistica/nomgenerales"
DIR_AGRU="/logistica/agrupaciones"

DIR_CAPC="/pvd/capacitacion"
DIR_COMP="/pvd/competencias"
DIR_RCOM="/pvd/comun"
DIR_EVAL="/pvd/evaluaciones"
DIR_MAST="/pvd/maestro"
DIR_MOVL="/pvd/movimientoslaborales"
DIR_NOMI="/pvd/nomina"
DIR_PERS="/pvd/persona"
DIR_REGIM="/pvd/regimentrabajo"
DIR_SELEC="/pvd/seleccion"
DIR_SST="/pvd/sst"
DIR_METAD="/metadatos"
DIR_RECC="/reccomplejas"
DIR_INTE="pvd/integracionreportes"

DIR_PHELP="/planificacion/help"
DIR_HERRA="/planificacion/herramientasintegracion"
DIR_PCOMUN="/planificacion/comun"
DIR_INVER="/planificacion/inversiones"
DIR_INVERP="/planificacion/inversionesproyecto"
DIR_PDO="/planificacion/pdo"
DIR_P711="/planificacion/plan711"
DIR_PINTE="/planificacion/planifintegracion"
DIR_PINDU="/planificacion/planindustrial"
DIR_PMETA="/planificacion/planmeta"
DIR_PPROE="/planificacion/planproeza"
DIR_PROD="/planificacion/producciones"
DIR_PROY="/planificacion/proyecto"
DIR_REPOR="/planificacion/reportes"
DIR_RESOUR="/planificacion/resources"
DIR_SUITE="/planificacion/suite"
DIR_WORK="/planificacion/workflow"

DIR_ATF="/logistica/activos_fijos"
DIR_LCOMUN="/logistica/comun"
DIR_DISTR="/logistica/distribucion"
DIR_FACT="/logistica/facturacion"
DIR_INVT="/logistica/inventario"
DIR_MAGE="/logistica/magentoadmin"
DIR_PUNTV="/logistica/puntoventa"
DIR_TALL="/logistica/talleres"
DIR_UTIL="/logistica/utiles"
DIR_PRO="logistica/produccion"
DIR_FARM="logistica/farmacia"
DIR_COMB="logistica/combustible"

DIR_AUDIT="/contabilidad/auditoria"
DIR_BANCO="/contabilidad/banco"
DIR_CAJA="/contabilidad/caja"
DIR_CCOMUN="/contabilidad/comun"
DIR_COPA="/contabilidad/cobros_pagos"
DIR_COSTO="/contabilidad/contabilidad_costos"
DIR_FINAN="/contabilidad/contabilidad_financiera"
DIR_PRES="contabilidad/presupuestom"
DIR_CHELP="contabilidad/help"

#~FUNCTIONS

#~ACTUALIZAR CODIGO LOCAL A UNA RAMA REMOTA GIT

function descargar_rama(){

echo "Actualizando codigo fuente a la rama remota "$BRANCH" ."
echo "NOTA: Es posible que se le solicite escribir un mensaje de confirmacion para fusiones de codigo local."

git submodule foreach --recursive git fetch origin >/dev/null && git submodule foreach --recursive git reset --hard origin/$BRANCH >/dev/null
git submodule foreach --recursive git checkout $BRANCH >/dev/null 2>&1 && git submodule foreach --recursive git pull origin >/dev/null

}

#~BORRAR DIRECTORIOS

function borrar_enlaces(){

	borrar_contabilidad
	borrar_crm
	borrar_logistica
	borrar_planificacion
	borrar_pvd
}

function borrar_contabilidad(){

	cd ../apps/ && rm -rf contabilidad && cd ../web/ && rm -rf contabilidad && cd ../distra/

}

function borrar_crm (){

	cd ../apps/ && rm -rf configuracion/ crm && cd ../web && rm -rf configuracion/ crm && cd ../distra/
}

function borrar_logistica(){

	cd ../apps/ && rm -rf logistica && cd ../web && rm -rf logistica && cd ../distra/
}

function borrar_planificacion(){

	cd ../apps/ && rm -rf planificacion && cd ../web && rm -rf planificacion && cd ../distra/
}

function borrar_pvd(){

	cd ../apps/ && rm -rf metadatos/ pvd reccomplejas/ configuracion/integracionreportes/ &&  cd ../web && rm -rf metadatos/ pvd reccomplejas/ configuracion/integracionreportes/
    cd ../distra/

}

#~CREAR ENLACES

#Construir en direccion directa
function construir(){

        crm
        contabilidad
        logistica
        planificacion
        pvd
}

#Construir en direccion inversa

function construir_2(){

        echo "Salvando estructura actual..."

        cd ../ && tar -czf salva_estructura_code_$FECHA.tar.gz apps web && cd distra

        echo "Construyendo aplicacion..."

        crear_crm
        crear_contabilidad
        crear_logistica
        crear_planificacion
        crear_pvd

		borrar_enlaces

		dir_vacias

		construir

		echo "Hecho"
}

function dir_vacias(){

dir="./"

DirList=./ditlist.tmp                                                                #Guardaremos la lista de todos los directorios en un archivo temporal
find $dir -type d > $DirList                                                            #Buscamos todos los directorios
dirs=`cat $DirList`                                                                     #Escribir todos los directorios en la variable

for dir in $dirs                                                                        #Comienza a revisar cada directorio

do
#Preguntamos con awk si la dir entrante tiene 4 columnas delimitadas por el caracter "/" , pero ademas la columna 4 debe tener un valor igual a "apps" o "web"
        if [ `echo "$dir" | awk -F'/' '{print NF}'` -eq 4 ] && [[ `echo "$dir" | awk -F'/' '{print $4}'` == "apps" || `echo "$dir" | awk -F'/' '{print $4}'` == "web" ]]
        then
	            [ `ls $dir | wc -l` -lt 1 ] || continue                                 #Comprobando si el directorio esta vacio

                echo -n "Eliminando directorio vacío $dir"                      		

				rm -rf "$dir"
        fi
done

rm -f ./ditlist.tmp

}
function crm(){



	cp -rl ./crm/crm/apps/ ../apps/crm/ && cp -rl ./crm/crm/web/ ../web/crm/
	cp -rl ./crm/$DIR_CONF/apps/ ../apps/$DIR_CONF/ && cp -rl ./crm/$DIR_CONF/web/ ../web/$DIR_CONF/
	cp -rl ./crm/$DIR_CLIP/apps/ ../apps/$DIR_CONF/$DIR_CLIP/ && cp -rl ./crm/$DIR_CLIP/web/ ../web/$DIR_CONF/$DIR_CLIP/

	cp -rl ./$DIR_NOMD/apps/ ../apps/$DIR_CONF/nomdinamicos/ && cp -rl ./$DIR_NOMD/web/ ../web/$DIR_CONF/nomdinamicos/
	cp -rl ./$DIR_NOMG/apps/ ../apps/$DIR_CONF/nomgenerales/ && cp -rl ./$DIR_NOMG/web/ ../web/$DIR_CONF/nomgenerales/
	cp -rl ./$DIR_AGRU/apps/ ../apps/$DIR_CONF/agrupaciones/ && cp -rl ./$DIR_AGRU/web/ ../web/$DIR_CONF/agrupaciones/

}

function pvd(){

	if [ ! -d ../apps/pvd ] || [ ! -d ../web/pvd ]
	then

		mkdir -p ../apps/pvd ../web/pvd



        cp -rl ./$DIR_INTE/apps/ ../apps/configuracion/integracionreportes/
        cp -rl ./$DIR_INTE/web/ ../web/configuracion/integracionreportes/
		cp -rl ./$DIR_RCOM/apps/ ../apps$DIR_RCOM && cp -rl ./$DIR_RCOM/web/ ../web$DIR_RCOM
		cp -rl ./$DIR_CAPC/apps/ ../apps$DIR_CAPC && cp -rl ./$DIR_CAPC/web/ ../web$DIR_CAPC
		cp -rl ./$DIR_COMP/apps/ ../apps$DIR_COMP && cp -rl ./$DIR_COMP/web/ ../web$DIR_COMP
		cp -rl ./$DIR_EVAL/apps/ ../apps$DIR_EVAL && cp -rl ./$DIR_EVAL/web/ ../web$DIR_EVAL
		cp -rl ./$DIR_MAST/apps/ ../apps$DIR_MAST && cp -rl ./$DIR_MAST/web/ ../web$DIR_MAST
		cp -rl ./$DIR_MOVL/apps/ ../apps$DIR_MOVL && cp -rl ./$DIR_MOVL/web/ ../web$DIR_MOVL
		cp -rl ./$DIR_NOMI/apps/ ../apps$DIR_NOMI && cp -rl ./$DIR_NOMI/web/ ../web$DIR_NOMI
		cp -rl ./$DIR_PERS/apps/ ../apps$DIR_PERS && cp -rl ./$DIR_PERS/web/ ../web$DIR_PERS
		cp -rl ./$DIR_REGIM/apps/ ../apps$DIR_REGIM && cp -rl ./$DIR_REGIM/web/ ../web$DIR_REGIM
		cp -rl ./$DIR_SELEC/apps/ ../apps$DIR_SELEC && cp -rl ./$DIR_SELEC/web/ ../web$DIR_SELEC
		cp -rl ./$DIR_SST/apps/ ../apps$DIR_SST && cp -rl ./$DIR_SST/web/ ../web$DIR_SST
		cp -rl ./pvd$DIR_METAD/apps/ ../apps$DIR_METAD && cp -rl ./pvd$DIR_METAD/web/ ../web$DIR_METAD
		cp -rl ./pvd$DIR_RECC/apps/ ../apps$DIR_RECC && cp -rl ./pvd$DIR_RECC/web/ ../web$DIR_RECC

	elif [ "$(ls ../apps/pvd/)" ] || [ "$(ls ../web/pvd/)" ]
	then

		echo "Los directorios de los modulos RRHH ya contienen el codigo fuente."
		echo "Si decea hacer enlaces nuevos use la opcion '[7] Chequear enlaces a código fuente' del menu principal."

	fi
}

function planificacion(){

	if [ ! -d ../apps/planificacion/ ] || [ ! -d ../apps/planificacion/ ]
	then

		mkdir -p ../apps/planificacion/ ../web/planificacion/



		cp -rl ./$DIR_PCOMUN/apps/ ../apps$DIR_PCOMUN && cp -rl ./$DIR_PCOMUN/web/ ../web$DIR_PCOMUN
		cp -rl ./$DIR_PHELP/ ../web$DIR_PHELP && cp -rl ./$DIR_RESOUR/ ../web$DIR_RESOUR
		cp -rl ./$DIR_HERRA/apps ../apps$DIR_HERRA  && cp -rl ./$DIR_HERRA/web ../web$DIR_HERRA

		cp -rl ./$DIR_INVER/apps ../apps$DIR_INVER  && cp -rl ./$DIR_INVER/web ../web$DIR_INVER
		cp -rl ./$DIR_INVERP/apps ../apps$DIR_INVERP  && cp -rl ./$DIR_INVERP/web ../web$DIR_INVERP
		cp -rl ./$DIR_PDO/apps ../apps$DIR_PDO  && cp -rl ./$DIR_PDO/web ../web$DIR_PDO
		cp -rl ./$DIR_P711/apps ../apps$DIR_P711  && cp -rl ./$DIR_P711/web ../web$DIR_P711
		cp -rl ./$DIR_PINTE/apps ../apps$DIR_PINTE  && cp -rl ./$DIR_PINTE/web ../web$DIR_PINTE
		cp -rl ./$DIR_PINDU/apps ../apps$DIR_PINDU  && cp -rl ./$DIR_PINDU/web ../web$DIR_PINDU
		cp -rl ./$DIR_PMETA/apps ../apps$DIR_PMETA  && cp -rl ./$DIR_PMETA/web ../web$DIR_PMETA
		cp -rl ./$DIR_PPROE/apps ../apps$DIR_PPROE  && cp -rl ./$DIR_PPROE/web ../web$DIR_PPROE
		cp -rl ./$DIR_PROD/apps ../apps$DIR_PROD  && cp -rl ./$DIR_PROD/web ../web$DIR_PROD
		cp -rl ./$DIR_PROY/apps ../apps$DIR_PROY  && cp -rl ./$DIR_PROY/web ../web$DIR_PROY
		cp -rl ./$DIR_REPOR/apps ../apps$DIR_REPOR  && cp -rl ./$DIR_REPOR/web ../web$DIR_REPOR
		cp -rl ./$DIR_SUITE/apps ../apps$DIR_SUITE  && cp -rl ./$DIR_SUITE/web ../web$DIR_SUITE
		cp -rl ./$DIR_WORK/apps ../apps$DIR_WORK  && cp -rl ./$DIR_WORK/web ../web$DIR_WORK

	elif [ "$(ls ../apps/planificacion/)" ] || [ "$(ls ../web/planificacion/)" ]
	then

		echo "Los directorios de los modulos Planificacion ya contienen el codigo fuente."
		echo "Si decea hacer enlaces nuevos use la opcion '[7] Chequear enlaces a código fuente' del menu principal."

	fi
}

function logistica(){

	if [ ! -d ../apps/logistica/facturacion/ ] || [ ! -d ../web/logistica/facturacion/ ]
	then

		mkdir -p ../apps/logistica/facturacion/ ../web/logistica/facturacion/



		cp -rl ./$DIR_ATF/apps/ ../apps$DIR_ATF && cp -rl ./$DIR_FACT/apps/ ../apps$DIR_FACT/facturacion/
		cp -rl ./$DIR_DISTR/apps/ ../apps$DIR_DISTR && cp -rl ./$DIR_MAGE/apps/ ../apps$DIR_FACT/magentoadmin/
		cp -rl ./$DIR_INVT/apps/ ../apps$DIR_INVT && cp -rl ./$DIR_PUNTV/apps/ ../apps$DIR_FACT/puntoventa/
		cp -rl ./$DIR_TALL/apps/ ../apps$DIR_TALL && cp -rl ./$DIR_UTIL/apps/ ../apps$DIR_UTIL
		cp -rl ./$DIR_LCOMUN/ ../apps/$DIR_LCOMUN/
		cp -rl ./$DIR_ATF/web/ ../web$DIR_ATF && cp -rl ./$DIR_FACT/web/ ../web$DIR_FACT/facturacion/
		cp -rl ./$DIR_DISTR/web/ ../web$DIR_DISTR && cp -rl ./$DIR_MAGE/web/ ../web$DIR_FACT/magentoadmin/
		cp -rl ./$DIR_INVT/web/ ../web$DIR_INVT && cp -rl ./$DIR_PUNTV/web/ ../web$DIR_FACT/puntoventa/
		cp -rl ./$DIR_TALL/web/ ../web$DIR_TALL && cp -rl ./$DIR_UTIL/web/ ../web$DIR_UTIL
		cp -rl ./$DIR_PRO/apps/ ../apps/$DIR_PRO && cp -rl ./$DIR_PRO/web/ ../web/$DIR_PRO
		cp -rl ./$DIR_FARM/apps/ ../apps/$DIR_FARM && cp -rl ./$DIR_FARM/web/ ../web/$DIR_FARM
		cp -rl ./$DIR_COMB/apps/ ../apps/$DIR_COMB && cp -rl ./$DIR_COMB/web/ ../web/$DIR_COMB


	elif [ "$(ls ../apps/logistica/)" ] || [ "$(ls ../web/logistica/)" ]
	then

		echo "Los directorios de los modulos Logistica ya contienen el codigo fuente."
		echo "Si decea hacer enlaces nuevos use la opcion '[7] Chequear enlaces a código fuente' del menu principal."

	fi
}


function contabilidad(){

	if [ ! -d ../apps/contabilidad/ ] || [ ! -d ../web/contabilidad/ ]
	then

		mkdir -p ../apps/contabilidad/ ../web/contabilidad/



		cp -rl ./$DIR_AUDIT/apps/ ../apps$DIR_AUDIT &&cp -rl ./$DIR_BANCO/apps/ ../apps$DIR_BANCO
		cp -rl ./$DIR_CAJA/apps/ ../apps$DIR_CAJA && cp -rl ./$DIR_COPA/apps/ ../apps$DIR_COPA
		cp -rl ./$DIR_COSTO/apps/ ../apps$DIR_COSTO && cp -rl ./$DIR_FINAN/apps/ ../apps$DIR_FINAN
		cp -rl ./$DIR_CCOMUN/apps/ ../apps$DIR_CCOMUN
		cp -rl ./$DIR_PRES/apps/ ../apps/$DIR_PRES && cp -rl ./$DIR_PRES/web/ ../web/$DIR_PRES
		cp -rl ./$DIR_AUDIT/web/ ../web$DIR_AUDIT && cp -rl ./$DIR_BANCO/web/ ../web$DIR_BANCO
		cp -rl ./$DIR_CAJA/web/ ../web$DIR_CAJA && cp -rl ./$DIR_COPA/web/ ../web$DIR_COPA
		cp -rl ./$DIR_COSTO/web/ ../web$DIR_COSTO && cp -rl ./$DIR_FINAN/web/ ../web$DIR_FINAN
		cp -rl ./$DIR_CCOMUN/web/ ../web$DIR_CCOMUN && cp -rl ./$DIR_CHELP/ ../web/$DIR_CHELP

	elif [ "$(ls ../apps/contabilidad/)" ] || [ "$(ls ../web/contabilidad/)" ]
	then

		echo "Los directorios de los modulos Contabilidad ya contienen el codigo fuente."
		echo "Si decea hacer enlaces nuevos use la opcion '[7] Chequear enlaces a código fuente' del menu principal."

	fi
}
#~======================= construir carpeta distra=================================

function crear_crm(){

	mkdir -p ./crm/crm/apps/ ./crm/crm/web/ ./crm/$DIR_CONF/apps/ ./crm/$DIR_CONF/web/ ./crm/$DIR_CLIP/apps/ ./crm/$DIR_CLIP/web/

	mkdir -p ./$DIR_NOMD/apps/ ./$DIR_NOMD/web/ ./$DIR_NOMG/apps/ ./$DIR_NOMG/web/ ./$DIR_AGRU/apps/ ./$DIR_AGRU/web/



	rsync -rza ../apps/crm/ ./crm/crm/apps && rsync -rza ../web/crm/ ./crm/crm/web
	rsync -rza ../apps/$DIR_CONF/ ./crm/$DIR_CONF/apps  && rsync -rza ../web/$DIR_CONF/ ./crm/$DIR_CONF/web
	rsync -rza ../apps/$DIR_CONF/$DIR_CLIP/ ./crm/$DIR_CLIP/apps  && rsync -rza ../web/$DIR_CONF/$DIR_CLIP/ ./crm/$DIR_CLIP/web

	rsync -rza ../apps/$DIR_CONF/nomdinamicos/ ./$DIR_NOMD/apps  && rsync -rza ../web/$DIR_CONF/nomdinamicos/ ./$DIR_NOMD/web 
	rsync -rza ../apps/$DIR_CONF/nomgenerales/ ./$DIR_NOMG/apps  && rsync -rza ../web/$DIR_CONF/nomgenerales/ ./$DIR_NOMG/web 
	rsync -rza ../apps/$DIR_CONF/agrupaciones/ ./$DIR_AGRU/apps  && rsync -rza ../web/$DIR_CONF/agrupaciones/ ./$DIR_AGRU/web 

	rm -rf ./crm/configuracion/apps/agrupaciones/ ./crm/configuracion/apps/nomdinamicos/ ./crm/configuracion/apps/nomgenerales/ ./crm/configuracion/apps/clientesyproveedores/ ./crm/configuracion/apps/integracionreportes/ 

	rm -rf ./crm/configuracion/web/agrupaciones/ ./crm/configuracion/web/nomdinamicos/ ./crm/configuracion/web/nomgenerales/ ./crm/configuracion/web/clientesyproveedores/ ./crm/configuracion/web/integracionreportes/

}

function crear_pvd(){

		mkdir -p ./$DIR_INTE/apps/ ./$DIR_INTE/web/ ./$DIR_RCOM/apps/ ./$DIR_RCOM/web/ ./$DIR_CAPC/web/ ./$DIR_CAPC/apps/ ./$DIR_EVAL/apps/

		mkdir -p ./$DIR_EVAL/web/ ./$DIR_MAST/web/ ./$DIR_MAST/apps/ ./$DIR_MOVL/apps/ ./$DIR_MOVL/web/ ./$DIR_NOMI/web/ ./$DIR_NOMI/apps/
		
		mkdir -p ./$DIR_NOMI/web/ ./$DIR_PERS/apps/ ./$DIR_PERS/web/ ./$DIR_REGIM/apps/ ./$DIR_REGIM/web/ ./$DIR_SELEC/apps/ ./$DIR_SELEC/web/

		mkdir -p ./$DIR_SST/apps/ ./$DIR_SST/web/ ./pvd$DIR_METAD/apps/ ./pvd$DIR_METAD/web/ ./pvd$DIR_RECC/apps/ ./pvd$DIR_RECC/web/ ./$DIR_COMP/apps/ ./$DIR_COMP/web/



rsync -rza ../apps/configuracion/integracionreportes/ ./$DIR_INTE/apps
rsync -rza ../web/configuracion/integracionreportes/ ./$DIR_INTE/web
rsync -rza ../apps$DIR_COMP/ ./$DIR_COMP/apps  && rsync -rza ../web$DIR_COMP/ ./$DIR_COMP/web
rsync -rza ../apps$DIR_RCOM/ ./$DIR_RCOM/apps  && rsync -rza ../web$DIR_RCOM/ ./$DIR_RCOM/web
rsync -rza ../apps$DIR_CAPC/ ./$DIR_CAPC/apps  && rsync -rza ../web$DIR_CAPC/ ./$DIR_CAPC/web
rsync -rza ../apps$DIR_EVAL/ ./$DIR_EVAL/apps  && rsync -rza ../web$DIR_EVAL/ ./$DIR_EVAL/web
rsync -rza ../apps$DIR_MAST/ ./$DIR_MAST/apps  && rsync -rza ../web$DIR_MAST/ ./$DIR_MAST/web
rsync -rza ../apps$DIR_MOVL/ ./$DIR_MOVL/apps  && rsync -rza ../web$DIR_MOVL/ ./$DIR_MOVL/web
rsync -rza ../apps$DIR_NOMI/ ./$DIR_NOMI/apps  && rsync -rza ../web$DIR_NOMI/ ./$DIR_NOMI/web
rsync -rza ../apps$DIR_PERS/ ./$DIR_PERS/apps  && rsync -rza ../web$DIR_PERS/ ./$DIR_PERS/web
rsync -rza ../apps$DIR_REGIM/ ./$DIR_REGIM/apps  && rsync -rza ../web$DIR_REGIM/ ./$DIR_REGIM/web
rsync -rza ../apps$DIR_SELEC/ ./$DIR_SELEC/apps  && rsync -rza ../web$DIR_SELEC/ ./$DIR_SELEC/web
rsync -rza ../apps$DIR_SST/ ./$DIR_SST/apps  && rsync -rza ../web$DIR_SST/ ./$DIR_SST/web
rsync -rza ../apps$DIR_METAD/ ./pvd$DIR_METAD/apps  && rsync -rza ../web$DIR_METAD/ ./pvd$DIR_METAD/web
rsync -rza ../apps$DIR_RECC/ ./pvd$DIR_RECC/apps  && rsync -rza ../web$DIR_RECC/ ./pvd$DIR_RECC/web

}
function crear_planificacion(){

		mkdir -p ./$DIR_PCOMUN/apps/ ./$DIR_PCOMUN/web/ ./$DIR_PHELP/ ./$DIR_RESOUR/ ./$DIR_HERRA/apps ./$DIR_HERRA/web ./$DIR_INVER/apps ./$DIR_INVER/web 

		mkdir -p ./$DIR_PDO/apps ./$DIR_PDO/web ./$DIR_P711/apps ./$DIR_P711/web ./$DIR_PINTE/apps ./$DIR_PINTE/web ./$DIR_PINDU/apps ./$DIR_PINDU/web

		mkdir -p ./$DIR_PMETA/apps ./$DIR_PMETA/web ./$DIR_PPROE/apps ./$DIR_PPROE/web ./$DIR_PROD/apps ./$DIR_PROD/web ./$DIR_PROY/apps ./$DIR_PROY/web

		mkdir -p /$DIR_REPOR/apps ./$DIR_REPOR/web ./$DIR_SUITE/apps ./$DIR_SUITE/web ./$DIR_WORK/apps ./$DIR_WORK/web ./$DIR_INVERP/apps ./$DIR_INVERP/web 

		rsync -rza ../apps$DIR_PCOMUN/ ./$DIR_PCOMUN/apps  && rsync -rza ../web$DIR_PCOMUN/ ./$DIR_PCOMUN/web
		rsync -rza ../web$DIR_PHELP/ ./$DIR_PHELP  && rsync -rza ../web$DIR_RESOUR/ ./$DIR_RESOUR
		rsync -rza ../apps$DIR_HERRA/ ./$DIR_HERRA/apps   && rsync -rza ../web$DIR_HERRA/ ./$DIR_HERRA/web

		rsync -rza ../apps$DIR_INVER/ ./$DIR_INVER/apps && rsync -rza ../web$DIR_INVER/ ./$DIR_INVER/web 
		rsync -rza ../apps$DIR_INVERP/ ./$DIR_INVERP/apps   && rsync -rza ../web$DIR_INVERP/ ./$DIR_INVERP/web 
		rsync -rza ../apps$DIR_PDO/ ./$DIR_PDO/apps   && rsync -rza ../web$DIR_PDO/ ./$DIR_PDO/web 
		rsync -rza ../apps$DIR_P711/ ./$DIR_P711/apps   && rsync -rza ../web$DIR_P711/ ./$DIR_P711/web 
		rsync -rza ../apps$DIR_PINTE/ ./$DIR_PINTE/apps   && rsync -rza ../web$DIR_PINTE/ ./$DIR_PINTE/web 
		rsync -rza ../apps$DIR_PINDU/ ./$DIR_PINDU/apps   && rsync -rza ../web$DIR_PINDU/ ./$DIR_PINDU/web 
		rsync -rza ../apps$DIR_PMETA/ ./$DIR_PMETA/apps   && rsync -rza ../web$DIR_PMETA/ ./$DIR_PMETA/web 
		rsync -rza ../apps$DIR_PPROE/ ./$DIR_PPROE/apps   && rsync -rza ../web$DIR_PPROE/ ./$DIR_PPROE/web 
		rsync -rza ../apps$DIR_PROD/ ./$DIR_PROD/apps   && rsync -rza ../web$DIR_PROD/ ./$DIR_PROD/web 
		rsync -rza ../apps$DIR_PROY/ ./$DIR_PROY/apps   && rsync -rza ../web$DIR_PROY/ ./$DIR_PROY/web
		rsync -rza ../apps$DIR_REPOR/ ./$DIR_REPOR/apps   && rsync -rza ../web$DIR_REPOR/ ./$DIR_REPOR/web
		rsync -rza ../apps$DIR_SUITE/ ./$DIR_SUITE/apps   && rsync -rza ../web$DIR_SUITE/ ./$DIR_SUITE/web
		rsync -rza ../apps$DIR_WORK/ ./$DIR_WORK/apps   && rsync -rza ../web$DIR_WORK/ ./$DIR_WORK/web	


}
function crear_logisticaa(){
    mkdir -p ./testing/
}

function crear_logistica(){

		mkdir -p ./$DIR_ATF/apps/ ./$DIR_FACT/apps/ ./$DIR_DISTR/apps/ ./$DIR_MAGE/apps/ ./$DIR_INVT/apps/ ./$DIR_PUNTV/apps/ ./$DIR_TALL/apps/ ./$DIR_UTIL/apps/

		mkdir -p ./$DIR_LCOMUN/ ./$DIR_ATF/web/ ./$DIR_FACT/web/ ./$DIR_DISTR/web/ ./$DIR_MAGE/web/ ./$DIR_INVT/web/ ./$DIR_PUNTV/web/ ./$DIR_TALL/web/

		mkdir -p ./$DIR_UTIL/web/ ./$DIR_PRO/apps/ ./$DIR_PRO/web/ ./$DIR_FARM/apps/ ./$DIR_FARM/web/

		rsync -rza ../apps$DIR_ATF/ ./$DIR_ATF/apps  && rsync -rza ../apps$DIR_FACT/facturacion/ ./$DIR_FACT/apps 
		rsync -rza ../apps$DIR_DISTR/ ./$DIR_DISTR/apps  && rsync -rza ../apps$DIR_FACT/magentoadmin/ ./$DIR_MAGE/apps
		rsync -rza ../apps$DIR_INVT/ ./$DIR_INVT/apps  && rsync -rza ../apps$DIR_FACT/puntoventa/ ./$DIR_PUNTV/apps
		rsync -rza ../apps$DIR_TALL/ ./$DIR_TALL/apps  && rsync -rza ../apps$DIR_UTIL/ ./$DIR_UTIL/apps
		rsync -rza ../apps/$DIR_LCOMUN/ ./$DIR_LCOMUN 
		rsync -rza ../web$DIR_ATF/ ./$DIR_ATF/web && rsync -rza ../web$DIR_FACT/facturacion/ ./$DIR_FACT/web
		rsync -rza ../web$DIR_DISTR/ ./$DIR_DISTR/web  && rsync -rza ../web$DIR_FACT/magentoadmin/ ./$DIR_MAGE/web
		rsync -rza ../web$DIR_INVT/ ./$DIR_INVT/web  && rsync -rza ../web$DIR_FACT/puntoventa/ ./$DIR_PUNTV/web
		rsync -rza ../web$DIR_TALL/ ./$DIR_TALL/web  && rsync -rza ../web$DIR_UTIL/ ./$DIR_UTIL/web
		rsync -rza ../apps/$DIR_PRO/ ./$DIR_PRO/apps  && rsync -rza ../web/$DIR_PRO/ ./$DIR_PRO/web 
		rsync -rza ../apps/$DIR_FARM/ ./$DIR_FARM/apps  && rsync -rza ../web/$DIR_FARM/ ./$DIR_FARM/web
		#rsync -rza ../apps/$DIR_COMB/ ./$DIR_COMB/apps  && rsync -rza ../web/$DIR_COMB/ ./$DIR_COMB/web

}


function crear_contabilidad(){

		mkdir -p ./$DIR_AUDIT/apps/ $DIR_BANCO/apps/ ./$DIR_CAJA/apps/ ./$DIR_COPA/apps/ ./$DIR_COSTO/apps/ ./$DIR_FINAN/apps/ ./$DIR_CCOMUN/apps/ ./$DIR_CHELP/
		mkdir -p ./$DIR_PRES/apps/ ./$DIR_PRES/web/ ./$DIR_AUDIT/web/ ./$DIR_BANCO/web/ ./$DIR_CAJA/web/ ./$DIR_COPA/web/ ./$DIR_COSTO/web/ ./$DIR_FINAN/web/ ./$DIR_CCOMUN/web/

		rsync -rza ../apps$DIR_AUDIT/ ./$DIR_AUDIT/apps  &&rsync -rza ../apps$DIR_BANCO/ ./$DIR_BANCO/apps
		rsync -rza ../apps$DIR_CAJA/ ./$DIR_CAJA/apps  && rsync -rza ../apps$DIR_COPA/ ./$DIR_COPA/apps
		rsync -rza ../apps$DIR_COSTO/ ./$DIR_COSTO/apps  && rsync -rza ../apps$DIR_FINAN/ ./$DIR_FINAN/apps
		rsync -rza ../apps$DIR_CCOMUN/ ./$DIR_CCOMUN/apps 
		rsync -rza ../apps/$DIR_PRES/ ./$DIR_PRES/apps  && rsync -rza ../web/$DIR_PRES/ ./$DIR_PRES/web
		rsync -rza ../web$DIR_AUDIT/ ./$DIR_AUDIT/web  && rsync -rza ../web$DIR_BANCO/ ./$DIR_BANCO/web
		rsync -rza ../web$DIR_CAJA/ ./$DIR_CAJA/web  && rsync -rza ../web$DIR_COPA/ ./$DIR_COPA/web
		rsync -rza ../web$DIR_COSTO/ ./$DIR_COSTO/web  && rsync -rza ../web$DIR_FINAN/ ./$DIR_FINAN/web
		rsync -rza ../web$DIR_CCOMUN/ ./$DIR_CCOMUN/web && rsync -rza ../web/$DIR_CHELP/ ./$DIR_CHELP
}
#~~


#~MENU AUXILIAR

function revisar_enlaces(){

	clear
	echo "+=========================================================+"
	echo "|          Chequear enlaces al codigo fuente              |"
	echo "+=========================================================+"
	echo "|  Seleccione el número de la acción que desea realizar:  |"
	echo "|---------------------------------------------------------|"
	echo "|  [1]  Contabilidad Financiera                           |"
	echo "|  [2]  CRM                                               |"
	echo "|  [3]  Logistica                                         |"
	echo "|  [4]  Planificacion                                     |"
	echo "|  [5]  RRHH                                              |"
	echo "|                                                         |"
	echo "|  [6]  Volver al menu principal                          |"
	echo "|  [7]  Salir de la herramienta                           |"
	echo "+---------------------------------------------------------+"
	while [ True ]
	do
		read -e -p "Introduzca la opcion deseada: " ACTION_TYPE
		case $ACTION_TYPE in
			1)  borrar_contabilidad ;contabilidad ;echo "Hecho" ;break ;;
            2)  borrar_crm ;crm ;echo "Hecho" ;break ;;
            3)  borrar_logistica ;logistica ;echo "Hecho" ;break ;;
            4)  borrar_planificacion ;planificacion ;echo "Hecho" ;break ;;
			5)  borrar_pvd ;pvd ;echo "Hecho" ;break ;;
			6)  main ;;
			7)	exit ;;
			*)	echo "Opcion no valida." ;;
		esac
	done

}

#~MENU PRINCIPAL

function main(){

	clear

	echo "+=======================================================+"
	echo "|          Herramienta para construir Distra            |"
	echo "+=======================================================+"
	echo "|     Seleccione la rama de codigo fuente que usara:    |"
	echo "|-------------------------------------------------------|"
	echo "|                       RAMAS                           |"
	echo "|  [1]  dev                                             |"
	echo "|  [2]  master                                          |"
	echo "|                   OTRAS OPCIONES                      |"
	echo "|  [5]  Salir de la herramienta                         |"
	echo "|  [6]  Borrar construccion actual                      |"
	echo "|  [7]  Chequear enlaces a código fuente                |"
	echo "|                                                       |"
	echo "| NOTA: Al elegir una rama perdera los cambios agregados|"
	echo "|       localmente al codigo.                           |"
	echo "+-------------------------------------------------------+"

    while [ True ]
        do
            read -e -p "Introduzca la opcion deseada: " ACTION_TYPE
            case $ACTION_TYPE in
                    1)      BRANCH="dev" ;descargar_rama ;echo "Construyendo aplicacion..." ;construir ;echo "Hecho" ;break ;;
                    2)      BRANCH="master" ;descargar_rama ;echo "Construyendo aplicacion..." ;construir ;echo "Hecho" ;break ;;
		    		5)	    exit ;;
		    		6)      borrar_enlaces ;echo "Construccion borrada" ;;
			        7)      revisar_enlaces ;break ;;
                    *)      echo "Debe elegir una opcion." ;;
                esac
    	done
}

#~SETUP

if [ $# != 0 ]
then
 #~PARAMETROS PARA EL GITLAB-RUNNER E INSTALADOR
        if [ $1 = 1 ]
        then

			echo "Construyendo aplicacion..."
            construir
			echo "Hecho"
            exit 0

		elif [ $1 = 2 ]
		then 
			construir_2
			exit 0

        elif [ $1 = distra/contabilidad/distra ]
		then

			borrar_contabilidad
			contabilidad
			exit 0

        elif [ $1 = distra/logistica/distra ]
		then

			borrar_logistica
			logistica
			exit 0
        elif [ $1 = distra/crm/distra ]
		then

			borrar_crm
			crm
			exit 0
        elif [ $1 = distra/planificacion/distra ]
		then

			borrar_planificacion
			planificacion
			exit 0
        elif [ $1 = distra/pvd/distra ]
		then

			borrar_pvd
			pvd
			exit 0
		else
                ayuda
                exit 1
        fi
else
        main
fi
