<?php

class DatActividadentidadnaeModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function insertardat_actividadentidadnae($datActividadentidadnae) {
        $datActividadentidadnae->save();
    }

    public function modificardat_actividadentidadnae($datActividadentidadnae) {
        $datActividadentidadnae->save();
    }

    public function eliminardat_actividadentidadnae($datActividadentidadnae) {
        $datActividadentidadnae->delete();
    }

    public function getModeloAsocEntidadDemandados($arrayIdent, $arrayIdesp) {
        $arrayMods = DatActividadentidadnae::getModeloAsocEntidadDemandados(
                        $arrayIdent, $arrayIdesp
        );
        foreach ($arrayMods as $k => $modelo) {
            unset($arrayMods[$k]);
            $arrayMods[$k]['text'] = $modelo['denominacion'];
            $arrayMods[$k]['id'] = $modelo['idmodelo'];
            $arrayMods[$k]['leaf'] = true;
        }
        return $arrayMods;
    }

    public function listar($params) {
        // $query = new Doctrine_Query();
        $idejercicio = NomEjercicioplanificacion::listarEjercicioActual();
        $idejercicio = $idejercicio[0]['idejercicio'];
        $arrayFormatoUltimonivel = NomActividad::obtener_ConfFormato_UltimoNivel();
        $condiciones = array();
        $condGroupby = array();
        $arraySqlparams = array();
        $arraySqlparamsGroupby = array();

        if ($params['is_leaf'] == 'true') {
            $arraySqlparams[0] = $params['idespecialidad'];
            $arraySqlparams[1] = $params['identidad'];
            $arraySqlparams[2] = $params['idmodelo'];
        } else {
            $arraySqlparams[0] = $params['idmodelo'];
        }


        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $condiciones[] = " a.codigo  LIKE ? "; //'{$datos ['data'] ['value']}%'
                    $arraySqlparams[] = "%{$datos ['data'] ['value']}%";
                } elseif ($datos ['field'] == 'denominacion') {
                    $condiciones[] = " upper(a.denominacion) LIKE ? ";
                    $arraySqlparams[] = "%" . strtoupper(
                                    $datos ['data'] ['value']
                            ) . "%";
                } elseif ($datos ['field'] == 'denespecialidad') {
                    $condiciones[] = " a.idespecialidad = ? ";
                    $arraySqlparams[] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'importe') {
                    $cond = "=";
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $cond = ">";
                    }
                    $condGroupby[] = " round( ( COALESCE(aem.nivelactividadmanual,0)+
                    COALESCE(aea.nivelactividadautomatico,0)+
                    COALESCE(np.nivelactividadproduccion,0) ) 
                    * SUM(n.necesidad*ind.precio),3
                    ) {$cond} {$datos ['data'] ['value']} ";
