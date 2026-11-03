<?php

class NomTipomodelo extends BaseNomTipomodelo {

    public function setUp() {
        parent::setUp();
        $this->hasMany(
                'DatModelo', array('local' => 'idtipomodelo', 'foreign' => 'idtipomodelo')
        );
        $this->hasMany(
                'NomTipomodelocolumna', array('local' => 'idtipomodelo', 'foreign' => 'idtipomodelo')
        );
        $this->hasMany(
                'DatTipomodelodesglose', array('local' => 'idtipomodelo', 'foreign' => 'idtipomodelo')
        );
        $this->hasMany(
                'DatConfModelosMetadatos', array('local' => 'idmodelosmetadatos',
            'foreign' => 'idmodelosmetadatos')
        );
        $this->hasMany(
                'DatConfModelosMetadatos', array('local' => 'idmodelosmetadatos',
            'foreign' => 'idmodelosmetadatos')
        );
    }

    public function listarTablasExistenxNegocio(
    ) {
        $conn = Doctrine_Manager::connection();
        $queryTablas = "SELECT r.tabla
                        FROM ((
                                SELECT EXISTS (
                                                SELECT 1
                                                FROM information_schema.tables
                                                WHERE table_schema = 'mod_planificacion' AND
                                                      table_name = 'dat_modelo'
                                       ),
                                       'planificacion'               as tabla
                             )
                        UNION (
                                SELECT EXISTS (
                                                SELECT 1
                                                FROM information_schema.tables
                                                WHERE table_schema = 'mod_planifinversiones' AND
                                                      table_name = 'dat_elementotipomodelo'
                                       ),
                                       'inversiones'               as tabla
                              )
                        UNION (
                                SELECT EXISTS (
                                                SELECT 1
                                                FROM information_schema.tables
                                                WHERE table_schema = 'mod_spouam' AND
                                                      table_name = 'dat_variablecontrolentidad'
                                       ),
                                       'prodinfraestructura'               as tabla
                              )
                        UNION (
                                SELECT EXISTS (
                                                SELECT 1
                                                FROM information_schema.tables
                                                WHERE table_schema = 'mod_spouam' AND
                                                      table_name = 'dat_cartatecnologica'
                                       ),
                                       'prodcarta'               as tabla
                              )
                        ) r
                        WHERE r.EXISTS = 'true'";
        $tablas = $conn->execute($queryTablas)->fetchAll(PDO::FETCH_COLUMN);
        return $tablas;
    }

