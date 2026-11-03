<?php

class DatActividadentidadsisplanproduccionesModel extends DatActividadentidadModel {

    public function listarActsNivActPorEntidad($params) {

        $arrayParametros = array();
        $arrayParametrosTotal = array();
        $condiciones = array();
        $addHaving = " ";
        $whereconsX = " where true ";
        $addHavingSUM = "HAVING true  ";
        $arraysalida = array_filter($params['id_especialidades']);

        if (empty($arraysalida)) {
            return -1;
        }
        //print_r($params);die;
        $strEntidades = implode(',', $params['entidades']);

        $strEspecialidades = implode(',', $arraysalida);
        $arrayParametros[0] = $params['idejercicio'];
        $arrayParametros[1] = $params['idespecialidad'];
        $arrayParametros[2] = $params['idespecialidad'];
        $arrayParametros[3] = $params['idejercicio'];
        $arrayParametros[4] = $params['identidad'];
        $arrayParametros[5] = $params['idespecialidad'];
        $arrayParametrosTotal[0] = $params['idespecialidad'];
        $arrayParametrosTotal[1] = $params['idejercicio'];
        $arrayParametrosTotal[2] = $params['idejercicio'];
        $arrayParametrosTotal[3] = $params['identidad'];
        /* aki se verifica si viene calcular importe */
        if ($params['calcularimporte'] == 'true') {
            $arrayParametros[0] = $params['idejercicio'];
            $arrayParametros[1] = $params['idespecialidad'];
            $arrayParametros[2] = $params['idespecialidad'];
            $arrayParametros[3] = $params['idejercicio'];
            $arrayParametros[4] = $params['idejercicio'];
            $arrayParametros[5] = $params['identidad'];
            $arrayParametros[6] = $params['idespecialidad'];
            $arrayParametrosImp[0] = $params['idespecialidad'];
            $arrayParametrosImp[1] = $params['idejercicio'];
            $arrayParametrosImp[2] = $params['idejercicio'];
            $arrayParametrosImp[3] = $params['identidad'];
        }
        if ($params['calcularimporte'] == 'true') {
            $arrayParametros[0] = $params['idejercicio'];
            $arrayParametros[1] = $params['idespecialidad'];
            $arrayParametros[2] = $params['idespecialidad'];
            $arrayParametros[3] = $params['idejercicio'];
            $arrayParametros[4] = $params['idejercicio'];
            $arrayParametros[5] = $params['identidad'];
            $arrayParametros[6] = $params['idespecialidad'];
            $arrayParametrosImp[0] = $params['idespecialidad'];
            $arrayParametrosImp[1] = $params['idejercicio'];
            $arrayParametrosImp[2] = $params['idejercicio'];
            $arrayParametrosImp[3] = $params['identidad'];
        }
        $iddatosnomanclador = DatActespcomportamiento::obtenerIdDatosNom();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = "a.codigo LIKE '" . $datos['data']['value'] . "%'";
                    $arrayParametros[] = $datos['data']['value'] . "%";
                    $arrayParametrosTotal[] = $datos['data']['value'] . "%";
                    $arrayParametrosImp[] = $datos['data']['value'] . "%";
                } else {
                    if ($datos['field'] == 'denominacion') {
                        $condiciones[] = "upper(a.denominacion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                    } else {
                        if ($datos['field'] == 'descripcion') {
                            $condiciones[] = "upper(a.descripcion) LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                        } else {
                            if ($datos['field'] == 'denespecialidad') {
                                $condiciones[] = "a.idespecialidad = " . $datos['data']['value'] . " ";
                                $arrayParametros[] = $datos['data']['value'];
                                $arrayParametrosTotal[] = $datos['data']['value'];
                                $arrayParametrosImp[] = $datos['data']['value'];
                            } else {
                                if ($datos['field'] == 'comportamiento') {
                                    $comportamiento = array();
                                    $comportamiento = split(",", $datos['data']['value']);
                                    $iddatosnom = array();
                                    $iddatosnomcad = '';
                                    foreach ($comportamiento as $dat) {
                                        if ($dat == 'Propia') {
                                            $iddatosnom[] = $iddatosnomanclador['propia'];
                                        }
                                        if ($dat == 'Demandada') {
                                            $condicionescomport[] = "aec.iddatosnomenclador = " . $iddatosnomanclador['demandada'] . " ";
                                            $iddatosnom[] = $iddatosnomanclador['demandada'];
                                        }
                                        if ($dat == 'Compartida') {
                                            $condicionescomport[] = "aec.iddatosnomenclador = " . $iddatosnomanclador['compartida'] . " ";
                                            $iddatosnom[] = $iddatosnomanclador['compartida'];
                                        }
                                    }
                                    if ($iddatosnom[0]) {
                                        $iddatosnomcad = implode(',', $iddatosnom);
                                        $condiciones[] = "aec.iddatosnomenclador IN ($iddatosnomcad)";
                                    }
                                } else {
                                    if ($datos['field'] == 'nivelactividadautomatico' || $datos['field'] == 'nivelactividadmanual' ||
                                            $datos['field'] == 'nivelactividadproduccion' || $datos['field'] == 'nivelactividad' ||
                                            $datos['field'] == 'restoxdistrib' || $datos['field'] == 'ajuste' || $datos['field'] == 'nivelactividadajuste' ||
                                            $datos['field'] == 'importe' || $datos['field'] == 'importeajustado' || $datos['field'] == 'importefinal' || $datos['field'] == 'nivelactividadct'
                                    ) {
                                        if ($datos['data']['comparison'] == 'lt') {
                                            $sqlSigno = "<";
                                        } else {
                                            if ($datos['data']['comparison'] == 'gt') {
                                                $sqlSigno = ">";
                                            } else {
                                                $sqlSigno = "=";
                                            }
                                        }

                                        if ($datos['field'] == 'nivelactividadautomatico') {
                                            self::addHavigConParamsFoo($addHavingSUM, " ROUND(COALESCE(SUM(x.nivelactividadautomatico), 0),4)" . $sqlSigno, $datos['data']['value']);
                                        }
                                        if ($datos['field'] == 'nivelactividadmanual') {
                                            self::addHavigConParamsFoo($addHavingSUM, " ROUND(COALESCE(SUM(x.nivelactividadmanual), 0),4)" . $sqlSigno, $datos['data']['value']);
                                        }
                                        if ($datos['field'] == 'nivelactividadproduccion') {
                                            self::addHavigConParamsFoo($addHavingSUM, " ROUND(COALESCE(SUM(x.nivelactividadproduccion), 0),4)" . $sqlSigno, $datos['data']['value']);
                                        }
                                        if ($datos['field'] == 'nivelactividad') {
                                            self::addHavigConParamsFoo($addHavingSUM, " ROUND(COALESCE(SUM(x.nivelactividad), 0),4)" . $sqlSigno, $datos['data']['value']);
                                        }
                                        if ($datos['field'] == 'nivelactividadct') {
                                            self::addHavigConParamsFoo($addHavingSUM, " ROUND(COALESCE(SUM(x.nivelactividadct), 0),4)" . $sqlSigno, $datos['data']['value']);
                                        }
                                        if ($datos['field'] == 'restoxdistrib') {
                                            $whereconsX .= "and x.restoxdistrib " . $sqlSigno . $datos['data']['value'];
                                        }
                                        if ($datos['field'] == 'ajuste') {
                                            self::addHavigConParamsFoo($addHavingSUM, " ROUND(COALESCE(SUM(x.ajuste), 0),4)" . $sqlSigno, $datos['data']['value']);
                                        }
                                        if ($datos['field'] == 'nivelactividadajuste') {
                                            self::addHavigConParamsFoo($addHavingSUM, " ROUND((COALESCE(SUM(x.nivelactividad), 0)+COALESCE(SUM(x.ajuste),0)),4)" . $sqlSigno, $datos['data']['value']);
                                        }
                                        if ($datos['field'] == 'importe') {
                                            self::addHavigConParamsFoo($addHavingSUM, " SUM(x.importesumado)" . $sqlSigno, $datos['data']['value']);
                                        }
                                        if ($datos['field'] == 'importeajustado') {
                                            self::addHavigConParamsFoo($addHavingSUM, " SUM(x.importeajuste)" . $sqlSigno, $datos['data']['value']);
                                        }
                                        if ($datos['field'] == 'importefinal') {
                                            self::addHavigConParamsFoo($addHavingSUM, " SUM(x.importefinal)" . $sqlSigno, $datos['data']['value']);
                                        }
                                    } else {
                                        if ($datos['field'] == 'idaprobacion') {
                                            if ($datos['data']['value'] == 'No') {
                                                $whereconsX .= " and x.idaprobacion = 1";
                                            } else {
                                                if ($datos['data']['value'] == 'Si' || $datos['data']['value'] == 'Sí') {
                                                    $whereconsX .= " and x.idaprobacion >= 3";
                                                } else {
                                                    if ($datos['data']['value'] == 'Rector') {
                                                        $whereconsX .= " and x.idaprobacion = 4";
                                                    } else {
                                                        if ($datos['data']['value'] == 'Ajuste') {
                                                            $whereconsX .= " and x.idaprobacion = 5";
                                                        }
                                                    }
                                                }
                                            }
                                        } else {
                                            if ($datos['field'] == 'denmodelo') {
                                                if ($datos['data']['value'] == '-')
                                                    $condiciones[] = "mod.idmodelo IS NULL";
                                                else
                                                    $condiciones[] = "mod.idmodelo = {$datos ['data']['value']}";
                                            } else {
                                                if ($datos['field'] == 'desglosada') {
                                                    if ($datos['data']['value'] == 'No') {
                                                        $addHavingSUM .= " and COALESCE(MIN(x.desglosada),0) = 0";
                                                    }
                                                    if ($datos['data']['value'] == 'Sí' || $datos['data']['value'] == 'Si') {
                                                        $addHavingSUM .= " and COALESCE(MIN(x.desglosada),0) =1";
                                                    }
                                                    if ($datos['data']['value'] == 'Parcial' || $datos['data']['value'] == 'Parcial') {
                                                        $addHavingSUM .= " and COALESCE(MIN(x.desglosada),0) =2";
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }

        $HAVING = " HAVING true ";
        foreach ($arrayHaving as $condicion) {
            if ($HAVING == "") {
                $HAVING = 'AND ' . $condicion;
            } else {
                $HAVING = $HAVING . " AND " . $condicion;
            }
        }
        /*         * ****** FIN FILTROS ******* */
        $innerJoinNormaIndicador = "";
        $groupBy = "";


        if ($params['calcularimporte'] == 'true') {
            $calImporte = "(

                select (Coalesce(SUM((n.necesidad) * indp.precio) *
                (ROUND(COALESCE(aem.nivelactividadmanual, 0),4) + 
                ROUND(COALESCE(aea.nivelactividadautomatico, 0),4) + 
		ROUND(COALESCE(SUM(aect.nivelactividadproduccion),0),4) +
                ROUND(COALESCE(aep.nivelactividadproduccion, 0),4)), 0) +
                
                (Coalesce(SUM((n.necesidad) * indp.precio * indp.flete) *                
                (ROUND(COALESCE(aem.nivelactividadmanual, 0),4) + 
                ROUND(COALESCE(aea.nivelactividadautomatico, 0),4) + 
		ROUND(COALESCE(SUM(aect.nivelactividadproduccion),0),4) +
                ROUND(COALESCE(aep.nivelactividadproduccion, 0),4)), 0)) / 100 +               
                
                
                (Coalesce(SUM((n.necesidad) * indp.precio * indp.contingencia)*
                (ROUND(COALESCE(aem.nivelactividadmanual, 0),4) + 
                ROUND(COALESCE(aea.nivelactividadautomatico, 0),4) + 
		ROUND(COALESCE(SUM(aect.nivelactividadproduccion),0),4) +
                ROUND(COALESCE(aep.nivelactividadproduccion, 0),4)), 0)) / 100) as importeajuste
                

                from mod_planificacion.dat_norma n
                     INNER JOIN mod_datosmaestros.nom_indicador ind ON (n.idindicador = ind.idindicador AND ind.estado = 1)
                     INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON (n.idindicador = indp.idindicador AND indp.nivelplanif = 1  AND (indp.idaprobacion = 3 OR indp.idaprobacion = 4))
                where n.idactividad = a.idactividad AND
                      n.idejercicio = {$params['idejercicio']})";

            $calImporteAjustado = "(
                select (SUM((n.necesidad) * indp.precio) *
                  ROUND(COALESCE(ae.ajuste, 0),4) +
                  (SUM((n.necesidad) *indp.precio * indp.flete) * 
                  ROUND(COALESCE(ae.ajuste, 0),4)) / 100 +
                  (SUM((n.necesidad) * indp.precio *indp.contingencia) * 
                  ROUND(COALESCE(ae.ajuste, 0),4)) / 100) as  importeajustado
                from mod_planificacion.dat_norma n
                     INNER JOIN mod_datosmaestros.nom_indicador ind ON (n.idindicador = ind.idindicador AND ind.estado = 1)
                     INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON (n.idindicador = indp.idindicador AND indp.nivelplanif = 1  AND (indp.idaprobacion = 3 OR indp.idaprobacion = 4))
                where n.idactividad = a.idactividad AND
                      n.idejercicio = {$params ['idejercicio'] })";


            $calImporteFinal = "(
                select (Coalesce(SUM((n.necesidad) * indp.precio)*
                (ROUND(COALESCE(aem.nivelactividadmanual, 0),4) + 
                ROUND(COALESCE(aea.nivelactividadautomatico, 0),4) + 
		ROUND(COALESCE(SUM(aect.nivelactividadproduccion),0),4) +
                ROUND(COALESCE(aep.nivelactividadproduccion, 0),4)), 0) +
                

                (Coalesce(SUM((n.necesidad) * indp.precio * indp.flete) *
                (ROUND(COALESCE(aem.nivelactividadmanual, 0),4) + 
                ROUND(COALESCE(aea.nivelactividadautomatico, 0),4) + 
		ROUND(COALESCE(SUM(aect.nivelactividadproduccion),0),4) +
                ROUND(COALESCE(aep.nivelactividadproduccion, 0),4)), 0)) / 100 +
                
                (Coalesce(SUM((n.necesidad) * indp.precio * indp.contingencia)*
                (ROUND(COALESCE(aem.nivelactividadmanual, 0),4) + 
                ROUND(COALESCE(aea.nivelactividadautomatico, 0),4) + 
		ROUND(COALESCE(SUM(aect.nivelactividadproduccion),0),4) +
                ROUND(COALESCE(aep.nivelactividadproduccion, 0),4)), 0)) / 100 +
                
                (round(SUM((n.necesidad) * indp.precio) * 
                ROUND(COALESCE(ae.ajuste, 0),4) +
                (SUM((n.necesidad) * indp.precio * indp.flete) * 
                ROUND(COALESCE(ae.ajuste, 0),4)) / 100 +
                (SUM((n.necesidad) * indp.precio * indp.contingencia) * 
                ROUND(COALESCE(ae.ajuste, 0),4)) / 100, 3))) as importefinal
                  
                  
                from mod_planificacion.dat_norma n
                     INNER JOIN mod_datosmaestros.nom_indicador ind ON (
                       n.idindicador = ind.idindicador AND ind.estado = 1)
                     INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON (
                       n.idindicador = indp.idindicador AND indp.nivelplanif = 1
                       AND (indp.idaprobacion = 3 OR indp.idaprobacion = 4))
                where n.idactividad = a.idactividad AND
                      n.idejercicio = {$params ['idejercicio'] })";
        } else {
            $calImporte = 0;
            $calImporteAjustado = 0;
            $calImporteFinal = 0;
        }

        if (!$params['start']) {
            $params['start'] = 0;
        }
        if (!$params['limit']) {
            $params['limit'] = 1;
        }
        /* consolidar */
        if ($params['exportar']) {
            $offsetLimit = "";
            //$WhereExportarNivel = " AND ROUND(aem.nivelactividadmanual,4) > 0";
            $WhereExportarNivel = "";
        } else {
            $WhereExportarNivel = "";
            $offsetLimit = " OFFSET  {$params['start']}
                        LIMIT  {$params['limit']}";
        }

        $principoconsultaImportesTotales = "SELECT SUM (foo.importesumado),
                                            SUM (foo.importeajuste),
                                            SUM (foo.importefinal)
                                            FROM(";
        $finConsultaTotales = ") as foo";

        $conn = Doctrine_Manager::connection();
        $condicionPlan = '';
        $condicionPlanDos = '';
        if (isset($params['idmodelo'])) {
            $condicionPlan = " AND am.idmodelo = {$params['idmodelo']} AND ae.idaprobacion >= 3 ";


            $condicionPlanDos = " AND COALESCE(MIN(x.desglosada),0)=1 ";
        }

        $importes = "";
        $sumaimporte = "";

        if (isset($params['columnasamostrar'])) {
            if (in_array('importe', $params['columnasamostrar'])) {
                $importes .= " $calImporte as importesumado,";
                $sumaimporte .= "SUM(x.importesumado) as importesumado,";
            } else {
                $importes .= " 0 as importesumado,";
                $sumaimporte .= "SUM(x.importesumado) as importesumado,";
            }

            if (in_array('importeajustado', $params['columnasamostrar'])) {
                $importes .= " $calImporteAjustado as importeajuste,";
                $sumaimporte .= "SUM(x.importeajuste) as importeajuste,";
            } else {
                $importes .= "0 as importeajuste,";
                $sumaimporte .= "SUM(x.importeajuste) as importeajuste,";
            }

            if (in_array('importefinal', $params['columnasamostrar'])) {
                $importes .= "  $calImporteFinal as importefinal,";
                $sumaimporte .= "SUM(x.importefinal) as importefinal,";
            } else {
                $importes .= "  0 as importefinal,";
                $sumaimporte .= "SUM(x.importefinal) as importefinal,";
            }
        } else {
            $importes .= " $calImporte as importesumado,";
            $sumaimporte .= "SUM(x.importesumado) as importesumado,";
            $importes .= " $calImporteAjustado as importeajuste,";
            $sumaimporte .= "SUM(x.importeajuste) as importeajuste,";
            $importes .= "  $calImporteFinal as importefinal,";
            $sumaimporte .= "SUM(x.importefinal) as importefinal,";
        }


        if (in_array('denmodelo', $params['columnasamostrar'])) {

            $addcolumnamodelox = ' x.idmodelo,x.denominacion as denmodelo,';
            $addcolumnamodelo = 'mod.idmodelo, mod.denominacion as denmodelo,';

            $innerJoiModelo = 'LEFT JOIN mod_planificacion.dat_modelo mod
                ON(mod.idmodelo = am.idmodelo)';
            $groupmodelo = 'mod.idmodelo,mod.denominacion,';
            $groupmodelox = 'x.idmodelo,x.denominacion,';
        }

        $sql = "SELECT count(*) OVER() as total,x.idactividad as idactividad,
    x.codigo,
    x.denominacion,
    x.denmodelo as denmodelo,
    x.idmodelo,
    ROUND(COALESCE(SUM(x.nivelactividadautomatico), 0),4) AS nivelactividadautomatico,
    ROUND(COALESCE(SUM(x.nivelactividadmanual), 0),4) AS nivelactividadmanual,
    ROUND(COALESCE(SUM(x.nivelactividadproduccion), 0),4) AS nivelactividadproduccion,
    ROUND(COALESCE(SUM(x.nivelactividadct), 0),4) AS nivelactividadct,
    x.descripcion,
    x.idespecialidad,
    ROUND(COALESCE(SUM(x.nivelactividad), 0),4) as nivelactividad,
    $sumaimporte
    ROUND(COALESCE(SUM(x.ajuste),0),4) as ajuste,
    x.idaprobacion,
    $addcolumnamodelox
    x.iddatosnomenclador,
    x.restoxdistrib,
    x.existe_demanda,
    COALESCE(MIN(x.desglosada),0) as desglosada,
    COALESCE(SUM(x.cantdesglosada),0) AS cantdesglosada
                FROM
                (
WITH cantdesg as (
                SELECT SUM(des.nivelactivdesglosado) as desglose, des.idactividadentidad
                FROM mod_planificacion.dat_desgloseentidadnivel des               
               GROUP BY des.idactividadentidad
              )                
SELECT
a.idactividad as idactividad,
a.codigo,
a.denominacion,
mod.denominacion as denmodelo,
mod.idmodelo,
ROUND(COALESCE(aea.nivelactividadautomatico, 0),4) AS nivelactividadautomatico,
ROUND(COALESCE(aem.nivelactividadmanual, 0),4) AS nivelactividadmanual,
ROUND(COALESCE(aep.nivelactividadproduccion,0),4) AS nivelactividadproduccion,
ROUND(COALESCE(SUM(aect.nivelactividadproduccion),0),4) AS nivelactividadct,
a.descripcion,
a.idespecialidad,
ROUND((ROUND(COALESCE(aea.nivelactividadautomatico, 0),4) +
       ROUND(COALESCE(aem.nivelactividadmanual, 0),4) +
       ROUND(COALESCE(aep.nivelactividadproduccion,0),4) +
       ROUND(COALESCE(SUM(aect.nivelactividadproduccion),0),4)),4)  as nivelactividad,
c.desglose as cantdesglosada,
 case
                when 
                c.desglose = 0 then 0
                WHEN
                c.desglose =(ROUND(COALESCE(aea.nivelactividadautomatico, 0),4) + ROUND(COALESCE(
                aem.nivelactividadmanual, 0),4) + ROUND(COALESCE(
                aep.nivelactividadproduccion, 0),4)+ ROUND(COALESCE(SUM(aect.nivelactividadproduccion),0),4) + ROUND(COALESCE(ae.ajuste, 0),4)) 
                then 1  
                WHEN                              
                c.desglose > 0 then 2
              end as desglosada,
$importes
                ROUND(COALESCE(ae.ajuste, 0), 4) as ajuste,
                COALESCE((SELECT DISTINCT MIN (idaprobacion)
                FROM mod_planificacion.dat_actividadentidad
                WHERE (identidad IN ({$strEntidades}) OR identidad IS NULL) AND idactividad = a.idactividad
                AND idejercicio = {$params['idejercicio']}),1) as idaprobacion,
                $addcolumnamodelo
                aec.iddatosnomenclador,
                ( ROUND(COALESCE ( anp.nivelproduccion,0),4) - COALESCE ( (SELECT SUM(

ROUND(COALESCE (subaem.nivelactividadmanual,0),4)+
ROUND(COALESCE(SUM(aect.nivelactividadproduccion),0),4)  +
ROUND(COALESCE (subaea.nivelactividadautomatico,0),4) +     COALESCE (subaep.nivelactividadproduccion,0) )



            FROM mod_planificacion.dat_actividadentidad subae
            LEFT JOIN mod_planificacion.dat_actividadentidadmanual subaem
            ON(subaem.idactividadentidad = subae.idactividadentidad)
            LEFT JOIN mod_planificacion.dat_actividadentidadautomatico subaea
            ON(subaea.idactividadentidad = subae.idactividadentidad)
            LEFT JOIN mod_planificacion.dat_actividadentidadproduccion subaep
            ON( subaep.idactividadentidad = subae.idactividadentidad)
	    LEFT JOIN mod_spouam.dat_actividadentidadprodcartatec subaect 
            ON (subaect.idactividadentidad = subae.idactividadentidad)
            WHERE subae.idejercicio = {$params['idejercicio']}
            AND subae.idactividadentidad is not null AND subae.identidad IN (-1)
            AND subae.idactividad = a.idactividad),0) )  as restoxdistrib,
            
                COALESCE((SELECT aec2.idespecialidad
                    FROM mod_planificacion.dat_actespcomportamiento aec2
                    WHERE a.idactividad = aec2.idactividad
                    AND a.idespecialidad  IN({$strEspecialidades})
                    AND aec2.iddatosnomenclador = 156  AND aec2.idespecialidad <> a.idespecialidad
                    OFFSET 0 LIMIT 1),0 ) as existe_demanda
            FROM mod_planificacion.nom_actividad a

            INNER JOIN mod_planificacion.dat_actespcomportamiento aec
                ON (a.idactividad = aec.idactividad AND aec.idespecialidad IN({$strEspecialidades}))
            INNER JOIN mod_planificacion.dat_norma n 
            ON (n.idactividad = a.idactividad and n.idejercicio={$params['idejercicio']})
            " . $innerJoinNormaIndicador . "
            LEFT JOIN mod_planificacion.dat_actividadentidad ae
                ON (ae.idactespcomportamiento = aec.idactespcomportamiento
      AND (ae.idejercicio =  {$params['idejercicio']} or ae.idejercicio is null)
             AND (ae.identidad IN ({$strEntidades}) or ae.identidad is null) )
            
            LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                ON(aem.idactividadentidad = ae.idactividadentidad)

            LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                ON(aea.idactividadentidad = ae.idactividadentidad)

            LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
                ON( aep.idactividadentidad = ae.idactividadentidad)
                
                LEFT JOIN mod_spouam.dat_actividadentidadprodcartatec aect 
                ON (aect.idactividadentidad = ae.idactividadentidad)

            LEFT JOIN mod_planificacion.dat_actividadmodelo am
                    ON(am.idactividad = a.idactividad)
            LEFT JOIN mod_planificacion.dat_modelo mod ON (mod.idmodelo =
             am.idmodelo)

            $innerJoiModelo

            LEFT JOIN mod_planificacion.dat_actividadnivelproduccion anp
                ON(anp.idactividad = a.idactividad)

 LEFT JOIN cantdesg c ON ae.idactividadentidad = c.idactividadentidad

            WHERE  a.nivel={$this->nivel} AND a.idaprobacion =4 AND a.estado=1 AND a.normada = 1 $WhereExportarNivel

            " . $WHERE . " " . $condicionPlan . "

            GROUP BY
                a.idactividad,
                a.codigo,
                a.denominacion,
                mod.denominacion,
                mod.idmodelo,
                a.descripcion,
                a.idespecialidad,
                ae.idactividadentidad,
                aea.nivelactividadautomatico,
                aem.nivelactividadmanual,
                aep.nivelactividadproduccion,
                $groupmodelo
                aec.iddatosnomenclador,
                aec.idespecialidad,
                anp.nivelproduccion,
                ae.identidad,
                ae.ajuste,
                c.desglose
                " . $groupBy . "
                " . $HAVING . $addHaving . "
                ORDER BY a.codigo) as x
                $whereconsX
                GROUP BY
                x.idactividad,
                x.codigo,
                x.denmodelo,
                x.descripcion,
                x.idespecialidad,
                x.idaprobacion,
                x.idmodelo,
                $groupmodelox
		        x.denominacion,
                x.iddatosnomenclador,
                x.idespecialidad,
                x.restoxdistrib,
                x.existe_demanda
                $addHavingSUM $condicionPlanDos
		ORDER BY x.codigo";
        // print_r($sql);        die;
        $data->data = $conn->execute($sql . $offsetLimit)->fetchAll(PDO::FETCH_ASSOC);

        $data->total = $data->data[0]['total'];

        /* CALCULAR IMPORTE TOTAL DE LAS ACTIVIDADES */
        $TOTAL = $conn->execute($principoconsultaImportesTotales . $sql . $finConsultaTotales)->fetchAll();
        $data->importe = number_format($TOTAL[0][0], '3', '.', ',');
        $data->importeajuste = number_format($TOTAL[0][1], '3', '.', ',');
        $data->importefinal = number_format($TOTAL[0][2], '3', '.', ',');


        /* FIN CALCULAR IMPORTE TOTAL DE LAS ACTIVIDADES */

        $this->nomenclador = new ZendExt_Nomencladores_ADT();

        $arrayTmpmodelos = array();
        foreach ($data->data as $indice => $valor) {
            $data->data[$indice]['importe_total_paginado'] = 333; //$importe_total;
            $data->data[$indice]['importe'] = number_format($valor['importesumado'], '3', '.', ',');
            $data->data[$indice]['importeajustado'] = number_format($valor['importeajuste'], '3', '.', ',');
            $data->data[$indice]['importefinal'] = number_format($valor['importefinal'], '3', '.', ',');
            $data->data[$indice]['identidad'] = ($valor['identidad'] != null) ? $valor['identidad'] : $params['identidad'];
            $data->data[$indice]['sololectura'] = false;
            $data->data[$indice]['esorigenautomatico'] = ($valor['nivelactividadautomatico'] > 0) ? '1' : '0';
            if ($arrayTmpmodelos['den_' . $valor['idmodelo']] == null && $valor['idmodelo'] != null) { //optimizado
                $arrayTmpmodelos['den_' . $valor['idmodelo']] = Doctrine::getTable('DatModelo')->find($valor['idmodelo'])->denominacion;
            }

            $data->data[$indice]['denmodelo'] = $arrayTmpmodelos['den_' . $valor['idmodelo']];

            $arrayTmpespecialidades = $this->integrator->datosmaestros->obtenerEspecialidadPorId($valor['idespecialidad']);

            $data->data[$indice]['denespecialidad'] = $arrayTmpespecialidades[0]->denespecialidad;
            if ($data->data[$indice]['idaprobacion'] >= 3) {
                $data->data[$indice]['sololectura'] = true;
            }
            $data->data[$indice]['comportamiento'] = -1;
            if ($valor['iddatosnomenclador'] == $iddatosnomanclador['demandada']) {
                $data->data[$indice]['comportamiento'] = '0';
            } else {
                if ($valor['iddatosnomenclador'] == $iddatosnomanclador['compartida']) {
                    $data->data[$indice]['comportamiento'] = '1';
                }
            }
            //$data->data[$indice]['nivelactividadct'] = '-';
            if ($valor['existe_demanda'] == null) {
                $data->data[$indice]['restoxdistrib'] = '-';
            }
            if ($valor['ajuste'] == '0.000') {
                $data->data[$indice]['ajuste'] = '0';
            }
        }

        return $data;
    }

    public function exportarAExcel($params) {


        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $idioma = $this->global->Perfil->idioma;
        $etiquetas = file_get_contents(
                $dirApps .
                "/planificacion/planmeta/views/idioma/{$idioma}/"
                . "bpgestnivelesactividad/bpgestnivelesactividad.json"
        );
        unset($idioma);
        unset($dirApps);
        $etiquetas = str_replace("{", "", $etiquetas);
        $etiquetas = str_replace("}", "", $etiquetas);
        $etiquetas = str_replace("\n", "", $etiquetas);
        $etiquetas = str_replace("'", "", $etiquetas);
        $importeajust = 'Importe Ajustado';
        $etiquetas = split(",", $etiquetas);
        $arrayEtiq = array();
        foreach ($etiquetas as $key => $valor) {
            $arrayEtiqueta = split(":", $valor);
            $indice = str_replace("\r", "", $arrayEtiqueta[0]);
            $indice = str_replace(" ", "", $indice);
            $arrayEtiq[$indice] = $arrayEtiqueta[1];
            unset($etiquetas[$key]);
        }
        unset($etiquetas);


        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=niveles.xls");
        header("Content-Transfer-Encoding: binary ");

        echo '<caption> ' . /* $arrayEtiq['lbNivelActividad'] . 'Entidad: '. utf8_decode($params['text']) . */ ' </caption>';
        echo "
        <table border=1 cellspacing=0 width=80%>

        <thead>

                <tr>
                    <td colspan= 15>  <b>Entidad: </b> <b>" . '' . utf8_decode($params['text']) . "</b>&nbsp;&nbsp;&nbsp;

                    </td>

                </tr>
            </thead>
        <tr>
            <th align=left>C&oacute;digo</th>
             <th align=left>Denominaci&oacute;n</th>
             <th align=left >Nivel autom&aacute;tico</th>
             <th align=left >Nivel manual</th>
             <th align=left >Nivel demandado</th>
              <th align=left >Nivel carta tecnol&oacute;gica</th>
             <th align=left >Nivel</th>
             <th align=left >Ajuste</th>
              <th align=left >Nivel ajustado</th>
             <th align=left>Aprobaci&oacute;n</th>
             <th align=left>Plan</th>
			 <th align=left>Rector</th>
			 <th align=left>Importe Inicial</th>
			 <th align=left>{$importeajust}</th>
			 <th align=left>Importe Final</th>
         </tr>";
        $arrayIdsaprobacion = array();
        $arrayIdsaprobacion['id_1'] = 'No';
        $arrayIdsaprobacion['id_3'] = 'Si';
        $arrayIdsaprobacion['id_4'] = 'Rector';
        $arrayIdsaprobacion['id_5'] = 'Rector';

        $params['iddatosnomanclador'] = DatActespcomportamiento::obtenerIdDatosNom();

        if ($params['glob'] == 'false') {
            $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($params['identidad']);
            if ($params['identidad'][0] != null || $params['identidad'][0] != '' || $params['identidad'][0]) {
                $params['identidad'] = $params['identidad'][0];
                $params['entidades'] = array('0' => $params['identidad']);
                $datosEntidad = $this->integrator->metadatos->DameEstructura(
                        $params['identidad']
                );

                $params['id_especialidades'] [] = $datosEntidad [0]->idespecialidad;

                if ($params['esrector'] == 'true') {
                    $params['idespecialidad'] = $datosEntidad [0]->idespecialidad;
                }

                //$cant = $this->listarActsNivActPorEntidad($params)->total;
            }
        } else {
            $security = ZendExt_Aspect_Security_Sgis::getInstance();
            $modeloActEnt = new DatActividadentidad();
            $params['entidades'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                            $params['identidad']
            );
            $var = implode(',', $params['entidades']);
            $params['entidades'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);

            if ($params['entidades'][0] != null) {

                $params['id_especialidades'] = array();
                $tempEspecialidades = array();
                $tempEspecialidades["id_" . $params['idespecialidad']] = $params['idespecialidad'];
                $cont = 0;
                $integrator = ZendExt_IoC::getInstance();
                foreach ($params['entidades'] as $valorIdentidad) {
                    $entidades[] = $integrator->metadatos->DameEstructura(
                            $valorIdentidad
                    );
                    $idEspecialidad = $entidades[$cont++][0]->idespecialidad;
                    $tempEspecialidades["id_" . $idEspecialidad] = $idEspecialidad;
                }
                foreach ($tempEspecialidades as $valorIdesp) {
                    $params['id_especialidades'][] = $valorIdesp;
                }
            }

            //$cant = $this->listarActsNivActPorEntidad($params)->total;
        }

        /* $cantxpag = 10000;
          $cantpag = (int) ($cant / $cantxpag);
          if (fmod($cant, $cantxpag) > 0) {
          $cantpag++;
          }
          unset($cant);
          $params['start'] = 0; //start
          $params['limit'] = $cantxpag; //limit */

        //for ($i = 0; $i < $cantpag; $i++) {
        $params['exportar'] = true;

        $arrayNivsact = $this->listarActsNivActPorEntidad($params);

        foreach ($arrayNivsact->data as $value) {
            // print_r( number_format($value['nivelactividadmanual'], '3', '.', ','));die;
            if ($value['idaprobacion'] < 1) {
                $value['idaprobacion'] = 1;
            }

            //nivelactividadct

            echo "<tr> <td align=right><font color=white>'</font>"
            . $value['codigo'] .
            "<font color=white>'</font></td>
             <td align=left>" . utf8_decode($value['denominacion']) . "</td>
             <td align=right>" . (($value['nivelactividadautomatico'] != null) ? number_format($value['nivelactividadautomatico'], '3', '.', ',') : '0') . "</td>
             <td align=right >" . (($value['nivelactividadmanual'] != null) ? number_format($value['nivelactividadmanual'], '3', '.', ',') : '0') . "</td>
             <td align=right >" . (($value['nivelactividadproduccion'] != null) ? number_format($value['nivelactividadproduccion'], '3', '.', ',') : '0') . "</td>
             <td align=right >" . (($value['nivelactividadct'] != null) ? number_format($value['nivelactividadct'], '3', '.', ',') : '0') . "</td>
             <td align=right >" . number_format($value['nivelactividad'], '3', '.', ',') . "</td>
             <td align=right >" . number_format($value['ajuste'], '3', '.', ',') . "</td>
              <td align=right >" . number_format($value['nivelactividad'] + $value['ajuste'], '3', '.', ',') . "</td>
             <td align=right >" . $arrayIdsaprobacion['id_' . round($value['idaprobacion'])] . "</td>
             <td align=left>" . (($value['denmodelo'] == null) ? "-" : utf8_decode($value['denmodelo'])) . "</td>
             <td align=right >" . $arrayIdsaprobacion['id_' . round($value['idaprobacion'])] . "</td>
             <td align=right>" . $value['importe'] . "</td>
             <td align=right>" . $value['importeajustado'] . "</td>
             <td align=right>" . $value['importefinal'] . "</td>
             </tr>";
        }
        // $params['start'] += $params['limit'];
        // }

        echo "<tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
             <th>Importe Total:</th>
             <td>" . $arrayNivsact->importe . "</td>
                 <td>" . $arrayNivsact->importeajuste . "</td>
             <td>" . $arrayNivsact->importefinal . "</td>
            </tr>
</table>";
    }

    public function exportarAExcelConDesgloses($params) {


        $tipomod = new NomTipomodelo();
        $columnasDinam = $tipomod->getColumnasDinamicasSegunModelo($params);
        $cantcolumnasDinam = count($columnasDinam);
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $idioma = $this->global->Perfil->idioma;
        $etiquetas = file_get_contents(
                $dirApps .
                "/planificacion/planmeta/views/idioma/{$idioma}/"
                . "bpgestnivelesactividad/bpgestnivelesactividad.json"
        );
        unset($idioma);
        unset($dirApps);
        $etiquetas = str_replace("{", "", $etiquetas);
        $etiquetas = str_replace("}", "", $etiquetas);
        $etiquetas = str_replace("\n", "", $etiquetas);
        $etiquetas = str_replace("'", "", $etiquetas);
        $importeajust = 'Importe Ajustado';
        $etiquetas = split(",", $etiquetas);
        $arrayEtiq = array();
        foreach ($etiquetas as $key => $valor) {
            $arrayEtiqueta = split(":", $valor);
            $indice = str_replace("\r", "", $arrayEtiqueta[0]);
            $indice = str_replace(" ", "", $indice);
            $arrayEtiq[$indice] = $arrayEtiqueta[1];
            unset($etiquetas[$key]);
        }
        unset($etiquetas);

        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=niveles_con_desgloses.xls");
        header("Content-Transfer-Encoding: binary ");

        $encabezado .= '<caption> ' . $arrayEtiq['lbNivelActividad'] . 'Entidad: ' . utf8_decode($params['text']) . ' </caption>';
        $encabezado .= "
        <table border=1 cellspacing=0 width=80%>
        <tr>
            <th align=left>C&oacute;digo</th>
             <th align=left>Denominaci&oacute;n</th>
             <th align=left >Nivel autom&aacute;tico</th>
             <th align=left >Nivel manual</th>
             <th align=left >Nivel demandado</th>
             <th align=left >Nivel carta tecnol&aacute;gica</th>
             <th align=left >Nivel</th>
             <th align=left >Ajuste</th>
              <th align=left >Nivel ajustado</th>
             <th align=left>Aprobaci&oacute;n</th>
             <th align=left>Plan</th>
			 <th align=left>Rector</th>
			 <th align=left>Importe Inicial</th>
			 <th align=left>{$importeajust}</th>
			 <th align=left>Importe Final</th>
			 <th align=left>Nivel Actividad</th>";
        foreach ($columnasDinam as $value) {
            $encabezado .= "<th align=left>" . $value['etiqueta'] . "</th>";
        }
        $encabezado .= "</tr>";
        $arrayIdsaprobacion = array();
        $arrayIdsaprobacion['id_1'] = 'No';
        $arrayIdsaprobacion['id_3'] = 'Si';
        $arrayIdsaprobacion['id_4'] = 'Rector';
        $arrayIdsaprobacion['id_5'] = 'Rector';

        $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($params['identidad']);
        if ($params['identidad'][0] != null || $params['identidad'][0] != '' || $params['identidad'][0]) {
            $params['identidad'] = $params['identidad'][0];
            $params['entidades'] = array('0' => $params['identidad']);
            $datosEntidad = $this->integrator->metadatos->DameEstructura(
                    $params['identidad']
            );

            $params['id_especialidades'] [] = $datosEntidad [0]->idespecialidad;

            if ($params['esrector'] == 'true') {
                $params['idespecialidad'] = $datosEntidad [0]->idespecialidad;
            }
        }

        $params['exportar'] = true;
        $arrayNivsact = $this->listarActsNivActPorEntidad($params);

        foreach ($arrayNivsact->data as $value) {
            if ($value['idaprobacion'] < 1) {
                $value['idaprobacion'] = 1;
            }
            $params['idactividad'] = $value['idactividad'];
            $params['identidad'] = $value['identidad'];
            $result = DatActividadentidad::getDatosDesgloseActividad($params);
            foreach ($result as $key => $valor) {
                $datostabla .= "<tr> <td align=right><font color=white>'</font>"
                        . $value['codigo'] .
                        "<font color=white>'</font></td>
             <td align=left>" . utf8_decode($value['denominacion']) . "</td>
             <td align=right>" . (($value['nivelactividadautomatico'] != null) ?
                                number_format(
                                        $value['nivelactividadautomatico'], '3', '.', ','
                                ) : '0') . "</td>

             <td align=right >" . (($value['nivelactividadmanual'] != null) ?
                                number_format(
                                        $value['nivelactividadmanual'], '3', '.', ','
                                ) :
                                '0') . "</td>
             <td align=right >" . (($value['nivelactividadproduccion'] != null) ?
                                number_format(
                                        $value['nivelactividadproduccion'], '3', '.', ','
                                ) : '0') . "</td>
             <td align=right >" . (($value['nivelactividadct'] != null) ? number_format($value['nivelactividadct'], '3', '.', ',') : '0') . "</td>
             <td align=right >" . number_format(
                                $value['nivelactividad'], '3', '.', ','
                        ) . "</td>
             <td align=right >" . number_format($value['ajuste'], '3', '.', ',')
                        . "</td>
                <td align=right >" . number_format(
                                $value['nivelactividad'] + $value['ajuste'], '3', '.', ','
                        ) . "</td>
             <td align=right >" . $arrayIdsaprobacion['id_' . round(
                                $value['idaprobacion']
                        )] .
                        "</td>
             <td align=left>" . (($value['denmodelo'] == null) ? "-" : utf8_decode($value['denmodelo'])) .
                        "</td>
			 <td align=right >" . $arrayIdsaprobacion['id_' . round(
                                $value['idaprobacion']
                        )] .
                        "</td>
             <td align=right>" . $value['importe'] . "</td>
             <td align=right>" . $value['importeajustado'] . "</td>
             <td align=right>" . $value['importefinal'] . "</td>";
                $datostabla .= "<td align=right>" . $valor['nivelactivdesglosado'] . "</td>";
                $denomDatos = explode(',', $valor['denominacion']);
                foreach ($denomDatos as $den) {
                    $datostabla .= "<td align=right>" . $den . "</td>";
                }
            }
        }

        $pie .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
             <th>Importe Total:</th><td>" . $arrayNivsact->importe . "</td>
             <td>" . $arrayNivsact->importeajuste . "</td><td>" . $arrayNivsact->importefinal . "</td></tr></table>";

        $tabla = $encabezado . $datostabla . $pie;
        echo $tabla;
    }

    private function addHavigConParamsFoo(&$addHaving, $columCond, $param) {
        $addHaving .= " AND " . $columCond . $param;
//$params_query[] = $param;
    }

    public function modificarNivelesActividad($params) {
        $iddatosnomenclador = DatActespcomportamiento::obtenerIdDatosNom();
        $arrayIddatosnomenclador = array($iddatosnomenclador['demandada'], $iddatosnomenclador['compartida'], $iddatosnomenclador['propia']);
        unset($iddatosnomenclador);

        foreach ($params['actividades'] as $nivactividad) {
            $asocActentalmacenado = DatActividadentidadprodcartatec::buscarXEjercicio($nivactividad->identidad, $nivactividad->idactividad, $params['idejercicio'], true, true, true, true)->getFirst();
            $idactividadentidadPadre = $asocActentalmacenado->idactividadentidad;

            if ($nivactividad->campo_modif == 'nivelactividadmanual') {
                $nivManual = 0;
                $nivelactividadmanual = round(doubleval($nivactividad->nivelactividadmanual), 4);
                if ($nivelactividadmanual <= 0) {
                    $flujo = 'elim';
                    if ($asocActentalmacenado->DatActividadentidadmanual->idactividadentidad) {
                        $asocActentalmacenado->DatActividadentidadmanual->delete();
                    }
                    if ($asocActentalmacenado->DatActividadentidadautomatico->idactividadentidad == null && $asocActentalmacenado->DatActividadentidadproduccion->idactividadentidad == null && $asocActentalmacenado->DatActividadentidadprodcartatec->idactividadentidad == null) {
                        if (is_object($asocActentalmacenado)) {
                            $asocActentalmacenado->delete();
                        }
                    }
                    /* Actualizar actividades asociadas por automatico */
                } else {
                    /* Adicionar o actualizar */
                    if ($asocActentalmacenado->DatActividadentidadmanual->idactividadentidad == null || $asocActentalmacenado->DatActividadentidadmanual->idactividadentidad == '') {
                        /* Adicionar */
                        $flujo = 'add';
                        $idactividadentidadPadre = $asocActentalmacenado->idactividadentidad;
                        if ($asocActentalmacenado->idactividadentidad == null) {
                            $nuevaAsocactent = $this->crearAsociacionActEnt($nivactividad->idactividad, $arrayIddatosnomenclador, $params['espcomp'], $nivactividad->identidad, $params['idejercicio']);
                            $idactividadentidadPadre = $nuevaAsocactent->idactividadentidad;
                        }

                        $nuevaAsocactentmanual = new DatActividadentidadmanual();
                        $nuevaAsocactentmanual->idactividadentidad = $idactividadentidadPadre;
                        $nuevaAsocactentmanual->nivelactividadmanual = $nivelactividadmanual;
                        $nivManual = $nivelactividadmanual;
                        $nuevaAsocactentmanual->save();
                        /* Actualizar actividades asociadas por automatico */
                    } else {
                        /* Actualizar */
                        $flujo = 'act';
                        $asocActentalmacenado->DatActividadentidadmanual->nivelactividadmanual = $nivelactividadmanual;
                        $nivManual = $nivelactividadmanual;
                        $asocActentalmacenado->DatActividadentidadmanual->save();
                        /* Actualizar actividades asociadas por automatico */
                    }
                }
            } else {
                if ($nivactividad->campo_modif == 'nivelactividadproduccion') {
                    $nivelactividadproduccion = round(doubleval($nivactividad->nivelactividadproduccion), 4);
                    if ($nivelactividadproduccion <= 0) {
                        $flujo = 'elimp';
                        if ($asocActentalmacenado->DatActividadentidadproduccion->idactividadentidad != null
                        ) {
                            $asocActentalmacenado->DatActividadentidadproduccion->delete();
                        }
                        if ($asocActentalmacenado->DatActividadentidadautomatico->idactividadentidad == null && $asocActentalmacenado->DatActividadentidadmanual->idactividadentidad == null && $asocActentalmacenado->DatActividadentidadprodcartatec->idactividadentidad == null) {
                            if (is_a($asocActentalmacenado, DatActividadentidad)) {
                                $asocActentalmacenado->delete();
                            }
                        }
                        /* Actualizar actividades asociadas por automatico */
                    } else {
                        /* Adicionar o actualizar */
                        if ($asocActentalmacenado->DatActividadentidadproduccion->idactividadentidad == null
                        ) {
                            /* Adicionar */
                            $flujo = 'addp';
                            $idactividadentidadPadre = $asocActentalmacenado->idactividadentidad;
                            if ($asocActentalmacenado->idactividadentidad == null) {
                                $nuevaAsocactentprimera = $this->crearAsociacionActEnt($nivactividad->idactividad, $arrayIddatosnomenclador, $params['espcomp'], $nivactividad->identidad, $params['idejercicio']);
                                $idactividadentidadPadre = $nuevaAsocactentprimera->idactividadentidad;
                            }
                            if ($nivelactividadproduccion != null) {
                                $nuevaAsocactentprod = new DatActividadentidadproduccion();
                                $nuevaAsocactentprod->idactividadentidad = $idactividadentidadPadre;
                                $nuevaAsocactentprod->nivelactividadproduccion = $nivelactividadproduccion;
                                $nivProd = $nivelactividadproduccion;
                                $nuevaAsocactentprod->save();
                            }
                            /* Actualizar actividades asociadas por automatico */
                        } else {
                            /* Actualizar */
                            $flujo = 'actp';
                            if ($asocActentalmacenado->DatActividadentidadproduccion->idactividadentidad != null) {
                                $asocActentalmacenado->DatActividadentidadproduccion->nivelactividadproduccion = $nivelactividadproduccion;
                                $nivProd = $nivelactividadproduccion;
                                $asocActentalmacenado->DatActividadentidadproduccion->save();
                            }
                            /* Actualizar actividades asociadas por automatico */
                        }
                    }
                } else {
                    if ($nivactividad->campo_modif == 'ajuste') {
                        $ajuste = round(doubleval($nivactividad->ajuste), 4);
                        if (is_a($asocActentalmacenado, DatActividadentidad)) {
                            $asocActentalmacenado->ajuste = $ajuste;
                            $asocActentalmacenado->save();
                        }
                    }
                }
            }
            if (is_a($asocActentalmacenado, DatActividadentidad)) {
                $asocActentalmacenado->free();
            }

            $this->actualizarAsociacionesAutomaticas($nivactividad->idactividad, $nivactividad->identidad, $params['espcomp'], $arrayIddatosnomenclador, $params['idejercicio']);
        }
        return true;
    }

    public function exportarCalculoAExcel($params) {
        $idestructura = $this->integrator->metadatos->DameEstructura($params['identidad']);
        $denent = $idestructura[0]->denominacion;
        $dir_apps = Zend_Registry::getInstance()->config->dir_aplication;
        $idioma = $this->global->Perfil->idioma;
        $etiquetas = file_get_contents($dir_apps . "/planificacion/planmeta/views/idioma/{$idioma}/bpgestnivelesactividadsisplanproducciones/bpgestnivelesactividad.json"
        );
        unset($idioma);
        unset($dir_apps);
        $etiquetas = str_replace("{", "", $etiquetas);
        $etiquetas = str_replace("}", "", $etiquetas);
        $etiquetas = str_replace("\n", "", $etiquetas);
        $etiquetas = str_replace("'", "", $etiquetas);
        $importeajust = 'Importe Ajustado';
        $etiquetas = split(",", $etiquetas);
        $array_etiq = array();
        foreach ($etiquetas as $key => $valor) {
            $array_etiqueta = split(":", $valor);
            $indice = str_replace("\r", "", $array_etiqueta[0]);
            $indice = str_replace(" ", "", $indice);
            $array_etiq[$indice] = $array_etiqueta[1];
            unset($etiquetas[$key]);
        }
        unset($etiquetas);

        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=niveles.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<caption> ' . $denent . '  </caption>';
        echo "
        <table border=1 cellspacing=0 width=60%>
        <tr>
             <th align=left>C&oacute;digo actividad</th>
             <th align=left>Denominaci&oacute;n actividad</th>
             <th align=left>Nivel actividad</th>
             <th align=left>C&oacute;digo</th>
             <th align=left>Denominaci&oacute;n</th>
             <th align=left >Unidad de medida</th>
             <th align=left >Esfera</th>
             <th align=left >Precio MN</th>
             <th align=left >Cantidad</th>
             <th align=left >Importe</th>
         </tr>";
        $array_idsaprobacion = array();
        $array_idsaprobacion['id_1'] = $array_etiq['lbNo'];
        $array_idsaprobacion['id_3'] = $array_etiq['lbSi'];
        $array_idsaprobacion['id_4'] = $array_etiq['lbRector'];
        $array_idsaprobacion['id_5'] = $array_etiq['lbRector'];
        $params['iddatosnomanclador'] = DatActespcomportamiento::obtenerIdDatosNom();
        if ($params['global'] == 'false') {
            $params['entidades'] [] = $params['identidad'];
        } else {
            $params['entidades'] = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
            $params['entidades'] [] = $params['identidad'];
        }
        $importePorAct = 0;
        $importeTotal = 0;
        $totaldata = DatBasescalculoproduccionesModel::exportarCalculoAExcel($params);
        foreach ($totaldata->data as $k => $value) {
            if ($totaldata->data[$k - 1]['codactividad'] != $value['codactividad']) {
                if ($k != 0) {
                    echo "  <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <th>Importe total por actividad:</th>
                            <th>" . $importePorAct . "</th>";
                }
                $importePorAct = 0;
                echo "<tr> <td align=right><font color=white>'</font>" . $value['codactividad'] . "<font color=white>'</font></td>
                        <td align=right><font color=white>'</font>" . $value['denomactividad'] . "<font color=white>'</font></td>
                        <td align=right><font color=white>'</font>" . $value['nivelactividad'] . "<font color=white>'</font></td>";
            } else {
                echo "<tr> <td align=right><font color=white>'</font>-<font color=white>'</font></td>
                        <td align=right><font color=white>'</font>-<font color=white>'</font></td>
                        <td align=right><font color=white>'</font>-<font color=white>'</font></td>";
            }
            echo "<td align=right><font color=white>'</font>" . $value['codigo'] . "<font color=white>'</font></td>
                     <td align=left>" . utf8_decode($value['denominacion']) . "</td>
                     <td align=center >" . $value['abrevum'] . "</td>
                     <td align=left >" . $value['denominacionmod'] . "</td>
                     <td align=right >" . $value['precio'] . "</td>
                     <td align=right >" . $value['necesidadredondeada'] . "</td>
                     <td align=right >" . $value['importe'] . "</td>
                     </tr>";
            $importePorAct += $value['importe'];
            $importeTotal += $value['importe'];
        }
        echo "  <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <th>Importe total por actividad:</th>
                            <th>" . $importePorAct . "</th>";
        echo "<tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
             <th>Importe Total:</th>
             <th>" . $importeTotal . "</th>
            </tr>
</table>";
    }

    public function aprobar_desaprobarTodosNivelesActividad($identidad, $idejercicio, $idaprobacion, $entidadesHijas = null, $esrector = null, $aux, $idespecialidades
    ) {
        $params['idejercicio'] = $idejercicio;
        $params['exportar'] = true;
        $params['id_especialidades'] = $idespecialidades;
        if ($entidadesHijas != null && $entidadesHijas[0] != null) {

            foreach ($entidadesHijas as $valueEnt) {
                $params['entidades'][0] = $valueEnt;

                $datos = self::listarActsNivActPorEntidad($params);

                foreach ($datos->data as $val) {
                    if ($val['nivelactividad'] > 0) {
                        $Where = "";
                        if ($esrector != true) {
                            $Where .= " AND idaprobacion <> 4";
                        }

                        if ($aux == "false") {
                            if ($idaprobacion == 5) {
                                $Where .= " AND idaprobacion = 4";
                                $Where .= " AND ajuste > 0";
                            }
                        }
                        $conn = Doctrine_Manager::connection();
                        $query = "UPDATE mod_planificacion.dat_actividadentidad
                         SET idaprobacion = $idaprobacion
                          WHERE  identidad IN ($valueEnt) AND idactividad={$val['idactividad']} AND idejercicio = $idejercicio $Where";
                        $conn->execute($query);
                    }
                }
            }
        } else {
            $params['entidades'][0] = $identidad;
            $data = self::listarActsNivActPorEntidad($params);
            foreach ($data->data as $val) {
                if ($val['nivelactividad'] > 0) {
                    $Where = "";
                    if ($esrector != true) {
                        $Where .= " AND idaprobacion <> 4";
                    }
                    if ($aux == "false") {
                        if ($idaprobacion == 5) {
                            $Where .= " AND idaprobacion = 4";
                            $Where .= " AND ajuste > 0";
                        }
                    }
                    $conn = Doctrine_Manager::connection();
                    $query = "UPDATE mod_planificacion.dat_actividadentidad
                         SET idaprobacion = $idaprobacion
                          WHERE  identidad = $identidad AND idactividad={$val['idactividad']} AND idejercicio = $idejercicio $Where";
                    $conn->execute($query);
                }
            }
        }

        return true;
    }

}
