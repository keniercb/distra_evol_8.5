<?php

class DatNivelactividadporfechaModel extends ZendExt_Model {

    private $nivel;

    public function __construct() {
        $this->nivel = NomActividad::getNivel();
        parent::ZendExt_Model();
    }

    public function insertardat_nivelactividadporfecha($datNivelactividadporfecha
    ) {
        $datNivelactividadporfecha->save();
    }

    public function modificardat_nivelactividadporfecha($datNivelactividadporfecha
    ) {
        $datNivelactividadporfecha->save();
    }

    public function eliminardat_nivelactividadporfecha($datNivelactividadporfecha
    ) {
        $datNivelactividadporfecha->delete();
    }

    public function adicionar_modif_nivactporfecha($params) {
        foreach ($params['desgloses'] as $desglose) {
            if ($desglose->idnivelactividadporfecha != null) {
                $objNivActPorFecha = Doctrine::getTable(
                                'DatNivelactividadporfecha'
                        )->find(
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
        $querytotal = new Doctrine_Query();

        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos ['field'] == 'nivelactividad') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $query->addWhere(
                                "napf.nivelactividad <" . $datos ['data']['value']
                        );
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $query->addWhere(
                                "napf.nivelactividad >" . $datos ['data']['value']
                        );
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $query->addWhere(
                                "napf.nivelactividad =" . $datos ['data']['value']
                        );
                    }
                } else {
                    if ($datos ['field'] == 'fechainicio'
                    ) { //[data][comparision]  lt=antes 	gt=despues  eq=en
                        $fechainicio = explode('/', $datos ['data']['value']);
                        $fechainicio = $fechainicio[1] . '/' . $fechainicio[0]
                                . '/' . $fechainicio[2];
                        if ($datos['data']['comparison'] == 'lt') {
                            $query->addWhere(
                                    "napf.fechainicio <'" . $fechainicio . "'"
                            );
                        }
                        if ($datos['data']['comparison'] == 'gt') {
                            $query->addWhere(
                                    "napf.fechainicio >'" . $fechainicio . "'"
                            );
                        }
                        if ($datos['data']['comparison'] == 'eq') {
                            $query->addWhere(
                                    "napf.fechainicio ='" . $fechainicio . "'"
                            );
                        }
                    } else {
                        if ($datos ['field'] == 'fechafin') {
                            $fechafin = explode('/', $datos ['data']['value']);
                            $fechafin = $fechafin[1] . '/' . $fechafin[0] . '/'
                                    . $fechafin[2];
                            if ($datos['data']['comparison'] == 'lt') {
                                $query->addWhere(
                                        "napf.fechafin <'" . $fechafin . "'"
                                );
                            }
                            if ($datos['data']['comparison'] == 'gt') {
                                $query->addWhere(
                                        "napf.fechafin >'" . $fechafin . "'"
                                );
                            }
                            if ($datos['data']['comparison'] == 'eq') {
                                $query->addWhere(
                                        "napf.fechafin ='" . $fechafin . "'"
                                );
                            }
                        }
                    }
                }
            }
        }
        $data->data = $query->from('DatNivelactividadporfecha napf')
                ->addWhere(
                        'napf.idactividadentidad = ?', array($params['idactividadentidad'])
                )
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->offset($params['start'])
                ->limit($params['limit'])
                ->execute();

        $data->total = $querytotal->select('COUNT(*) as total')
                        ->from('DatNivelactividadporfecha napf')
                        ->addWhere(
                                'napf.idactividadentidad = ?', array($params['idactividadentidad'])
                        )
                        ->execute()->getFirst()->total;
        foreach ($data->data as $indice => $valor) {
            $data->data[$indice]['nivelactividad'] = number_format(
                    $valor['nivelactividad'], '3', '.', ','
            );
        }
        return $data;
    }

    public function eliminarDesgloses($params) {
        //temporal falta el filtrado
        if ($params['desgloses'][0] != null) {
            $query = new Doctrine_Query();
            $query->delete('DatNivelactividadporfecha')
                    ->from('DatNivelactividadporfecha napf')
                    ->addWhere(
                            'napf.idactividadentidad = ?', array($params['idactividadentidad'])
                    )
                    ->whereIn('napf.idnivelactividadporfecha', $params['desgloses'])
                    ->execute();
        }
        return '24';
    }

    public function listarNivsActAprob($params, $escont = 'noexp') {
        $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
        $arrayFormatultinivel = NomActividad::obtener_ConfFormato_UltimoNivel(
        );
        $idespLogueada = $params['idespecialidad'];
        if ($idespLogueada == null) {
            $idespLogueada = ZendExt_GlobalConcept::getInstance(
                    )->Estructura->idespecialidad;
        }
        $query = Doctrine_Manager::connection();
        $iddatosnomanclador = DatActespcomportamiento::obtenerIdDatosNom();
        $condiciones = array();
        $condicionesHaving = array();
        $arrayParametros = array();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $condiciones[] = " a.codigo LIKE '"
                            . $datos ['data']['value'] . "%'";
                } else {
                    if ($datos ['field'] == 'denominacion') {
                        $condiciones[] = "upper(a.denominacion) LIKE '"
                                . strtoupper($datos ['data']['value']) . "%'";
                    } else {
                        if ($datos ['field'] == 'descripcion') {
                            $condiciones[] = "upper(a.descripcion) LIKE '%"
                                    . strtoupper($datos ['data']['value']) . "%'";
                        } else {
                            if ($datos ['field'] == 'comportamiento') {
                                if ($datos ['data']['value'] == 'Propia') {
                                    $condiciones[] = "aec.iddatosnomenclador = "
                                            . $iddatosnomanclador['propia'];
                                } else {
                                    if ($datos ['data']['value'] == 'Demandada'
                                    ) {
                                        $condiciones[] = "aec.iddatosnomenclador = "
                                                . $iddatosnomanclador['demandada'];
                                    } else {
                                        if ($datos ['data']['value'] == 'Compartida'
                                        ) {
                                            $condiciones[] = "aec.iddatosnomenclador = "
                                                    . $iddatosnomanclador['compartida'];
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
                                        if ($datos['data']['comparison'] == 'gt'
                                        ) {
                                            $subsql .= ">";
                                        } else {
                                            $subsql .= "=";
                                        }
                                    }
                                    if ($params['is_leaf'] == 'true') {
                                        $condiciones[] = $subsql
                                                . $datos ['data']['value'];
                                    } else {
                                        $condicionesHaving[] = $subsql
                                                . $datos ['data']['value'];
                                    }
                                } else {
                                    if ($datos ['field'] == 'ajuste') {
                                        $subsql = " ";
                                        if ($params['is_leaf'] == 'true') {
                                            $subsql = " ae.ajuste ";
                                        } else {
                                            $subsql = " SUM( ae.ajuste ) ";
                                        }
                                        if ($datos['data']['comparison'] == 'lt'
                                        ) {
                                            $subsql .= "<";
                                        } else {
                                            if ($datos['data']['comparison'] == 'gt'
                                            ) {
                                                $subsql .= ">";
                                            } else { //eq
                                                $subsql .= "=";
                                            }
                                        }
                                        if ($params['is_leaf'] == 'true') {
                                            $condiciones[] = $subsql
                                                    . $datos ['data']['value'];
                                        } else {
                                            $condicionesHaving[] = $subsql
                                                    . $datos ['data']['value'];
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
                                            if ($datos['data']['comparison'] == 'lt'
                                            ) {
                                                $subsql .= "<";
                                            } else {
                                                if ($datos['data']['comparison'] == 'gt'
                                                ) {
                                                    $subsql .= ">";
                                                } else {
                                                    $subsql .= "= ";
                                                }
                                            }
                                            if ($params['is_leaf'] == 'true') {
                                                $condiciones[] = $subsql
                                                        . $datos ['data']['value'];
                                            } else {
                                                $condicionesHaving[] = $subsql
                                                        . $datos ['data']['value'];
                                            }
                                        } else {
                                            if ($datos ['field'] == 'nivelactividadpordesglozar'
                                            ) {
                                                $subsql = "";
                                                if ($params['is_leaf'] == 'true'
                                                ) {
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
                                                if ($datos['data']['comparison'] == 'lt'
                                                ) {
                                                    $subsql .= "<";
                                                } else {
                                                    if ($datos['data']['comparison'] == 'gt'
                                                    ) {
                                                        $subsql .= ">";
                                                    } else {
                                                        $subsql .= "= ";
                                                    }
                                                }
                                                $condicionesHaving[] = $subsql
                                                        . $datos ['data']['value'];
                                            } else {
                                                if ($datos ['field'] == 'idespecialidad'
                                                ) {
                                                    $condiciones[] = "a.idespecialidad = "
                                                            . $datos ['data']['value'];
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
        $ADDWHERE = "";
        $HAVING = "";
        foreach ($condiciones as $condicion) {
            $ADDWHERE = $ADDWHERE . " AND " . $condicion . " ";
        }
        $AND = "";
        foreach ($condicionesHaving as $condicionhav) {
            $HAVING .= $AND . $condicionhav . " ";
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
        COALESCE(ae.ajuste,0)) -  SUM( COALESCE(napf.nivelactividad,0) ) ,3) 
        as nivelactividadpordesglozar,                 
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
                ON(a.idactividad = aec.idactividad AND aec.idespecialidad = "
                    . $idespLogueada
                    . ")
                        INNER JOIN mod_planificacion.dat_actividadentidad ae
                        ON(ae.idactespcomportamiento = aec.idactespcomportamiento
                        AND ae.identidad = "
                    . $params['identidad'] . "
                AND ae.idejercicio =  {$arrayIdejercicio[0]['idejercicio']})
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
                                        AND a.nivel = {$arrayFormatultinivel[1]}  
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
            $arrayParametrostot = $arrayParametros;
            $arrayParametros[] = $params['start'];
            $arrayParametros[] = $params['limit'];
            $query = Doctrine_Manager::connection();
            if ($escont == 'noexp' || $escont == false) {

                $res = $query->execute($sql, $arrayParametros);
                $data->data = $res->fetchAll(PDO::FETCH_ASSOC);
                foreach ($data->data as $indice => $valor) {
                    if ($valor['ajuste'] == 0) {
                        $data->data[$indice]['ajuste'] = 0;
                    }
                    if ($valor['nivelactividadpordesglozar'] == 0) {
                        $data->data[$indice]['nivelactividadpordesglozar'] = 0;
                    }
                    $data->data[$indice]['nivelactividad'] = number_format(
                            $valor['nivelactividad'], '3', '.', ','
                    );
                    $data->data[$indice]['nivelactividadpordesglozar'] = number_format(
                            $valor['nivelactividadpordesglozar'], '3', '.', ','
                    );
                }
            }
            $sql = "SELECT COUNT(DISTINCT a.idactividad) as total
                FROM mod_planificacion.nom_actividad a
                INNER JOIN mod_planificacion.dat_actespcomportamiento aec
                ON(a.idactividad = aec.idactividad AND aec.idespecialidad  = "
                    . $idespLogueada
                    . " )
               INNER JOIN mod_planificacion.dat_actividadentidad ae
                ON(ae.idactespcomportamiento = aec.idactespcomportamiento
                AND ae.identidad = "
                    . $params['identidad'] . "
                AND ae.idejercicio =  {$arrayIdejercicio[0]['idejercicio']} )
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
                AND a.nivel = {$arrayFormatultinivel[1]}  
                AND ae.idaprobacion >= 3 
                $ADDWHERE
                $GROUPBY
                $HAVING ";

            if ($escont == 'noexp' || $escont == true) {
                $data->total = $query->execute($sql, $arrayParametrostot)
                        ->fetchAll(PDO::FETCH_ASSOC);
                $data->total = $data->total[0]['total'];
            }
            return $data;
        } else { //consolidado
            $modeloActEnt = new DatActividadentidad();
            $arrayEntidadeshijas = DatActividadentidad::auxObtenerEntidadesHijasComun(
                            $params['identidad']
            );
            if ($arrayEntidadeshijas [0] == null) {
                $data->data = array();
                $data->total = 0;
                return $data;
            }
            $arrayTempespecialidades = array();
            $arrayTempespecialidades["id_" . $idespLogueada] = $idespLogueada;
            $cont = 0;
            foreach ($arrayEntidadeshijas as $valorIdentidad) {
                $entidades[] = $params['integrator']->metadatos->DameEstructura(
                        $valorIdentidad
                );
                $idEspecialidad = $entidades [$cont++][0]->idespecialidad;
                $arrayTempespecialidades["id_" . $idEspecialidad] = $idEspecialidad;
            }
            foreach ($arrayTempespecialidades as $valorIdesp) {
                $arrayEspecialidades [] = $valorIdesp;
            }
            $arrayTempespecialidades = null;
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
                ON(a.idactividad = aec.idactividad AND aec.idespecialidad IN("
                    . implode(
                            ",", $arrayEspecialidades
                    ) . "))
                INNER JOIN dat_actividadentidad ae
                    ON(ae.idactespcomportamiento = aec.idactespcomportamiento
                    AND ae.identidad IN(" . implode(
                            ",", $arrayEntidadeshijas
                    ) . ")
                AND ae.idejercicio =  {$arrayIdejercicio[0]['idejercicio']} )
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
                AND a.nivel = {$this->nivel}
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
            $arrayParametros[] = $params['start'];
            $arrayParametros[] = $params['limit'];
            if ($escont == 'noexp' || $escont == false) {
                $res = $query->execute($sql, $arrayParametros);
                $data->data = $res->fetchAll(PDO::FETCH_ASSOC);

                foreach ($data->data as $indice => $valor) {
                    if ($valor['ajuste'] == 0) {
                        $data->data[$indice]['ajuste'] = 0;
                    }
                    if ($valor['nivelactividadpordesglozar'] == 0) {
                        $data->data[$indice]['nivelactividadpordesglozar'] = 0;
                    }
                    $data->data[$indice]['nivelactividad'] = number_format(
                            $valor['nivelactividad'], '3', '.', ','
                    );
                    $data->data[$indice]['nivelactividadpordesglozar'] = number_format(
                            $valor['nivelactividadpordesglozar'], '3', '.', ','
                    );
                }
            }

            $sql = "SELECT COUNT( DISTINCT a.idactividad ) as total
            FROM mod_planificacion.nom_actividad a
            INNER JOIN mod_planificacion.dat_actespcomportamiento aec
            ON(a.idactividad = aec.idactividad AND aec.idespecialidad IN("
                    . implode(
                            ",", $arrayEspecialidades
                    ) . "))
                    INNER JOIN dat_actividadentidad ae
                    ON(ae.idactespcomportamiento = aec.idactespcomportamiento
                    AND ae.identidad IN(" . implode(
                            ",", $arrayEntidadeshijas
                    ) . ")
                AND ae.idejercicio =  {$arrayIdejercicio[0]['idejercicio']} )
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
                AND a.nivel = {$arrayFormatultinivel[1]}   
                AND ae.idaprobacion >= 3 
                                        $HAVING ";
            if ($escont == 'noexp' || $escont == true) {
                $data->total = $query->execute($sql)->fetchAll(
                        PDO::FETCH_ASSOC
                );
                $data->total = $data->total[0]['total'];
            }
            return $data;
        }
    }

    public function exportarAExcel($params) {

        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $idioma = ZendExt_GlobalConcept::getInstance()->Perfil->idioma;
        $etiquetas = file_get_contents(
                $dirApps
                . "/planificacion/planmeta/views/idioma/{$idioma}/desgloseporfecha/desgloseporfecha.json"
        );
        unset($idioma);
        unset($dirApps);
        $etiquetas = str_replace("{", "", $etiquetas);
        $etiquetas = str_replace("}", "", $etiquetas);
        $etiquetas = str_replace("\n", "", $etiquetas);
        $etiquetas = str_replace("'", "", $etiquetas);
        $etiquetas = split(",", $etiquetas);
        $arrayEtiq = array();

        foreach ($etiquetas as $key => $valor) {
            $arrayEtiqueta = split(":", $valor);
            $indice = str_replace("\r", "", $arrayEtiqueta[0]);
            $indice = str_replace(" ", "", $indice);
            $arrayEtiq [$indice] = $arrayEtiqueta[1];
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
        echo "<tr><th colspan = 8 align=left>Niveles de actividad por fecha</th></tr>";
        echo "<tr><th colspan = 8 align=left>Ejercicio: " . $params['denoejercicio'] . "</th></tr>";
        echo "<tr><th colspan = 8 align=left>Entidad: " . $params['denoentidad'] . "</th></tr>";
        /* if ($params['is_leaf'] == 'true') {
          echo "<th colspan = 3 align=left>Desgloses por fecha</th>";
          } */
        echo "<tr>\n";
        echo '<th>Código</th>';
        echo '<th>Denominación</th>';
        echo '<th>Nivel actividad planificado</th>';
        echo '<th>Nivel actividad desglosado total</th>';
        echo '<th>Nivel actividad por desglosar</th>';
        echo '<th>Nivel actividad desglosado</th>';
        echo '<th>Fecha inicio</th>';
        echo '<th>Fecha inicio</th>';
        /* if ($params['is_leaf'] == 'true') {
          echo '<th>Nivel</th>';
          echo '<th>FechaInicio</th>';
          echo '<th>Fechafin</th>';
          } */
        echo "</tr>";
        $modelContEjecPlan = new DatNivelactividadporfechaModel();
        // $cant = self::listarNivsActAprob($params, true)->total;

        $d = $modelContEjecPlan->listarNivelesAct($params);

        $cant = $d->total;
        $cantxpag = 10000;
        $cantpag = (int) ($cant / $cantxpag);
        if (fmod($cant, $cantxpag) > 0) {
            $cantpag++;
        }
        unset($cant);
        $offset = 0; //start
        $paso = $cantxpag; //limit
        for ($i = 0; $i < $cantpag; $i++) {
            $params['start'] = $offset;
            $params['limit'] = $paso;
            $d = $modelContEjecPlan->listarNivelesAct($params);
            $arrayDnaxf = $d->data;

            foreach ($arrayDnaxf as $value) {
                $params['idactividad'] = $value['idactividad'];
                $params['idactividadentidad'] = DatActividadentidad::BuscarIdactividadEntidades1($params['identidad'], $params['idactividad'], $params['idejercicio']);
                $params['idactividadentidad'] = $params['idactividadentidad'][0]['idactividadentidad'];
                $modeloNivelAct = new DatNivelactividadporfechaModel();
                $desgloses = $modeloNivelAct->listarNivelactividadporfecha($params);

                if (count($desgloses->data) > 0) {
                    foreach ($desgloses->data as $desglose) {
                        echo "<tr> <td align=right style=\"mso-number-format:'@';\" >" . $value['codigo'] . "</td>
                           <td align=center >" . $value['denominacion'] . "</td>
                            <td align=right style=\"mso-number-format:'0.000000';\">" . number_format($value['nivelactividad'], '3', '.', ',') . "</td>
                            <td align=right style=\"mso-number-format:'0.000000';\">" . number_format($value['nivelactividadreal'], '3', '.', ',') . "</td>
                            <td align=right style=\"mso-number-format:'0.000000';\">" . number_format($value['nivelactividadpordesglozar'], '3', '.', ',') . "</td>";

                        echo "<td align=right style=\"mso-number-format:'0.000000';\">" . number_format($desglose['nivelactividad'], '3', '.', ',') . "</td>
                          <td align=right style=\"mso-number-format:'@';\">" . $desglose['fechainicio'] . "</td>
                          <td align=right style=\"mso-number-format:'@';\">" . $desglose['fechafin'] . "</td>";
                    }
                } else {
                    echo "<tr> <td align=right style=\"mso-number-format:'@';\" >" . $value['codigo'] . "</td>
                           <td align=center >" . $value['denominacion'] . "</td>
                            <td align=right style=\"mso-number-format:'0.000000';\">" . number_format($value['nivelactividad'], '3', '.', ',') . "</td>
                            <td align=right style=\"mso-number-format:'0.000000';\">" . number_format($value['nivelactividadreal'], '3', '.', ',') . "</td>
                            <td align=right style=\"mso-number-format:'0.000000';\">" . number_format($value['nivelactividadpordesglozar'], '3', '.', ',') . "</td>";

                    echo "<td align=right style=\"mso-number-format:'0.000000';\">0</td>
                          <td align=right style=\"mso-number-format:'@';\"></td>
                          <td align=right style=\"mso-number-format:'@';\"></td>";
                }
            }
            $offset += $paso;
        }
        echo "</table>";
    }

    public function listarNivelesAct($params) {
        $condiciones = array();
        $arraysalida = array_filter($params['id_especialidades']);
        if (empty($arraysalida)) {
            return -1;
        }
        $strEntidades = implode(',', $params['entidades']);
        $strEspecialidades = implode(',', $arraysalida);
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condic[] = "a.codigo LIKE '" . $datos['data']['value']
                            . "%'";
                } else {
                    if ($datos['field'] == 'denominacion') {
                        $condic[] = "upper(a.denominacion) LIKE  " . ("'%"
                                . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'");
                    } else {
                        if ($datos['field'] == 'nivelactividad') {
                            $sqlNNA = " SUM(x.nivelactividadfinal)";
                            if ($datos['data']['comparison'] == 'lt') {
                                $sqlNNA = $sqlNNA . "<";
                            } else {
                                if ($datos['data']['comparison'] == 'gt') {
                                    $sqlNNA = $sqlNNA . ">";
                                } else {
                                    $sqlNNA = $sqlNNA . "=";
                                }
                            }
                            $condiciones[] = $sqlNNA
                                    . $datos['data']['value'];
                        } else {
                            if ($datos['field'] == 'nivelactividadreal') {
                                $sqlNNA = " SUM(x.nivelactividadxfecha)";
                                if ($datos['data']['comparison'] == 'lt') {
                                    $sqlNNA = $sqlNNA . "<";
                                } else {
                                    if ($datos['data']['comparison'] == 'gt') {
                                        $sqlNNA = $sqlNNA . ">";
                                    } else {
                                        $sqlNNA = $sqlNNA . "=";
                                    }
                                }
                                $condiciones[] = $sqlNNA
                                        . $datos['data']['value'];
                            } else {
                                if ($datos['field'] == 'nivelactividadpordesglozar') {
                                    $sqlNNA = " COALESCE((SUM(x.nivelactividadfinal) - COALESCE(SUM(
           x.nivelactividadxfecha), 0)), 0)";
                                    if ($datos['data']['comparison'] == 'lt') {
                                        $sqlNNA = $sqlNNA . "<";
                                    } else {
                                        if ($datos['data']['comparison'] == 'gt') {
                                            $sqlNNA = $sqlNNA . ">";
                                        } else {
                                            $sqlNNA = $sqlNNA . "=";
                                        }
                                    }
                                    $condiciones[] = $sqlNNA
                                            . $datos['data']['value'];
                                }
                            }
                        }
                    }
                }
            }
        }
        $Having = "";
        foreach ($condiciones as $condicion) {
            if ($Having == "") {
                $Having = 'AND ' . $condicion;
            } else {
                $Having = $Having . " AND " . $condicion;
            }
        }

        $WHERE = "";

        foreach ($condic as $co) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $co;
            } else {
                $WHERE = $WHERE . " AND " . $co;
            }
        }

        if (!$params['start']) {
            $params['start'] = 0;
        }
        if (!$params['limit']) {
            $params['limit'] = 1;
        }
        $offsetLimit = " OFFSET  {$params['start']}
                          LIMIT  {$params['limit']}";
        $data = DatNivelactividadporfecha::listarNivelesAct(
                        $params, $strEspecialidades, $strEntidades, $WHERE, $offsetLimit, $Having
        );
        return $data;
    }

}