    public function listarTiposModeloNegocio($parametros, $start, $limit
    ) {
        $ADDWHERE = "WHERE TRUE";
        $HAVING = "";
        $when = "";
        if (is_array($parametros)) {
            foreach ($parametros as $param) {
                
                if ($param['field'] == 'codigo') {
                    $value = $param['data']['value'];
                    $ADDWHERE .= " AND upper(r.codigo) LIKE " . "'"
                            . '%' . strtoupper($value) . '%' . "'";
                } elseif ($param['field'] == 'idusuario') {
                    $ADDWHERE .= " AND r.idusuario ={$param['data']['value']}";
                } elseif ($param ['field'] == 'fecha') {
                    $fecha = explode('/', $param ['data']['value']);
                    $fecha = $fecha[1] . '/' . $fecha[0] . '/' . $fecha[2];
                    if ($param['data']['comparison'] == 'lt') {
                        $ADDWHERE .= "AND r.fecha::date<'{$fecha}'";
                    }
                    if ($param['data']['comparison'] == 'gt') {
                        $ADDWHERE .= "AND r.fecha::date>'{$fecha}'";
                    }
                    if ($param['data']['comparison'] == 'eq') {
                        $ADDWHERE .= "AND r.fecha::date='{$fecha}'";
                    }
                } else {
                    if ($param['field'] == 'denominacion') {
                        $value = $param['data']['value'];
                        $ADDWHERE .= " AND upper(r.denominacion) LIKE "
                                . "'"
                                . '%' . strtoupper($value) . '%' . "'";
                    } else {
                        if ($param['field'] == 'descripcion') {
                            $value = $param['data']['value'];
                            $ADDWHERE .= " AND upper(r.descripcion) LIKE "
                                    . "'"
                                    . '%' . strtoupper($value) . '%' . "'";
                        } else {
                            if ($param['field'] == 'negocio') {
                                $value = $param['data']['value'];
                                $ADDWHERE .= " AND r.idmodelosmetadatos = $value";
                            } else {
                                if ($param['field'] == 'asociado') {
                                    $value = $param['data']['value'];
                                    if ($value != '-') {
                                        $ADDWHERE .= " AND r.asociado = $value";
                                    } else {
                                        $ADDWHERE .= " AND r.asociado is null";
                                    }
                                } else {
                                    if ($param['field'] == 'idaprobacion') {
                                        $value = $param['data']['value'];
                                        if ($value == 'true') {

                                            $ADDWHERE .= " AND (r.idaprobacion = 3 or r.idaprobacion = 4)";
                                        } else {
                                            $ADDWHERE .= " AND (r.idaprobacion = 1 or r.idaprobacion = 2)";
                                        }
                                    } else {
                                        if ($param['field'] == 'uso') {
                                            $value = $param['data']['value'];
                                            if ($value == 'true') {
                                                $ADDWHERE .= " AND coalesce(r.uso, 0) = 1 ";
                                            } else {
                                                $ADDWHERE .= " AND coalesce(r.uso, 0) = 0 ";
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
       
        $conn = Doctrine_Manager::connection();
        $tablas = self::listarTablasExistenxNegocio();
        if (in_array('planificacion', $tablas)) {
            $when = " WHEN cmm.tabla = 'dat_planificacion' THEN coalesce((
                                                                       SELECT DISTINCT 1 as uso
                                                                       from mod_planificacion.dat_modelo m
                                                                       WHERE m.idtipomodelo = tm.idtipomodelo
                ), 0)";
        }
        if (in_array('inversiones', $tablas)) {

            $when = $when . "WHEN cmm.tabla = 'dat_elementotipomodelovalor' THEN coalesce((
                                                                                 SELECT DISTINCT 1 as uso
                                                                                 from mod_planifinversiones.dat_elementotipomodelo m
                                                                                 WHERE m.idtipomodelo = tm.idtipomodelo
                ), 0)";
        }
        if (in_array('prodinfraestructura', $tablas)) {

            $when = $when . " WHEN cmm.tabla = 'dat_variablecontrolentidad' THEN coalesce((
                                                                                SELECT DISTINCT 1 as uso
                                                                                from mod_spouam.dat_variablecontrol m
                                                                                WHERE m.idtipomodelo = tm.idtipomodelo
                ), 0)";
        }
        if (in_array('prodcarta', $tablas)) {

            $when = $when . " WHEN cmm.tabla = 'dat_cartatecnologica' THEN coalesce((
                                                                          SELECT DISTINCT 1 as uso
                                                                          from mod_spouam.dat_cartatecnologica m
                                                                          WHERE m.idtipomodelo = tm.idtipomodelo
                ), 0)";
        }
        $sql = "SELECT r.idtipomodelo,
                        r.descripcion,
                        r.idtabla,
                        r.denominacion,
                        r.idaprobacion,
                        r.codigo,
                        r.idmodelosmetadatos,
                        r.negocio,
                        r.uso,
                        r.asociado,
                        r.idusuario,
                        r.fecha,
                        count(*) OVER() AS total
                from (
                       SELECT DISTINCT tm.idtipomodelo,
                              tm.descripcion,
                              tm.idtabla,
                              tm.denominacion,
                              tm.idaprobacion,
                              tm.codigo,
                              tm.idmodelosmetadatos,
                              cmm.denominacion as negocio,
                              CASE
                               $when
                              END AS uso,
                              de.denominacion as asociado, 
                              tm.idusuario,
                              tm.fecha
                       from mod_planificacion.nom_tipomodelo tm
                            INNER join mod_planificacion.conf_modelosmetadatos cmm on (tm.idmodelosmetadatos = cmm.idmodelosmetadatos)
                            LEFT JOIN mod_planificacion.dat_tipomodelodesglose tmd ON (tm.idtipomodelo = tmd.idtipomodelo)
                            LEFT JOIN mod_planificacion.dat_desglose de ON (tmd.iddesglose = de.iddesglose)
                     ) r
                  $ADDWHERE
                order by r.codigo  
                limit $limit offset $start";
        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];

        return $data;
    }

    public function eliminar($idtipomodelo) {
        $conn = Doctrine_Manager::connection();

        $sql_query = "DELETE FROM
  mod_planificacion.nom_tipomodelo WHERE idtipomodelo = $idtipomodelo;";
        $conn->execute($sql_query);
        return true;
    }

    public function GetLLave($conn) {
        return $conn->fetchOne(
                        "SELECT NEXTVAL('mod_planificacion.sec_tipomodelo_seq')"
        );
    }

    //Servicio que devuelve los modelos que corresponden con el negocio especificado
    public function servicioObtenerTipoModelo($negocio = false, $aprobado = false) {
        $where = "";
        $whereaprob = "";
        if ($negocio == false) {
            $where = " AND (nom.idmodelosmetadatos IS NULL OR conf.tabla = 'dat_planificacion')";
        } else {
            $where = " AND (conf.tabla = '{$negocio}')";
        }
        if ($aprobado == true)
            $whereaprob = "AND nom.idaprobacion = 3";

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT nom.idtipomodelo,nom.denominacion
                FROM mod_planificacion.nom_tipomodelo nom
                LEFT JOIN mod_planificacion.conf_modelosmetadatos conf ON (nom.idmodelosmetadatos = conf.idmodelosmetadatos)
                WHERE true $where $whereaprob";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Metodo para saber si el TM tiene columnas nomencladas
    public function tieneColumnasNomencladas($idtipomodelo) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT count(tmc.idtiponomenclador) AS cant
                    FROM mod_planificacion.nom_tipomodelo tm
                    INNER JOIN mod_planificacion.nom_tipomodelocolumna tmc ON (tm.idtipomodelo
                           = tmc.idtipomodelo)
                    WHERE tm.idtipomodelo = $idtipomodelo";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        if ($data[0] > 0) {
            return 1;
        } else {
            return 0;
        }
    }