//                    $arraySqlparamsGroupby = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'importedivisa') {
                    $cond = "=";
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $cond = ">";
                    }
                    $condGroupby[] = " round( ( COALESCE(aem.nivelactividadmanual,0)+
                    COALESCE(aea.nivelactividadautomatico,0)+
                    COALESCE(np.nivelactividadproduccion,0) ) 
                    * SUM(n.necesidad*ind.preciodivisa),3
                    ) {$cond} {$datos ['data'] ['value']} ";
                } elseif ($datos ['field'] == 'asociado') {

                    if ($datos ['data'] ['value'] == "Si") {
                        $condiciones[] = " pg.idplanificacionnaegeneral IS NOT NULL";
                    } else {
                        $condiciones[] = " pg.idplanificacionnaegeneral IS NULL";
                    }
                } elseif ($datos ['field'] == 'Nae_OG' || $datos ['field'] == 'idingreso'
                ) {
                    if ($datos ['data'] ['value'] == "Si") {
                        ////temporal cambiar el OG por otra atributo que 
                        //no cambie con el idioma
                        $condiciones[] = " pnog.idplanificacionnaegeneral IS NOT NULL";
                    } else {
                        $condiciones[] = " pni.idplanificacionnaegeneral IS NOT NULL";
                    }
                } elseif ($datos ['field'] == 'datos') {
                    $condiciones[] = " ( COALESCE(og.codigo,'') || COALESCE(rf.codigo,'-') ||
                    COALESCE(og.denominacion,'-') || COALESCE(rf.denominacion,'') )
                     LIKE '{$datos ['data'] ['value']}%'";
                }
            }
        }
        $where = "";
        foreach ($condiciones as $cond) {
            $where = $where . " AND " . $cond;
        }
        $having = "";
        $and = "";
        foreach ($condGroupby as $cond) {
            $having = $having . $and . $cond;
            $and = " AND ";
        }
        if ($having != '') {
            $having = 'HAVING ' . $having;
        }
        foreach ($arraySqlparamsGroupby as $valor) {
            $arraySqlParams[] = $valor;
        }
        $conn = Doctrine_Manager::connection();
        if ($params['is_leaf'] == 'true') {

            $sql = "SELECT DISTINCT a.idactividad,a.codigo,a.denominacion,
                    a.idespecialidad,ae.idactividadentidad,
                    round( ( COALESCE(aem.nivelactividadmanual,0)+
                    COALESCE(aea.nivelactividadautomatico,0)+
                    COALESCE(np.nivelactividadproduccion,0) ) 
                    * SUM(n.necesidad*ind.precio),3
                    ) as importe,

                    round( ( COALESCE(aem.nivelactividadmanual,0)+
                    COALESCE(aea.nivelactividadautomatico,0)+
                    COALESCE(np.nivelactividadproduccion,0) ) ,3
                    ) as importe112,


                    round( ( COALESCE(aem.nivelactividadmanual,0)+
                    COALESCE(aea.nivelactividadautomatico,0)+
                    COALESCE(np.nivelactividadproduccion,0) ) 
                    * SUM(n.necesidad*ind.preciodivisa),3
                    ) as importedivisa,aenae.idplanificacionnaegeneral,
                    aenae.idactividadentidadnae,pnog.idobjetogasto,
                    pni.idingreso,
                    ( COALESCE(og.codigo,'') || COALESCE(rf.codigo,'-') ||
                    COALESCE(og.denominacion,'-') || COALESCE(rf.denominacion,'') )
                      as datos
                    FROM mod_planificacion.nom_actividad a
                    INNER JOIN mod_planificacion.dat_actividadmodelo am
                    ON(am.idactividad = a.idactividad)
                    INNER JOIN mod_planificacion.dat_actespcomportamiento aec
                    ON(aec.idactividad = a.idactividad)
                    INNER JOIN mod_planificacion.nom_datosnomenclador dn
                    ON(dn.iddatosnomenclador = aec.iddatosnomenclador 
                    AND dn.uridatosnomenclador = 'demandada')
                    INNER JOIN mod_planificacion.dat_actividadentidad ae
                    ON(ae.idactespcomportamiento = aec.idactespcomportamiento)
                    LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                    ON(ae.idactividadentidad = aem.idactividadentidad)
                    LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                    ON(ae.idactividadentidad = aea.idactividadentidad)
                    LEFT JOIN mod_planificacion.dat_actividadentidadproduccion np
                    ON(ae.idactividadentidad = np.idactividadentidad)
                    INNER JOIN mod_planificacion.dat_norma n
                    ON(n.idactividad = a.idactividad)
                    INNER JOIN mod_planificacion.nom_indicador ind
                    ON(ind.idindicador = n.idindicador)
                    
                    LEFT JOIN  mod_planificacion.dat_actividadentidadnae aenae
                    ON( aenae.idactividadentidad = ae.idactividadentidad )
                    LEFT JOIN  mod_planificacion.dat_planificacionnaegeneral pg
                    ON( aenae.idplanificacionnaegeneral = pg.idplanificacionnaegeneral )

                    LEFT JOIN  mod_planificacion.dat_planificacionnaeobjetogasto pnog
                    ON( pnog.idplanificacionnaegeneral = pg.idplanificacionnaegeneral )
        
                    LEFT JOIN  mod_planificacion.dat_planificacionnaeingreso pni
                    ON( pni.idplanificacionnaegeneral = pg.idplanificacionnaegeneral )
        
                    LEFT JOIN  mod_planificacion.nom_objetogasto og
                    ON( og.idobjetogasto = pnog.idobjetogasto )
        
                    LEFT JOIN  mod_planificacion.nom_recursofinanciero rf
                    ON( rf.idrecursofinanciero = pni.idingreso )
        
                    LEFT JOIN  mod_planificacion.nom_nae nae
                    ON( aenae.idnae = nae.idnae )
        
                    WHERE a.estado =1 AND a.idaprobacion >= 3
                    AND a.nivel = {$arrayFormatoUltimonivel[1]}
                    AND ae.idaprobacion >= 3 AND ae.idejercicio = {$idejercicio}
                    AND aec.idespecialidad = ? AND ae.identidad = ?
                    AND am.idmodelo = ? {$where}
                    GROUP BY a.idactividad,a.codigo,a.denominacion,a.idespecialidad,
                    ae.idactividadentidad,aem.nivelactividadmanual,aea.nivelactividadautomatico,
                    np.nivelactividadproduccion,aenae.idplanificacionnaegeneral,
                    pnog.idobjetogasto,pni.idingreso,nae.codigo,nae.denominacion,
                    og.codigo,og.denominacion,rf.codigo,rf.denominacion,aenae.idactividadentidadnae
                    {$having}  OFFSET ? LIMIT ? ";
            $arraySqlparamsTotal = $arraySqlParams;
            $arraySqlParams[] = $params['start'];
            $arraySqlParams[] = $params['limit'];
            $data->data = $conn->execute($sql, $arraySqlParams)->fetchAll(
                    PDO::FETCH_CLASS
            ); //PDO::FETCH_UNIQUE |

            $sql = "SELECT COUNT( DISTINCT a.idactividad ) as total
                        FROM mod_planificacion.nom_actividad a
                        INNER JOIN mod_planificacion.dat_actividadmodelo am
                        ON(am.idactividad = a.idactividad)
                        INNER JOIN mod_planificacion.dat_actespcomportamiento aec
                        ON(aec.idactividad = a.idactividad)
                        INNER JOIN mod_planificacion.dat_actividadentidad ae
                        ON(ae.idactespcomportamiento = aec.idactespcomportamiento)
                        INNER JOIN mod_planificacion.nom_datosnomenclador dn
                        ON(dn.iddatosnomenclador = aec.iddatosnomenclador 
                        AND dn.uridatosnomenclador = 'demandada')
                        LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                        ON(ae.idactividadentidad = aem.idactividadentidad)
                        LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                        ON(ae.idactividadentidad = aea.idactividadentidad)
                        LEFT JOIN mod_planificacion.dat_actividadentidadproduccion np
                        ON(ae.idactividadentidad = np.idactividadentidad)
                        INNER JOIN mod_planificacion.dat_norma n
                        ON(n.idactividad = a.idactividad)
                        INNER JOIN mod_planificacion.nom_indicador ind
                        ON(ind.idindicador = n.idindicador)
        
                        LEFT JOIN  mod_planificacion.dat_actividadentidadnae aenae
                        ON( aenae.idactividadentidad = ae.idactividadentidad )
                        LEFT JOIN  mod_planificacion.dat_planificacionnaegeneral pg
                        ON( aenae.idplanificacionnaegeneral = pg.idplanificacionnaegeneral )

                        LEFT JOIN  mod_planificacion.dat_planificacionnaeobjetogasto pnog
                        ON( pnog.idplanificacionnaegeneral = pg.idplanificacionnaegeneral )

                        LEFT JOIN  mod_planificacion.dat_planificacionnaeingreso pni
                        ON( pni.idplanificacionnaegeneral = pg.idplanificacionnaegeneral )

                        LEFT JOIN  mod_planificacion.nom_objetogasto og
                        ON( og.idobjetogasto = pnog.idobjetogasto )

                        LEFT JOIN  mod_planificacion.nom_recursofinanciero rf
                        ON( rf.idrecursofinanciero = pni.idingreso )

                        LEFT JOIN  mod_planificacion.nom_nae nae
                        ON( aenae.idnae = nae.idnae )

                        WHERE a.estado =1 AND a.idaprobacion >= 3
                        AND a.nivel = {$arrayFormatoUltimonivel[1]}
                        AND ae.idaprobacion >= 3 AND ae.idejercicio = {$idejercicio}
                        AND aec.idespecialidad = ? AND ae.identidad = ?
                        AND am.idmodelo = ? $where {$having} ";
            $result = $conn->execute($sql, $arraySqlparamsTotal)->fetchAll(
                    PDO::FETCH_CLASS
            ); //PDO::FETCH_UNIQUE |
            $data->total = $result[0]->total;

            $sql = " SELECT
                     SUM(alias.importe) as importetotal,
                     SUM(alias.importedivisa) as importedivisa FROM (SELECT DISTINCT a.idactividad     ,              
                    round( ( COALESCE(aem.nivelactividadmanual,0)+
                    COALESCE(aea.nivelactividadautomatico,0)+
                    COALESCE(np.nivelactividadproduccion,0) ) 
                    * SUM(n.necesidad*ind.precio),3
                    ) as importe,
                    
                    round( ( COALESCE(aem.nivelactividadmanual,0)+
                    COALESCE(aea.nivelactividadautomatico,0)+
                    COALESCE(np.nivelactividadproduccion,0) ) 
                    * SUM(n.necesidad*ind.preciodivisa),3
                    ) as importedivisa                   
                    
                    FROM mod_planificacion.nom_actividad a
                    INNER JOIN mod_planificacion.dat_actividadmodelo am
                    ON(am.idactividad = a.idactividad)
                    INNER JOIN mod_planificacion.dat_actespcomportamiento aec
                    ON(aec.idactividad = a.idactividad)
                    INNER JOIN mod_planificacion.nom_datosnomenclador dn
                    ON(dn.iddatosnomenclador = aec.iddatosnomenclador 
                    AND dn.uridatosnomenclador = 'demandada')
                    INNER JOIN mod_planificacion.dat_actividadentidad ae
                    ON(ae.idactespcomportamiento = aec.idactespcomportamiento)
                    LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                    ON(ae.idactividadentidad = aem.idactividadentidad)
                    LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                    ON(ae.idactividadentidad = aea.idactividadentidad)
                    LEFT JOIN mod_planificacion.dat_actividadentidadproduccion np
                    ON(ae.idactividadentidad = np.idactividadentidad)
                    INNER JOIN mod_planificacion.dat_norma n
                    ON(n.idactividad = a.idactividad)
                    INNER JOIN mod_planificacion.nom_indicador ind
                    ON(ind.idindicador = n.idindicador)
                    
                    LEFT JOIN  mod_planificacion.dat_actividadentidadnae aenae
                    ON( aenae.idactividadentidad = ae.idactividadentidad )
                    LEFT JOIN  mod_planificacion.dat_planificacionnaegeneral pg
                    ON( aenae.idplanificacionnaegeneral = pg.idplanificacionnaegeneral )

                    LEFT JOIN  mod_planificacion.dat_planificacionnaeobjetogasto pnog
                    ON( pnog.idplanificacionnaegeneral = pg.idplanificacionnaegeneral )
        
                    LEFT JOIN  mod_planificacion.dat_planificacionnaeingreso pni
                    ON( pni.idplanificacionnaegeneral = pg.idplanificacionnaegeneral )
        
                    LEFT JOIN  mod_planificacion.nom_objetogasto og
                    ON( og.idobjetogasto = pnog.idobjetogasto )
        
                    LEFT JOIN  mod_planificacion.nom_recursofinanciero rf
                    ON( rf.idrecursofinanciero = pni.idingreso )
        
                    LEFT JOIN  mod_planificacion.nom_nae nae
                    ON( aenae.idnae = nae.idnae )
        
                    WHERE a.estado =1 AND a.idaprobacion >= 3
                    AND a.nivel = {$arrayFormatoUltimonivel[1]}
                    AND ae.idaprobacion >= 3 AND ae.idejercicio = {$idejercicio}
                    AND aec.idespecialidad = ? AND ae.identidad = ?
                    AND am.idmodelo = ? {$where}
                    GROUP BY a.idactividad,a.codigo,a.denominacion,a.idespecialidad,
                    ae.idactividadentidad,aem.nivelactividadmanual,aea.nivelactividadautomatico,
                    np.nivelactividadproduccion,aenae.idplanificacionnaegeneral,
                    pnog.idobjetogasto,pni.idingreso,nae.codigo,nae.denominacion,
                    og.codigo,og.denominacion,rf.codigo,rf.denominacion,
                    aenae.idactividadentidadnae {$having} ) alias ";
            $resImpTotaldiv = $conn->execute($sql, $arraySqlparamsTotal)
                    ->fetchAll(
                    PDO::FETCH_CLASS
            );
            $data->importetotal = $resImpTotaldiv[0]->importetotal;
            $data->importetotaldivisa = $resImpTotaldiv[0]->importedivisa;
            $data->sum_na = $resImpTotaldiv[0]->sum_na;
            $data->sum_importe = $resImpTotaldiv[0]->sum_importe;
        } else {
            //consolidar
            $result = NomActividad::serv_getEspecialidades(
                            $params ['identidad'], $params ['idespecialidad']
            );
            if ($result->array_id_esps[0] == null || $result->array_ents[0] == null
            ) {
                $data->data = array();
                $data->total = 0;
                return $data;
            }
            $strEsp = implode(',', $result->array_id_esps);
            $strEnts = implode(',', $result->array_ents);

            $sql = "SELECT DISTINCT a.idactividad,
                    a.codigo,
                    a.denominacion,
                    a.idespecialidad,                   
                    round(( SELECT SUM(n.necesidad*ind.precio)
                    FROM mod_planificacion.dat_norma n
                    INNER JOIN mod_planificacion.nom_indicador ind
                    ON(ind.idindicador = n.idindicador AND ind.idaprobacion > 2 AND ind.estado = 1 AND ind.nivel = 1)
                    WHERE n.idactividad = a.idactividad ) *
                    ( 
                     SUM( COALESCE(aem.nivelactividadmanual,0) )+
                     SUM( COALESCE(aea.nivelactividadautomatico,0))+
                     SUM( COALESCE(np.nivelactividadproduccion,0))
                    ),3) as importe,'-' as idobjetogasto,'-' as idingreso,
                    '-' as datos
                                    
                    FROM mod_planificacion.nom_actividad a                    
                    INNER JOIN mod_planificacion.dat_actespcomportamiento aec
                    ON( aec.idactividad = a.idactividad  AND aec.idespecialidad IN({$strEsp}))
                    
                    INNER JOIN mod_planificacion.dat_actividadentidad ae
                    ON( ae.idejercicio = {$idejercicio} AND ae.idactespcomportamiento = aec.idactespcomportamiento
                    AND ae.identidad IN({$strEnts}))
                    
                    INNER JOIN mod_planificacion.nom_datosnomenclador dn
                    ON(dn.iddatosnomenclador = aec.iddatosnomenclador
                    AND dn.uridatosnomenclador = 'demandada')
                    
                    LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                    ON(ae.idactividadentidad = aem.idactividadentidad)
                    
                    LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                    ON(ae.idactividadentidad = aea.idactividadentidad)
                    
                    LEFT JOIN mod_planificacion.dat_actividadentidadproduccion np
                    ON(ae.idactividadentidad = np.idactividadentidad)
                    
                    INNER JOIN mod_planificacion.dat_actividadmodelo am
                    ON(am.idactividad = a.idactividad)
        
                    WHERE a.estado =1
                    AND a.idaprobacion > 2
                    AND a.nivel = {$arrayFormatoUltimonivel[1]}
                    AND ae.idaprobacion > 2 AND am.idmodelo = ?
                    {$where}
                    GROUP BY a.idactividad,a.codigo,a.denominacion,a.idespecialidad
                        
                    {$having} OFFSET ? LIMIT ? ";

            $arraySqlparamsTotal = $arraySqlParams;
            $arraySqlParams[] = $params['start'];
            $arraySqlParams[] = $params['limit'];
            $data->data = $conn->execute($sql, $arraySqlParams)->fetchAll(
                    PDO::FETCH_CLASS
            ); //PDO::FETCH_UNIQUE |

            $sql = "SELECT  COUNT( DISTINCT a.idactividad ) as total
                    FROM mod_planificacion.nom_actividad a                    
                    INNER JOIN mod_planificacion.dat_actespcomportamiento aec
                    ON( aec.idactividad = a.idactividad  AND aec.idespecialidad IN({$strEsp}))
                    
                    INNER JOIN mod_planificacion.dat_actividadentidad ae
                    ON( ae.idejercicio = {$idejercicio} AND ae.idactespcomportamiento = aec.idactespcomportamiento
                    AND ae.identidad IN({$strEnts}))
                    
                    INNER JOIN mod_planificacion.nom_datosnomenclador dn
                    ON(dn.iddatosnomenclador = aec.iddatosnomenclador
                    AND dn.uridatosnomenclador = 'demandada')
                    
                    LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                    ON(ae.idactividadentidad = aem.idactividadentidad)
                    
                    LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                    ON(ae.idactividadentidad = aea.idactividadentidad)
                    
                    LEFT JOIN mod_planificacion.dat_actividadentidadproduccion np
                    ON(ae.idactividadentidad = np.idactividadentidad)
                    
                    INNER JOIN mod_planificacion.dat_actividadmodelo am
                    ON(am.idactividad = a.idactividad)
        
                    WHERE a.estado =1 AND a.idaprobacion > 2
                    AND a.nivel = {$arrayFormatoUltimonivel[1]}
                    AND ae.idaprobacion > 2 AND am.idmodelo = ? {$where}  ";
            $result = $conn->execute($sql, $arraySqlparamsTotal)->fetchAll(
                    PDO::FETCH_CLASS
            );
            $data->total = $result[0]->total;

            $sql = "SELECT
                    SUM(alias.importe) as importetotal,                    
                    SUM(alias.importedivisa) as importetotaldivisa                    
                     FROM ( SELECT DISTINCT a.idactividad,                       
                    round(
                    ( 
                     SUM( COALESCE(aem.nivelactividadmanual,0) )+
                     SUM( COALESCE(aea.nivelactividadautomatico,0))+
                     SUM( COALESCE(np.nivelactividadproduccion,0))
                    ) *       
                    SUM( (SELECT SUM(n.necesidad*ind.precio)
                    FROM mod_planificacion.dat_norma n
                    INNER JOIN mod_planificacion.nom_indicador ind
                    ON(ind.idindicador = n.idindicador AND ind.idaprobacion > 2 AND ind.estado = 1 AND ind.nivel = 1)
                    WHERE n.idactividad = a.idactividad ) ),3) as importe,
                     round(
                    ( 
                     SUM( COALESCE(aem.nivelactividadmanual,0) )+
                     SUM( COALESCE(aea.nivelactividadautomatico,0))+
                     SUM( COALESCE(np.nivelactividadproduccion,0))
                    ) *       
                    SUM( (SELECT SUM(n.necesidad*ind.preciodivisa)
                    FROM mod_planificacion.dat_norma n
                    INNER JOIN mod_planificacion.nom_indicador ind
                    ON(ind.idindicador = n.idindicador AND ind.idaprobacion > 2 AND ind.estado = 1 AND ind.nivel = 1)
                    WHERE n.idactividad = a.idactividad ) ),3) as importedivisa

                    
                    FROM mod_planificacion.nom_actividad a       
                    
                    INNER JOIN mod_planificacion.dat_actespcomportamiento aec
                    ON( aec.idactividad = a.idactividad  AND aec.idespecialidad IN({$strEsp}))
                    
                    INNER JOIN mod_planificacion.dat_actividadentidad ae
                    ON( ae.idejercicio = {$idejercicio} AND ae.idactespcomportamiento = aec.idactespcomportamiento
                    AND ae.identidad IN({$strEnts}))
                    
                    INNER JOIN mod_planificacion.nom_datosnomenclador dn
                    ON(dn.iddatosnomenclador = aec.iddatosnomenclador
                    AND dn.uridatosnomenclador = 'demandada')
                    
                    LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                    ON(ae.idactividadentidad = aem.idactividadentidad)
                    
                    LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                    ON(ae.idactividadentidad = aea.idactividadentidad)
                    
                    LEFT JOIN mod_planificacion.dat_actividadentidadproduccion np
                    ON(ae.idactividadentidad = np.idactividadentidad)
                  
                    
                    INNER JOIN mod_planificacion.dat_actividadmodelo am
                    ON(am.idactividad = a.idactividad)
        
                    WHERE a.estado =1 AND a.idaprobacion > 2
                    AND a.nivel = {$arrayFormatoUltimonivel[1]}
                    AND ae.idaprobacion > 2 AND am.idmodelo = ? {$where}
                    GROUP BY a.idactividad,a.codigo,a.denominacion,a.idespecialidad
                    
                    {$having} ) alias ";

            $resultImp = $conn->execute($sql, $arraySqlparamsTotal)
                    ->fetchAll(PDO::FETCH_CLASS);
            $data->importetotal = $resultImp[0]->importetotal;
            $data->importetotaldivisa = $resultImp[0]->importetotaldivisa;
        }
        return $data;
    }

    public function asociarNaeAOGoRF($params, $esog) {

        foreach ($params['actividades'] as $idactent) {
            if ($idactent != null) {
                foreach ($params['idnae'] as $idnae) {
                    $aenae = DatActividadentidadnae::buscarActEntNae(
                                    $idactent, $idnae
                    );
                    if ($aenae->idactividadentidadnae != null) { //actualizar
                        $aenae->idnae = $idnae;
                        if ($esog == true) { //act. OG
                            if ($aenae->DatPlanificacionnaegeneral->DatPlanificacionnaeobjetogasto->idplanificacionnaegeneral != null
                            ) {
                                $aenae->DatPlanificacionnaegeneral->DatPlanificacionnaeobjetogasto->idobjetogasto = $params['idog'];
                                $aenae->DatPlanificacionnaegeneral->DatPlanificacionnaeobjetogasto->save(
                                );
                            } else {
                                if ($aenae->DatPlanificacionnaegeneral->DatPlanificacionnaeingreso->idplanificacionnaegeneral != null
                                ) {
                                    $aenae->DatPlanificacionnaegeneral->DatPlanificacionnaeingreso->delete(
                                    );
                                }
//                            //add OG
                                $aenae->DatPlanificacionnaegeneral->DatPlanificacionnaeobjetogasto = new DatPlanificacionnaeobjetogasto();
                                $aenae->DatPlanificacionnaegeneral->DatPlanificacionnaeobjetogasto->idplanificacionnaegeneral = $aenae->idplanificacionnaegeneral;
                                $aenae->DatPlanificacionnaegeneral->DatPlanificacionnaeobjetogasto->idobjetogasto = $params['idog'];
                                $aenae->DatPlanificacionnaegeneral->DatPlanificacionnaeobjetogasto->save(
                                );
                            }
                            $aenae->save();
                        } else { //act. RF
                            if ($aenae->DatPlanificacionnaegeneral->DatPlanificacionnaeingreso->idplanificacionnaegeneral != null
                            ) {
                                $aenae->DatPlanificacionnaegeneral->DatPlanificacionnaeingreso->idingreso = $params['idrf'];
                                $aenae->DatPlanificacionnaegeneral->DatPlanificacionnaeingreso->save(
                                );
                            } else {
                                if ($aenae->DatPlanificacionnaegeneral->DatPlanificacionnaeobjetogasto->idplanificacionnaegeneral != null
                                ) {
                                    $aenae->DatPlanificacionnaegeneral->DatPlanificacionnaeobjetogasto->delete(
                                    );
                                }
                                $aenae->DatPlanificacionnaegeneral->DatPlanificacionnaeingreso = new DatPlanificacionnaeingreso();
                                $aenae->DatPlanificacionnaegeneral->DatPlanificacionnaeingreso->idplanificacionnaegeneral = $aenae->idplanificacionnaegeneral;
                                $aenae->DatPlanificacionnaegeneral->DatPlanificacionnaeingreso->idingreso = $params['idrf'];
                                $aenae->DatPlanificacionnaegeneral->DatPlanificacionnaeingreso->save(
                                );
                            }
                            $aenae->save();
                        }
                    } else { //add
                        $plangen = new DatPlanificacionnaegeneral();
                        $plangen->save();
                        if ($esog == true) {
                            $plangenog = new DatPlanificacionnaeobjetogasto();
                            $plangenog->idplanificacionnaegeneral = $plangen->idplanificacionnaegeneral;
                            $plangenog->idobjetogasto = $params['idog'];
                            $plangenog->save();
                        } else {
                            $plangidrf = new DatPlanificacionnaeingreso();
                            $plangidrf->idingreso = $params['idrf'];
                            $plangidrf->save();
                        }
                        $naeog = new DatActividadentidadnae();
                        $naeog->idnae = $idnae;
                        $naeog->idactividadentidad = $idactent;
                        $naeog->idplanificacionnaegeneral = $plangen->idplanificacionnaegeneral;
                        $naeog->save();
                    }
                }
            }
        }
        return 1;
    }

    public function desasociarNaeAOGoRF($params) {
        if ($params['idactividadentidadnae'][0] != null) {
            $query = new Doctrine_Query();
            $query->delete('DatActividadentidadnae')
                    ->from('DatActividadentidadnae aen')
                    ->whereIn(
                            'aen.idactividadentidadnae', $params['idactividadentidadnae']
                    )->execute();
            return 1;
        } else {
            return 3;
        }
    }

}
