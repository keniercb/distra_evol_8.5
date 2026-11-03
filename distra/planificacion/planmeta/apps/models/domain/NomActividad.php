<?php

class NomActividad extends BaseNomActividad {

    public function setUp() {
        parent::setUp();
        $this->hasMany(
                'DatActividadentidad', array('local' => 'idactividad', 'foreign' =>
            'idactividad')
        );
        $this->hasMany(
                'DatNorma', array('local' => 'idactividad', 'foreign' =>
            'idactividad')
        );
        $this->hasMany(
                'DatDestino', array('local' => 'idactividad', 'foreign' =>
            'idactividad')
        );
        $this->hasOne(
                'DatRegla', array('local' => 'idactividad', 'foreign' =>
            'idactividaddestino')
        );
        $this->hasMany(
                'DatActividadmodelo', array('local' => 'idactividad', 'foreign' =>
            'idactividad')
        );
        $this->hasMany(
                'DatActividadmodelosalida', array('local' => 'idactividad', 'foreign' =>
            'idactividad')
        );
        $this->hasOne(
                'DatActividadnivelproduccion', array('local' => 'idactividad',
            'foreign' => 'idactividad')
        );
//        $this->hasMany(
//                'DatDatosnomencladoractividad', array('local' => 'idactividad',
//            'foreign' => 'idactividad')
//        );
//        $this->hasMany(
//                'DatServicio', array('local' => 'idactividad', 'foreign' =>
//            'idactividad')
//        );
//        $this->hasMany(
//                'TempGestionaractividad', array('local' => 'idactividad',
//            'foreign' => 'idactividad')
//        );
        $this->hasMany(
                'DatSalida', array('local' => 'idactividad', 'foreign' =>
            'idactividad')
        );
        $this->hasMany(
                'TempInsactividad', array('local' => 'codigo', 'foreign' =>
            'codigo')
        );
        $this->hasMany(
                'TempInsnorma', array('local' => 'codigo', 'foreign' => 'codigo')
        );
    }

