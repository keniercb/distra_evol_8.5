<?php

class NomDatosnomenclador extends BaseNomDatosnomenclador {

    public function setUp() {
        parent::setUp();

        $this->hasOne('NomTiponomenclador', array('local' => 'idtiponomenclador', 'foreign' => 'idtiponomenclador'));
        $this->hasMany('DatEntidaddatosnomenclador', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador'));
        $this->hasMany('DatDatosnomencladoractividad', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador'));
        $this->hasMany('DatModelodatosnomenclador', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador'));
        $this->hasMany('TempInsindicador', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador'));
        $this->hasMany('TempInsactividad', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador'));
        $this->hasMany('TempInsnorma', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador'));
        $this->hasMany('TempInsindicadorviayos', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador'));
        $this->hasMany('TempIndicadorprecio', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador'));
        $this->hasMany('DatDocumentoaprobacion', array('local' => 'iddatosnomenclador', 'foreign' => 'idoperacion'));
        $this->hasMany('DatDocumentoaprobacion', array('local' => 'iddatosnomenclador', 'foreign' => 'idtipoaprobacion'));
        $this->hasMany('NomEjercicioplanificacion', array('local' => 'iddatosnomenclador', 'foreign' => 'idestado'));
        $this->hasMany('DatProcesofuncionalidadestado', array('local' => 'iddatosnomenclador', 'foreign' => 'idestado'));


        //ver si se mantiene o no esta solución
        $this->hasMany('DatDatosnomencladordatosnomenclador', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomencladorpadre'));
        $this->hasMany('DatDatosnomencladordatosnomenclador', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomencladorhijo'));

        //esto ver si aun se usa
        $this->hasMany('DatDesglosedatosnomenclador', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador'));
    }

    public function listarDatonomenclador($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                    dn.iddatosnomenclador,
                    dn.denominacion,
                    dn.idtiponomenclador,
                    dn.descripcion,
                    dn.uridatosnomenclador,
                    dn.cantdescendente,
                    dn.cantascendente,
                    dn.activacion,
                    dn.valordefecto,
                    dn.orden,
                    tn.configsistema,
                    count(*) OVER() as total
                  FROM mod_planificacion.nom_datosnomenclador dn
                    INNER JOIN mod_planificacion.nom_tiponomenclador tn
                    ON (dn.idtiponomenclador=tn.idtiponomenclador)
                    WHERE dn.idtiponomenclador={$params['idtiponomenclador']}
                    {$params['addWhereFiltros']}
                    ORDER BY dn.orden";
        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];
        return $data;
    }

    public function eliminarValorDefectoDatonomenclador($idtiponomenclador) {
        $conn = Doctrine_Manager::connection();
        $query = "UPDATE
                    mod_planificacion.nom_datosnomenclador
                  SET
                    valordefecto = 0
                  WHERE
                    idtiponomenclador = $idtiponomenclador";
        $conn->execute($query);
    }

    public function eliminarDatonomenclador($iddatosnomenclador) {
        try {
            //Capturo una instancia de Doctrine_Manager para manejar la conexion
            $dm = Doctrine_Manager::getInstance();
            //Capturo una instancia de la conexion
            $con = $dm->getCurrentConnection();
            $query = "DELETE FROM mod_planificacion.nom_datosnomenclador
                  WHERE  iddatosnomenclador = $iddatosnomenclador";
            $con->execute($query);
            //Ejecuto la transaccion de doctrine para poder insertar el meta correspondiente a la tupla
            $con->commit();
            //Habro una nueva transaccion de doctrine para la proxima ejecucion
            $con->beginTransaction();
            return 1; //operacion realizada
        } catch (Exception $e) {
            return 0; //no se pudo eliminar porque está en uso
        }
    }

    public function activarDesactivar($params) {
        $addWhere = "";
        if ($params['activacion'] == 0)
            $addWhere = " AND valordefecto=0";
        $conn = Doctrine_Manager::connection();
        $query = "UPDATE
                    mod_planificacion.nom_datosnomenclador
                  SET
                    activacion = {$params['activacion']}
                  WHERE
                    iddatosnomenclador IN({$params['iddatosnomenclador']}) $addWhere";
        $conn->execute($query);
    }

    function crearUriDatoNomenclador($iddatonomenclador) {
        $paramsQuery = array($iddatonomenclador);
        $query = "select * from mod_planificacion.f_generaruridatosnomencladorxid(?)";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($query, $paramsQuery);
        $result->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerDatosCargados($idusuario) {
        $conn = Doctrine_Manager::connection();
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_datonomencladordatos" . $idusuario . "");
    }

    public function crearTablaTemporal($idusuario) {
        $conn = Doctrine_Manager::connection();
        $conn->execute("CREATE TABLE mod_planifimportacion.temp_datonomencladordatos" . $idusuario . " (
                                    idtabla SERIAL,
                                    denominacion VARCHAR(255),
                                    descripcion VARCHAR(255),
                                    iddatosnomenclador NUMERIC(19,0))");
    }

    public function insertarDatosTablaTemporal($idusuario, $denominacion, $descripcion) {
        $conn = Doctrine_Manager::connection();
        $conn->execute("INSERT INTO mod_planifimportacion.temp_datonomencladordatos" . $idusuario . "
                        (denominacion,
                        descripcion)
                        VALUES ('$denominacion',
                              '$descripcion')");
    }

    public function listarDatosTablaTemporal($idusuario) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT    tdn.idtabla,
                            tdn.descripcion,
                            tdn.denominacion,
                            count(*) OVER () as total
                          FROM
                            mod_planifimportacion.temp_datonomencladordatos" . $idusuario . " tdn ORDER BY tdn.idtabla";
        $result = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function actualizarValidacion($idusuario, $idtabla, $iddatosnomenclador) {
        $conn = Doctrine_Manager::connection();
        $query = "UPDATE
                    mod_planifimportacion.temp_datonomencladordatos" . $idusuario . "
                  SET
                    iddatosnomenclador = $iddatosnomenclador
                  WHERE
                    idtabla = $idtabla";
        $conn->execute($query);
    }

    public function listarDatosValidados($idusuario, $start, $limit, $filtros) {
        $condiciones = array();
        if ($filtros) {
            foreach ($filtros as $datos) {
                if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
                    $condiciones[] = "upper(tdn." . $datos['field'] . ") LIKE '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                }
            }
        }
        $WHERE = "true";
        foreach ($condiciones as $condicion) {
            $WHERE = $WHERE . " AND " . $condicion;
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT    tdn.idtabla,
                            tdn.descripcion,
                            tdn.denominacion,
                            tdn.iddatosnomenclador,
                            dn.denominacion as denominaciondato,
                            count(*) OVER () as total
                          FROM
                            mod_planifimportacion.temp_datonomencladordatos" . $idusuario . " tdn
                            LEFT JOIN mod_planificacion.nom_datosnomenclador dn ON (dn.iddatosnomenclador = tdn.iddatosnomenclador)
                            WHERE $WHERE
                ORDER BY tdn.idtabla OFFSET $start LIMIT $limit";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarDatosAImportar($idusuario) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT    tdn.idtabla,
                            tdn.descripcion,
                            tdn.denominacion,
                            count(*) OVER () as total
                          FROM
                            mod_planifimportacion.temp_datonomencladordatos" . $idusuario . " tdn
                 WHERE tdn.iddatosnomenclador=312 ORDER BY tdn.idtabla";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function ObtenerDatosNomenclador($idtiponomenclador, $dataindex, $ordenar = false) {
        $alias = ' nom_datosnomenclador_denominacion';
        if ($dataindex) {
            $alias = $dataindex;
        }
        $query = new Doctrine_Query();
        if ($ordenar) {
            $query->orderBy('m.denominacion');
        } else {
            $query->orderBy('m.iddatosnomenclador');
        }
        $temp = $query->select('m.iddatosnomenclador, m.denominacion as ' . $alias)
                ->from('NomDatosnomenclador m')
                ->where('m.idtiponomenclador=?', $idtiponomenclador)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $temp;
    }

    //Utilizado como servicio
    public function obtenerDatosPrimero($idtiponomenclador) {
        $guion = '-';
        $query = new Doctrine_Query();
        $temp = $query->select('m.iddatosnomenclador, m.denominacion as nom_datosnomenclador_denominacion')
                        ->from('NomDatosnomenclador m')
                        ->where('m.idtiponomenclador=? AND m.denominacion=?', array($idtiponomenclador, $guion))
                        ->execute()->getFirst();
        return $temp;
    }

    public function getDatosNomPorIdTipoNom($idtiponomenclador) {
        $query = new Doctrine_Query();
        return $query->select('m.iddatosnomenclador, m.denominacion as denominacionnom, m.descripcion')
                        ->from('NomDatosnomenclador m')
                        ->where('m.idtiponomenclador=?', $idtiponomenclador)
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
    }

    public function ObtenerDatosDadoIdDatosNom($iddatosnomenclador) {
        $query = new Doctrine_Query();
        return $query->select('m.denominacion')
                        ->from('NomDatosnomenclador m')
                        ->where('m.iddatosnomenclador=?', $iddatosnomenclador)
                        ->execute()->toArray();
    }

    public function obtenerTipoNomenclador($parametros) {
        $query = new Doctrine_Query();
        $where = '';
        $flag = false;
        if ($parametros['nodo'] == 'undefined') {
            $where = 'n.cantascendente = 0';
        } else {
            $where = "dn.iddatosnomencladorpadre =  " . $parametros['nodo'];
            $flag = true;
        }
        $query->select('*,')
                ->from('NomDatosnomenclador n')
                ->innerJoin(' n.NomTiponomenclador ntn');
        if ($flag) {
            $query->innerJoin("n.DatDatosnomencladordatosnomenclador dn");
        }
        $query->where($where)
                ->addWhere("ntn.uritiponomenclador LIKE '" . strtolower($parametros['uri']) . "'")
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        return $query->execute();
    }

    public function getDatosNomPorUriTipoNomIdestado($uritiponomenclador) {
        $query = new Doctrine_Query();
        if ($uritiponomenclador->idestado) {
            $query->addWhere("dn.iddatosnomenclador <> " . $uritiponomenclador->idestado . "");
        }
        return $query->select('dn.iddatosnomenclador, dn.denominacion,dn.uridatosnomenclador, dn.idtiponomenclador, dn.descripcion')
                        ->from('NomDatosnomenclador dn')->innerJoin('dn.NomTiponomenclador tn')
                        ->addWhere('lower(tn.uritiponomenclador) =?', strtolower($uritiponomenclador->uri))
                        ->orderby('dn.denominacion')
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
    }

    public function getDatosNomPorUriTipoNomIdestadoDadoEstado($uritiponomenclador) {
        $query = new Doctrine_Query();
        return $query->select('dn.iddatosnomenclador, dn.denominacion,dn.uridatosnomenclador, dn.idtiponomenclador')
                        ->from('NomDatosnomenclador dn')->innerJoin('dn.NomTiponomenclador tn')
                        ->addWhere('tn.uritiponomenclador =?', strtolower($uritiponomenclador)->uri)
                        ->addWhere('dn.iddatosnomenclador = ?', $uritiponomenclador->idestado)
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
    }

    public function getDatosNomPorUriTipoNomIdestadoDadoUri($uritiponomenclador) {
        $query = new Doctrine_Query();
        return $query->select('dn.iddatosnomenclador, dn.denominacion,dn.uridatosnomenclador, dn.idtiponomenclador')
                        ->from('NomDatosnomenclador dn')->innerJoin('dn.NomTiponomenclador tn')
                        ->addWhere('tn.uritiponomenclador =?', strtolower($uritiponomenclador->uri))
                        ->addWhere('dn.uridatosnomenclador = ?', strtolower($uritiponomenclador->uriestado))
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
    }

    public function getDatosNomPorUriTipoNom($uritiponomenclador, $uridato = false, $excluir = false) {
        $query = new Doctrine_Query();
        $query->select('dn.iddatosnomenclador, dn.denominacion,dn.uridatosnomenclador, dn.idtiponomenclador, dn.descripcion')
                ->from('NomDatosnomenclador dn')
                ->innerJoin('dn.NomTiponomenclador tn')
                ->addWhere('tn.uritiponomenclador =?', strtolower($uritiponomenclador))
                ->addWhere('dn.activacion =?', 1);
        if ($uridato) {
            $query->addWhere('dn.uridatosnomenclador =?', strtolower($uridato));
        }
        if ($excluir) {
            $query->addWhere('dn.uridatosnomenclador <>?', strtolower($excluir));
        }
        $query->orderBy('dn.iddatosnomenclador');
        return $query->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
    }

    public function getDatosNomPorUriTipoNomCtrlProc($uritiponomenclador) {
        $query = new Doctrine_Query();
        return $query->select("dn.iddatosnomenclador, dn.denominacion,dn.uridatosnomenclador, dn.idtiponomenclador ")
                        ->from('NomDatosnomenclador dn')->innerJoin('dn.NomTiponomenclador tn')
                        ->addWhere('lower(tn.uritiponomenclador) =? ', array(strtolower($uritiponomenclador)))
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
    }

    //Utilizado como servicio
    public function getDatosNomPorUriDatosNom($uridatosnomenclador) {
        $query = new Doctrine_Query();
        return $query->select('dn.iddatosnomenclador,dn.denominacion,dn.uridatosnomenclador,dn.idtiponomenclador')
                        ->from('NomDatosnomenclador dn')
                        ->addwhere("dn.uridatosnomenclador = ? ", strtolower($uridatosnomenclador))
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
    }

    public function obtenerDatosNomencladorByDenominacion($denominacion) {
        $query = new Doctrine_Query();
        $temp = $query->select('m.iddatosnomenclador, m.denominacion as nom_datosnomenclador_denominacion')
                        ->from('NomDatosnomenclador m')
                        ->where('m.denominacion=?', $denominacion)
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
        return $temp;
    }

    public function obtenerDatosNomencladorByDenominacionTipoNom($denominacion, $idtiponomenclador) {
        $query = new Doctrine_Query();
        $temp = $query->select('m.iddatosnomenclador, m.denominacion as nom_datosnomenclador_denominacion')
                        ->from('NomDatosnomenclador m')
                        ->where('m.denominacion=? AND m.idtiponomenclador = ?', array($denominacion, $idtiponomenclador))
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
        return $temp;
    }

    public function ObtenerDatosDadoArrayIdDatosNom($arrayIddatosnom) {
        $query = new Doctrine_Query();
        return $query->select('m.denominacion,m.iddatosnomenclador')
                        ->from('NomDatosnomenclador m')
                        ->whereIn('m.iddatosnomenclador', $arrayIddatosnom)->execute()->toArray();
    }

    public function getDatosNomEstadosUri() {
        $query = new Doctrine_Query();
        return $query->select('dn.uridatosnomenclador')
                        ->from('NomDatosnomenclador dn')
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
    }

    public function ObtenerIDDatosNom($dendat) {
        $con = Doctrine_Manager::connection();
        $query = " SELECT m.iddatosnomenclador
                        FROM mod_planificacion.nom_datosnomenclador m
                        WHERE  m.denominacion LIKE '" . $dendat . "';";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function enUsoDatosNomenclador($idtipo) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT idtipomodelocolumna
                    FROM mod_planificacion.nom_tipomodelocolumna
                    where idtiponomenclador = $idtipo LIMIT 1";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function listarEstados() {
        $con = Doctrine_Manager::connection();
        $query = "SELECT dn.iddatosnomenclador,
                         dn.denominacion as estado
                  FROM mod_planificacion.nom_datosnomenclador dn
                  INNER JOIN mod_planificacion.nom_tiponomenclador tn ON (tn.idtiponomenclador = dn.idtiponomenclador)
                  WHERE tn.uritiponomenclador = 'estadosejercicio' AND
                       (dn.uridatosnomenclador = 'elaboracion' OR
                       dn.uridatosnomenclador = 'ejecucion')
                  ORDER BY dn.denominacion";
        $res = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    public function getDatosNomPorUriTipoNomArray($uritiposnomencladores, $uridato = false) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT tn.uritiponomenclador,
                        dn.iddatosnomenclador
                    FROM mod_planificacion.nom_tiponomenclador tn
                    INNER JOIN mod_planificacion.nom_datosnomenclador dn ON tn.idtiponomenclador = dn.idtiponomenclador
                    WHERE tn.uritiponomenclador IN ($uritiposnomencladores) AND
                          dn.uridatosnomenclador = '$uridato'";
        $res = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    public function getIddatosnom($denom, $idtipo) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT iddatosnomenclador
                  FROM mod_planificacion.nom_datosnomenclador
                  where idtiponomenclador = $idtipo and denominacion='$denom'";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function listarPeriodos() {
        $con = Doctrine_Manager::connection();
        $query = "SELECT tn.idtiponomenclador as idperiodo,
                         tn.denominacion as periodo
                  FROM mod_planificacion.nom_tiponomenclador tn
                  WHERE tn.uritiponomenclador = 'mes' OR
                       tn.uritiponomenclador = 'trimestre'
                  ORDER BY tn.denominacion";
        $res = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    public function servicioObtenerDatosnom($uri, $act = false, $excluir = '') {
        $uri = "'" . strtolower($uri) . "'";
        $whereAct = "";
        if ($act) {
            $whereAct = "AND dn.activacion=1";
        }
        $whereExcluirDatoNom = "";
        if ($excluir != '') {
            $whereExcluirDatoNom = "AND dn.uridatosnomenclador<>'$excluir'";
        }
        $con = Doctrine_Manager::connection();
        $query = "SELECT dn.iddatosnomenclador,
                         dn.denominacion,
                         dn.uridatosnomenclador,
                         dn.valordefecto,
                         count(*) over () as total
                  FROM mod_planificacion.nom_tiponomenclador tn
                  INNER JOIN mod_planificacion.nom_datosnomenclador dn
                  ON(tn.idtiponomenclador=dn.idtiponomenclador)
                  WHERE lower(tn.uritiponomenclador) = $uri
                  $whereAct
                      $whereExcluirDatoNom
                  ORDER BY dn.orden";
        $res = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    public function obtenerMesesacumular($uridatosnomenclador) {
        $uridatosnomenclador = strtolower($uridatosnomenclador);
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT dn2.uridatosnomenclador as mes
                        FROM mod_planificacion.nom_tiponomenclador tn
                             INNER JOIN mod_planificacion.nom_datosnomenclador dn
                             ON (dn.idtiponomenclador = tn.idtiponomenclador AND dn.uridatosnomenclador = '$uridatosnomenclador')
                             INNER JOIN mod_planificacion.nom_datosnomenclador dn2
                             ON (dn2.idtiponomenclador = tn.idtiponomenclador AND dn2.iddatosnomenclador <= dn.iddatosnomenclador AND dn2.uridatosnomenclador <> '-')
                        WHERE tn.uritiponomenclador = 'mes' ";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_COLUMN);
    }

    public function obtenerMesesMenorMayor($idejercicio, $iddatosnomenclador, $posteriores = false) {
        $condicion = '<=';
        if ($posteriores)
            $condicion = '>';
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT txn.iddatosnomenclador
                     FROM mod_planificacion.conf_tiempoxnomenclador txn
                         INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (dn.iddatosnomenclador = txn.iddatosnomenclador)
                         INNER JOIN mod_planificacion.nom_tiponomenclador tn ON (tn.idtiponomenclador = dn.idtiponomenclador AND tn.uritiponomenclador = 'mes')
                     WHERE txn.idejercicio = $idejercicio AND
                          txn.fechafin $condicion
                          (
                            SELECT fechafin
                            FROM mod_planificacion.conf_tiempoxnomenclador
                            WHERE iddatosnomenclador = $iddatosnomenclador AND
                                  idejercicio = $idejercicio
                          )
                     ORDER BY txn.fechafin";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_COLUMN);
    }

    public function getDatosNomOrdenados($idtiponomenclador) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT dn.iddatosnomenclador
                  FROM mod_planificacion.nom_tiponomenclador tn
                  INNER JOIN mod_planificacion.nom_datosnomenclador dn
                  ON(tn.idtiponomenclador=dn.idtiponomenclador)
                  WHERE tn.idtiponomenclador = $idtiponomenclador
                  ORDER BY dn.orden";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_COLUMN);
    }

    public function getDatosNomOrdenAlfabetico($idtiponomenclador) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT dn.iddatosnomenclador
                  FROM mod_planificacion.nom_tiponomenclador tn
                  INNER JOIN mod_planificacion.nom_datosnomenclador dn
                  ON(tn.idtiponomenclador=dn.idtiponomenclador)
                  WHERE tn.idtiponomenclador = $idtiponomenclador
                  ORDER BY dn.denominacion";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_COLUMN);
    }

    public function actualizarOrdenDatoNom($iddatosnomenclador, $orden) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "UPDATE mod_planificacion.nom_datosnomenclador
                        SET orden = $orden
                        WHERE iddatosnomenclador = $iddatosnomenclador";
        $conn->execute($sqlQuery);
    }

    //ver si esta solución se mantiene o no

    public function updateCantdescendente($cantdesc, $id) {
        $arrayParams = array();
        $arrayParams[] = $cantdesc;
        $arrayParams[] = $id;
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "UPDATE mod_planificacion.nom_datosnomenclador
        SET cantdescendente =? WHERE iddatosnomenclador =?";
        $res = $conn->execute($sqlQuery, $arrayParams);
        $res = $res->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerCantdescendenteById($id) {
        $query = new Doctrine_Query();
        $cantdesc = $query->select("ndn.cantdescendente")
                        ->from("NomDatosnomenclador ndn")
                        ->where("ndn.iddatosnomenclador=?", $id)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $cantdesc;
    }

    public function servObtenerDatosNomencladorUriTipoNomIdExcluir($uritiponomenclador, $idnomencladores) {
        $whereExcluir = "";
        if ($idnomencladores) {
            $whereExcluir = " AND
              dn.iddatosnomenclador NOT IN ($idnomencladores)";
        }
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT dn.iddatosnomenclador,
               dn.denominacion
        FROM mod_planificacion.nom_datosnomenclador dn
             INNER JOIN mod_planificacion.nom_tiponomenclador tn ON (
               dn.idtiponomenclador = tn.idtiponomenclador)
        WHERE tn.uritiponomenclador = '$uritiponomenclador' AND
              dn.valordefecto <> 1
        ";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
    }

}
