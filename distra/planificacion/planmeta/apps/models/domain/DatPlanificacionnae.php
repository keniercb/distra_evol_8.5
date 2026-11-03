<?php

class DatPlanificacionnae extends BaseDatPlanificacionnae {

    public function setUp() {
        parent::setUp();
    }

    public function ObtenerIdPlanificacionConNAE($identidadmodelo) {
        $query = new Doctrine_Query();
        $query->addWhere(
                'nae.idplanificacionnaegeneral IN DatPlanificacionnaeobjetogasto og'
        );
        $result = $query->select(
                                'm.idplanificacion, nae.idplanificacionnaegeneral, og.idobjetogasto'
                        )->from('DatPlanificacion m')
                        ->innerjoin(
                                'm.DatPlanificacionnae nae', 'nae.DatPlanificacionnaegeneral naeg'
                        )
                        ->where('m.identidadmodelo =?', $identidadmodelo)->setHydrationMode(
                        Doctrine::HYDRATE_ARRAY
                )->execute();
        return $result;
    }

    public function verNAEasociados($identidad, $ids, $parametros) {
        if (empty($ids)) {
            $identidades = -1;
        } else {
            if (is_array($ids)) {
                $idents = [];
                foreach ($ids as $id) {
                    $idents[] = $id['identidad'];
                }
                $identidades = implode(",", $idents);
            } else {
                $identidades = $ids;
            }
        }

        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT pnae.idnae FROM mod_planificacion.dat_planificacionnae pnae
            INNER JOIN mod_planificacion.dat_planificacion p ON pnae.idplanificacion = p.idplanificacion
            INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo = em.identidadmodelo
            WHERE pnae.idejercicio = " . $parametros->idejercicio
                . " AND em.identidad = $identidad OR em.identidad IN ("
                . $identidades . ")";
        $result = $conn->fetchAll($query);
        return $result;
    }

    public function verNAEasociadosEconomia($identidad, $parametros) {

        $conn = Doctrine_Manager::connection();
        $query = "SELECT ant.idanteproyecto, antnae.idnae
FROM mod_planificacion.dat_anteproyecto ant
INNER JOIN mod_planificacion.dat_anteproyectonae antnae ON(ant.idanteproyecto = antnae.idanteproyecto)
WHERE ant.identidad = $identidad  AND
      ant.idejercicio = $parametros->idejercicio AND
      ant.idtipoanteproyecto = 1";

        $result = $conn->fetchAll($query);
        return $result;
    }

    public function comprobarNaeAsociadosEnUnaEntidad($identidad, $idnae, $idtipoanteproyecto, $parametros
    ) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT ant.idanteproyecto
FROM mod_planificacion.dat_anteproyecto ant
     INNER JOIN mod_planificacion.dat_anteproyectonae antnae ON (
     ant.idanteproyecto = antnae.idanteproyecto)
WHERE ant.identidad = " . $identidad . " AND
      ant.idejercicio = " . $parametros->idejercicio . " AND
      antnae.idnae = " . $idnae . " AND
      ant.idtipoanteproyecto = $idtipoanteproyecto";

        $result = $conn->fetchAll($query);
        return $result;
    }

    public function getEntidadesPorNae($idnae, /*
      $idtipoanteproyecto, */ $parametros
    ) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT em.identidad
      FROM mod_planificacion.dat_planificacionnae pnae
      INNER JOIN mod_planificacion.dat_planificacion planif ON(pnae.idplanificacion = planif.idplanificacion)
      INNER JOIN mod_planificacion.dat_entidadmodelo em ON(em.identidadmodelo = planif.identidadmodelo)
      WHERE pnae.idnae = " . $idnae
                . " AND pnae.idejercicio = $parametros->idejercicio";
        $result = $conn->fetchAll($query);
        return $result;
    }

    public function getNaesAsociadas($parametros, $idtipoanteproyecto) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT  DISTINCT antnae.idnae
FROM mod_planificacion.dat_anteproyecto ant
     INNER JOIN mod_planificacion.dat_anteproyectonae antnae ON (
     ant.idanteproyecto = antnae.idanteproyecto)