    public function buscarOrdenIzqDer($idactividad) {
        $query = new Doctrine_Query();
        $result = $query->select('n.ordender as ordenderecho, n.ordenizq as ordenizquierdo,n.idarbol')
                        ->from('NomActividad n')->where('n.idactividad = ?', $idactividad)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function validarTipoModeloConColumnNomencladas($params) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT
                                CASE
                                  WHEN count(tmc.idtiponomenclador) = 0 THEN 0
                                  ELSE 1
                                END AS tmconcolnomenclada
                         FROM mod_planificacion.nom_tipomodelo tm
                              INNER JOIN mod_planificacion.nom_tipomodelocolumna tmc ON (tm.idtipomodelo
                                = tmc.idtipomodelo)
                              INNER JOIN mod_planificacion.dat_modelo m ON (tm.idtipomodelo =
                                m.idtipomodelo)
                              INNER JOIN mod_planificacion.dat_actividadmodelo am ON (m.idmodelo =
                                am.idmodelo)
                         WHERE am.idactividad = {$params['idactividad']}";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    //funcion listar actividades
    public function listar($params) {
        $params['idespecialidades'] = 0;
        //ordenar tree
        $devolverPadre = ($params['idpadre'] == 0 ? "null as _parent" : "a.idpadre as _parent");

        //filtro por nivel de la actividad
        if ($params['nivel'] != null && $params['nivel'] != '' && $params['idpadre'] == null) {
            $whereNivel = " AND a.nivel ={$params['nivel']}";
        } elseif ($params['idpadre']) {
            //filtro del tree
            $whereIdpadre = " AND a.idpadre ={$params['idpadre']} AND a.idpadre <> a.idactividad";
        }

        //filtrar actividades con un indicador especifico en sus normas
        $buscarIndicador = "";
        $wherebuscarIndicador = "";
        if ($params['idindicadorebuscar'] != null && $params['limpiarbuscar'] != 2) {
            $buscarIndicador = " INNER JOIN mod_planificacion.dat_norma  n ON a.idactividad = n.idactividad";
            $wherebuscarIndicador = " AND n.idindicador = {$params['idindicadorebuscar']} AND n.idejercicio in({$params['idejerciciosbuscar']})";
        }
        //fin de filtrar actividades con un indicador especifico en sus normas
//filtros
        $addWhereFiltros = "";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['data']['value'] == "" && $datos['data']['value'] != 0) {
                    continue;
                }
                if ($datos['field'] == 'codigo') {
                    $addWhereFiltros .= " AND a.codigo LIKE '" . $datos['data']['value'] . "%'";
                } elseif ($datos['field'] == 'denominacion') {
                    $addWhereFiltros .= " AND upper(a.denominacion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos['field'] == 'descripcion') {
                    $addWhereFiltros .= " AND upper(a.descripcion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos['field'] == 'estado') {
                    if ($datos['data']['value'] == 'Si' || $datos['data']['value'] == 'Sí' || $datos['data']['value'] == 'si' || $datos['data']['value'] == 'sí') {
                        $addWhereFiltros .= " AND a.estado  =  1";
                    }
                    if ($datos['data']['value'] == 'No') {
                        $addWhereFiltros .= " AND a.estado  =  0";
                    }
                } elseif ($datos['field'] == 'normada') {
                    if ($datos['data']['value'] == 'Si' || $datos['data']['value'] == 'Sí' || $datos['data']['value'] == 'si' || $datos['data']['value'] == 'sí') {
                        $addWhereFiltros .= " AND a.normada= 1";
                    } else {
                        $addWhereFiltros .= " AND a.normada= 0";
                    }
                } elseif ($datos['field'] == 'salida') {
                    if ($datos['data']['value'] == 'Si' || $datos['data']['value'] == 'Sí' || $datos['data']['value'] == 'si' || $datos['data']['value'] == 'sí') {
                        $addWhereFiltros .= " AND COALESCE(s.idactividad,0)> 0";
                    } else {
                        $addWhereFiltros .= " AND COALESCE(s.idactividad,0)= 0";
                    }
                } elseif ($datos['field'] == 'reglas') {
                    if ($datos['data']['value'] == 'Si' || $datos['data']['value'] == 'Sí' || $datos['data']['value'] == 'si' || $datos['data']['value'] == 'sí') {
                        $addWhereFiltros .= " AND (r.regla >0)";
                    } else {
                        $addWhereFiltros .= " AND (r.regla IS NULL)";
                    }
                } elseif ($datos['field'] == 'idaprobacion') {
                    if ($datos['data']['value'] == 'Si' || $datos['data']['value'] == 'Sí' || $datos['data']['value'] == 'si' || $datos['data']['value'] == 'sí' || $datos['data']['value'] == 'Especialista') {
                        $addWhereFiltros .= " AND a.idaprobacion  = 3";
                    } else {
                        if ($datos['data']['value'] == 'Rector') {
                            $addWhereFiltros .= " AND a.idaprobacion  = 4";
                        } else {
                            $addWhereFiltros .= " AND a.idaprobacion  = 1";
                        }
                    }
                } elseif ($datos['field'] == 'idmodelo') {
                    if ($datos['data']['value'] == '-') {
                        $addWhereFiltros .= " AND am.idmodelo is null";
                    } else {
                        $addWhereFiltros .= " AND am.idmodelo ={$datos['data']['value']}";
                    }
                } elseif ($datos['field'] == 'idusuario') {
                    $addWhereFiltros .= " AND a.idusuario ={$datos['data']['value']}";
                } elseif ($datos['field'] == 'idespecialidad') {
                    $params['idespecialidades'] = $datos['data']['value'];
                } elseif ($datos ['field'] == 'fecha') {
                    $fechafin = explode('/', $datos ['data']['value']);
                    $fechafin = $fechafin[1] . '/' . $fechafin[0] . '/' . $fechafin[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhereFiltros .= "AND a.fecha::date<'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhereFiltros .= "AND a.fecha::date>'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhereFiltros .= "AND a.fecha::date='{$fechafin}'";
                    }
                } elseif ($datos['field'] == 'idmodelosalida') {
                    if ($datos['data']['value'] == '-') {
                        $addWhereFiltros .= " AND ams.idmodelo is null";
                    } else {
                        $addWhereFiltros .= " AND ams.idmodelo ={$datos['data']['value']}";
                    }
                }
            }
        }
        if ($params['idespecialidades'] == 0) {
            if ($params['idespecialidad'] != null) {
                $especialidades = $params['integrator']->datosmaestros->getTodosHijosEspecialidad($params['idespecialidad']);
                $idespecialidades[] = $params['idespecialidad'];
            } else {
                //se busca el array de especialidades segun entidad logueada
                if ($params['rector'] == 'false') {
                    $idespLogueada = ZendExt_GlobalConcept::getInstance()->Estructura->idespecialidad;
                    $especialidades = $params['integrator']->datosmaestros->getTodosHijosEspecialidad($idespLogueada);
                    $idespecialidades[] = $idespLogueada;
                } else {
                    $especialidades = NomActividad::obtenerEspecialidadesTodas();
                }
            }
            //obteniendo cadena de idespecialidades
            foreach ($especialidades as $value) {
                $idespecialidades[] = $value['idespecialidad'];
            }
            $params['idespecialidades'] = implode(',', $idespecialidades);
        }
        $conn = Doctrine_Manager::connection();
        $query = "WITH reglas AS (  SELECT dr.idactividadorigen,dr.idactividaddestino,
                                   count(dr.idregla) as regla
                                   FROM mod_planificacion.dat_regla dr
                                   WHERE dr.idejercicio = {$params['idejercicio']}
                                   GROUP BY dr.idactividadorigen,dr.idactividaddestino
                                   )
                SELECT a.idactividad,
                       count(*) OVER() as total,
                       CASE
                            WHEN (r.regla >0) THEN 1
                            ELSE 0
                        END as reglas,
                       a.idpadre,
                       a.codigo,
                       a.idformato,
                       a.denominacion,
                       a.estado,
                       a.idaprobacion,
                       a.idarbol,
                       a.descripcion,
                       a.nivel,
                       CASE WHEN a.nivel = {$params['ultimonivel']}
                       THEN TRUE
                       ELSE FALSE
                       END AS esultimonivel,
                       a.ordender,
                       a.ordenizq,
                       a.normada,
                       am.idmodelo as idmodelo,
                       ams.idmodelo as idmodelosalida,
                       a.idespecialidad,
                       $devolverPadre,
                       ((a.ordender - a.ordenizq) = 1) as _is_leaf,

                       COALESCE((SELECT act.codigo
                       FROM  mod_planificacion.nom_actividad act
                       WHERE act.idactividad = a.idpadre AND a.nivel <> 1),'-1') as codigopadre,
                       case WHEN COALESCE(s.idactividad,0)> 0 THEN 1
                       ELSE 0 END as salida,
                       a.idusuario,
                       a.fecha
                FROM mod_planificacion.nom_actividad a
                     LEFT JOIN mod_planificacion.dat_actividadmodelo am
                     ON am.idactividad = a.idactividad
                     LEFT JOIN mod_planificacion.dat_actividadmodelosalida ams
                     ON ams.idactividad = a.idactividad
                     LEFT JOIN mod_planificacion.dat_salida s
                     ON s.idactividad = a.idactividad
                     LEFT JOIN reglas r  ON (r.idactividadorigen = a.idactividad OR r.idactividaddestino = a.idactividad)
                     $buscarIndicador
                where true
                and a.idespecialidad IN ({$params['idespecialidades']})
                $addWhereFiltros
                      $whereNivel
                      $whereIdpadre
                      $wherebuscarIndicador
                group by a.idactividad,
                         am.idmodelo,
                         r.regla,
                         ams.idmodelo,
                         s.idactividad
                ORDER BY a.codigo";
        if ($params['limitado']) {
            $query .= " OFFSET {$params['start']}
                                     LIMIT {$params['limit']}";
        } else {
            $query .= " OFFSET 0
                                     LIMIT 1";
        }
        //print_r($query);die;
        $data->data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];
        return $data;
    }

    /*     * calcularCostoDirecto
     * @param $params
     * @return mixed
     */

    public function calcularCostoDirecto($params) {

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT coalesce(res.costosindirectos, 0) as costosindirectos,
                        coalesce(res.otroscostos, 0) as otroscostos,
                        coalesce((sum(round((dn.necesidad * nip.precio), 3))), 0) as importe
                 FROM mod_planificacion.nom_actividad na
                      INNER JOIN mod_planificacion.dat_norma dn ON (na.idactividad =
                        dn.idactividad AND dn.idejercicio = {$params['idejercicio']})
                      INNER JOIN mod_datosmaestros.nom_indicador ni ON (ni.idindicador =
                        dn.idindicador)
                      INNER JOIN mod_datosmaestros.nom_indicadorplanif nip ON (ni.idindicador =
                        nip.idindicador and nip.idaprobacion = 4)
                      INNER JOIN mod_datosmaestros.dat_indicadorcentrobalance icb ON
                        ni.idindicador = icb.idindicador
                      LEFT JOIN mod_planificacion.dat_rescostoactividad res ON (na.idactividad =
                        res.idactividad AND res.idejercicio = {$params['idejercicio']})
                 WHERE na.idactividad = {$params['idactividad']} AND
                       ni.estado = 1 AND
                       nip.nivelplanif = 1
                 GROUP BY res.costosindirectos,
                          res.otroscostos";

        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    //funcion aprobar actividades
    public function aprobardesaprobarArrayActividades($actDesap, $esrector, $idaprobacion) {
        $conn = Doctrine_Manager::connection();
        $estado = "";
        if ($idaprobacion == 1) {
            $estado = ", estado=0";
        }
        $sql = "UPDATE mod_planificacion.nom_actividad
                SET idaprobacion = $idaprobacion $estado
                WHERE idactividad IN ($actDesap)";
        if ($esrector == false) {
            $sql = $sql . " AND idaprobacion <> '4' ";
        }
        $conn->execute($sql);
    }

    public function obtenerNormPlan($actividades) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                    a.idactividad
                  FROM
                    mod_planificacion.nom_actividad a
                    /*INNER JOIN mod_planificacion.dat_actividadmodelo am
                    ON(a.idactividad=am.idactividad)*/
                    WHERE a.idactividad in($actividades)
                    AND a.normada=1";
        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    public function obtenerUltimoNivel($ordender, $ordenizq, $idarbol, $ultimonivel, $arrAct) {
        $actividades = implode(',', $arrAct);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                idactividad
              FROM
                mod_planificacion.nom_actividad
                where
                ordender <= $ordender
                and ordenizq >= $ordenizq
                and idarbol = $idarbol
                and nivel = $ultimonivel
                and idactividad not in ($actividades)";
        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    public function ObtenerIdActividades($params) {
        $conn = Doctrine_Manager::connection();
        $primero = true;
        $sqlWhere = "";
        foreach ($params as $id) {
            if ($primero) {
                $sqlWhere = "and (ind.ordenizq >= $id->ordenizq and ind.ordender <=
                    $id->ordender and ind.idarbol=$id->idarbol)";
                $primero = false;
            } else {
                $sqlWhere .= " or (ind.ordenizq >= $id->ordenizq and ind.ordender <=
                $id->ordender and ind.idarbol=$id->idarbol)";
            }
        }
        $sql = "select ind.idactividad as idactividad
				from mod_planificacion.nom_actividad  ind
				where true
				$sqlWhere";
        $idactividad = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);

        return $idactividad;
    }

