<?php

class DatEtapaEquipo extends BaseDatEtapaEquipos {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('DatEtapa', array('local' => 'idetapainversion', 'foreign' => 'idetapainversion'));
        $this->hasOne('DatElemento', array('local' => 'idelemento', 'foreign' => 'idelemento'));
        $this->hasOne('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
    }

    public function adiconarEqui($array_equipo, $params) {
        $des = "Se ha adicionado el equipo: ";
        foreach ($array_equipo as $key => $value) {
            $des = $des . "{$value->denominacion}, ";
            
            $idcentro = split(",", $value->idcentrobalance);
            foreach ($idcentro as $ke => $val) {
                $model = new DatEtapaEquipo();
                $model->idindicador = $value->idindicador;
                $model->idunidadmedida = $value->idumedida;
                $model->precio = $value->precio;
                $model->preciodivisa = $value->preciodivisa;
                $model->idcentrobalance = $val;
                $model->idequipoplan = $params['idequipoplan'];
                if($params['idequipoplan']==10){
                    $model->identidadmodelo = 6227;
                }
                if($params['idequipoplan']==9){
                    $model->identidadmodelo = 466;
                }
                $model->importe = 0;
                $model->importedivisa = 0;
                $model->cantidad = 0;
                $model->idadquisicion = null;
                $model->idcomprar = null;
                $model->idetapainversion = $params['idetapainversion'];
                $model->idejercicio = $params['idejercicio'];
                $model->save();
            }
        }

        //Insertar Traza
        /*HisTrazasinversionesModel::seveTrazasInversiones('Inversión_Equipo', 'adicionar', 'dat_etapaequipos', 
                $params['idinversion'], $des, $params['idusuario']);*/
    }

    public function listarEquipos($params) {
        // print_r()
        $ADDWHERE = "";
        $condiciones = array();
        $array_parametros = array();
        $p = $params['filtros'];
        foreach ($p as $key => $datos) {
            if ($datos['field'] == 'denominacion') {
                $condiciones[] = "upper(n.denominacion) LIKE " . ("'%" . strtoupper($datos['data']['value']) . "%'");
            } else if ($datos['field'] == 'codigo') {
                $condiciones[] = "(n.codigo) LIKE " . ("'%" . $datos['data']['value'] . "%'");
            } else if ($datos['field'] == 'descripcion') {
                $condiciones[] = "upper(n.descripcion) LIKE " . ("'%" . strtoupper($datos['data']['value']) . "%'");
            } else if ($datos['field'] == 'cantidad') { {
                    $cond = "=";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $condiciones[] = "e.cantidad {$cond} " . ($datos['data']['value']);
                }
            } else if ($datos['field'] == 'precio') { {
                    $cond = "=";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $condiciones[] = "e.precio {$cond} " . ($datos['data']['value']);
                }
            } else if ($datos['field'] == 'preciodivisa') { {
                    $cond = "=";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $condiciones[] = "e.preciodivisa {$cond} " . ($datos['data']['value']);
                }
            } else if ($datos['field'] == 'importe') { {
                    $cond = "=";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $condiciones[] = "e.importe {$cond} " . ($datos['data']['value']);
                }
            } else if ($datos['field'] == 'importedivisa') { {
                    $cond = "=";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $condiciones[] = "e.importedivisa {$cond} " . ($datos['data']['value']);
                }
            } else if ($datos['field'] == 'donacion' && $datos['data']['value'] == 'Si') {
                $condiciones[] = "e.donacion=1";
            } else if ($datos['field'] == 'donacion' && $datos['data']['value'] == 'No') {
                $condiciones[] = "e.donacion=0";
            } else if ($datos['field'] == 'nuevo' && $datos['data']['value'] == 'Si') {
                $condiciones[] = "e.nuevo=1";
            } else if ($datos['field'] == 'nuevo' && $datos['data']['value'] == 'No') {
                $condiciones[] = "e.nuevo=0";
            } else if ($datos['field'] == 'via') {
                $condiciones[] = "upper(va.denominacion) LIKE " . ("'%" . strtoupper($datos['data']['value']) . "%'");
            } else if ($datos['field'] == 'orgrect') {
                $condiciones[] = "upper(os.denominacion) LIKE " . ("'%" . strtoupper($datos['data']['value']) . "%'");
            } else if ($datos['field'] == 'observaciones') {
                $condiciones[] = "upper(e.observaciones) LIKE " . ("'%" . strtoupper($datos['data']['value']) . "%'");
            } else if ($datos['field'] == 'adquirir') {
                $condiciones[] = (" e.idadquisicion  =" . ($datos['data']['value']));
            } else if ($datos['field'] == 'comprar') {
                $condiciones[] = (" e.idcomprar  =" . ($datos['data']['value']));
            } else if ($datos['field'] == 'pais') {
                $condiciones[] = (" e.idcomprarpais  =" . ($datos['data']['value']));
            }
        }
        $ADDWHERE = ' ';
        foreach ($condiciones as $condicion) {
            $ADDWHERE = $ADDWHERE . ' AND ' . $condicion;
        }
        $conn = Doctrine_Manager::connection();

        //print_r($params['identidadmodelo']);die;
        $sql = "Select /*distinct ON (e.idindicador)*/e.idindicador,e.precio,e.preciodivisa,e.idunidadmedida,e.idcentrobalance,
                       e.cantidad,e.importe,e.importedivisa,
                       --e.identidadmodelo,
                       n.denominacion,n.codigo,n.numeropieza,
                       n.descripcion,e.idetapaequipos,va.denominacion as via,os.denominacion as orgrector,
                       e.observaciones,e.idadquisicion,e.idcomprar,dat.denominacion as adquirir,da.denominacion as comprar,e.idcomprarpais
                       ,dapa.denominacion as pais
                       ,(select array(select Distinct(COALESCE(sc4.denominacion,'-')) from mod_planifinversiones.dat_etapaequipos sc1
                       INNER JOIN mod_datosmaestros.nom_indicador sc2 ON (sc1.idindicador = sc2.idindicador)
	              INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface sc3 ON (sc2.idindicador = sc3.idindicador)
	               INNER JOIN mod_datosmaestros.nom_organosatisface sc4 ON (sc3.idorganosatisface = sc4.idorganosatisface)
                       Where sc1.idindicador = e.idindicador AND sc2.idindicador=sc3.idindicador )) as orgrect
                       from mod_planifinversiones.dat_etapaequipos e
                       INNER JOIN mod_datosmaestros.nom_indicador n ON (n.idindicador=e.idindicador)
                       LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicion indv ON (n.idindicador = indv.idindicador)
                       LEFT JOIN mod_datosmaestros.nom_viaadquisicion va ON (indv.idviaadquisicion = va.idviaadquisicion)
                       LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface indos ON (indos.idindicador = n.idindicador)
                       LEFT JOIN mod_datosmaestros.nom_organosatisface os ON (os.idorganosatisface = indos.idorganosatisface)
                       LEFT JOIN mod_planifinversiones.dat_adquisicion ad ON (e.idadquisicion = ad.idadquisicion)
                       LEFT JOIN mod_planificacion.nom_datosnomenclador dat ON (dat.iddatosnomenclador =  ad.iddatosnomenclador)
                       LEFT JOIN mod_planifinversiones.dat_comprar com ON (e.idcomprar= com.idcomprar)
                       LEFT JOIN mod_planificacion.nom_datosnomenclador da ON (da.iddatosnomenclador =  com.iddatosnomenclador)
                       LEFT JOIN mod_planifinversiones.dat_comprar compa ON (e.idcomprarpais= compa.idcomprar)
                       LEFT JOIN mod_planificacion.nom_datosnomenclador dapa ON (dapa.iddatosnomenclador =  compa.iddatosnomenclador)
                       WHERE e.idetapainversion=" . $params['idetapainversion'] . " AND  e.idequipoplan=" . $params['idequipoplan'] . "
                       $ADDWHERE 
                       OFFSET " . $params['start'] . "
                       LIMIT " . $params['limit'] . " ";
        //
        /* $array_parametros [] = $params['start'];
          $array_parametros [] = $params['limit']; */

//print_r($sql);die;
        $data['data'] = $conn->execute($sql/* , $array_parametros */)->fetchAll(PDO::FETCH_ASSOC);
//print_r($data);die;

        $conn = Doctrine_Manager::connection();

        $querytotal = "Select /*distinct ON (e.idindicador)*/e.idindicador,e.precio,e.preciodivisa,e.idunidadmedida,e.idcentrobalance,
                       e.cantidad,e.importe,e.importedivisa,
                       --e.identidadmodelo,
                       n.denominacion,n.codigo,n.numeropieza,
                       n.descripcion,e.idetapaequipos,va.denominacion as via,os.denominacion as orgrector,
                       e.observaciones,e.idadquisicion,e.idcomprar,dat.denominacion as adquirir,da.denominacion as comprar
                       ,(select array(select Distinct(COALESCE(sc4.denominacion,'-')) from mod_planifinversiones.dat_etapaequipos sc1
                       INNER JOIN mod_datosmaestros.nom_indicador sc2 ON (sc1.idindicador = sc2.idindicador)
	              INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface sc3 ON (sc2.idindicador = sc3.idindicador)
	               INNER JOIN mod_datosmaestros.nom_organosatisface sc4 ON (sc3.idorganosatisface = sc4.idorganosatisface)
                       Where sc1.idindicador = e.idindicador AND sc2.idindicador=sc3.idindicador )) as orgrect
                       from mod_planifinversiones.dat_etapaequipos e
                       INNER JOIN mod_datosmaestros.nom_indicador n ON (n.idindicador=e.idindicador)
                       LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicion indv ON (n.idindicador = indv.idindicador)
                       LEFT JOIN mod_datosmaestros.nom_viaadquisicion va ON (indv.idviaadquisicion = va.idviaadquisicion)
                       LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface indos ON (indos.idindicador = n.idindicador)
                       LEFT JOIN mod_datosmaestros.nom_organosatisface os ON (os.idorganosatisface = indos.idorganosatisface)
                       LEFT JOIN mod_planifinversiones.dat_adquisicion ad ON (e.idadquisicion = ad.idadquisicion)
                       LEFT JOIN mod_planificacion.nom_datosnomenclador dat ON (dat.iddatosnomenclador =  ad.iddatosnomenclador)
                       LEFT JOIN mod_planifinversiones.dat_comprar com ON (e.idcomprar= com.idcomprar)
                       LEFT JOIN mod_planificacion.nom_datosnomenclador da ON (da.iddatosnomenclador =  com.iddatosnomenclador)
                       WHERE e.idetapainversion=" . $params['idetapainversion'] . " AND  e.idequipoplan=" . $params['idequipoplan'] . "
                       $ADDWHERE
                        ";

        $resultado = $conn->execute($querytotal)->fetchAll(PDO::FETCH_ASSOC);
        //print_r($resultado);die();
        //$data['total'] = $resultado[0]['total'];
        $data['total'] = count($resultado);
        //print_r($data);die();
        return $data;
    }

