<?php

class DatNivelactividadporfechaModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function insertardat_nivelactividadporfecha($dat_nivelactividadporfecha) {
        $dat_nivelactividadporfecha->save();
    }

    public function modificardat_nivelactividadporfecha($dat_nivelactividadporfecha) {
        $dat_nivelactividadporfecha->save();
    }

    public function eliminardat_nivelactividadporfecha($dat_nivelactividadporfecha) {
        $dat_nivelactividadporfecha->delete();
    }

    public function adicionar_modif_nivactporfecha($params) { ///idnivelactividadporfecha
        foreach ($params['desgloses'] as $desglose) {
            if ($desglose->idnivelactividadporfecha != null) {
                $objNivActPorFecha = Doctrine::getTable('DatNivelactividadporfecha')->find(
                        $desglose->idnivelactividadporfecha
                );
                $objNivActPorFecha->nivelactividad = $desglose->nivelactividad;
                $objNivActPorFecha->fechainicio = $desglose->fechainicio;
                $objNivActPorFecha->fechafin = $desglose->fechafin;
                $objNivActPorFecha->save();
            } else {
                $objNivActPorFecha = new DatNivelactividadporfecha();
                $objNivActPorFecha->idactividadentidad = $params['idactividadentidad'];
                $objNivActPorFecha->nivelactividad = $desglose->nivelactividad;
                $objNivActPorFecha->fechainicio = $desglose->fechainicio;
                $objNivActPorFecha->fechafin = $desglose->fechafin;
                $objNivActPorFecha->save();
            }
        }
        return '24';
    }

    public function listarNivelactividadporfecha($params) {
        //temporal falta el filtrado
        $query = new Doctrine_Query();
        $querytotal = new Doctrine_Query ();

        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos ['field'] == 'nivelactividad') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $query->addWhere("napf.nivelactividad <" . $datos ['data']['value']);
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $query->addWhere("napf.nivelactividad >" . $datos ['data']['value']);
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $query->addWhere("napf.nivelactividad =" . $datos ['data']['value']);
                    }
                } else {
                    if ($datos ['field'] == 'fechainicio') { //[data][comparision]  lt=antes 	gt=despues  eq=en
                        $fechainicio = explode('/', $datos ['data']['value']);
                        $fechainicio = $fechainicio[1] . '/' . $fechainicio[0] . '/' . $fechainicio[2];
                        if ($datos['data']['comparison'] == 'lt') {
                            $query->addWhere("napf.fechainicio <'" . $fechainicio . "'");
                        }
                        if ($datos['data']['comparison'] == 'gt') {
                            $query->addWhere("napf.fechainicio >'" . $fechainicio . "'");
                        }
                        if ($datos['data']['comparison'] == 'eq') {
                            $query->addWhere("napf.fechainicio ='" . $fechainicio . "'");
                        }
                    } else {
                        if ($datos ['field'] == 'fechafin') {
                            $fechafin = explode('/', $datos ['data']['value']);
                            $fechafin = $fechafin[1] . '/' . $fechafin[0] . '/' . $fechafin[2];
                            if ($datos['data']['comparison'] == 'lt') {
                                $query->addWhere("napf.fechafin <'" . $fechafin . "'");
                            }
                            if ($datos['data']['comparison'] == 'gt') {
                                $query->addWhere("napf.fechafin >'" . $fechafin . "'");
                            }
                            if ($datos['data']['comparison'] == 'eq') {
                                $query->addWhere("napf.fechafin ='" . $fechafin . "'");
                            }
                        }
                    }
                }
            }
        }
        $data->data = $query->from('DatNivelactividadporfecha napf')
                ->addWhere('napf.idactividadentidad = ?', array($params['idactividadentidad']))
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->offset($params['start'])
                ->limit($params['limit'])
                ->execute();

        $data->total = $querytotal->select('COUNT(*) as total')
                        ->from('DatNivelactividadporfecha napf')
                        ->addWhere('napf.idactividadentidad = ?', array($params['idactividadentidad']))
                        ->execute()->getFirst()->total;
        foreach ($data->data as $indice => $valor) {
            $data->data[$indice]['nivelactividad'] = number_format($valor['nivelactividad'], '3', '.', ',');
        }
        return $data;
    }

    public function eliminarDesgloses($params) {
        //temporal falta el filtrado
        if ($params['desgloses'][0] != null) {
            $query = new Doctrine_Query();
            $query->delete('DatNivelactividadporfecha')
                    ->from('DatNivelactividadporfecha napf')
                    ->addWhere('napf.idactividadentidad = ?', array($params['idactividadentidad']))
                    ->whereIn('napf.idnivelactividadporfecha', $params['desgloses'])
                    ->execute();
        }
        return '24';
    }

    public function listarNivsActAprob($params, $escont = 'noexp') {
        $array_idejercicio = NomEjercicioplanificacion::listarEjercicioActual();
        $array_format_ultinivel = NomActividad::obtener_ConfFormato_UltimoNivel();
        $idesp_logueada = $params['idespecialidad'];
        if ($idesp_logueada == null) {
            $idesp_logueada = ZendExt_GlobalConcept::getInstance()->Estructura->idespecialidad;
        }
        $query = Doctrine_Manager::connection();
        $iddatosnomanclador = DatActespcomportamiento::obtenerIdDatosNom();
        $condiciones = array();
        $condiciones_having = array();
        $array_parametros = array();
        if (is_array($params['filtros']))
            foreach ($params['filtros'] as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $condiciones[] = " a.codigo LIKE '" . $datos ['data']['value'] . "%'";
                } else if ($datos ['field'] == 'denominacion') {
                    $condiciones[] = "upper(a.denominacion) LIKE '" . strtoupper($datos ['data']['value']) . "%'";
                } else if ($datos ['field'] == 'descripcion') {
                    $condiciones[] = "upper(a.descripcion) LIKE '%" . strtoupper($datos ['data']['value']) . "%'";
                } else if ($datos ['field'] == 'comportamiento') {
                    if ($datos ['data']['value'] == 'Propia') {
                        $condiciones[] = "aec.iddatosnomenclador = " . $iddatosnomanclador['propia'];
                    } else {
                        if ($datos ['data']['value'] == 'Demandada') {
                            $condiciones[] = "aec.iddatosnomenclador = " . $iddatosnomanclador['demandada'];
                        } else {
                            if ($datos ['data']['value'] == 'Compartida') {
                                $condiciones[] = "aec.iddatosnomenclador = " . $iddatosnomanclador['compartida'];
                            }
                        }
                    }
                } else {
                    if ($datos ['field'] == 'nivelactividad') {
                        if ($params['is_leaf'] == 'true') {
                            $subsql = "COALESCE(aea.nivelactividadautomatico,0)+
                                   COALESCE(aem.nivelactividadmanual,0)+
                                   COALESCE(aep.nivelactividadproduccion ,0) ";
                        } else {
                            $subsql = " ( SUM( COALESCE(aea.nivelactividadautomatico,0))  +
                                                  SUM( COALESCE(aem.nivelactividadmanual,0) )+
                                                  SUM( COALESCE(aep.nivelactividadproduccion ,0) ) ) ";
                        }
                        if ($datos['data']['comparison'] == 'lt') {
                            $subsql .= "<";
                        } else {
                            if ($datos['data']['comparison'] == 'gt') {
                                $subsql .= ">";
                            } else {
                                $subsql .= "=";
                            }
                        }
                        if ($params['is_leaf'] == 'true') {
                            $condiciones[] = $subsql . $datos ['data']['value'];
                        } else {
                            $condiciones_having[] = $subsql . $datos ['data']['value'];
                        }
                    } else {
                        if ($datos ['field'] == 'ajuste') {
                            $subsql = " ";
                            if ($params['is_leaf'] == 'true') {
                                $subsql = " ae.ajuste ";
                            } else {
                                $subsql = " SUM( ae.ajuste ) ";
                            }
                            if ($datos['data']['comparison'] == 'lt') {
                                $subsql .= "<";
                            } else {
                                if ($datos['data']['comparison'] == 'gt') {
                                    $subsql .= ">";
                                } else { //eq
                                    $subsql .= "=";
                                }
                            }
                            if ($params['is_leaf'] == 'true') {
                                $condiciones[] = $subsql . $datos ['data']['value'];
                            } else {
                                $condiciones_having[] = $subsql . $datos ['data']['value'];
                            }
                        } else {
                            if ($datos ['field'] == 'real') {
                                if ($params['is_leaf'] == 'true') {
                                    $subsql = " COALESCE(aea.nivelactividadautomatico,0)  +
                                    COALESCE(aem.nivelactividadmanual,0) +
                                    COALESCE(aep.nivelactividadproduccion ,0) +
                                    COALESCE(ae.ajuste,0) ";
                                } else {
                                    $subsql = "   SUM( COALESCE(aea.nivelactividadautomatico,0)  +
                                      COALESCE(aem.nivelactividadmanual,0)+
                                      COALESCE(aep.nivelactividadproduccion ,0) ) + SUM( COALESCE(ae.ajuste,0) ) ";
                                }
                                if ($datos['data']['comparison'] == 'lt') {
                                    $subsql .= "<";
                                } else {
                                    if ($datos['data']['comparison'] == 'gt') {
                                        $subsql .= ">";
                                    } else {
                                        $subsql .= "= ";
                                    }
                                }
                                if ($params['is_leaf'] == 'true') {
                                    $condiciones[] = $subsql . $datos ['data']['value'];
                                } else {
                                    $condiciones_having[] = $subsql . $datos ['data']['value'];
                                }
                            } else {
                                if ($datos ['field'] == 'nivelactividadpordesglozar') {
                                    $subsql = "";
                                    if ($params['is_leaf'] == 'true') {
                                        $subsql = "  ( COALESCE(aea.nivelactividadautomatico,0)  +
                                    COALESCE(aem.nivelactividadmanual,0) +
                                    COALESCE(aep.nivelactividadproduccion ,0) +
                                    COALESCE(ae.ajuste ,0)  ) -  SUM( COALESCE(napf.nivelactividad,0) ) ";
                                    } else {
                                        $subsql = "SUM  ( COALESCE(aea.nivelactividadautomatico,0)  +
                                    COALESCE(aem.nivelactividadmanual,0) +
                                    COALESCE(aep.nivelactividadproduccion ,0) ) +
                                    SUM( COALESCE(ae.ajuste ,0) )  -  SUM( COALESCE(napf.nivelactividad,0) ) ";
                                    }
                                    if ($datos['data']['comparison'] == 'lt') {
                                        $subsql .= "<";
                                    } else {
                                        if ($datos['data']['comparison'] == 'gt') {
                                            $subsql .= ">";
                                        } else {
                                            $subsql .= "= ";
                                        }
                                    }
                                    $condiciones_having[] = $subsql . $datos ['data']['value'];
                                } else {
                                    if ($datos ['field'] == 'idespecialidad') {
                                        $condiciones[] = "a.idespecialidad = " . $datos ['data']['value'];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        $ADDWHERE = "";
        $HAVING = "";
        foreach ($condiciones as $condicion) {
            $ADDWHERE = $ADDWHERE . " AND " . $condicion . " ";
        }
        $AND = "";
        foreach ($condiciones_having as $condicion_hav) {
            $HAVING .= $AND . $condicion_hav . " ";
            $AND = " AND ";
        }
        $GROUPBY = "";
        if ($HAVING != "") {
            $HAVING = " HAVING " . $HAVING . " ";
            $GROUPBY = "GROUP BY ae.ajuste,
                        aea.nivelactividadautomatico,
                        aem.nivelactividadmanual,
                        aep.nivelactividadproduccion";
        }
        if ($params['is_leaf'] == 'true') {
            $sql = "SELECT DISTINCT a.idactividad,
                        a.codigo,
                        a.denominacion,
                        a.descripcion,a.idespecialidad,
                        ae.idactividadentidad	,
                        ( COALESCE(aea.nivelactividadautomatico,0) +
                        COALESCE(aem.nivelactividadmanual,0) +
                        COALESCE(aep.nivelactividadproduccion,0) ) as nivelactividad,                   
                       round(  ( COALESCE(aea.nivelactividadautomatico,0) +
                        COALESCE(aem.nivelactividadmanual,0) +
                        COALESCE(aep.nivelactividadproduccion,0)  + 
                        COALESCE(ae.ajuste,0)) -  SUM( COALESCE(napf.nivelactividad,0) ) ,3) as nivelactividadpordesglozar,                 
                        round( COALESCE(ae.ajuste,0) ,4) as ajuste,                        
                        mod.idmodelo, 
                                            mod.denominacion as denmodelo,                                          
                                            aec.iddatosnomenclador,
                                            aec.idactespcomportamiento ,
                                            dn.uridatosnomenclador as comportamiento
                                            " . (($escont == false) ? "
                                                ,napf2.nivelactividad as nivel,
                                                napf2.fechainicio,
                                                napf2.fechafin" : "") . "
                                        FROM mod_planificacion.nom_actividad a                                       
                                        INNER JOIN mod_planificacion.dat_actespcomportamiento aec
                                        ON(a.idactividad = aec.idactividad AND aec.idespecialidad = " . $idesp_logueada
                    . ")
                                        INNER JOIN mod_planificacion.dat_actividadentidad ae
                                        ON(ae.idactespcomportamiento = aec.idactespcomportamiento
                                        AND ae.identidad = " . $params['identidad'] . " 
                                        AND ae.idejercicio =  {$array_idejercicio[0]['idejercicio']})
                                        LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                                        ON(aem.idactividadentidad = ae.idactividadentidad)
                                        LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                                        ON(aea.idactividadentidad = ae.idactividadentidad)                
                                        LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
                                        ON( aep.idactividadentidad = ae.idactividadentidad)                                            
                                        LEFT JOIN mod_planificacion.dat_nivelactividadporfecha napf
                                        ON( napf.idactividadentidad = ae.idactividadentidad)
                                        LEFT JOIN mod_planificacion.dat_actividadmodelo am
                                        ON(am.idactividad = a.idactividad)
                                        LEFT JOIN mod_planificacion.dat_modelo mod
                                        ON(mod.idmodelo = am.idmodelo) 
                                            LEFT JOIN mod_planificacion.nom_datosnomenclador dn
                                        ON(dn.iddatosnomenclador = aec.iddatosnomenclador) 
                                        " . (($escont == false) ? "
                                        LEFT JOIN mod_planificacion.dat_nivelactividadporfecha napf2
                                        ON( napf2.idactividadentidad = ae.idactividadentidad) 
                                        " : "") . "
                                        WHERE                                            
                                        a.idaprobacion >= 3 
                                        AND a.estado = 1
                                        AND a.nivel = {$array_format_ultinivel[1]}  
                                        AND ae.idaprobacion >= 3
                                        $ADDWHERE
                                        GROUP BY
                                            a.idactividad,
                                            a.codigo,
                                            a.denominacion,
                                            a.descripcion,
                                            a.idespecialidad,
                                            mod.idmodelo,
                                            mod.denominacion,
                                            aec.idespecialidad,
                                            aec.iddatosnomenclador,
                                            dn.uridatosnomenclador,
                                        ae.idactividadentidad,
                                        aec.idactespcomportamiento,
                                        ae.ajuste,
                                        aea.nivelactividadautomatico,
                                        aem.nivelactividadmanual,
                                        aep.nivelactividadproduccion
                                        " . (($escont == false) ? "
                                        ,napf2.nivelactividad,
                                        napf2.fechainicio,
                                        napf2.fechafin
                                        " : "") . "
                                        $HAVING
                                        ORDER BY a.codigo,a.denominacion
                                        OFFSET ?
                                        LIMIT ? ";
            $array_parametros_tot = $array_parametros;
            $array_parametros[] = $params['start'];
            $array_parametros[] = $params['limit'];
            $query = Doctrine_Manager::connection();
            if ($escont == 'noexp' || $escont == false) {

                $res = $query->execute($sql, $array_parametros);
                $data->data = $res->fetchAll(PDO::FETCH_ASSOC);
                foreach ($data->data as $indice => $valor) {
                    if ($valor['ajuste'] == 0) {
                        $data->data[$indice]['ajuste'] = 0;
                    }
                    if ($valor['nivelactividadpordesglozar'] == 0) {
                        $data->data[$indice]['nivelactividadpordesglozar'] = 0;
                    }
                    $data->data[$indice]['nivelactividad'] = number_format($valor['nivelactividad'], '3', '.', ',');
                    $data->data[$indice]['nivelactividadpordesglozar'] = number_format($valor['nivelactividadpordesglozar'], '3', '.', ',');
                }
            }
            $sql = "SELECT COUNT(DISTINCT a.idactividad) as total
                                        FROM mod_planificacion.nom_actividad a
                                        INNER JOIN mod_planificacion.dat_actespcomportamiento aec
                                        ON(a.idactividad = aec.idactividad AND aec.idespecialidad  = " . $idesp_logueada
                    . " )
                                       INNER JOIN mod_planificacion.dat_actividadentidad ae
                                        ON(ae.idactespcomportamiento = aec.idactespcomportamiento
                                        AND ae.identidad = " . $params['identidad'] . "
                                        AND ae.idejercicio =  {$array_idejercicio[0]['idejercicio']} )
                                            LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                                        ON(aem.idactividadentidad = ae.idactividadentidad)
                                        LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                                        ON(aea.idactividadentidad = ae.idactividadentidad)                
                                        LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
                                        ON( aep.idactividadentidad = ae.idactividadentidad)  
                                        LEFT JOIN mod_planificacion.dat_nivelactividadporfecha napf
                                        ON( napf.idactividadentidad = ae.idactividadentidad)
                                        LEFT JOIN mod_planificacion.dat_actividadmodelo am
                                        ON(am.idactividad = a.idactividad)
                                        LEFT JOIN mod_planificacion.dat_modelo mod
                                        ON(mod.idmodelo = am.idmodelo) 
                                        LEFT JOIN mod_planificacion.nom_datosnomenclador dn
                                        ON(dn.iddatosnomenclador = aec.iddatosnomenclador) 
                                        WHERE
                                        a.idaprobacion >= 3
                                        AND a.estado = 1
                                        AND a.nivel = {$array_format_ultinivel[1]}  
                                        AND ae.idaprobacion >= 3 
                                        $ADDWHERE
                                        $GROUPBY
                                        $HAVING ";

            if ($escont == 'noexp' || $escont == true) {
                //print_r($sql);die;
                $data->total = $query->execute($sql, $array_parametros_tot)->fetchAll(PDO::FETCH_ASSOC);
                $data->total = $data->total[0]['total'];
            }
            return $data;
        } else { //consolidado
            $security = ZendExt_Aspect_Security_Sgis::getInstance();
            $array_entidades_hijas = DatActividadentidad::auxObtenerEntidadesHijas($params['identidad'], $security);
            if ($array_entidades_hijas [0] == null) {
                $data->data = array();
                $data->total = 0;
                return $data;
            }
            $array_temp_especialidades = array();
            $array_temp_especialidades["id_" . $idesp_logueada] = $idesp_logueada;
            $cont = 0;
            foreach ($array_entidades_hijas as $valor_identidad) {
                $entidades[] = $params['integrator']->metadatos->DameEstructura($valor_identidad);
                $_idespecialidad = $entidades [$cont++][0]->idespecialidad;
                $array_temp_especialidades["id_" . $_idespecialidad] = $_idespecialidad;
            }
            foreach ($array_temp_especialidades as $valor_idesp) {
                $array_especialidades [] = $valor_idesp;
            }
            $array_temp_especialidades = null;
            $sql = "SELECT DISTINCT a.idactividad,
                        a.codigo,
                        a.denominacion,
                        a.descripcion,a.idespecialidad,                                            
                        SUM( COALESCE(aea.nivelactividadautomatico,0) + 
                        COALESCE(aem.nivelactividadmanual,0) +
                        COALESCE(aep.nivelactividadproduccion,0) ) as nivelactividad,
                        SUM( COALESCE(aea.nivelactividadautomatico,0) + 
                        COALESCE(aem.nivelactividadmanual,0) +
                        COALESCE(aep.nivelactividadproduccion,0) ) +
                        SUM( COALESCE(ae.ajuste,0) ) -
                        SUM( COALESCE(napf.nivelactividad,0) ) 
                        as nivelactividadpordesglozar,                 
                        round(SUM( COALESCE(ae.ajuste,0) ),3) as ajuste, 
                        mod.idmodelo, 
                                            mod.denominacion as denmodelo,                                          
                                            aec.iddatosnomenclador,
                                            aec.idactespcomportamiento ,
                                            dn.uridatosnomenclador as comportamiento
                                        FROM mod_planificacion.nom_actividad a
                                        INNER JOIN mod_planificacion.dat_actespcomportamiento aec
                                        ON(a.idactividad = aec.idactividad AND aec.idespecialidad IN(" . implode(
                            ",", $array_especialidades
                    ) . "))
                                        INNER JOIN dat_actividadentidad ae
                                            ON(ae.idactespcomportamiento = aec.idactespcomportamiento
                                            AND ae.identidad IN(" . implode(",", $array_entidades_hijas) . ")
                                            AND ae.idejercicio =  {$array_idejercicio[0]['idejercicio']} )
                                            LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                                            ON(aem.idactividadentidad = ae.idactividadentidad)
                                            LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                                            ON(aea.idactividadentidad = ae.idactividadentidad)                
                                            LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
                                            ON( aep.idactividadentidad = ae.idactividadentidad)                                            
                                            LEFT JOIN mod_planificacion.dat_nivelactividadporfecha napf
                                            ON( napf.idactividadentidad = ae.idactividadentidad)
                                            LEFT JOIN mod_planificacion.dat_actividadmodelo am
                                            ON(am.idactividad = a.idactividad)
                                            LEFT JOIN mod_planificacion.dat_modelo mod
                                            ON(mod.idmodelo = am.idmodelo) 
                                             LEFT JOIN mod_planificacion.nom_datosnomenclador dn
                                            ON(dn.iddatosnomenclador = aec.iddatosnomenclador) 
                                            WHERE                                            
                                            a.idaprobacion >= 3 
                                            AND a.estado = 1
                                            AND a.nivel = 4   
                                           AND (ae.idaprobacion >= 3)
                                            $ADDWHERE 
                                            GROUP BY
                                                a.idactividad,
                                                a.codigo,
                                                a.denominacion,
                                                a.descripcion,
                                                a.idespecialidad,
                                                mod.idmodelo,
                                                mod.denominacion,
                                                aec.idespecialidad,
                                                aec.iddatosnomenclador,
                                                dn.uridatosnomenclador,
                                            aec.idactespcomportamiento
                                            $HAVING
                                            ORDER BY a.codigo,a.denominacion
                                            OFFSET ?
                                            LIMIT ? ";
            $array_parametros[] = $params['start'];
            $array_parametros[] = $params['limit'];
            if ($escont == 'noexp' || $escont == false) {
                $res = $query->execute($sql, $array_parametros);
                $data->data = $res->fetchAll(PDO::FETCH_ASSOC);

                foreach ($data->data as $indice => $valor) {
                    if ($valor['ajuste'] == 0) {
                        $data->data[$indice]['ajuste'] = 0;
                    }
                    if ($valor['nivelactividadpordesglozar'] == 0) {
                        $data->data[$indice]['nivelactividadpordesglozar'] = 0;
                    }
                    $data->data[$indice]['nivelactividad'] = number_format($valor['nivelactividad'], '3', '.', ',');
                    $data->data[$indice]['nivelactividadpordesglozar'] = number_format($valor['nivelactividadpordesglozar'], '3', '.', ',');
                }
            }

            $sql = "SELECT COUNT( DISTINCT a.idactividad ) as total
                                        FROM mod_planificacion.nom_actividad a
                                        INNER JOIN mod_planificacion.dat_actespcomportamiento aec
                                        ON(a.idactividad = aec.idactividad AND aec.idespecialidad IN(" . implode(
                            ",", $array_especialidades
                    ) . "))
                                        INNER JOIN dat_actividadentidad ae
                                        ON(ae.idactespcomportamiento = aec.idactespcomportamiento
                                        AND ae.identidad IN(" . implode(",", $array_entidades_hijas) . ")
                                        AND ae.idejercicio =  {$array_idejercicio[0]['idejercicio']} )
                                        LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                                        ON(aem.idactividadentidad = ae.idactividadentidad)
                                        LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                                        ON(aea.idactividadentidad = ae.idactividadentidad)                
                                        LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
                                        ON( aep.idactividadentidad = ae.idactividadentidad)                                            
                                        LEFT JOIN mod_planificacion.dat_nivelactividadporfecha napf
                                        ON( napf.idactividadentidad = ae.idactividadentidad)
                                        LEFT JOIN mod_planificacion.dat_actividadmodelo am
                                        ON(am.idactividad = a.idactividad)
                                        LEFT JOIN mod_planificacion.dat_modelo mod
                                        ON(mod.idmodelo = am.idmodelo) 
                                            LEFT JOIN mod_planificacion.nom_datosnomenclador dn
                                        ON(dn.iddatosnomenclador = aec.iddatosnomenclador) 
                                        WHERE
                                        a.idaprobacion >= 3 
                                        AND a.estado = 1
                                        AND a.nivel = {$array_format_ultinivel[1]}   
                                        AND ae.idaprobacion >= 3 
                                        $HAVING ";
            if ($escont == 'noexp' || $escont == true) {
                $data->total = $query->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                $data->total = $data->total[0]['total'];
            }
            return $data;
        }
    }

    public function exportarAExcel($params) {

        $dir_apps = Zend_Registry::getInstance()->config->dir_aplication;
        $idioma = ZendExt_GlobalConcept::getInstance()->Perfil->idioma;
        $etiquetas = file_get_contents(
                $dir_apps . "/planificacion/planmeta/views/idioma/{$idioma}/desgloseporfecha/desgloseporfecha.json"
        );
        unset($idioma);
        unset($dir_apps);
        $etiquetas = str_replace("{", "", $etiquetas);
        $etiquetas = str_replace("}", "", $etiquetas);
        $etiquetas = str_replace("\n", "", $etiquetas);
        $etiquetas = str_replace("'", "", $etiquetas);
        $etiquetas = split(",", $etiquetas);
        $array_etiq = array();

        foreach ($etiquetas as $key => $valor) {
            $array_etiqueta = split(":", $valor);
            $indice = str_replace("\r", "", $array_etiqueta[0]);
            $indice = str_replace(" ", "", $indice);
            $array_etiq [$indice] = $array_etiqueta[1];
            unset($etiquetas[$key]);
        }
        unset($etiquetas);
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=desgloses.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo "<table border=1>\n";
        echo "<tr>\n";
        echo "<th colspan = 6 align=left>Niveles de actividad</th>";
        if ($params['is_leaf'] == 'true') {
            echo "<th colspan = 3 align=left>Desgloses por fecha</th>";
        }
        echo "</tr>";
        echo "<tr>\n";
        echo '<th>' . $array_etiq['lbCodigo'] . '</th>';
        echo '<th>' . $array_etiq['lbDenominacion'] . '</th>';
        echo '<th>' . $array_etiq['lbNAP'] . '</th>';
        echo '<th>' . $array_etiq['lbAjuste'] . '</th>';
        echo '<th>' . $array_etiq['lbNAR'] . '</th>';
        echo '<th>' . $array_etiq['lbNAD'] . '</th>';
        if ($params['is_leaf'] == 'true') {
            echo '<th>' . $array_etiq['lbNivel'] . '</th>';
            echo '<th>' . $array_etiq['lbFechaInicio'] . '</th>';
            echo '<th>' . $array_etiq['lbFechafin'] . '</th>';
        }
        echo "</tr>";
        $cant = self::listarNivsActAprob($params, true)->total;
        $cantxpag = 10000;
        $cantpag = (int) ($cant / $cantxpag);
        if (fmod($cant, $cantxpag) > 0)
            $cantpag++;
        unset($cant);
        $offset = 0; //start
        $paso = $cantxpag; //limit
        for ($i = 0; $i < $cantpag; $i++) {
            $array_dnaxf = self::listarNivsActAprob($params, false)->data;
            foreach ($array_dnaxf as $k => $value) {
                echo "<tr> <td align=right style=\"mso-number-format:'@';\" >" . $value['codigo'] . "</td>
             <td align=center >" . $value['denominacion'] . "</td>
             <td>" . $value['nivelactividad'] . "</td>
             <td>" . $value['ajuste'] . "</td>
             <td>" . ($value['nivelactividad'] - $value['ajuste']) . "</td>
             <td>" . $value['nivelactividadpordesglozar'] . "</td>";
                if ($params['is_leaf'] == 'true') {
                    echo " <td >" . number_format($value['nivel'], '3', ',', '.') . "</td>
                     <td>" . $value['fechainicio'] . "</td>
                     <td>" . $value['fechafin'] . "</td>
                     </tr>";
                }
            }
            $offset += $paso;
        }
        echo "</table>";
    }

}

?>