//fin de la funcion aprobar actividades
//funcion activar actividades
    public function ActualizarEstado($params) {
        //busco solo las actividades de ultimo nivel
        //involucradas en la seleccion
        $arrTemp[] = 0;
        $actividadesUltimonivelArr = array();
        foreach ($params['actividades'] as $act) {
            if ($actividadesUltimonivelArr[0])
                $actividadesUltimonivelArr = array_merge($actividadesUltimonivelArr, self::obtenerUltimoNivel($act->ordender, $act->ordenizq, $act->idarbol, $params['nivel'], $actividadesUltimonivelArr));
            else
                $actividadesUltimonivelArr = array_merge($actividadesUltimonivelArr, self::obtenerUltimoNivel($act->ordender, $act->ordenizq, $act->idarbol, $params['nivel'], $arrTemp));
        }
        if ($actividadesUltimonivelArr[0]) {
            //activo las actividdaes del ultimo nivel que estan aprobadas nivel 4
            $actividadesUltimonivel = implode(',', $actividadesUltimonivelArr);
            self::activarDesactivarArrayActividades($actividadesUltimonivel, $params['estado']);
            return true;
        } else {
            return false;
        }
    }

    public function activarDesactivarArrayActividades($actDesact, $estado) {
        $conn = Doctrine_Manager::connection();
        $aprobacion = "";
        if ($estado == 1) {
            $aprobacion = "AND idaprobacion=4";
        }
        $sql = "UPDATE mod_planificacion.nom_actividad
                SET estado = $estado
                WHERE idactividad IN ($actDesact) $aprobacion";
        $conn->execute($sql);
    }