WHERE  ant.idejercicio = $parametros->idejercicio AND
      ant.idtipoanteproyecto = $idtipoanteproyecto";
        $result = $conn->fetchAll($query);
        return $result;
    }

    public function consolidarOG($identidad, $idnae, $ids, $parametros) {
        if (empty($ids)) {
            $identidades = -1;
        } else {
            if (is_array($ids)) {
                $identidades = implode(",", $ids);
            } else {
                $identidades = $ids;
            }
        }

        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT og.idobjetogasto,pnae.idnae,SUM(dp.importe) as importe
               FROM mod_planificacion.dat_planificacion dp
			   INNER JOIN 	mod_planificacion.dat_entidadmodelo em
                                                ON(dp.identidadmodelo = em.identidadmodelo)
                                            INNER JOIN mod_planificacion.dat_planificacionnae pnae
                                                ON(dp.idplanificacion = pnae.idplanificacion )
                                            INNER JOIN mod_planificacion.dat_planificacionnaegeneral pnaeg
                                                ON(pnae.idplanificacionnaegeneral = pnaeg.idplanificacionnaegeneral )
                                            LEFT JOIN mod_planificacion.dat_planificacionnaeobjetogasto og
                                                ON(pnaeg.idplanificacionnaegeneral = og.idplanificacionnaegeneral )
					WHERE pnae.idejercicio = " . $parametros->idejercicio
                . " AND pnae.idnae=" . $idnae . " AND (em.identidad=" . $identidad
                . " or em.identidad IN (" . $identidades . ")) AND og.idplanificacionnaegeneral IN
            (SELECT og.idplanificacionnaegeneral FROM mod_planificacion.dat_planificacionnaeobjetogasto og)
					GROUP BY og.idobjetogasto,pnae.idnae";

        if ($arrayParametros) {
            $res = $conn->execute($query, $arrayParametros);
        } else {
            $res = $conn->execute($query);
        }
        return $res->fetchAll(PDO::FETCH_ASSOC);
    }

    public function select() {
        $consulta = "SELECT DISTINCT a.idactividad,a.codigo,a.denominacion,a.idespecialidad,
                    ae.idactividadentidad,round( ( COALESCE(aem.nivelactividadmanual,0)+
                    COALESCE(aea.nivelactividadautomatico,0)+
                    COALESCE(np.nivelactividadproduccion,0) )
                    * SUM(n.necesidad*indplanif.precio),3
                    ) as importe,round( ( COALESCE(aem.nivelactividadmanual,0)+
                    COALESCE(aea.nivelactividadautomatico,0)+
                    COALESCE(np.nivelactividadproduccion,0) ) ,3
                    ) as importe112, round( ( COALESCE(aem.nivelactividadmanual,0)+
                    COALESCE(aea.nivelactividadautomatico,0)+
                    COALESCE(np.nivelactividadproduccion,0) )
                    * SUM(n.necesidad*indplanif.preciodivisa),3
                    ) as importedivisa,aenae.idplanificacionnaegeneral,
                    aenae.idactividadentidadnae, pnog.idobjetogasto,pni.idingreso,
                    ( COALESCE(og.codigo,'') || COALESCE(rf.codigo,'-') ||
                    COALESCE(og.denominacion,'-') || COALESCE(rf.denominacion,'') )";
        return $consulta;
    }

    public function listarActividades($params) {
        $idejercicio = NomEjercicioplanificacion::listarEjercicioActual();
        $idejercicio = $params['idejercicio'];
        $arrayFormatoUltimonivel = NomActividad::obtener_ConfFormato_UltimoNivel();
        $condiciones = array();
        $condGroupby = array();
        $arraySqlparams = array();
        $arraySqlparamsGroupby = array();
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

        foreach ($arraySqlparamsGroupby as $valor) {
            $arraySqlparams[] = $valor;
        }
        $conn = Doctrine_Manager::connection();
        $groupby = self::groupBy();
        $select = self::select();
        $sql = "$select as datos
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
                     INNER JOIN mod_datosmaestros.nom_indicador ind
                    ON(ind.idindicador = n.idindicador)
                    INNER JOIN mod_datosmaestros.nom_indicadorplanif indplanif
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
                    AND aec.idespecialidad = {$params['idespecialidad']}
                    AND ae.identidad = {$params['identidad']}
                    AND aenae.idnae={$params['idnae']}
                     $groupby";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_CLASS);

        return $data;
    }

    public function groupBy() {
        $consulta = "GROUP BY a.idactividad,a.codigo,a.denominacion,a.idespecialidad,
                    ae.idactividadentidad, aem.nivelactividadmanual,aea.nivelactividadautomatico,
                    np.nivelactividadproduccion,aenae.idplanificacionnaegeneral,
                    pnog.idobjetogasto,pni.idingreso,nae.codigo,nae.denominacion,
                    og.codigo,og.denominacion,rf.codigo,rf.denominacion,aenae.idactividadentidadnae";
        return $consulta;
    }

    public function consolidarRF($identidad, $idnae, $ids, $parametros) {

        if (empty($ids)) {
            $identidades = -1;
        } else {
            if (is_array($ids)) {
                $identidades = implode(",", $ids);
            } else {
                $identidades = $ids;
            }
        }

        $conn = Doctrine_Manager::connection();
        $query = " SELECT DISTINCT  rf.idingreso,pnae.idnae, SUM(dp.importe) as importe
                FROM mod_planificacion.dat_planificacion dp
				INNER JOIN 	mod_planificacion.dat_entidadmodelo em
                                                ON(dp.identidadmodelo = em.identidadmodelo)
                                            INNER JOIN mod_planificacion.dat_planificacionnae pnae
                                                ON(dp.idplanificacion = pnae.idplanificacion )
                                            INNER JOIN mod_planificacion.dat_planificacionnaegeneral pnaeg
                                                ON(pnae.idplanificacionnaegeneral = pnaeg.idplanificacionnaegeneral )
                                            LEFT JOIN mod_planificacion.dat_planificacionnaeingreso rf
                                                ON(pnaeg.idplanificacionnaegeneral = rf.idplanificacionnaegeneral )
					WHERE  pnae.idejercicio = " . $parametros->idejercicio
                . " AND pnae.idnae=" . $idnae . " AND (em.identidad=" . $identidad
                . " or em.identidad IN (" . $identidades . ")) AND rf.idplanificacionnaegeneral IN
            (SELECT rf.idplanificacionnaegeneral FROM mod_planificacion.dat_planificacionnaeingreso rf)
					GROUP BY rf.idingreso,pnae.idnae";

        if ($arrayarametros) {
            $res = $conn->execute($query, $arrayarametros);
        } else {
            $res = $conn->execute($query);
        }
        return $res->fetchAll(PDO::FETCH_ASSOC);
    }

    /*
      Metodo para verificar que el nae que recibo de la interfaz
      esta realmente asociado a la entidad que recibo de la interfaz
     */

    public function verificarNaeEntidad($identidad, $asociados, $parametros) {
        $d = true;
        if (!empty($asociados)) {
            foreach ($asociados as $nae) {
                $d = self::verificarNae($identidad, $nae['idnae'], $parametros);
                if (!$d) {
                    break;
                }
            }
            return $d;
        } else {
            return true;
        }
    }

    public function verificarNae($identidad, $idnae, $parametros) {
        $query = Doctrine_Query::create();
        $query->from('DatAnteproyectonae apn')
                ->where('apn.idnae = ?', $idnae)
                ->innerJoin('apn.DatAnteproyecto ap')
                ->addWhere(
                        'ap.identidad = ? AND ap.idejercicio = ?', array($identidad, $parametros->idejercicio)
        );
        $obj = $query->execute()->toArray();
        if (!empty($obj)) {
            return true;
        } else {
            return false;
        }
    }

    public function tieneDocumento($idnae, $identidad, $parametros) {
        $query = Doctrine_Query::create();
        $query->from('DatAnteproyecto ap')
                ->innerjoin('ap.DatAnteproyectonae apn')
                ->where(
                        'apn.idnae = ? AND ap.identidad=? AND ap.idtipoanteproyecto <> 4 AND ap.idejercicio=?', array($idnae, $identidad, $parametros->idejercicio)
        );
        $obj = $query->execute()->toArray();
        if (!empty($obj)) {
            return true;
        } else {
            return false;
        }
    }

    public function OGasociados($idanteproyectonae) {
        $query = Doctrine_Query::create();
        $query->from('DatAnteproyectonaeobjetogasto apog')
                ->where('apog.idanteproyectonae = ?', $idanteproyectonae);
        $obj = $query->execute()->toArray();
        return $obj;
    }

    public function ultimoAPnae($idanteproyecto) {
        $query = Doctrine_Query::create();
        $query->select('MAX(apn.idanteproyectonae)')
                ->from('DatAnteproyectonae apn')
                ->where('apn.idanteproyecto = ?', $idanteproyecto);
        $obj = $query->execute()->toArray();
        return $obj;
    }

    public function ultimaVersion($numero, $nae) {
        $query = Doctrine_Query::create();
        if ($numero != 0) {
            $query->select('MAX(ap.version)')
                    ->from('DatAnteproyecto ap')
                    ->where('ap.numero = ?', $numero);
            $obj = $query->execute()->toArray();
        } else {
            if ($nae) {
                $query->select('MAX(ap.version)')
                        ->from('DatAnteproyecto ap')
                        ->innerjoin('ap.DatAnteproyectonae apnae')
                        ->where('apnae.idnae = ?', $nae);
                $obj = $query->execute()->toArray();
            }
        }
        return $obj;
    }

    public function obtenerDocdadoNAE($nae, $parametros) {
        $query = Doctrine_Query::create();
        $ver = self::ultimaVersion(0, $nae);
        $version = $ver[0]['MAX'];
        $query->from('DatAnteproyecto ap')
                ->innerjoin('ap.DatAnteproyectonae apnae')
                ->where(
                        'apnae.idnae = ? AND ap.version=? AND ap.idejercicio = ? AND ap.identidad = ?', array($nae, $version, $parametros->idejercicio,
                    $parametros->identidad)
        );
        $obj = $query->execute()->toArray();
        return $obj;
    }

    public function ultimoAP() {
        $query = Doctrine_Query::create();
        $query->select('MAX(ap.idanteproyecto)')
                ->from('DatAnteproyecto ap');
        $obj = $query->execute()->toArray();
        return $obj;
    }

    public function RFasociados($idanteproyectonae) {
        $query = Doctrine_Query::create();
        $query->from('DatAnteproyectonaeingreso aprf')
                ->where('aprf.idanteproyectonae = ?', $idanteproyectonae);
        $obj = $query->execute()->toArray();
        return $obj;
    }

    public function existeP2($identidad, $tipo, $parametros) {
        $query = Doctrine_Query::create();
        $query->from('DatAnteproyecto ap')
                ->where(
                        'ap.identidad = ? AND ap.idtipoanteproyecto=? AND ap.idaprobacion = 1 AND ap.idejercicio = ?', array($identidad, $tipo, $parametros->idejercicio)
        );
        $obj = $query->execute()->toArray();
        return $obj;
    }

    public function antepnae($idanteproyecto) {
        $query = Doctrine_Query::create();
        $query->from('DatAnteproyectonae apn')
                ->where('apn.idanteproyecto = ?', $idanteproyecto);
        $obj = $query->execute()->toArray();
        return $obj;
    }

    public function buscarConceptoNinguno($identidad) {
        $integrator = ZendExt_IoC::getInstance();
        $estructura = $integrator->metadatos->DameEstructura($identidad);
        $query = Doctrine_Query::create();
        $query->from('DatConceptoespecialidad ce')
                ->innerJoin('ce.NomConcepto c')
                ->where(
                        "c.uriconcepto = 'ninguno' and ce.idespecialidad = ?", array($estructura[0]->idespecialidad)
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();

        if (empty($result)) {
            $queryUno = Doctrine_Query::create();
            $queryUno->select("c.idconcepto")->from("NomConcepto c")->where(
                    "c.uriconcepto = 'ninguno'"
            );
            $idconcepto = $queryUno->fetchOne();
            $idespecialidad = $estructura[0]->idespecialidad;
            $idconceptoinser = $idconcepto->idconcepto;

            //Capturo una instancia de Doctrine_Manager para manejar la conexion
            $dm = Doctrine_Manager::getInstance();
            //Capturo una instancia de la conexion
            $con = $dm->getCurrentConnection();
            $conceptoEsp = new DatConceptoespecialidad();
            $conceptoEsp->idconcepto = $idconceptoinser;
            $conceptoEsp->idespecialidad = $idespecialidad;
            $conceptoEsp->save();
            $con->commit();
            //Habro una nueva transaccion de doctrine
            // para la proxima ejecucion
            $con->beginTransaction();
            $result[0]['idconceptoespecialidad'] = $conceptoEsp->idconceptoespecialidad;
        }
        return $result;
    }

    public function lastNo($identidad) {
        $query = Doctrine_Query::create();
        $query->select('MAX(ap.numero)')
                ->from('DatAnteproyecto ap')->where('ap.identidad=?', $identidad);
        $obj = $query->execute()->toArray();
        return $obj;
    }

    public function crearanteproyecto($identidad, $idusuario, $tipodoc, $parametros
    ) {
        $idconceptoespecialidad = self::buscarConceptoNinguno($identidad);
        $num = self::lastNo($identidad);
        $numero = $num[0]['MAX'] += 1;
        $fecha = "'" . date('d-m-Y') . "'";

        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();
        $anteproyecto = new DatAnteproyecto();
        $anteproyecto->numero = $numero;
        $anteproyecto->idejercicio = $parametros->idejercicio;
        $anteproyecto->fecha = $fecha;
        $anteproyecto->idtipoanteproyecto = $tipodoc;
        $anteproyecto->idaprobacion = 1;
        $anteproyecto->idusuario = $idusuario;
        $anteproyecto->identidad = $identidad;
        $anteproyecto->idconceptoespecialidad = $idconceptoespecialidad[0]['idconceptoespecialidad'];
        $anteproyecto->version = $parametros->version;
        $anteproyecto->save();
        $con->commit();
        //Habro una nueva transaccion de doctrine
        // para la proxima ejecucion
        $con->beginTransaction();
        return $anteproyecto;
    }

    public function generardoc21($identidad, $idnae, $anteproyecto, $idshijos, $idespecialidad, $parametros
    ) {

        $anteproyectonae = new DatAnteproyectonae();
        $usada = false;
        $anteproyectonae->idanteproyecto = $anteproyecto->idanteproyecto;
        $anteproyectonae->idnae = $idnae;
        $params['idespecialidad'] = $idespecialidad;
        $params['identidad'] = $identidad;
        $params['idnae'] = $idnae;
        $params['idejercicio'] = $parametros->idejercicio;
        $idanteproyectonae = DatAnteproyectonaeModel::insertardatAnteproyectonae($anteproyectonae);

        $resultid = null;
        $act = self::listarActividades($params);
        $rf = self::consolidarRF($identidad, $idnae, $idshijos, $parametros);
        $og = self::consolidarOG($identidad, $idnae, $idshijos, $parametros);

        if (!empty($act)) {
            foreach ($act as $actUno) {
                if ($actUno->idobjetogasto) {
                    if (!empty($og)) {
                        foreach ($og as $pos => $ogUno) {
                            if ($ogUno['idobjetogasto'] == $actUno->idobjetogasto
                            ) {
                                $usada = true;
                                $anteproyectoobjetgasto = new DatAnteproyectonaeobjetogasto();
                                $anteproyectoobjetgasto->idanteproyectonae = $idanteproyectonae;
                                $anteproyectoobjetgasto->idusuario = $anteproyecto->idusuario;
                                $anteproyectoobjetgasto->idobjetogasto = $ogUno['idobjetogasto'];
                                $anteproyectoobjetgasto->ejecucionanterior = 0;
                                $anteproyectoobjetgasto->presupuestoactual = self::getPresupuestoAnnoActual(
                                                $params, 'og'
                                );
                                $anteproyectoobjetgasto->estimadoactual = 0;
                                $anteproyectoobjetgasto->planificacion = $ogUno['importe'] + $actUno->importe;
                                $resultid = DatAnteproyectonaeobjetogastoModel::insertardatAnteproyectonaeobjetogasto(
                                                $anteproyectoobjetgasto
                                );
                                unset($og[$pos]);
                            }
                        }
                    }
                    if (!$usada) {
                        $anteproyectoobjetgasto = new DatAnteproyectonaeobjetogasto();
                        $anteproyectoobjetgasto->idanteproyectonae = $idanteproyectonae;
                        $anteproyectoobjetgasto->idusuario = $anteproyecto->idusuario;
                        $anteproyectoobjetgasto->idobjetogasto = $actUno->idobjetogasto;
                        $anteproyectoobjetgasto->ejecucionanterior = 0;
                        $anteproyectoobjetgasto->presupuestoactual = self::getPresupuestoAnnoActual($params, 'og');
                        $anteproyectoobjetgasto->estimadoactual = 0;
                        $anteproyectoobjetgasto->planificacion = $actUno->importe;
                        $resultid = DatAnteproyectonaeobjetogastoModel::insertardatAnteproyectonaeobjetogasto(
                                        $anteproyectoobjetgasto
                        );
                    }
                    $usada = false;
                } else {
                    if ($actUno->idingreso) {
                        if (!empty($rf)) {
                            foreach ($rf as $pos => $rfUno) {
                                if ($rfUno['idingreso'] == $actUno->idingreso) {
                                    $usada = true;
                                    $anteproyectoingreso = new DatAnteproyectonaeingreso();
                                    $anteproyectoingreso->idanteproyectonae = $idanteproyectonae;
                                    $anteproyectoingreso->idusuario = $anteproyecto->idusuario;
                                    $anteproyectoingreso->idingreso = $rfUno['idingreso'];
                                    $anteproyectoingreso->ejecucionanterior = 0;
                                    $anteproyectoingreso->presupuestoactual = self::getPresupuestoAnnoActual(
                                                    $params, 'ing'
                                    );
                                    $anteproyectoingreso->estimadoactual = 0;
                                    $anteproyectoingreso->planificacion = $rfUno['importe'] + $actUno->importe;
                                    $resultid = DatAnteproyectonaeingresoModel::insertardatAnteproyectonaeingreso(
                                                    $anteproyectoingreso
                                    );
                                    unset($rf[$pos]);
                                }
                            }
                        }
                        if (!$usada) {
                            $anteproyectoingreso = new DatAnteproyectonaeingreso();
                            $anteproyectoingreso->idanteproyectonae = $idanteproyectonae;
                            $anteproyectoingreso->idusuario = $anteproyecto->idusuario;
                            $anteproyectoingreso->idingreso = $actUno->idingreso;
                            $anteproyectoingreso->ejecucionanterior = 0;
                            $anteproyectoingreso->presupuestoactual = self::getPresupuestoAnnoActual(
                                            $params, 'ing'
                            );
                            $anteproyectoingreso->estimadoactual = 0;
                            $anteproyectoingreso->planificacion = $actUno->importe;
                            $resultid = DatAnteproyectonaeingresoModel::insertardatAnteproyectonaeingreso(
                                            $anteproyectoingreso
                            );
                        }
                        $usada = false;
                    }
                }
            }
        }


        if (!empty($og)) {
            foreach ($og as $ogUno) {
                $anteproyectoobjetgasto = new DatAnteproyectonaeobjetogasto();
                $anteproyectoobjetgasto->idanteproyectonae = $idanteproyectonae;
                $anteproyectoobjetgasto->idusuario = $anteproyecto->idusuario;
                $anteproyectoobjetgasto->idobjetogasto = $ogUno['idobjetogasto'];
                $anteproyectoobjetgasto->ejecucionanterior = 0;
                $anteproyectoobjetgasto->presupuestoactual = self::getPresupuestoAnnoActual($params, 'og');
                $anteproyectoobjetgasto->estimadoactual = 0;
                $anteproyectoobjetgasto->planificacion = $ogUno['importe'];
                $resultid = DatAnteproyectonaeobjetogastoModel::insertardatAnteproyectonaeobjetogasto(
                                $anteproyectoobjetgasto
                );
            }
        }
        if (!empty($rf)) {
            foreach ($rf as $rfUno) {
                $anteproyectoingreso = new DatAnteproyectonaeingreso();
                $anteproyectoingreso->idanteproyectonae = $idanteproyectonae;
                $anteproyectoingreso->idusuario = $anteproyecto->idusuario;
                $anteproyectoingreso->idingreso = $rfUno['idingreso'];
                $anteproyectoingreso->ejecucionanterior = 0;
                $anteproyectoingreso->presupuestoactual = self::getPresupuestoAnnoActual($params, 'ing');
                $anteproyectoingreso->estimadoactual = 0;
                $anteproyectoingreso->planificacion = $rfUno['importe'];
                $resultid = DatAnteproyectonaeingresoModel::insertardatAnteproyectonaeingreso(
                                $anteproyectoingreso
                );
            }
        }
        return $resultid;
    }

    public function obtenerDocumentoDadoId($iddoc) {
        $query = Doctrine_Query::create();
        $query->from('DatAnteproyecto ap')
                ->where('ap.idanteproyecto = ?', $iddoc)
                ->innerJoin('ap.DatAnteproyectonae apn')
                ->leftJoin('apn.DatAnteproyectonaeingreso apni')
                ->leftJoin('apn.DatAnteproyectonaeobjetogasto apno')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        return $result;
    }

    public function duplicarAnteproyecto($doc, $idusuario, $actualizar) {
        $anteproyecto = new DatAnteproyecto();
        $anteproyecto->idtipoanteproyecto = $doc[0]['idtipoanteproyecto'];
        if ($actualizar != 0) {
            $anteproyecto->idaprobacion = $doc[0]['idaprobacion'];
        } else {
            $anteproyecto->idaprobacion = 1;
        }

        $anteproyecto->idusuario = $idusuario;
        $anteproyecto->identidad = $doc[0]['identidad'];
        $anteproyecto->idconceptoespecialidad = $doc[0]['idconceptoespecialidad'];
        $anteproyecto->numero = $doc[0]['numero'];
        $anteproyecto->idejercicio = $doc[0]['idejercicio'];
        $anteproyecto->fecha = date('d-m-Y');

        if ($actualizar != 0) {
            $anteproyecto->version = $doc[0]['version'];
        } else {
            $anteproyecto->version = $doc[0]['version'] += 1;
        }
        $anteproyecto = DatAnteproyectoModel::insertardatAnteproyecto(
                        $anteproyecto
        );
        return $anteproyecto;
    }

    public function buscarObjeto($objeto, $arrayObjeto) {
        foreach ($arrayObjeto as $obj) {
            if ($objeto['idobjetogasto'] == $obj->idobjetogasto) {
                return $obj;
            }
        }
    }

    public function buscarIngreso($ingreso, $arrayIngreso) {
        foreach ($arrayIngreso as $ing) {
            if ($ingreso['idingreso'] == $ing->idingreso) {
                return $ing;
            }
        }
    }

    public function obtenerantproynaeobj($id) {
        $result = Doctrine::getTable('DatAnteproyectonaeobjetogasto')->find(
                $id
        );
        return $result;
    }

    public function obtenerantproynaeing($id) {
        $result = Doctrine::getTable('DatAnteproyectonaeingreso')->find($id);
        return $result;
    }

    public function duplicarModificarDocumento($iddoc, $idusuario, $ingresosmodificados, $gastosmodificados, $duplicar
    ) {
        if ($duplicar) {
            $doc = self::obtenerDocumentoDadoId($iddoc);
            $anteproyecto = self::duplicarAnteproyecto($doc, $idusuario, 0);
            foreach ($doc[0]['DatAnteproyectonae'] as $nae) {
                $anteproyectonae = new DatAnteproyectonae();
                $anteproyectonae->idanteproyecto = $anteproyecto->idanteproyecto;
                $anteproyectonae->idnae = $nae['idnae'];
                $idanteproyectonae = DatAnteproyectonaeModel::insertardatAnteproyectonae(
                                $anteproyectonae
                );
                foreach ($nae['DatAnteproyectonaeobjetogasto'] as $objeto) {
                    $anteproyectoobjetgasto = new DatAnteproyectonaeobjetogasto( );
                    $anteproyectoobjetgasto->idanteproyectonae = $idanteproyectonae;
                    $anteproyectoobjetgasto->idusuario = $anteproyecto->idusuario;
                    $anteproyectoobjetgasto->idobjetogasto = $objeto['idobjetogasto'];
                    $anteproyectoobjetgasto->ejecucionanterior = $objeto['ejecucionanterior'];
                    $anteproyectoobjetgasto->presupuestoactual = $objeto['presupuestoactual'];
                    $anteproyectoobjetgasto->estimadoactual = $objeto['estimadoactual'];
                    $anteproyectoobjetgasto->planificacion = $objeto['planificacion'];
                    $resultid = DatAnteproyectonaeobjetogastoModel::insertardatAnteproyectonaeobjetogasto(
                                    $anteproyectoobjetgasto
                    );
                }
                foreach ($nae['DatAnteproyectonaeingreso'] as $ingreso) {
                    $anteproyectoingreso = new DatAnteproyectonaeingreso();
                    $anteproyectoingreso->idanteproyectonae = $idanteproyectonae;
                    $anteproyectoingreso->idusuario = $anteproyecto->idusuario;
                    $anteproyectoingreso->idingreso = $ingreso['idingreso'];
                    $anteproyectoingreso->ejecucionanterior = $ingreso['ejecucionanterior'];
                    $anteproyectoingreso->presupuestoactual = $ingreso['presupuestoactual'];
                    $anteproyectoingreso->estimadoactual = $ingreso['estimadoactual'];
                    $anteproyectoingreso->planificacion = $ingreso['planificacion'];
                    $resultid = DatAnteproyectonaeingresoModel::insertardatAnteproyectonaeingreso(
                                    $anteproyectoingreso
                    );
                }
            }
        } else {
            foreach ($gastosmodificados as $ogm) {
                $apno = self::obtenerantproynaeobj(
                                $ogm->idanteproyectonaeobjetogasto
                );
                $apno->ejecucionanterior = $ogm->ejecucionanterior;
                $apno->estimadoactual = $ogm->estimadoactual;
                $resultid = DatAnteproyectonaeobjetogastoModel::insertardatAnteproyectonaeobjetogasto(
                                $apno
                );
            }
            foreach ($ingresosmodificados as $im) {
                $apni = self::obtenerantproynaeing(
                                $im->idanteproyectonaeingreso
                );
                $apni->ejecucionanterior = $im->ejecucionanterior;
                $apni->estimadoactual = $im->estimadoactual;
                $resultid = DatAnteproyectonaeingresoModel::insertardatAnteproyectonaeingreso(
                                $apni
                );
            }
        }
        return 1;
    }

    public function getPresupuestoAnnoActual($parametros, $tipo) {
        $conn = Doctrine_Manager::connection();
        $select = ($tipo == 'og') ? " COALESCE(SUM(dapog.planificacion),0) as actualog " : " COALESCE(SUM(dapi.planificacion),0) as actualingreso ";
        $consulta = " SELECT {$select}
                        FROM mod_planificacion.nom_datosnomenclador dn
                        INNER JOIN mod_planificacion.nom_ejercicioplanificacion ej
                        ON (ej.idestado = dn.iddatosnomenclador AND dn.uridatosnomenclador = 'ejecucionpresupuesto')
                        INNER JOIN mod_planificacion.dat_anteproyecto ap ON (ap.idejercicio = ej.idejercicio
                        AND ap.identidad = " . $parametros['identidad'] . ")
                        INNER JOIN mod_planificacion.dat_anteproyectonae apn
                        ON (ap.idanteproyecto = apn.idanteproyecto AND apn.idnae = "
                . $parametros['idnae'] . ")
                        LEFT JOIN mod_planificacion.dat_anteproyectonaeingreso dapi
                        ON dapi.idanteproyectonae = apn.idanteproyectonae
                        LEFT JOIN mod_planificacion.dat_anteproyectonaeobjetogasto dapog
                        ON dapog.idanteproyectonae = apn.idanteproyectonae ";
        $res = $conn->execute($consulta)->fetchAll(PDO::FETCH_COLUMN);
        return $res[0];
    }

}