    public function listarEnt($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select dn.denominacion,
                    ep.idequipoplan
             from mod_planifinversiones.dat_equipoplan ep
             INNER JOIN mod_planificacion.nom_datosnomenclador dn ON dn.iddatosnomenclador = ep.iddatosnomenclador";
//    print_r($sql);die;    
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }
    public function listarEnt_old($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select distinct ON (m.idmodelo)m.idmodelo,ent.identidadmodelo,m.denominacion  FROM mod_planificacion.dat_entidadmodelo ent
                             INNER JOIN mod_planificacion.dat_modelo m ON(ent.idmodelo=m.idmodelo)
                             WHERE ent.identidad=" . $params['identidad'] . "";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function deVolPlan($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select ndn.denominacion,
                ep.idequipoplan
                from mod_planifinversiones.dat_equipoplan ep
                INNER JOIN mod_planificacion.nom_datosnomenclador ndn ON ndn.iddatosnomenclador = ep.iddatosnomenclador";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }
//    public function deVolPlan($params) {
//        $conn = Doctrine_Manager::connection();
//        $sql = "Select distinct ON (m.idmodelo)m.idmodelo,ent.identidadmodelo,m.denominacion  
//                FROM mod_planificacion.dat_entidadmodelo ent
//                INNER JOIN mod_planificacion.dat_modelo m ON(ent.idmodelo=m.idmodelo)
//                INNER JOIN mod_planifinversiones.dat_etapaequipos et ON(et.identidadmodelo= ent.identidadmodelo)
//                INNER JOIN mod_planifinversiones.dat_etapainversion eti ON(eti.idetapainversion = et.idetapainversion)
//                WHERE eti.idinversion=" . $params['idinversion'];
//        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
//        return $data;
//    }


    public function getEquipoGlobalByInversion($idinversion) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select eqg.idetapaequipoglobal
                             FROM mod_planifinversiones.dat_etapainversion e
                             INNER JOIN mod_planifinversiones.dat_etapaequipos eq ON(e.idetapainversion = eq.idetapainversion)
                             INNER JOIN mod_planifinversiones.dat_etapaequipoglobal eqg ON(eq.idetapaequipos= eqg.idetapaequipos)
                             WHERE e.idinversion = $idinversion";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function deVolEtapa($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select distinct ON (eiv.idetapainversion)eiv.idetapainversion idetapa, ne.denominacion
                FROM mod_planifinversiones.dat_etapainversion eiv
                INNER JOIN mod_planifinversiones.dat_etapa et ON (eiv.idetapa =et.idetapa)
                INNER JOIN mod_planifinversiones.dat_etapaequipos etp ON(etp.idetapainversion= eiv.idetapainversion)
                INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
                WHERE eiv.idinversion = " . $params['idinversion'];
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarEquiposDesglose($params) {
        $ADDWHERE = "";
        if ($params['idindicador']) {
            $ADDWHERE = $ADDWHERE . " AND ni.idindicador = " . $params['idindicador'];
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                ni.denominacion,
                ni.idindicador,
                ee.identidadmodelo,
                em.idmodelo,
                coalesce(egp.valor, 0) AS valor,
                ni.descripcion,
                ee.importe,
                ee.importedivisa,
                ee.idcentrobalance,
                ee.idadquisicion,
                nna.denominacion as adquirir,
                ee.idcomprar,
                nnc.denominacion as comprar,

                ee.idcomprarpais,
                nncp.denominacion as comprarpais
              FROM
                mod_planifinversiones.dat_etapaequipos ee
                INNER JOIN mod_planificacion.dat_entidadmodelo em ON(em.identidadmodelo = ee.identidadmodelo)
                INNER JOIN mod_planifinversiones.dat_etapainversion ei ON (ee.idetapainversion = ei.idetapainversion)
     
                INNER JOIN mod_planifinversiones.dat_comprar dc ON (dc.idcomprar = ee.idcomprar)
                INNER JOIN mod_planificacion.nom_datosnomenclador nnc ON (nnc.iddatosnomenclador = dc.iddatosnomenclador)

                INNER JOIN mod_planifinversiones.dat_comprar dcp ON (dcp.idcomprar = ee.idcomprarpais)
                INNER JOIN mod_planificacion.nom_datosnomenclador nncp ON (nncp.iddatosnomenclador = dcp.iddatosnomenclador)

                INNER JOIN mod_planifinversiones.dat_adquisicion da ON (da.idadquisicion = ee.idadquisicion)
                INNER JOIN mod_planificacion.nom_datosnomenclador nna ON (nna.iddatosnomenclador = da.iddatosnomenclador)

                INNER JOIN mod_datosmaestros.nom_indicador ni ON (ee.idindicador = ni.idindicador)
                LEFT JOIN mod_planifinversiones.dat_etapaequipoglobal eg ON (ee.idetapaequipos = eg.idetapaequipos)
                LEFT JOIN mod_planifinversiones.dat_etapaequipoplan egp ON (eg.idetapaequipoglobal = egp.idetapaequipoglobal) AND (egp.idejercicio = 91)
              WHERE
                ei.idinversion = " . $params['idinversion'] . " $ADDWHERE
              ORDER BY
                ni.denominacion,
                ee.identidadmodelo";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarEquiposDesagregac($params) {
// pre_r($params);die;
//        $ADDWHERE = "";
//        if ($params['idindicador']) {
//            $ADDWHERE = $ADDWHERE . " AND ni.idindicador = " . $params['idindicador'];
//        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT eg.idetapaequipoglobal,
                       ni.denominacion,
                       ni.idindicador,
                       ee.identidadmodelo,
                       em.idmodelo,
                       (coalesce(ee.cantidad, 0))::numeric(19,0) AS valor,
                       ip.precio,
                       ip.preciodivisa,
                       ni.descripcion,
                       (coalesce(egp.valor, 0) * ip.precio)::numeric(19,2) as importe, --ee.importe
                       (coalesce(egp.valor, 0) * ip.preciodivisa)::numeric(19,2) as importedivisa, --ee.importedivisa
                       ee.idcentrobalance,
                       ee.idadquisicion,
                       nna.denominacion as adquirir,
                       ee.idcomprar,
                       nnc.denominacion as comprar,
                       ee.idcomprarpais,
                       nncp.denominacion as comprarpais
                FROM mod_planifinversiones.dat_etapaequipos ee
                inner join mod_datosmaestros.nom_indicadorplanif ip on (ip.idindicador = ee.idindicador)
                     INNER JOIN mod_planificacion.dat_entidadmodelo em ON (em.identidadmodelo = ee.identidadmodelo)
                     INNER JOIN mod_planifinversiones.dat_etapainversion ei ON (ee.idetapainversion = ei.idetapainversion)
                     INNER JOIN mod_planifinversiones.dat_comprar dc ON (dc.idcomprar = ee.idcomprar)
                     INNER JOIN mod_planificacion.nom_datosnomenclador nnc ON (nnc.iddatosnomenclador = dc.iddatosnomenclador)
                     INNER JOIN mod_planifinversiones.dat_comprar dcp ON (dcp.idcomprar = ee.idcomprarpais)
                     INNER JOIN mod_planificacion.nom_datosnomenclador nncp ON (nncp.iddatosnomenclador = dcp.iddatosnomenclador)
                     INNER JOIN mod_planifinversiones.dat_adquisicion da ON (da.idadquisicion = ee.idadquisicion)
                     INNER JOIN mod_planificacion.nom_datosnomenclador nna ON (nna.iddatosnomenclador = da.iddatosnomenclador)
                     INNER JOIN mod_datosmaestros.nom_indicador ni ON (ee.idindicador = ni.idindicador)
                     LEFT JOIN mod_planifinversiones.dat_etapaequipoglobal eg ON (ee.idetapaequipos = eg.idetapaequipos)
                     LEFT JOIN mod_planifinversiones.dat_etapaequipoplan egp ON (eg.idetapaequipoglobal = egp.idetapaequipoglobal) AND (egp.idejercicio = " . $params['idejercicio'] . ")
                WHERE ei.idinversion = " . $params['idinversion'] . "
                ORDER BY ni.denominacion,
                         ee.identidadmodelo";
        //print_r($sql); die;
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function boolEquipoDesglosado($idEtapaEquipo) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                count(ep.idetapaequipoplan) AS cont
              FROM
                mod_planifinversiones.dat_etapaequipoplan ep
                INNER JOIN mod_planifinversiones.dat_etapaequipoglobal eg ON (ep.idetapaequipoglobal = eg.idetapaequipoglobal)
                INNER JOIN mod_planifinversiones.dat_etapaequipos eq ON (eg.idetapaequipos = eq.idetapaequipos)
                INNER JOIN mod_planifinversiones.dat_etapainversion ei ON (eq.idetapainversion = ei.idetapainversion)
                INNER JOIN mod_planifinversiones.dat_inversion i ON (i.idinversion = ei.idinversion)
              WHERE               
                eq.idetapaequipos = " . $idEtapaEquipo . " AND 
                ep.valor <> 0";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function eliminarEqui($parametros) {
            $conn = Doctrine_Manager::connection();
            if(count($parametros)){
                $query = "DELETE FROM 
                            mod_planifinversiones.dat_etapaequipos 
                          WHERE 
                            idetapaequipos in ($parametros)";
                return $conn->execute($query);
            }
            return true;
//        $query = new Doctrine_Query();
//        return $query->delete()
//                        ->from('DatEtapaEquipo ')
//                        ->whereIn('idetapaequipos', $parametros)
//                        ->execute();
    }

    public function updateEquipos($params, $arre) {
        if ($arre['idetapaequipos'] != '') {
            $conn = Doctrine_Manager::connection();
            $query = "UPDATE mod_planifinversiones.dat_etapaequipos 
                         SET cantidad = '" . $arre['cantidad'] . "',
                              importe = '" . $arre['importe'] . "',
                              importedivisa = '" . $arre['importedivisa'] . "',
                              idadquisicion = '" . $arre['idadquisicion'] . "',
                              idcomprar = '" . $arre['idcomprar'] . "',
                              idcomprarpais = '" . $arre['idcomprarpais'] . "',
                              observaciones = '" . $arre['observaciones'] . "'
                          WHERE  idetapaequipos = " . $arre['idetapaequipos'] . "
                            ";
            $total = $conn->execute($query);
        }
    }

    public function listarEquiposPlan($params) {

        $ADDWHERE = "";
        $condiciones = array();
        $array_parametros = array();
        $p = $params['filtros'];
        foreach ($p as $key => $datos) {
            if ($datos['field'] == 'denominacion') {
                $condiciones[] = "upper(ind.denominacion) LIKE " . ("'%" . strtoupper($datos['data']['value']) . "%'");
            } else if ($datos['field'] == 'viaadq') {
                $condiciones[] = "upper(va.denominacion) LIKE " . ("'%" . strtoupper($datos['data']['value']) . "%'");
            } else if ($datos['field'] == 'orgrect') {
                $condiciones[] = "upper(os.denominacion) LIKE " . ("'%" . strtoupper($datos['data']['value']) . "%'");
            } else if ($datos['field'] == 'codigo') {
                $condiciones[] = "(ind.codigo) LIKE " . ("'%" . $datos['data']['value'] . "%'");
            } else if ($datos['field'] == 'descripcion') {
                $condiciones[] = "upper(ind.descripcion) LIKE " . ("'%" . strtoupper($datos['data']['value']) . "%'");
            } else if ($datos['field'] == 'cantidad') { {
                    $cond = "=";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $condiciones[] = "ee.cantidad {$cond} " . ($datos['data']['value']);
                }
            } else if ($datos['field'] == 'precio') { {
                    $cond = "=";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $condiciones[] = "ee.precio {$cond} " . ($datos['data']['value']);
                }
            } else if ($datos['field'] == 'preciodivisa') { {
                    $cond = "=";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $condiciones[] = "ee.preciodivisa {$cond} " . ($datos['data']['value']);
                }
            } else if ($datos['field'] == 'importe') { {
                    $cond = "=";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $condiciones[] = "ee.importe {$cond} " . ($datos['data']['value']);
                }
            } else if ($datos['field'] == 'importedivisa') { {
                    $cond = "=";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $condiciones[] = "ee.importedivisa {$cond} " . ($datos['data']['value']);
                }
            } else if ($datos['field'] == 'adquirir') {
                $condiciones[] = (" ee.idadquisicion  =" . ($datos['data']['value']));
            } else if ($datos['field'] == 'comprar') {
                $condiciones[] = (" ee.idcomprar  =" . ($datos['data']['value']));
            }
        }
        $ADDWHERE = ' ';
        foreach ($condiciones as $condicion) {
            $ADDWHERE = $ADDWHERE . ' AND ' . $condicion;
        }
        $conn = Doctrine_Manager::connection();
        $sql = "Select distinct(ee.idindicador), ee.cantidad, ee.precio,-- ee.idetapaequipos
                ee.importe,
                --ee.identidadmodelo,
                ei.idetapa,
                ee.idindicador, ee.preciodivisa, ee.idunidadmedida,ee.importedivisa,
                ee.idadquisicion, ee.idcomprar,dat.denominacion as adquirir,da.denominacion as comprar, ind.numeropieza, ind.codigo, ind.denominacion, ind.descripcion,
                va.denominacion as viaadq,
                --em.identidadmodelo,
                --m.denominacion as plan,
                (select array(select Distinct(COALESCE(sc4.denominacion,'-')) from mod_planifinversiones.dat_etapaequipos sc1
               INNER JOIN mod_datosmaestros.nom_indicador sc2 ON (sc1.idindicador = sc2.idindicador)
	       INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface sc3 ON (sc2.idindicador = sc3.idindicador)
	       INNER JOIN mod_datosmaestros.nom_organosatisface sc4 ON (sc3.idorganosatisface = sc4.idorganosatisface)
               Where sc1.idindicador = ee.idindicador AND sc2.idindicador=sc3.idindicador )) as orgrect
                
                from mod_planifinversiones.dat_etapainversion ei
                INNER JOIN mod_planifinversiones.dat_etapaequipos ee ON (ee.idetapainversion = ei.idetapainversion)
                --inner join mod_planificacion.dat_entidadmodelo em ON(ee.identidadmodelo=em.identidadmodelo)
                --inner join mod_planificacion.dat_modelo m ON(em.idmodelo=m.idmodelo)

                INNER JOIN mod_datosmaestros.nom_indicador ind ON (ind.idindicador = ee.idindicador)
                LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicion indv ON (ind.idindicador = indv.idindicador)
                LEFT JOIN mod_datosmaestros.nom_viaadquisicion va ON (indv.idviaadquisicion = va.idviaadquisicion)
                LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface indos ON (indos.idindicador = ind.idindicador)
                LEFT JOIN mod_datosmaestros.nom_organosatisface os ON (os.idorganosatisface = indos.idorganosatisface)
                LEFT JOIN mod_planifinversiones.dat_adquisicion ad ON (ee.idadquisicion = ad.idadquisicion)
                LEFT JOIN mod_planificacion.nom_datosnomenclador dat ON (dat.iddatosnomenclador =  ad.iddatosnomenclador)
                LEFT JOIN mod_planifinversiones.dat_comprar com ON (ee.idcomprar= com.idcomprar)
                LEFT JOIN mod_planificacion.nom_datosnomenclador da ON (da.iddatosnomenclador =  com.iddatosnomenclador)
                WHERE ei.idinversion=" . $params['idinversion'] . " $ADDWHERE order by ind.denominacion";
//print_r($sql);die;
        $data['data'] = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        $conn = Doctrine_Manager::connection();
        $querytotal = "Select COUNT(distinct(ee.idetapaequipos))AS total
                       from mod_planifinversiones.dat_etapainversion ei
                       INNER JOIN mod_planifinversiones.dat_etapaequipos ee ON (ee.idetapainversion = ei.idetapainversion)
                       INNER JOIN mod_datosmaestros.nom_indicador ind ON (ind.idindicador = ee.idindicador)
                       LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicion indv ON (ind.idindicador = indv.idindicador)
                       LEFT JOIN mod_datosmaestros.nom_viaadquisicion va ON (indv.idviaadquisicion = va.idviaadquisicion)
                       LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface indos ON (indos.idindicador = ind.idindicador)
                       LEFT JOIN mod_datosmaestros.nom_organosatisface os ON (os.idorganosatisface = indos.idorganosatisface)
                       LEFT JOIN mod_planifinversiones.dat_adquisicion ad ON (ee.idadquisicion = ad.idadquisicion)
                       LEFT JOIN mod_planificacion.nom_datosnomenclador dat ON (dat.iddatosnomenclador =  ad.iddatosnomenclador)
                       LEFT JOIN mod_planifinversiones.dat_comprar com ON (ee.idcomprar= com.idcomprar)
                       LEFT JOIN mod_planificacion.nom_datosnomenclador da ON (da.iddatosnomenclador =  com.iddatosnomenclador)
                       WHERE ei.idinversion=" . $params['idinversion'] . " 
                       $ADDWHERE 
                    ";
        $resultado = $conn->execute($querytotal)->fetchAll(PDO::FETCH_ASSOC);
        $data['total'] = $resultado[0]['total'];
        return $data;
    }

    public function listarEquiposAutomotores($parametros, $entidades) {
        $conn = Doctrine_Manager::connection();
        $ADDWHERE = "";
        if ($parametros['idcompra']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "e.idcomprar=" . $parametros['idcompra'] . "";
        }
        if ($parametros['idforma']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "inv.idformapropiedad=" . $parametros['idforma'] . "";
        }

        $sql = "Select distinct(e.idindicador),  inv.denominacion as denominv,inv.idinversion, i.denominacion as denomind
                      From mod_planifinversiones.dat_etapaequipos e
                      INNER JOIN  mod_datosmaestros.nom_indicador i ON (e.idindicador=i.idindicador)
                      LEFT JOIN  mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface org ON (org.idindicador=i.idindicador)
                      LEFT JOIN  mod_datosmaestros.nom_organosatisface nomor ON (org.idorganosatisface=nomor.idorganosatisface)
                      INNER JOIN   mod_planifinversiones.dat_etapainversion eta ON (eta.idetapainversion=e.idetapainversion)
                      INNER JOIN   mod_planifinversiones.dat_inversion inv ON (inv.idinversion=eta.idinversion)
                      Where  e.idejercicio=" . $parametros['idejercicio'] . " 
                      $ADDWHERE
                      AND inv.idestructuracomun IN (" . $entidades . ")
                          order by inv.denominacion
                      ";
        //print_r($sql);die;
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarOSInversionIdOrgano($parametros, $idorgano, $idinversion) {

        $ADDWHERE = "";
        if ($parametros['idcompra']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "e.idcomprar=" . $parametros['idcompra'] . "";
        }
        if ($parametros['idforma']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "inv.idformapropiedad=" . $parametros['idforma'] . "";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "Select distinct(os.idorganosatisface), os.denominacion 
                      From mod_planifinversiones.dat_etapaequipos e                      
                      INNER JOIN  mod_datosmaestros.nom_indicador i ON (e.idindicador=i.idindicador)
                      INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface indos ON (indos.idindicador = i.idindicador)
                      INNER JOIN mod_datosmaestros.nom_organosatisface os ON (os.idorganosatisface = indos.idorganosatisface)    
                      INNER JOIN   mod_planifinversiones.dat_etapainversion eta ON (eta.idetapainversion=e.idetapainversion)
                      INNER JOIN   mod_planifinversiones.dat_inversion inv ON (inv.idinversion=eta.idinversion)
                      INNER JOIN mod_planificacion.dat_entidadmodelo ent ON (e.identidadmodelo= ent.identidadmodelo)
                      INNER JOIN mod_planificacion.dat_modelo m ON(ent.idmodelo=m.idmodelo)
                      Where  e.idejercicio=" . $parametros['idejercicio'] . " AND inv.idinversion=" . $idinversion . "
                          $ADDWHERE
                      AND inv.idestructuracomun=$idorgano
                         -- order by inv.denominacion
                      ";
        //  print_r($sql);die;
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarInversionesdadoIdOrgano($parametros, $idorgano) {

        $ADDWHERE = "";
        if ($parametros['idcompra']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "e.idcomprar=" . $parametros['idcompra'] . "";
        }
        if ($parametros['idforma']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "inv.idformapropiedad=" . $parametros['idforma'] . "";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "Select distinct(inv.idinversion), inv.denominacion 
                      From mod_planifinversiones.dat_etapaequipos e
                      INNER JOIN  mod_datosmaestros.nom_indicador i ON (e.idindicador=i.idindicador)
                      INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface indos ON (indos.idindicador = i.idindicador)
                      INNER JOIN mod_datosmaestros.nom_organosatisface os ON (os.idorganosatisface = indos.idorganosatisface) 
                      INNER JOIN   mod_planifinversiones.dat_etapainversion eta ON (eta.idetapainversion=e.idetapainversion)
                      INNER JOIN   mod_planifinversiones.dat_inversion inv ON (inv.idinversion=eta.idinversion)
                      INNER JOIN mod_planificacion.dat_entidadmodelo ent ON (e.identidadmodelo= ent.identidadmodelo)
                      INNER JOIN mod_planificacion.dat_modelo m ON(ent.idmodelo=m.idmodelo)
                      Where  e.idejercicio=" . $parametros['idejercicio'] . " 
                          $ADDWHERE
                      AND inv.idestructuracomun=$idorgano
                          order by inv.denominacion
                      ";
        //print_r($sql);die;
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarEntidadPlan($parametros, $ids) {
        $entidades = implode(',', $ids);
        $conn = Doctrine_Manager::connection();
        $sql = "Select distinct (m.idmodelo)
                      From mod_planifinversiones.dat_etapaequipos e
                      INNER JOIN  mod_datosmaestros.nom_indicador i ON (e.idindicador=i.idindicador)
                      INNER JOIN  mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface org ON (org.idindicador=i.idindicador)
                      INNER JOIN  mod_datosmaestros.nom_organosatisface nomor ON (org.idorganosatisface=nomor.idorganosatisface)
                      INNER JOIN   mod_planifinversiones.dat_etapainversion eta ON (eta.idetapainversion=e.idetapainversion)
                      INNER JOIN   mod_planifinversiones.dat_inversion inv ON (inv.idinversion=eta.idinversion)
                      INNER JOIN mod_planificacion.dat_entidadmodelo ent ON (e.identidadmodelo= ent.identidadmodelo)
                      INNER JOIN mod_planificacion.dat_modelo m ON(ent.idmodelo=m.idmodelo)
                      Where  e.idejercicio=" . $parametros['idejercicio'] . " 
                      AND e.idcomprar=" . $parametros['idcompra'] . "  AND inv.idformapropiedad=" . $parametros['idforma'] . " 
                      AND inv.idestructuracomun IN (" . $entidades . ")
                      order by m.idmodelo
                      ";
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarPlanesReporte($entidad) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select distinct (m.idmodelo), m.denominacion
                FROM mod_planificacion.dat_entidadmodelo ent
                INNER JOIN mod_planificacion.dat_modelo m ON(ent.idmodelo=m.idmodelo)
                WHERE ent.identidad in ($entidad)
                --WHERE ent.identidad =$entidad
                order by m.denominacion
                ";
        //print_r($sql); die;
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        if ($data[0]['idmodelo'] == null) {
            $sql = "Select distinct (m.idmodelo), m.denominacion FROM  mod_planificacion.dat_modelo m
order by m.denominacion";
        //print_r($sql); die;
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        }
        return $data;
    }

    public function listarDonacion($parametros, $entidades, $diplan) {
        if ($diplan['idmodelo'] == "") {
            $diplan['idmodelo'] = 0;
        }
        $ADDWHERE = "";
        if ($parametros['idcompra']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "e.idcomprar=" . $parametros['idcompra'] . "";
        }
        if ($parametros['idforma']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "inv.idformapropiedad=" . $parametros['idforma'] . "";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "Select distinct (org.idorganosatisface), e.idindicador,e.identidadmodelo,i.denominacion,e.cantidad
                       From mod_planifinversiones.dat_etapaequipos e 
                       INNER JOIN mod_datosmaestros.nom_indicador i ON (e.idindicador=i.idindicador) 
                       LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface org ON (org.idindicador=i.idindicador) 
                       LEFT JOIN mod_datosmaestros.nom_organosatisface nomor ON (org.idorganosatisface=nomor.idorganosatisface) 
                       INNER JOIN mod_planifinversiones.dat_etapainversion eta ON (eta.idetapainversion=e.idetapainversion) 
                       INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion=eta.idinversion)
                       LEFT JOIN mod_planifinversiones.dat_adquisicion ad ON (e.idadquisicion = ad.idadquisicion)
                       LEFT JOIN mod_planificacion.nom_datosnomenclador dat ON (dat.iddatosnomenclador =  ad.iddatosnomenclador)
                       INNER JOIN mod_planificacion.dat_entidadmodelo ent ON (e.identidadmodelo= ent.identidadmodelo)
                      INNER JOIN mod_planificacion.dat_modelo m ON(ent.idmodelo=m.idmodelo)
                       Where  e.idejercicio=" . $parametros['idejercicio'] . " 
                       AND inv.idestructuracomun IN (" . $entidades . ")
                           $ADDWHERE
                       AND m.idmodelo =" . $diplan['idmodelo'] . "  
                       AND dat.uridatosnomenclador IN ('donacionequiponuevo','donacionequipouso')
                      ";
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    /* public function listarEquiposDadoIdinversion($parametros, $idinversion, $idplanes) {
      $ADDWHERE = "";
      if ($parametros['idcompra']) {
      $ADDWHERE = $ADDWHERE . ' AND ' . "e.idcomprar=" . $parametros['idcompra'] . "";
      }
      if ($parametros['idforma']) {
      $ADDWHERE = $ADDWHERE . ' AND ' . "inv.idformapropiedad=" . $parametros['idforma'] . "";
      }
      $conn = Doctrine_Manager::connection();
      $sql = "SELECT DISTINCT
      (e.idindicador),i.denominacion as denomind,e.precio,
      sum(e.cantidad),
      m.idmodelo,m.denominacion
      FROM
      mod_planifinversiones.dat_etapaequipos e
      INNER JOIN mod_datosmaestros.nom_indicador i ON (e.idindicador = i.idindicador)
      INNER JOIN mod_planifinversiones.dat_etapainversion eta ON (eta.idetapainversion = e.idetapainversion)
      INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = eta.idinversion)
      INNER JOIN mod_planificacion.dat_entidadmodelo ent ON (e.identidadmodelo = ent.identidadmodelo)
      INNER JOIN mod_planificacion.dat_modelo m ON (ent.idmodelo = m.idmodelo)
      WHERE
      e.idejercicio = " . $parametros['idejercicio'] . "
      AND (m.idmodelo=" . $idplanes[0]['idmodelo'] . " or m.idmodelo=" . $idplanes[1]['idmodelo'] . ")
      AND inv.idinversion=$idinversion
      group by e.idindicador,m.denominacion,m.idmodelo,i.denominacion,e.precio
      order by e.idindicador,m.denominacion
      ";

      $dato = $conn->execute($sql);
      $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
      return $datos;
      } */

    public function listarEquiposDadoIdinversion($parametros, $idinversion, $idplanes) {
        $ADDWHERE = "";
        if ($parametros['idcompra']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "e.idcomprar=" . $parametros['idcompra'] . "";
        }
        if ($parametros['idforma']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "inv.idformapropiedad=" . $parametros['idforma'] . "";
        }
        if ($idplanes[0]['idmodelo'] != '' && $idplanes[1]['idmodelo'] != '') {
            $PLANES = 'AND ' . " (m.idmodelo=" . $idplanes[0]['idmodelo'] . " or m.idmodelo=" . $idplanes[1]['idmodelo'] . ")";
        } else if ($parametros['modelo'] != '') {
            $PLANES = 'AND ' . " m.idmodelo in (" . $parametros['modelo'] . ")";
        } else {
            $PLANES = "";
        }
        if ($parametros['componente']) {
            $ETAPAS = 'AND ' . " eta.idetapainversion in (" . $parametros['componente'] . ")";
        } else {
            $ETAPAS = '';
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT 
                    (e.idindicador),i.denominacion as denomind,e.precio,eta.idetapainversion,
                    sum(e.cantidad),
                    m.idmodelo,m.denominacion
                  FROM
                    mod_planifinversiones.dat_etapaequipos e
                    INNER JOIN mod_datosmaestros.nom_indicador i ON (e.idindicador = i.idindicador)
                    INNER JOIN mod_planifinversiones.dat_etapainversion eta ON (eta.idetapainversion = e.idetapainversion)
                    INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = eta.idinversion)
                    INNER JOIN mod_planificacion.dat_entidadmodelo ent ON (e.identidadmodelo = ent.identidadmodelo)
                    INNER JOIN mod_planificacion.dat_modelo m ON (ent.idmodelo = m.idmodelo)
                  WHERE
                    e.idejercicio = " . $parametros['idejercicio'] . "
                    AND inv.idinversion= $idinversion $PLANES $ETAPAS
                   group by e.idindicador,m.denominacion,m.idmodelo,i.denominacion,e.precio,eta.idetapainversion,
                   order by e.idindicador,m.denominacion";
        // print_r($sql);die;
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarDonacionDadoIdindicador($parametros, $idinversion, $idplanes, $idindicador) {
        $ADDWHERE = "";
        if ($parametros['idcompra']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "e.idcomprar=" . $parametros['idcompra'] . "";
        }
        if ($parametros['idforma']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "inv.idformapropiedad=" . $parametros['idforma'] . "";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT sum(e.cantidad) as donacion
                FROM
                  mod_planifinversiones.dat_etapaequipos e
                  INNER JOIN mod_datosmaestros.nom_indicador i ON (e.idindicador = i.idindicador)
                  INNER JOIN mod_planifinversiones.dat_etapainversion eta ON (eta.idetapainversion = e.idetapainversion)
                  INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = eta.idinversion)
                  LEFT JOIN mod_planifinversiones.dat_adquisicion ad ON (e.idadquisicion = ad.idadquisicion)
                  LEFT JOIN mod_planificacion.nom_datosnomenclador dat ON (dat.iddatosnomenclador =  ad.iddatosnomenclador)
                  INNER JOIN mod_planificacion.dat_entidadmodelo ent ON (e.identidadmodelo = ent.identidadmodelo)
                  INNER JOIN mod_planificacion.dat_modelo m ON (ent.idmodelo = m.idmodelo)
                WHERE
                  e.idejercicio = " . $parametros['idejercicio'] . "  
                 AND (m.idmodelo=" . $idplanes[0]['idmodelo'] . " or m.idmodelo=" . $idplanes[1]['idmodelo'] . ")
                 AND inv.idinversion=$idinversion and i.idindicador=$idindicador
                 AND dat.uridatosnomenclador IN ('DONACIÓNNUEVO','DONACIÓNUSO')
                 group by e.idindicador
                      ";
        //print_r($sql);die;
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarDatosEquiposFiltros($parametros, $identidad, $idplanes, $whereInversion, $whereOtrosIndicadores, $whereEq, $whereFin, $whereConstr) {
        //pre_r($whereEq);die;

        $ADDWHERE = "";
        if ($parametros['idcompra']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "e.idcomprar=" . $parametros['idcompra'] . "";
        }
        if ($parametros['forma']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "i.idformapropiedad in (" . $parametros['forma'] . ")";
        }
        $conn = Doctrine_Manager::connection();
//
        $sql = "select r.idpadre, r.idorganosatisface, r.organosat, r.orden,
                sum(r.planinc ) as planinc,
                sum(r.planrep) as planrep,
                sum(r.total) as total,
                sum(r.importe) as importe,
                sum(r.donacion) as donacion
                from (
                
                
Select /*m.idmodelo,*/ind.idpadre, os.idorganosatisface, os.denominacion as organosat,os.ordenemision orden,
                --case when m.idmodelo=" . $idplanes[0]['idmodelo'] . "  then sum(mdest.valor) else 0 end planinc,
                case when e.idequipoplan = 9  then sum(mdest.valor) else 0 end planinc,
                --case when m.idmodelo=" . $idplanes[1]['idmodelo'] . "  then sum(mdest.valor) else 0 end planrep,
                case when e.idequipoplan = 10 then sum(mdest.valor) else 0 end planrep,
                sum(e.cantidad) as total,
                sum(e.cantidad*e.precio) as importe,
                case when (e.idadquisicion = 107 or e.idadquisicion = 108)  then sum(e.cantidad) else 0 end donacion
                FROM
                  mod_planifinversiones.dat_etapaequipos e
                  INNER JOIN mod_datosmaestros.nom_indicador ind ON (e.idindicador = ind.idindicador)
                  INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface indos ON (indos.idindicador = ind.idindicador)
                  INNER JOIN mod_datosmaestros.nom_organosatisface os ON (os.idorganosatisface = indos.idorganosatisface)
                  INNER JOIN mod_planifinversiones.dat_etapainversion eta ON (eta.idetapainversion = e.idetapainversion)
                  INNER JOIN mod_planifinversiones.dat_inversion i ON (i.idinversion = eta.idinversion)
                  
and i.idinversion in (select fi.idinversion from mod_planifinversiones.dat_financiamiento fi where fi.idtipofinanciamiento IN (108, 88) )
  and i.idinversion in (select doi.idinversion from mod_planifinversiones.dat_otrosindicadares doi where doi.idnomotrosindicadores IN (108, 88) )


                  left JOIN mod_planifinversiones.dat_etapinverconsprov conts ON (conts.idetapainversion = eta.idetapainversion) 
                  left JOIN mod_planifinversiones.dat_otrosindicadares doi ON (i.idinversion = doi.idinversion) 
                  --INNER JOIN mod_planificacion.dat_entidadmodelo ent ON (e.identidadmodelo = ent.identidadmodelo)
                  --INNER JOIN mod_planificacion.dat_modelo m ON (ent.idmodelo = m.idmodelo)
                WHERE i.idestadoinversion = 1 AND
                and i.eliminada = 0
                  i.idestructuracomun in ($identidad)  $ADDWHERE  $whereInversion   $whereOtrosIndicadores   $whereEq  $whereFin  $whereConstr

 group by /*e.precio,*/os.idorganosatisface/*,m.idmodelo*/,ind.idpadre, e.idadquisicion)r
                 group by r.idpadre, r.idorganosatisface, r.organosat, r.orden, e.idequipoplan
                 order by r.orden, r.idorganosatisface,r.idpadre
                      ";




        $sqlSinFiltrosFinOtros = "select r.idpadre, r.idorganosatisface, r.organosat, r.orden,
                sum(r.planinc ) as planinc,
                sum(r.planrep) as planrep,
                sum(r.total) as total,
                sum(r.importe) as importe,
                sum(r.donacion) as donacion
                from (
                
                
                Select /*m.idmodelo,*/ind.idpadre, os.idorganosatisface, os.denominacion as organosat,os.ordenemision orden,
                --case when m.idmodelo=" . $idplanes[0]['idmodelo'] . "  then sum(mdest.valor) else 0 end planinc,
                case when e.idequipoplan = 9  then sum(mdest.valor) else 0 end planinc,
                --case when m.idmodelo=" . $idplanes[1]['idmodelo'] . "  then sum(mdest.valor) else 0 end planrep,
                case when e.idequipoplan = 10 then sum(mdest.valor) else 0 end planrep,
                sum(mdest.valor) as total,
                sum(mdest.valor*e.precio) as importe,
                case when (e.idadquisicion = 107 or e.idadquisicion = 108)  then sum(mdest.valor) else 0 end donacion
                FROM mod_planifinversiones.dat_etapaequipoglobal glob
                        INNER JOIN mod_planifinversiones.dat_etapaequipos e ON (e.idetapaequipos = glob.idetapaequipos)
			INNER JOIN mod_planifinversiones.dat_etapaequipoplan mdest ON (mdest.idetapaequipoglobal = glob.idetapaequipoglobal and mdest.idejercicio =  " . $parametros['idejercicio'] . " )
                  INNER JOIN mod_datosmaestros.nom_indicador ind ON (e.idindicador = ind.idindicador)
                  INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface indos ON (indos.idindicador = ind.idindicador)
                  INNER JOIN mod_datosmaestros.nom_organosatisface os ON (os.idorganosatisface = indos.idorganosatisface)
                  INNER JOIN mod_planifinversiones.dat_etapainversion eta ON (eta.idetapainversion = e.idetapainversion)
                  INNER JOIN mod_planifinversiones.dat_inversion i ON (i.idinversion = eta.idinversion)
                   $whereOtrosIndicadores  $whereFin  $whereConstr
                  --INNER JOIN mod_planificacion.dat_entidadmodelo ent ON (e.identidadmodelo = ent.identidadmodelo)
                  --INNER JOIN mod_planificacion.dat_modelo m ON (ent.idmodelo = m.idmodelo)
                WHERE i.idestadoinversion = 1 AND
    i.idestructuracomun in ($identidad)       and  (" . $parametros['idejercicioden'] . " >= (date_part('year',  i.fechainicio))::numeric
                                  and
                                  " . $parametros['idejercicioden'] . " <= (date_part('year',  i.fechafin))::numeric
                                 )
                                  and mdest.valor <> 0
                                  and i.eliminada = 0
                $ADDWHERE  $whereEq

 group by /*e.precio,*/os.idorganosatisface/*,m.idmodelo*/,ind.idpadre, e.idadquisicion, e.idequipoplan)r
                 group by r.idpadre, r.idorganosatisface, r.organosat, r.orden
                 order by r.orden, r.idorganosatisface,r.idpadre";   //$whereInversion   $whereOtrosIndicadores   $whereEq  $whereFin  $whereConstr
//pre_r($sqlSinFiltrosFinOtros);die;
//
//
       // print_r($sqlSinFiltrosFinOtros);die;
        $dato = $conn->execute($sqlSinFiltrosFinOtros);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarDatosEquipos($parametros, $identidad, $idplanes, $whereInversion, $whereOtrosIndicadores, $whereEq, $whereFin, $whereConstr) {
        $ADDWHERE = "";
        if ($parametros['idcompra']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "e.idcomprar=" . $parametros['idcompra'] . "";
        }
        if ($parametros['idforma']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "inv.idformapropiedad in (" . $parametros['idforma'] . ")";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "select 
r.idpadre, r.idorganosatisface, r.organosat, r.orden,
                sum(r.planinc ) as planinc,
                sum(r.planrep) as planrep,
                sum(r.total) as total,
                sum(r.importe) as importe,
                sum(r.donacion) as donacion
                from (
                
                
Select m.idmodelo,i.idpadre, os.idorganosatisface, os.denominacion as organosat, os.ordenemision as orden,
                case when m.idmodelo=" . $idplanes[0]['idmodelo'] . "  then sum(e.cantidad) else 0 end planinc,
                case when m.idmodelo=" . $idplanes[1]['idmodelo'] . "  then sum(e.cantidad) else 0 end planrep,
                sum(e.cantidad) as total,
                sum(e.cantidad*e.precio) as importe,
                case when (e.idadquisicion = 107 or e.idadquisicion = 108)  then sum(e.cantidad) else 0 end donacion/*,
                ( SELECT COALESCE(sum(e.cantidad),0) FROM
                  mod_planifinversiones.dat_etapaequipos e
                  INNER JOIN mod_datosmaestros.nom_indicador i ON (e.idindicador = i.idindicador)
                  INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface indos ON (indos.idindicador = i.idindicador)
                  INNER JOIN mod_datosmaestros.nom_organosatisface os ON (os.idorganosatisface = indos.idorganosatisface)
                  INNER JOIN mod_planifinversiones.dat_etapainversion eta ON (eta.idetapainversion = e.idetapainversion)
                  INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = eta.idinversion)
                  INNER JOIN mod_planificacion.dat_entidadmodelo ent ON (e.identidadmodelo = ent.identidadmodelo)
                  INNER JOIN mod_planificacion.dat_modelo m ON (ent.idmodelo = m.idmodelo)
                  LEFT JOIN mod_planifinversiones.dat_adquisicion ad ON (e.idadquisicion = ad.idadquisicion)
                  LEFT JOIN mod_planificacion.nom_datosnomenclador dat ON (dat.iddatosnomenclador =  ad.iddatosnomenclador)
                  WHERE
                  e.idejercicio =  " . $parametros['idejercicio'] . "
				  AND inv.idestructuracomun in ($identidad)
				  AND dat.uridatosnomenclador IN ('DONACIÓNNUEVO','DONACIÓNUSO')) as donacion*/
                FROM
                  mod_planifinversiones.dat_etapaequipos e
                  INNER JOIN mod_datosmaestros.nom_indicador i ON (e.idindicador = i.idindicador)
                  INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface indos ON (indos.idindicador = i.idindicador)
                  INNER JOIN mod_datosmaestros.nom_organosatisface os ON (os.idorganosatisface = indos.idorganosatisface)
                  INNER JOIN mod_planifinversiones.dat_etapainversion eta ON (eta.idetapainversion = e.idetapainversion)
                  INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = eta.idinversion)
                  INNER JOIN mod_planificacion.dat_entidadmodelo ent ON (e.identidadmodelo = ent.identidadmodelo)
                  INNER JOIN mod_planificacion.dat_modelo m ON (ent.idmodelo = m.idmodelo)
                WHERE
                  e.idejercicio = " . $parametros['idejercicio'] . " 
   AND inv.idestructuracomun in ($identidad)  $ADDWHERE

 group by /*e.precio,*/os.idorganosatisface,m.idmodelo,i.idpadre, e.idadquisicion,os.ordenemision
                 
                 order by os.idorganosatisface,i.idpadre,os.ordenemision
                 
                 )r
                 group by r.idpadre, r.idorganosatisface, r.organosat, r.orden
                 order by r.orden, r.idorganosatisface,r.idpadre,r.orden
                      ";
        //  print_r($sql);die;
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarDemonIndEsp($idpadre) {

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT   
  ind.denominacion  
FROM 
  mod_datosmaestros.nom_indicador ind
WHERE  
ind.idindicador = $idpadre
                      ";
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function ExportarEquiposAutomotoresExcel($parametros) {
        //  print_r($parametros['entidades']);die;
        //$parametros['entidades']
        //$parametros['orgsat']
        //$parametros['idcompra']
        //$parametros['idadquirir']
        //$parametros['idforma']
        $conn = Doctrine_Manager::connection();
        $ADDWHERE = "";
        if ($parametros['entidades']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "inv.idestructuracomun IN (" . $parametros['entidades'] . ")";
        }
        if ($parametros['orgsat']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "os.idorganosatisface IN (" . $parametros['orgsat'] . ")";
        }
        if ($parametros['idcompra']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "e.idcomprar IN (" . $parametros['idcompra'] . ")";
        }
        if ($parametros['idadquirir']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "e.idadquisicion IN (" . $parametros['idadquirir'] . ")";
        }
        if ($parametros['idforma']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . " inv.idformapropiedad IN (" . $parametros['idforma'] . ")";
        }



        $sql = "SELECT (
         select 
                est.denominacion
         from mod_estructuracomp.nom_filaestruc p1,
              mod_estructuracomp.nom_filaestruc h1
              INNER JOIN mod_estructuracomp.dat_estructura est on (est.idestructura = h1.idpadre)
         where h1.lft between p1.lft and
               p1.rgt and
               h1.idfila = inv.idestructuracomun
         order by est.denominacion
         OFFSET 1
         LIMIT 1
       ) as organismo,
       es.denominacion as estructura,
       inv.denominacion as inversion,
       (
         SELECT ind.denominacion
         FROM mod_datosmaestros.nom_indicador ind
         where ind.idindicador = i.idpadre
       ) as indicador,
       os.denominacion as organosatisface,
       dn.denominacion as formapropiedad,
       (
         SELECT dn1.denominacion
         FROM mod_planificacion.nom_datosnomenclador dn1
              INNER JOIN mod_planifinversiones.dat_adquisicion a ON ((
              a.iddatosnomenclador = dn1.iddatosnomenclador) AND (
              e.idadquisicion = a.idadquisicion))
       ) as adquirir,
       (
         SELECT dn1.denominacion
         FROM mod_planificacion.nom_datosnomenclador dn1
              INNER JOIN mod_planifinversiones.dat_comprar c ON ((
              c.iddatosnomenclador = dn1.iddatosnomenclador) AND (e.idcomprar =
               c.idcomprar))
       ) as comprar,
       (
         SELECT dn1.denominacion
         FROM mod_planificacion.nom_datosnomenclador dn1
              INNER JOIN mod_planifinversiones.dat_comprar c ON ((
              c.iddatosnomenclador = dn1.iddatosnomenclador) AND (e.idcomprarpais =
               c.idcomprar))
       ) as pais,
       case
         when m.idmodelo = 10000000052 then sum(e.cantidad)
         else 0
       end planrep,
       case
         when m.idmodelo = 10000000049 then sum(e.cantidad)
         else 0
       end planinc,
       sum(e.cantidad) as total,
       ((sum(e.cantidad)) * e.precio) as valortotal
	FROM mod_planifinversiones.dat_etapaequipos e
          INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (e.idejercicio=ep.idejercicio)
     INNER JOIN mod_datosmaestros.nom_indicador i ON (e.idindicador =
      i.idindicador)
     INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface
      indos ON (indos.idindicador = i.idindicador)
     INNER JOIN mod_datosmaestros.nom_organosatisface os ON (
     os.idorganosatisface = indos.idorganosatisface)
     INNER JOIN mod_planifinversiones.dat_etapainversion eta ON (
     eta.idetapainversion = e.idetapainversion)
     INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion =
      eta.idinversion)
     INNER JOIN mod_planifinversiones.dat_formapropiedad fp ON (
     inv.idformapropiedad = fp.idformapropiedad)
     INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (
     fp.iddatosnomenclador = dn.iddatosnomenclador)
     INNER JOIN mod_planificacion.dat_entidadmodelo ent ON (e.identidadmodelo =
      ent.identidadmodelo)
     INNER JOIN mod_planificacion.dat_modelo m ON (ent.idmodelo = m.idmodelo)
     LEFT JOIN mod_estructuracomp.dat_estructura es ON (inv.idestructuracomun =
      es.idestructura)
WHERE  ep.actual = 1 AND           
      es.idproyecto = 0 
      $ADDWHERE
group by os.denominacion,
         es.denominacion,
         inv.denominacion,
         i.idpadre,
         dn.denominacion,
         m.idmodelo,
         e.idadquisicion,
         e.idcomprar,
         e.idcomprarpais,
         e.precio,
         inv.idestructuracomun
order by organismo ";
        // print_r('<pre>');print_r($sql);die;
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function ExportarEquiposAutomotoresCompReportes($parametros) {
//print_r($parametros);die;
        //$parametros['entidades']
        //$parametros['orgsat']
        //$parametros['idcompra']
        //$parametros['idadquirir']
        //$parametros['idforma']
        $conn = Doctrine_Manager::connection();
        $ADDWHERE = "";
        if ($parametros['filtro_entidades']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "i.idestructuracomun IN (" . $parametros['filtro_entidades'] . ")";
        }


        $sql = "SELECT (
         select
                est.denominacion
         from mod_estructuracomp.nom_filaestruc p1,
              mod_estructuracomp.nom_filaestruc h1
              INNER JOIN mod_estructuracomp.dat_estructura est on (est.idestructura = h1.idpadre)
         where h1.lft between p1.lft and
               p1.rgt and
               h1.idfila = i.idestructuracomun
         order by est.denominacion
         OFFSET 1
         LIMIT 1
       ) as organismo,
       es.denominacion as estructura,
       i.denominacion as inversion,
       (
         SELECT ind.denominacion
         FROM mod_datosmaestros.nom_indicador ind
         where ind.idindicador = idc.idpadre
       ) as indicador,
       os.denominacion as organosatisface,
       dn.denominacion as formapropiedad,
       (
         SELECT dn1.denominacion
         FROM mod_planificacion.nom_datosnomenclador dn1
              INNER JOIN mod_planifinversiones.dat_adquisicion a ON ((
              a.iddatosnomenclador = dn1.iddatosnomenclador) AND (
              eeq.idadquisicion = a.idadquisicion))
       ) as adquirir,
       (
         SELECT dn1.denominacion
         FROM mod_planificacion.nom_datosnomenclador dn1
              INNER JOIN mod_planifinversiones.dat_comprar c ON ((
              c.iddatosnomenclador = dn1.iddatosnomenclador) AND (eeq.idcomprar =
               c.idcomprar))
       ) as comprar,
       (
         SELECT dn1.denominacion
         FROM mod_planificacion.nom_datosnomenclador dn1
              INNER JOIN mod_planifinversiones.dat_comprar c ON ((
              c.iddatosnomenclador = dn1.iddatosnomenclador) AND (eeq.idcomprarpais =
               c.idcomprar))
       ) as pais,
       case
        --when m.idmodelo = 10000000052 then sum(ete.valor)
        when eeq.idequipoplan = 10 then sum(ete.valor)
         else 0
       end planrep,
       case
        --when m.idmodelo = 10000000049 then sum(ete.valor)
        when eeq.idequipoplan = 9  then sum(ete.valor)
         else 0
       end planinc,
       /*sum(eeq.cantidad) as total,
       ((sum(eeq.cantidad)) * eeq.precio) as valortotal*/
       replace((sum(ete.valor)::numeric(19,0))::varchar, '.', ',') as total,
       replace((((sum(ete.valor)) * eeq.precio)::numeric(19,2)) ::varchar, '.', ',') as valortotal,
       replace ((((sum(ete.valor)) * eeq.preciodivisa)::numeric (19, 2))::varchar, '.', ',') as valortotalimportacion
    FROM mod_planifinversiones.dat_etapaequipos eeq
        inner join mod_planifinversiones.dat_etapaequipoglobal etg on (etg.idetapaequipos = eeq.idetapaequipos)
        inner join mod_planifinversiones.dat_etapaequipoplan ete on (ete.idetapaequipoglobal = etg.idetapaequipoglobal and ete.idejercicio = {$parametros['idejercicio']})
        INNER JOIN mod_planificacion.nom_ejercicioplanificacion epl ON (eeq.idejercicio = epl.idejercicio)
     INNER JOIN mod_datosmaestros.nom_indicador idc ON (eeq.idindicador =
      idc.idindicador)
     INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface
      indos ON (indos.idindicador = idc.idindicador)
     INNER JOIN mod_datosmaestros.nom_organosatisface os ON (os.idorganosatisface = indos.idorganosatisface)
     INNER JOIN mod_planifinversiones.dat_etapainversion eta ON (eta.idetapainversion = eeq.idetapainversion)
     INNER JOIN mod_planifinversiones.dat_inversion i ON (i.idinversion = eta.idinversion)
     INNER JOIN mod_planifinversiones.dat_formapropiedad fp ON (i.idformapropiedad = fp.idformapropiedad)
     INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (fp.iddatosnomenclador = dn.iddatosnomenclador)
     --INNER JOIN mod_planificacion.dat_entidadmodelo ent ON (eeq.identidadmodelo =  ent.identidadmodelo)
     --INNER JOIN mod_planificacion.dat_modelo m ON (ent.idmodelo = m.idmodelo)
     LEFT JOIN mod_estructuracomp.dat_estructura es ON (i.idestructuracomun =  es.idestructura)

     LEFT JOIN mod_estructuracomp.nom_filaestruc nfe ON nfe.idfila = i.idestructuracomun
     LEFT JOIN mod_estructuracomp.dat_estructura e ON nfe.idfila = e.idestructura
     LEFT JOIN mod_estructuracomp.dat_estructura ep ON nfe.idpadre = ep.idestructura
WHERE  i.eliminada = 0 AND i.idestadoinversion = 1 AND
      es.idproyecto = 0
      $ADDWHERE
      {$parametros['cadenaEquipoWHERE']}
      {$parametros['cadenaWHERE']}
      and ete.idejercicio = {$parametros['idejercicio']}
      and (" . $parametros['ejercicio']. " >= (date_part('year',  i.fechainicio))::numeric
      and " . $parametros['ejercicio']. " <= (date_part('year',  i.fechafin))::numeric )
group by os.denominacion,
         es.denominacion,
         i.denominacion,
         idc.idpadre,
         dn.denominacion,
         --m.idmodelo,
         eeq.idequipoplan,
         eeq.idadquisicion,
         eeq.idcomprar,
         eeq.idcomprarpais,
         eeq.precio,
         eeq.preciodivisa,
         i.idestructuracomun
order by organismo, i.denominacion";
      

        //print_r('Equipos automotores por órgano rector:---'.$sql);die;
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function EquiposTercerN($parametros) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT distinct
                    i.idpadre,
                    ip.codigo as padre,
                    ios.idorganosatisface,
                    ip.idindicador,
                    ip.denominacion,ip.nivel
                    from mod_planifinversiones.dat_etapaequipos ee
                    inner join mod_datosmaestros.nom_indicador i on (i.idindicador = ee.idindicador)
                    inner join mod_datosmaestros.nom_indicador ip on (ip.idindicador = i.idpadre)
                    inner join mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ios on (ios.idindicador = ip.idindicador)
                    inner join mod_datosmaestros.nom_organosatisface o on (o.idorganosatisface = ios.idorganosatisface)
                    WHERE  o.idorganosatisface = " . $parametros['idorgrector'] . " and ip.nivel = 3 and ee.idejercicio = " . $parametros['idejercicio'] . "
                    order by ip.codigo";
        /* ee.idejercicio = 15
          and */
        //  print_r($sql);die;
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        // print_r($datos);die;
        return $datos;
    }

    public function EquiposTercerNCompReportes($parametros) {
        //print_r($parametros);die;
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT distinct
                    i.idpadre,
                    ip.codigo as padre,
                    ios.idorganosatisface,
                    ip.idindicador,
                    ip.denominacion,ip.nivel
                    from mod_planifinversiones.dat_etapaequipos eeq
                    inner join mod_planifinversiones.dat_etapaequipoglobal eg on(eeq.idetapaequipos = eg.idetapaequipos)
                    inner join mod_planifinversiones.dat_etapaequipoplan  ep on(eg.idetapaequipoglobal = ep.idetapaequipoglobal)
                    inner join mod_datosmaestros.nom_indicador i on (i.idindicador = eeq.idindicador)
                    inner join mod_datosmaestros.nom_indicador ip on (ip.idindicador = i.idpadre)
                    inner join mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ios on (ios.idindicador = i.idindicador)
                    inner join mod_datosmaestros.nom_organosatisface os on (os.idorganosatisface = ios.idorganosatisface)
                    WHERE  ip.nivel = 3 and ep.idejercicio = {$parametros['idejercicio']}
                    {$parametros['cadenaEquipoWHERE']}
                    order by ip.codigo";

//        print_r('Balance de equipos automores----Primera consulta ejecutada:------'.$sql);
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        // print_r($datos);die;
        return $datos;
    }

    public function cantEspecifico($pla, $adq, $id, $nom, $parametros) {
        //pre_r($parametros);die;

        $plaza = implode(',', $pla);
        $ADDWHERE = "";
        if ($nom == 1 || $nom == 2 || $nom == 12) {
            $ADDWHERE = ' and i.idprograma not in  (214,215,217,216,213)';
        } else if ($nom == 3) {
            $ADDWHERE = ' and i.idprograma = 216';
        } else if ($nom == 4) {
            $ADDWHERE = ' and i.idprograma = 217';
        } else if ($nom == 5) {
            $ADDWHERE = ' and i.idprograma = 213 ';
        } else if ($nom == 6) {
            $ADDWHERE = ' and i.idprograma = 215';
        } else if ($nom == 7) {
            $ADDWHERE = ' and i.idprograma = 214';
        } else if ($nom == 8) {
            $ADDWHERE = ' and i.idprograma in (215,214)';
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
      sum(valor)
         from mod_planifinversiones.dat_etapaequipos eeq
         inner join mod_planifinversiones.dat_etapaequipoglobal eg on(eeq.idetapaequipos = eg.idetapaequipos)
         inner join mod_planifinversiones.dat_etapaequipoplan  eqp on(eg.idetapaequipoglobal = eqp.idetapaequipoglobal)
        inner join mod_datosmaestros.nom_indicador ind on (ind.idindicador = eeq.idindicador)
        inner join mod_datosmaestros.nom_indicador ip on (ip.idindicador = ind.idpadre)
        inner join mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ios on (ios.idindicador = ind.idindicador)
        inner join mod_datosmaestros.nom_organosatisface os on (os.idorganosatisface = ios.idorganosatisface)
        inner join mod_planifinversiones.dat_etapainversion ei on (ei.idetapainversion = eeq.idetapainversion) 
        inner join mod_planifinversiones.dat_inversion i on (i.idinversion = ei.idinversion)

        LEFT JOIN mod_estructuracomp.nom_filaestruc nfe ON nfe.idfila = i.idestructuracomun
        LEFT JOIN mod_estructuracomp.dat_estructura e ON nfe.idfila = e.idestructura
        LEFT JOIN mod_estructuracomp.dat_estructura ep ON nfe.idpadre = ep.idestructura
      WHERE  i.idestadoinversion = 1
      AND eqp.idejercicio =  {$parametros['idejercicio']}
      and eeq.idcomprarpais in ($plaza)
      and eeq.idadquisicion = $adq
      and ip.idindicador =$id
      and  (" . $parametros['ejercicio'] . " >= (date_part('year',  i.fechainicio))::numeric
      and " . $parametros['ejercicio'] . " <= (date_part('year',  i.fechafin))::numeric)
       $ADDWHERE
        {$parametros['cadenaEquipoWHERE']}
        {$parametros['cadenaWHERE']}";
//if ($nom == 1 || $nom == 2 || $nom == 12) {
//    print_r($sql);die;
//}

        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function nomAdquisicion($id, $adq, $tol, $parametros) {
        $ADDWHERE = "";
        if ($adq == 1) {
            $ADDWHERE = 'AND ad.idadquisicion =' . $adq . '';
        }
        if ($tol == 1) {
            $ADDWHERE = $ADDWHERE . 'AND ip.idindicador = ' . $id . '';
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    distinct (ad.idadquisicion),nom.denominacion
                    from mod_planifinversiones.dat_etapaequipos ee
                    inner join mod_datosmaestros.nom_indicador i on (i.idindicador = ee.idindicador)
                    inner join mod_datosmaestros.nom_indicador ip on (ip.idindicador = i.idpadre)
                    inner join mod_planifinversiones.dat_adquisicion  ad on (ad.idadquisicion = ee.idadquisicion) 
                    
                    inner join mod_planificacion.nom_datosnomenclador nom on (nom.iddatosnomenclador = ad.iddatosnomenclador) 
                    inner join mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ios on (ios.idindicador = ip.idindicador) 
                    inner join mod_datosmaestros.nom_organosatisface o on (o.idorganosatisface = ios.idorganosatisface) 
                    WHERE o.idorganosatisface = " . $parametros['idorgrector'] . "   and ee.idejercicio = " . $parametros['idejercicio'] . "  $ADDWHERE";
        // print_r($sql);die;
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function nomAdquisicionCompReportes($id, $adq, $tol, $parametros) {
        $ADDWHERE = "";
        if ($adq == 1) {
            $ADDWHERE = 'AND ad.idadquisicion =' . $adq . '';
        }
        if ($tol == 1) {
            $ADDWHERE = $ADDWHERE . 'AND ip.idindicador = ' . $id . '';
            //$ADDWHERE = $ADDWHERE . 'AND i.idindicador = ' . $id . '';
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                    distinct (ad.idadquisicion),nom.denominacion
                    from mod_planifinversiones.dat_etapaequipos eeq
                    inner join mod_planifinversiones.dat_etapaequipoglobal eg on(eeq.idetapaequipos = eg.idetapaequipos)
                    inner join mod_planifinversiones.dat_etapaequipoplan  ep on(eg.idetapaequipoglobal = ep.idetapaequipoglobal)
                    inner join mod_datosmaestros.nom_indicador i on (i.idindicador = eeq.idindicador)
                    inner join mod_datosmaestros.nom_indicador ip on (ip.idindicador = i.idpadre)
                    inner join mod_planifinversiones.dat_adquisicion  ad on (ad.idadquisicion = eeq.idadquisicion)

                    inner join mod_planificacion.nom_datosnomenclador nom on (nom.iddatosnomenclador = ad.iddatosnomenclador)
                    inner join mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ios on (ios.idindicador = i.idindicador)
                    inner join mod_datosmaestros.nom_organosatisface os on (os.idorganosatisface = ios.idorganosatisface)
                    WHERE ep.idejercicio = {$parametros['idejercicio']} $ADDWHERE
                    and ep.valor > 0
                    {$parametros['cadenaEquipoWHERE']}";
//        print_r('-------Segunda consulta a ejecutar:--------'.$sql); die;            
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarejecutado($ejercicio, $params, $idglob) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select DISTINCT ON(glob.idetapaequipoglobal,mdest.idetapaequipoejecutado) glob.idetapaequipoglobal,mdest.idetapaequipoejecutado,
                 COALESCE(mdest.valor,0) AS valor
                         FROM mod_planifinversiones.dat_etapaequipoglobal glob
				INNER JOIN mod_planifinversiones.dat_etapaequipos et ON (et.idetapaequipos = glob.idetapaequipos)
				LEFT JOIN mod_planifinversiones.dat_etapaequipoejecutado mdest ON (mdest.idetapaequipoglobal = glob.idetapaequipoglobal)
                                
                                
                               WHERE mdest.idejercicio = $ejercicio 
                                AND et.idetapainversion = {$params['componente']} 
                                AND glob.idetapaequipos  = {$idglob}";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarplanmdio($ejercicio, $params, $idglob) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select DISTINCT ON(glob.idetapaequipoglobal,mdest.idetapaequipoplan) glob.idetapaequipoglobal,mdest.idetapaequipoplan,
                 COALESCE(mdest.valor,0) AS valor
                FROM mod_planifinversiones.dat_etapaequipoglobal glob
                    INNER JOIN mod_planifinversiones.dat_etapaequipos et ON (et.idetapaequipos = glob.idetapaequipos)
                    LEFT JOIN mod_planifinversiones.dat_etapaequipoplan mdest ON (mdest.idetapaequipoglobal = glob.idetapaequipoglobal)
                WHERE mdest.idejercicio = $ejercicio 
                    AND 
                    et.idetapainversion = {$params['componente']} 
                    AND glob.idetapaequipos  = {$idglob}";
//pre_r($sql);
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarproyecc($ejercicio, $params, $idglob) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select DISTINCT ON(glob.idetapaequipoglobal,mdest.idetapaequipoproyectado) glob.idetapaequipoglobal,mdest.idetapaequipoproyectado,
                 COALESCE(mdest.valor,0) AS valor
                         FROM mod_planifinversiones.dat_etapaequipoglobal glob
				INNER JOIN mod_planifinversiones.dat_etapaequipos et ON (et.idetapaequipos = glob.idetapaequipos)
				LEFT JOIN mod_planifinversiones.dat_etapaequipoproyectado mdest ON (mdest.idetapaequipoglobal = glob.idetapaequipoglobal)
                                
                                
                               WHERE mdest.idejercicio = $ejercicio 
                                AND et.idetapainversion = {$params['componente']} 
                                AND glob.idetapaequipos  = {$idglob}";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarestimado($ejercicio, $params, $idglob) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select DISTINCT ON(glob.idetapaequipoglobal,mdest.idetapaequipoestimado) glob.idetapaequipoglobal,mdest.idetapaequipoestimado,
                 COALESCE(mdest.valor,0) AS valor
                         FROM mod_planifinversiones.dat_etapaequipoglobal glob
				INNER JOIN mod_planifinversiones.dat_etapaequipos et ON (et.idetapaequipos = glob.idetapaequipos)
				LEFT JOIN mod_planifinversiones.dat_etapaequipoestimado mdest ON (mdest.idetapaequipoglobal = glob.idetapaequipoglobal)
                                
                                
                               WHERE mdest.idejercicio = $ejercicio 
                                AND et.idetapainversion = {$params['componente']} 
                                AND et.idetapaequipos  = {$idglob}";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function cargarEquiposGlobal($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "select DISTINCT ON(et.idetapaequipos) et.idetapaequipos,
                        et.precio,et.preciodivisa,et.idunidadmedida,et.idcentrobalance,
                       et.cantidad,et.importe,et.importedivisa,
                       --et.identidadmodelo,
                       n.denominacion,n.codigo,n.numeropieza,
                       n.descripcion,dat.denominacion as adquirir,glob.idetapaequipoglobal,
                       et.observaciones,et.idadquisicion ,et.idcomprar,da.denominacion as comprar,et.idcomprarpais
                       ,dapa.denominacion as pais
                FROM mod_planifinversiones.dat_etapaequipos et
                LEFT JOIN mod_planifinversiones.dat_etapaequipoglobal glob  ON (et.idetapaequipos = glob.idetapaequipos)
                 LEFT JOIN mod_planifinversiones.dat_comprar com ON (et.idcomprar= com.idcomprar)
                LEFT JOIN mod_planificacion.nom_datosnomenclador da ON (da.iddatosnomenclador =  com.iddatosnomenclador)
                LEFT JOIN mod_planifinversiones.dat_comprar compa ON (et.idcomprarpais= compa.idcomprar)
                LEFT JOIN mod_planificacion.nom_datosnomenclador dapa ON (dapa.iddatosnomenclador =  compa.iddatosnomenclador)
                LEFT JOIN mod_planifinversiones.dat_adquisicion ad ON (et.idadquisicion = ad.idadquisicion)
                LEFT JOIN mod_planificacion.nom_datosnomenclador dat ON (dat.iddatosnomenclador =  ad.iddatosnomenclador)
                --INNER JOIN mod_planificacion.dat_entidadmodelo ent ON (et.identidadmodelo = ent.identidadmodelo)
                INNER JOIN mod_datosmaestros.nom_indicador n ON (n.idindicador=et.idindicador)
                WHERE  et.idetapainversion = {$params['componente']} 
                AND et.idequipoplan = {$params['idequipoplan']}";
// AND et.idejercicio = {$params['idejercicio']}
//print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function eliminarGlobal($tabla, $idtext, $id) {
        if ($id != '') {
            $query = new Doctrine_Query();
            $sql_query = "DELETE FROM mod_planifinversiones." . $tabla . " 
                            WHERE (" . $idtext . " = " . $id . ")";
            $conn = Doctrine_Manager::connection();
            $conn->execute($sql_query);
        }
    }

    public function addvalorGlobal($tabla, $idglob, $ejercicio, $valor) {
        $conn = Doctrine_Manager::connection();
        $sql = "INSERT INTO  mod_planifinversiones." . $tabla . " (idetapaequipoglobal,idejercicio,valor)
                VALUES (" . $idglob . "," . $ejercicio . "," . $valor . ")";
        $res1 = $conn->execute($sql);
        return $res1;
    }

    public function getIdGlobal($idetapaequipos) {
        $conn = Doctrine_Manager::connection();
        $select = "SELECT ee.idetapaequipoglobal
                    from mod_planifinversiones.dat_etapaequipoglobal ee
                    where ee.idetapaequipos = $idetapaequipos";
        $idglobal = $conn->execute($select);
        $datos = $idglobal->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function insertarEquiposGlobal($idetapaequipos, $idadquisicion, $idcomprar, $idcomprarpais) {
        $conn = Doctrine_Manager::connection();
        if ($idetapaequipos != '' && $idadquisicion != '' && $idcomprar != '' && $idcomprarpais != '') {
            $sql = "INSERT INTO  mod_planifinversiones.dat_etapaequipoglobal (idetapaequipos,idadquisicion,idcomprar,idcomprarpais)
                VALUES (" . $idetapaequipos . "," . $idadquisicion . "," . $idcomprar . "," . $idcomprarpais . ")";
            $res1 = $conn->execute($sql);
            $id = self::getIdGlobal($idetapaequipos);
            return $id[0]['idetapaequipoglobal'];
        } else {
            return -1;
        }
    }


    public function calcularImporteEquiposPorAnno($parametros) {

        $conn = Doctrine_Manager::connection();
        $select = "select sum (r.precio) as precio,sum (r.preciodivisa) as preciodivisa, r.idequipoplan from (
					SELECT
                    (sum(ete.valor) * ind.precio)::numeric(19,2) as precio,
					(sum(ete.valor) * ind.preciodivisa)::numeric(19,2) as preciodivisa,
                 --   sum(ete.valor * round(ind.precio,2)) as precio,
                  --  sum(ete.valor * round(ind.preciodivisa,2)) as preciodivisa,
                    --ete.valor * ind.precio as precio,
                    --ete.valor * ind.preciodivisa as preciodivisa,
                    --m.idmodelo,
                    --m.denominacion
                    eeq.idequipoplan

                    FROM mod_planifinversiones.dat_inversion i
                    inner join mod_planifinversiones.dat_etapainversion ei on(i.idinversion = ei.idinversion)
                    inner join mod_planifinversiones.dat_etapaequipos eeq on(ei.idetapainversion = eeq.idetapainversion)
                        inner join mod_planifinversiones.dat_etapaequipoglobal etg on (etg.idetapaequipos = eeq.idetapaequipos)
                        inner join mod_planifinversiones.dat_etapaequipoplan ete on (ete.idetapaequipoglobal = etg.idetapaequipoglobal )
                        /*inner JOIN mod_planificacion.dat_entidadmodelo em ON(eeq.identidadmodelo = em.identidadmodelo)
                        INNER JOIN mod_planificacion.dat_modelo m ON (em.idmodelo = m.idmodelo)*/
                        INNER JOIN mod_datosmaestros.nom_indicadorplanif ind on(eeq.idindicador = ind.idindicador)
                    WHERE
                    i.idestadoinversion = 1
                    AND  ete.idejercicio = {$parametros['idejercicio']}

                    AND i.idestructuracomun in({$parametros['identidad']})
                    and i.idinversion = {$parametros['idinversion']}

                    GROUP BY
                        eeq.idequipoplan
                    /*m.idmodelo,
                    m.denominacion
                    ORDER BY
                    m.denominacion*/
					, ind.precio ,
                 ind.preciodivisa  
                        ) r
                        group by r.idequipoplan";
//pre_r($select);die;
        $d = $conn->execute($select);
        $datos = $d->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }
    
    public function dameEquipo($idetapaequipos){
        $conn = Doctrine_Manager::connection();
        $select = "select indp.precio, indp.preciodivisa

                    FROM mod_planifinversiones.dat_etapaequipos eeq
                        INNER JOIN mod_datosmaestros.nom_indicadorplanif indp on(eeq.idindicador = indp.idindicador)
                    WHERE
                     eeq.idetapaequipos = $idetapaequipos
                   ";
//pre_r($select);die;
        $d = $conn->execute($select);
        $datos = $d->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }
    public function UpdateEquipo($param){
        $query = new Doctrine_Query();
            $sql_query = "  update  
                                mod_planifinversiones.dat_etapaequipos
                                set  
                                precio = {$param[0]['precio']},
                                importe = cantidad * {$param[0]['precio']},
                                preciodivisa = {$param[0]['preciodivisa']},
                                importedivisa = cantidad * {$param[0]['preciodivisa']}
                                where   
                                idetapaequipos = {$param[0]['idetapaequipos']}";
            $conn = Doctrine_Manager::connection();
            $conn->execute($sql_query);
            return 1;
    }

}