    public function validarCodigo($codigo, $idtipomodelo) {
        $query = Doctrine_Query::create();
        if ($idtipomodelo) {
            return $query->from('NomTipomodelo n')
                            ->where(
                                    'n.codigo = ? AND n.idtipomodelo != ?', array($codigo, $idtipomodelo)
                            )->count();
        } else {
            return $query->from('NomTipomodelo n')
                            ->where('n.codigo = ?', $codigo)
                            ->count();
        }
    }

    public function Buscar($idtipomodelo) {
        $query = Doctrine_Query::create();
        return $query->from('NomTipomodelo n')
                        ->where('n.idtipomodelo = ?', $idtipomodelo)
                        ->execute()
                        ->toArray();
    }

    public function getIdTablaDadoIdTipoModelo($idtipomodelo) {
        $query = new Doctrine_Query();
        $res = $query->select('m.idtabla')
                ->from('NomTipomodelo m')
                ->where('m.idtipomodelo =?', $idtipomodelo)
                ->execute()
                ->toArray();
        return $res;
    }

    //Utilizado como servicio
    public function getDenominacionDadoIdTipoModelo($idtipomodelo) {
        $query = new Doctrine_Query();
        $res = $query->select('m.denominacion')
                ->from('NomTipomodelo m')
                ->where('m.idtipomodelo =?', $idtipomodelo)
                ->execute()
                ->toArray();
        return $res;
    }

    public function getIdTablaEncabezadoDadoIdTipoModelo($idtipomodelo) {
        $query = new Doctrine_Query();
        $res = $query->select('m.idtablaencabezado,m.idtabla')//->select('m.idtablaencabezado')
                ->from('NomTipomodelo m')
                ->where('m.idtipomodelo =?', $idtipomodelo)
                ->execute()
                ->toArray();
        return $res;
    }

    public function ObtenerIdTipoModelo($idmodelo) {
        $query = new Doctrine_Query();
        $res = $query->select('m.idtipomodelo, m.idtabla,m.codigo')
                ->from('NomTipoModelo m,m.DatModelo d')
                ->where('d.idmodelo =?', $idmodelo)
                ->execute()
                ->toArray();
        return $res;
    }

    public function ObtenerIdTipoModeloYDenominacion() {
        $query = new Doctrine_Query();
        $res = $query->select('m.idtipomodelo, m.denominacion')
                ->from('NomTipoModelo m')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $res;
    }

    public function aprobarDesaprobar($idtipomodelo, $idaprobacion) {
        $hojas = Doctrine::getTable('NomTipomodelo')->find($idtipomodelo);
        $hojas->idaprobacion = $idaprobacion;
        $hojas->save();
        return true;
    }

    public function aprobacionTipomodelo($idtipomodelo) {
        $query = new Doctrine_Query();

        $idaprob = $query->select('n.idaprobacion')
                ->from('NomTipomodelo n')
                ->where('n.idtipomodelo= ?', $idtipomodelo)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $idaprob[0][idaprobacion];
    }