//fin de la funcion activar actividades
//funcion eliminar actividades
    public function eliminarArrayAct($actividades) {
        $queryElim = Doctrine_Query::create();
        $queryElim->delete('NomActividad')
                ->from('NomActividad')
                ->whereIn('idactividad', $actividades)
                ->execute();
    }

    /* auxiliares */

    public function obtenerEspecialidadesTodas($especialidades = null, $denominacion = true) {
        $con = Doctrine_Manager::connection();
        $where = "";
        if ($especialidades != null) {
            if (count($especialidades) > 0)
                $esp = implode(',', $especialidades);
            $where = " where idespecialidad NOT IN({$esp})";
        }
        $alias = "";
        if ($denominacion)
            $alias = " as denominacion";
        $query = "SELECT idespecialidad, denespecialidad $alias , codespecialidad
                  FROM mod_datosmaestros.nom_especialidad  " . $where
                . "order by denespecialidad";
        $res = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    public function getNivel() {
        $select = " SELECT f.idformato,MAX(df.nivel) as nivel
                FROM mod_planificacion.nom_formatopredefinido f
                INNER JOIN mod_datosmaestros.dat_parteformato df ON df.idformato = f.idformato
                GROUP BY f.idformato";
        $conex = Doctrine_Manager:: connection();
        $result = $conex->execute($select)->fetchAll(PDO::FETCH_ASSOC);
        if (count($result)) {
            $result = $result[0]['nivel'];
        } else {
            $result = 4;
        }
        return $result;
    }

    public function guardarFormatoPredefinido($idformato) {
        //$objFormato = Doctrine::getTable('NomFormatopredefinido')->findByDql("idformato = {$idformato}");
        //if ($objFormato[0]->idformato == null) {
        $obj = new NomFormatopredefinido();
        $obj->idformato = $params['idformato'];
        $obj->save();
        //}
    }

    public function formato($integrator, $denoFormato = 'Actividades') {
        $select = " SELECT f.idformato FROM mod_planificacion.nom_formatopredefinido f";
        $conex = Doctrine_Manager:: connection();
        $result = $conex->execute($select)->fetchAll(PDO::FETCH_COLUMN);
        return $result[0];
    }

    public function obtener_ConfFormato_UltimoNivel() {
        //temporal hasta que se haga un servicio que de el id del formato "Actividades"
        $idformatoAct = self::obtIdformato();
        $ultimonivel = -1;
        $partesformato = array();
        if ($idformatoAct != null) {

            $partesformato = ZendExt_IoC::getInstance()->datosmaestros->buscarParteFormato($idformatoAct);
            foreach ($partesformato as $value) {
                if ($value->nivel > $ultimonivel) {
                    $ultimonivel = $value->nivel;
                }
            }
        }
        return array($idformatoAct, $ultimonivel, $partesformato);
    }

    public function obtIdformato($denoFormato = 'Actividades') {
        $formato = ZendExt_IoC::getInstance()->datosmaestros->listarFormatos();

        foreach ($formato as $valor) {
            if ($valor->nombre == $denoFormato) {
                return $valor->idformato;
                break;
            }
        }
        return null;
    }

    public function getFormatoandNivel() {
        $select = " SELECT f.idformato,MAX(df.nivel) as nivel
                FROM mod_planificacion.nom_formatopredefinido f
                INNER JOIN mod_datosmaestros.dat_parteformato df ON df.idformato = f.idformato
                GROUP BY f.idformato";
        $conex = Doctrine_Manager:: connection();
        $result = $conex->execute($select)->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    public function BuscarHijos($idactividad, $comoarray = false) {
        /* temporal no traer a la LN los ids, hacerlo en una subconsulta */
        $ordenderordenizq = NomActividad::buscarOrdenIzqDer($idactividad);
        $query = new Doctrine_Query();
        if ($comoarray) {
            return $query->from('NomActividad a')->where(
                            'a.ordenizq>? AND a.ordender<? AND a.idpadre=?
                AND a.idactividad<>? AND a.idarbol = ?', array(
                        $ordenderordenizq[0]['ordenizquierdo'],
                        $ordenderordenizq[0]['ordenderecho'],
                        $idactividad,
                        $idactividad,
                        $ordenderordenizq[0]['idarbol'])
                    )->execute()->toArray();
        } else {
            return $query->from('NomActividad a')->where(
                            'a.ordenizq>? AND a.ordender<? AND a.idpadre=?
                AND a.idactividad<>? AND a.idarbol = ?', array(
                        $ordenderordenizq[0]['ordenizquierdo'],
                        $ordenderordenizq[0]['ordenderecho'],
                        $idactividad,
                        $idactividad,
                        $ordenderordenizq[0]['idarbol'])
                    )->execute();
        }
    }

    public function BuscarMisPadres($idactividadgeneradora) {
        $sqlQuery = "SELECT
  r.denominacion,
  r.idactividadquegenera,
  n.idnorma,
  na.denominacion as denomicionactgenera,
  na.idactividad
FROM
  mod_planificacion.dat_norma n
  inner join mod_planificacion.dat_regla r
  on (r.idnorma = n.idnorma)
  inner join mod_datosmaestros.nom_indicador ni
  on (n.idindicador = ni.idindicador)
  inner join mod_planificacion.nom_actividad na
  on (na.idactividad = r.idactividadquegenera)
WHERE
   r.idactividadquegenera = '$idactividadgeneradora';";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($sqlQuery); //$array_parametros
        return $res->fetchAll(PDO::FETCH_ASSOC);
    }

    //metodo recursivo
    public function BuscarTodosLosCaminos($mispadres, $mispadresactividades, $cont, $contador, $arregloPadresdemispadres) {

        if (count($mispadres[0]) == 0 && count($mispadresactividades[0]) == 0) {
            return $arregloPadresdemispadres;
        } else {

            if ($cont < 1) {
                if (count($mispadres[0]) != 0) {
                    for ($i = 0; $i < count($mispadres[0]); $i++) {
                        $resultAux[] = DatRegla::DameDenomActividadDadoIdNorma(
                                        $mispadres[0][$i]['idnorma']
                        );
                        if (count($resultAux[0]) != 0) {
                            for ($j = 0; $j < count($resultAux[0]); $j++) {

                                $arregloPadresdemispadres[$contador]
                                        /* ['padres'] */ = $resultAux[0][$j]['idactividad'];
                                $contador++;
                                $cont++;
                            }
                        }
                    }
                }

                if (count($mispadresactividades[0]) != 0) {
                    for ($k = 0; $k < count($mispadresactividades[0]); $k++) {
                        $arregloPadresdemispadres[$contador] = $mispadresactividades[0][$k]['idactividad'];
                        $resultAuxiliar[$k] = NomActividad::BuscarMisPadres(
                                        $mispadresactividades[0][$k]['idactividad']
                        );
                    }
                }
                return NomActividad::BuscarTodosLosCaminos(
                                $resultAux, $resultAuxiliar, $cont, $contador, $arregloPadresdemispadres
                );
            } else {

                for ($i = 0; $i < count($mispadres); $i++) {

                    $resultAux[$i] = NomActividad::BuscarMisPadres(
                                    $mispadres[$i][0]['idactividad']
                    );
                }
                for ($i = 0; $i < count($resultAux); $i++) {

                    if ($resultAux[$i][0]['idnorma'] != null) {
                        $arregloPadresdemispadres[$contador] = $resultAux[$i][0]['idactividad'];
                        $resultAux[$i] = DatRegla::DameDenomActividadDadoIdNorma(
                                        $resultAux[$i][0]['idnorma']
                        );
                        $contador++;
                    }
                }

                for ($k = 0; $k < count($resultAux); $k++) {

                    if (count($resultAux[$k]) != 0) {
                        for ($j = 0; $j < count($resultAux[$k]); $j++) {
                            $arregloPadresdemispadres[$contador]
                                    /* ['padres'] */ = $resultAux[$k][$j]['idactividad'];
                            $contador++;
                        }
                    }
                }
                //para las actividades sin normas

                for ($h = 0; $h < count($mispadresactividades[0]); $h++) {

                    $resultAuxiliar[$h] = NomActividad::BuscarMisPadres(
                                    $mispadresactividades[0][$h]['idactividad']
                    );
                }

                for ($i = 0; $i < count($resultAuxiliar); $i++) {

                    if ($resultAuxiliar[$i][0]['idnorma'] != null) {
                        $arregloPadresdemispadres[$contador] /* ['padres'] */ = $resultAuxiliar[$i][0]['idactividad'];
                        $resultAuxiliar[$i] = DatRegla::DameDenomActividadDadoIdNorma(
                                        $resultAuxiliar[$i][0]['idnorma']
                        );
                        $contador++;
                    }
                }

                for ($k = 0; $k < count($resultAuxiliar); $k++) {

                    if (count($resultAuxiliar[$k]) != 0) {
                        for ($j = 0; $j < count($resultAuxiliar[$k]); $j++) {
                            $arregloPadresdemispadres[$contador]
                                    /* ['padres'] */ = $resultAuxiliar[$k][$j]['idactividad'];
                            $contador++;
                        }
                    }
                }

                return NomActividad::BuscarTodosLosCaminos(
                                $resultAux, $resultAuxiliar, $cont, $contador, $arregloPadresdemispadres
                );
            }
        }
    }

    public function buscarValorArreglo($valor, $arreglo) {

        for ($i == 0; $i < count($arreglo); $i++) {
            if ($valor == $arreglo[$i]['posiciones']) {
                return true;
                break;
            }
        }
    }