    public function listarNegocio() {
        $where = "";
        $conn = Doctrine_Manager::connection();
        $tablas = self::listarTablasExistenxNegocio();
        if (in_array('planificacion', $tablas)) {
            if ($where == '') {
                $where = "WHERE con.tabla = 'dat_planificacion'";
            } else {
                $where = $where . " OR con.tabla = 'dat_planificacion'";
            }
        }
        if (in_array('inversiones', $tablas)) {
            if ($where == '') {
                $where = "WHERE con.tabla = 'dat_elementotipomodelovalor'";
            } else {
                $where = $where . " OR con.tabla = 'dat_elementotipomodelovalor'";
            }
        }
        if (in_array('prodinfraestructura', $tablas)) {
            if ($where == '') {
                $where = "WHERE con.tabla = 'dat_variablecontrolentidad'";
            } else {
                $where = $where . " OR con.tabla = 'dat_variablecontrolentidad'";
            }
        }
        if (in_array('prodcarta', $tablas)) {
            if ($where == '') {
                $where = "WHERE con.tabla = 'dat_cartatecnologica'";
            } else {
                $where = $where . " OR con.tabla = 'dat_cartatecnologica'";
            }
        }
        $sql = "Select  con.denominacion ,con.idmodelosmetadatos
                     From  mod_planificacion.conf_modelosmetadatos con 
               $where
               order by con.idmodelosmetadatos ";
        $data['data'] = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarNegocioA($idmodelosmetadatos) {

        $conn = Doctrine_Manager::connection();
        $sql = "Select  con.tabla ,con.esquema,con.denominacion ,con.idmodelosmetadatos
                     From  mod_planificacion.conf_modelosmetadatos con 
                      Where con.idmodelosmetadatos= $idmodelosmetadatos ";
        $data['data'] = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function dameIdtabla($idmodelo) {
        $conn = Doctrine_Manager::connection();
        $query = "select tm.idtabla
		from mod_planificacion.nom_tipomodelo tm 
		inner join mod_planificacion.dat_modelo m on (tm.idtipomodelo=m.idtipomodelo) 
		where m.idmodelo= {$idmodelo}";
        $result = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function listarDesglosesAsociar($arridtiponomenclador, $cant) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT dt.iddesglose
                FROM mod_planificacion.dat_desglosetiponomenclador dt
                INNER JOIN  mod_planificacion.dat_desglose d ON dt.iddesglose=d.iddesglose
                WHERE dt.idtiponomenclador IN ($arridtiponomenclador)
                AND dt.iddesglose NOT IN (
                                           SELECT DISTINCT dt1.iddesglose 
                                           FROM mod_planificacion.dat_desglosetiponomenclador dt1
                                           WHERE dt1.idtiponomenclador NOT IN ($arridtiponomenclador))
                GROUP BY dt.iddesglose,d.denominacion
                HAVING max(dt.orden)=$cant ";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    public function listarDesglosesTodos() {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT dt.iddesglose as idconfdesglose, d.denominacion
                FROM mod_planificacion.dat_desglosetiponomenclador dt
                INNER JOIN  mod_planificacion.dat_desglose d ON dt.iddesglose=d.iddesglose  ";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function cantColmnasNomencladas($idtipomodelo) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT count(tmc.idtipomodelocolumna)
FROM mod_planificacion.nom_tipomodelo tm
     inner join mod_planificacion.nom_tipomodelocolumna tmc ON (tm.idtipomodelo
       = tmc.idtipomodelo)
WHERE tmc.idtiponomenclador IS NOT NULL AND
      tmc.idtipomodelo = $idtipomodelo ";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    public function getColmnasNomencladas($idtipomodelo) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT tmc.idtiponomenclador
FROM  mod_planificacion.nom_tipomodelocolumna tmc
WHERE tmc.idtiponomenclador IS NOT NULL AND
      tmc.idtipomodelo = $idtipomodelo ";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    public function asociarDesglose($idtipomodelo, $iddesglose) {
        $query = "INSERT INTO mod_planificacion.dat_tipomodelodesglose(idtipomodelo, iddesglose)
             VALUES ($idtipomodelo, $iddesglose);";
        $conn = Doctrine_Manager::connection();
        $conn->execute($query);
    }

    public function desasociarDesglose($idtipomodelo) {
        $query = "DELETE from mod_planificacion.dat_tipomodelodesglose
        WHERE idtipomodelo = $idtipomodelo";
        $conn = Doctrine_Manager::connection();
        $conn->execute($query);
    }

    public function getColumnasDinamicasSegunModelo($idmodelo) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT co.etiqueta
      FROM mod_metadata.dat_componente co
      INNER JOIN mod_metadata.dat_campo c ON co.idcampo = c.idcampo
      INNER JOIN mod_metadata.dat_tabla t ON c.idtabla = t.idtabla
      INNER JOIN mod_planificacion.nom_tipomodelo tm ON tm.idtabla = t.idtabla
      INNER JOIN mod_planificacion.dat_modelo m On tm.idtipomodelo = m.idtipomodelo
      WHERE m.idmodelo = $idmodelo ";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}