//este se puede borrar cuando se elimine el componente viejo de nivel de actividad
    public function listarEspPorUri($params) {
        $addWhere = "";

        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacionentidad') {
                    $addWhere .= " AND ae.identidad =" . $datos['data']['value']
                            . "";
                } elseif ($datos['field'] == 'denominacionespecialidad') {
                    $addWhere .= " AND aec.idespecialidad =" . $datos['data']['value'] . "";
                } elseif ($datos['field'] == 'nivel') {
                    if ($datos['data']['comparison'] == "gt") {
                        $addWhere .= " AND COALESCE(aea.nivelactividadautomatico, 0) +
                                            COALESCE(aem.nivelactividadmanual, 0) +
                                            COALESCE(aep.nivelactividadproduccion,0) >" . $datos['data']['value'] . "";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $addWhere .= " AND COALESCE(aea.nivelactividadautomatico, 0) +
                                        COALESCE(aem.nivelactividadmanual, 0) +
                                        COALESCE(aep.nivelactividadproduccion,0) <" . $datos['data']['value'] . "";
                    } else {
                        $addWhere
                                .= " AND COALESCE(aea.nivelactividadautomatico, 0) +
                                    COALESCE(aem.nivelactividadmanual, 0) +
                                    COALESCE(aep.nivelactividadproduccion,0) =" . $datos['data']['value'] . "";
                    }
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT aec.idespecialidad, ae.identidad,
                COALESCE(aea.nivelactividadautomatico, 0) +
                COALESCE(aem.nivelactividadmanual, 0) +
                COALESCE(aep.nivelactividadproduccion,0)  as nivel,
                count(*) OVER() as total
                FROM mod_planificacion.dat_actespcomportamiento aec
                INNER JOIN mod_planificacion.dat_actividadentidad ae
                ON(aec.idactespcomportamiento=ae.idactespcomportamiento AND ae.idejercicio=" . $params['idejercicio'] . ")
                LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                ON(aem.idactividadentidad = ae.idactividadentidad)
                LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                ON(aea.idactividadentidad = ae.idactividadentidad)
                LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
                ON(aep.idactividadentidad = ae.idactividadentidad)
                WHERE aec.idactividad=" . $params['idactividad'] . "
                AND aec.iddatosnomenclador= {$params['iddatosnomenclador']}
                $addWhere
                OFFSET " . $params['start'] . "
                LIMIT  " . $params['limit'] . "";
//        print_r($sql);die;
        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        $data->total = $data->data[0]['total'];
        return $data;
    }

    public function listarEspPorUriDatosNomenclador($params) {

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT aec.idespecialidad, ae.identidad,
                COALESCE(aea.nivelactividadautomatico, 0) +
                COALESCE(aem.nivelactividadmanual, 0) +
                COALESCE(aep.nivelactividadproduccion,0)  as nivel,
                count(*) OVER() as total
                FROM mod_planificacion.dat_actespcomportamiento aec
                INNER JOIN mod_planificacion.dat_actividadentidad ae
                ON(aec.idactespcomportamiento=ae.idactespcomportamiento AND ae.idejercicio=" . $params['idejercicio'] . ")
                LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                ON(aem.idactividadentidad = ae.idactividadentidad)
                LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                ON(aea.idactividadentidad = ae.idactividadentidad)
                LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
                ON(aep.idactividadentidad = ae.idactividadentidad)
                WHERE aec.idactividad=" . $params['idactividad'] . "
                AND aec.iddatosnomenclador= {$params['iddatosnomenclador']}
                ";
//        print_r($sql);die;
        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        $data->total = $data->data[0]['total'];
        return $data;
    }

    public function obtIntervalosPorPartesDeFormatos($codesp, $soloinicial = false
    ) {
        //temporal hasta que se haga un servicio que de el id del formato "Actividades"
        $idformatoAct = self::obtIdformato();
        $arrayRangoslongs = array();
        if ($idformatoAct != -1) {
            $partesformato = ZendExt_IoC::getInstance(
                    )->datosmaestros->buscarParteFormato($idformatoAct);
            $nivelini = 0;
            $nivelfin = strlen($codesp); //codigo de la especialidad
            foreach ($partesformato as $value) {
                $nivelini = $nivelfin;
                $nivelfin = $nivelini + $value->longitud;
                if ($soloinicial) {
                    $arrayRangoslongs[$value->nivel] = array($nivelini, $nivelfin);
                } else {
                    $arrayRangoslongs[$value->nivel] = $nivelini;
                }
            }
        }
        return $arrayRangoslongs;
    }

    public function obtActPorCod($codigo) {
        $query = Doctrine_Query::create();
        return $query->from('NomActividad')->where('codigo = ?', $codigo)
                        ->execute()->getFirst();
    }

}
