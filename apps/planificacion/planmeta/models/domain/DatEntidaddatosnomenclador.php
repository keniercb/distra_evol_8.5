<?php

class DatEntidaddatosnomenclador extends BaseDatEntidaddatosnomenclador {

    public function setUp() {
        parent::setUp();

        $this->hasOne(
                'NomDatosnomenclador', array('local' => 'iddatosnomenclador',
            'foreign' => 'iddatosnomenclador')
        );
        $this->hasMany(
                'DatPlanificacion', array('local' => 'identidaddatosnomenclador',
            'foreign' => 'idcentrobalance')
        );
        $this->hasMany(
                'DatIndicadorcentrobalance', array('local' => 'identidaddatosnomenclador',
            'foreign' => 'identidaddatosnomenclador')
        );
        $this->hasMany(
                'DatAjustedemanda', array('local' => 'identidaddatosnomenclador',
            'foreign' => 'identidaddatosnomenclador')
        );
        $this->hasMany(
                'DatPrioridadcentrobalance', array('local' => 'identidaddatosnomenclador',
            'foreign' => 'idcentrobalance')
        );
        $this->hasMany(
                'DatControldivisaindicadormodelo', array('local' => 'identidaddatosnomenclador',
            'foreign' => 'identidadautor')
        );
    }

    //Utilizado como servicio
    public function obtenerEntidadRectora() {

        $query = new Doctrine_Query();
        $rectora = 'rectorbalance';
        $res = $query->select('d.identidad')
                        ->from(' DatEntidaddatosnomenclador d  ')
                        ->innerJoin(' d.NomDatosnomenclador ndn')
                        ->where('ndn.uridatosnomenclador =?', $rectora)
                        ->execute()->toArray();

        return $res;
    }

    public function listarComportamiento($parametros, $idsentidades) {

        $addHaving = "";
        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $datos) {
                if ($datos['data']['value'] == "" && $datos['data']['value'] != 0) {
                    continue;
                }
                if ($datos['field'] == 'identidad') {
                    $idsentidades = $datos['data']['value'];
                } elseif ($datos['field'] == 'od') {
                    if ($datos['data']['value'] == 'Sí')
                        $addHaving .= "AND sum(c.od) = 1";
                    else
                        $addHaving .= " AND sum(c.od) = 0";
                }elseif ($datos['field'] == 'cb') {
                    if ($datos['data']['value'] == 'Sí')
                        $addHaving .= "AND sum(c.cb) = 1";
                    else
                        $addHaving .= " AND sum(c.cb) = 0";
                }elseif ($datos['field'] == 'ejecutor') {
                    if ($datos['data']['value'] == 'Sí')
                        $addHaving .= "AND sum(c.ejecutor) = 1";
                    else
                        $addHaving .= " AND sum(c.ejecutor) = 0";
                }elseif ($datos['field'] == 'rector') {
                    if ($datos['data']['value'] == 'Sí')
                        $addHaving .= "AND sum(c.rectorbalance) = 1";
                    else
                        $addHaving .= " AND sum(c.rectorbalance) = 0";
                }
            }
        }
        $delimitando = "";
        if ($parametros['start'] != null && $parametros['limit']) {
            $delimitando = " LIMIT {$parametros['limit']} OFFSET {$parametros['start']} ";
        }

        $conn = Doctrine_Manager::connection();

        $query = "WITH comportamiento AS (
            SELECT f.idfila as identidad,
                   f.orden,
                    case when dn.uridatosnomenclador = 'organoconsumidor' then 1
                        else 0 end as od,
                    case when dn.uridatosnomenclador = 'centrodebalance' then 1
                        else 0 end as cb,
                    case when dn.uridatosnomenclador = 'ejecutor' then 1
                        else 0 end as ejecutor,
                    case when dn.uridatosnomenclador = 'rectorbalance' then 1
                        else 0 end as rectorbalance
            FROM mod_estructuracomp.nom_filaestruc f
                 LEFT JOIN mod_planificacion.dat_entidaddatosnomenclador
                   edn ON (f.idfila = edn.identidad)
                 LEFT JOIN mod_planificacion.nom_datosnomenclador
                   dn ON edn.iddatosnomenclador = dn.iddatosnomenclador
            where f.idfila IN ($idsentidades))
       SELECT c.identidad,
                c.orden,
              CASE WHEN sum(c.od) = 1 THEN TRUE ELSE FALSE END AS od,
              CASE WHEN sum(c.cb) = 1 THEN TRUE ELSE FALSE END AS cb,
              CASE WHEN sum(c.ejecutor) = 1 THEN TRUE ELSE FALSE END AS ejecutor,
              CASE WHEN sum(c.rectorbalance) = 1 THEN TRUE ELSE FALSE END AS rector,
              COUNT(*) OVER() AS total
       FROM comportamiento c
       GROUP BY c.orden,c.identidad
       HAVING true $addHaving
       ORDER BY c.orden $delimitando";
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    public function listarComportamientoDinamico($params) {
        $addHaving = "";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['data']['value'] == "" && $datos['data']['value'] != 0) {
                    continue;
                }
                if ($datos['field'] == 'identidad') {
                    $params['idsentidades'] = $datos['data']['value'];
                } else {
                    //es una columna dinamica
                    if ($datos['data']['value'] == 'Sí')
                        $addHaving .= "AND sum(c." . $datos['field'] . ") = 1";
                    else
                        $addHaving .= "AND sum(c." . $datos['field'] . ") = 0";
                }
            }
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit']) {
            $delimitando = " LIMIT {$params['limit']} OFFSET {$params['start']} ";
        }

        $conn = Doctrine_Manager::connection();
        //trabajo con columnas dinamicas
        $selectDinamicoVentana = "";
        $selectDinamicoConsulta = "";
        foreach ($params['columnas'] as $value) {
            $selectDinamicoVentana.=",
                    case when dn.uridatosnomenclador = '$value->uridatosnomenclador' then 1
                        else 0 end as $value->uridatosnomenclador";
            $selectDinamicoConsulta.=",
              CASE WHEN sum(c.$value->uridatosnomenclador) = 1 THEN TRUE ELSE FALSE END AS $value->uridatosnomenclador";
        }
        $query = "WITH comportamiento AS (
            SELECT f.idfila as identidad,
                   f.orden
                   $selectDinamicoVentana
            FROM mod_estructuracomp.nom_filaestruc f
                 LEFT JOIN mod_planificacion.dat_entidaddatosnomenclador
                   edn ON (f.idfila = edn.identidad)
                 LEFT JOIN mod_planificacion.nom_datosnomenclador
                   dn ON edn.iddatosnomenclador = dn.iddatosnomenclador
            where f.idfila IN ({$params['idsentidades']}))
       SELECT c.identidad,
                c.orden
                $selectDinamicoConsulta,
              COUNT(*) OVER() AS total
       FROM comportamiento c
       GROUP BY c.orden,c.identidad
       HAVING true $addHaving
       ORDER BY c.orden $delimitando";
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    public function obtenerEntidadesDadoComportamiento($uri_comportamiento, $identidades = null) {
        $where = "";
        if ($identidades != null) {
            $where = " WHERE edn.identidad IN ($identidades) ";
        }
        $uri_comportamiento = strtolower($uri_comportamiento);
        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT edn.identidad
                 FROM mod_planificacion.dat_entidaddatosnomenclador edn
                      INNER JOIN mod_planificacion.nom_datosnomenclador dn ON
                        dn.iddatosnomenclador = edn.iddatosnomenclador AND lower(dn.uridatosnomenclador) ='$uri_comportamiento'
                      INNER JOIN mod_planificacion.nom_tiponomenclador tn ON tn.idtiponomenclador
                        = dn.idtiponomenclador AND tn.uritiponomenclador =
                        'comportamientodeentidad'
                $where
                 ";
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        return $res;
    }

    public function obtenerComportamiento($uri) {
        $uri = strtolower($uri);
        $conn = Doctrine_Manager::connection();
        $query = " SELECT dn.iddatosnomenclador
                    FROM mod_planificacion.nom_datosnomenclador dn
                    WHERE lower(dn.uridatosnomenclador) ='$uri'";
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        return $res;
    }

    public function cbConIndicadores($identidad) {

        $conn = Doctrine_Manager::connection();
        $query = " SELECT CASE WHEN
            (idindicadorcentrobalance IS NOT NULL OR p.idcentrobalance IS NOT NULL) THEN 1
            ELSE 0 END AS tienedatos
                   FROM mod_planificacion.dat_entidaddatosnomenclador edn
                        INNER JOIN mod_datosmaestros.dat_indicadorcentrobalance icb ON
                          icb.identidaddatosnomenclador = edn.identidaddatosnomenclador
                        INNER JOIN mod_planificacion.dat_planificacion p ON
                          edn.identidaddatosnomenclador = p.idcentrobalance
                   WHERE edn.identidad = $identidad
                   LIMIT 1";
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        return $res;
    }

    public function odConNivelesOPlan($identidad) {

        $conn = Doctrine_Manager::connection();
        $query = " SELECT CASE
                            WHEN (p.identidadmodelo IS NOT NULL OR ae.idactividadentidad IS NOT
                              NULL) THEN 1
                            ELSE 0
                          END AS tienedatos
                   FROM mod_planificacion.dat_entidaddatosnomenclador edn
                        INNER JOIN mod_planificacion.dat_entidadmodelo em ON edn.identidad =
                          em.identidad
                        INNER JOIN mod_planificacion.dat_planificacion p ON em.identidadmodelo =
                          p.identidadmodelo
                        INNER JOIN mod_planificacion.dat_actividadentidad ae ON edn.identidad =
                          ae.identidad
                   WHERE edn.identidad = $identidad
                   LIMIT 1";
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        return $res;
    }

    /* metodos viejos */

    public function getIdentidaddatosnomenclador($identidad) {
        $query = new Doctrine_Query();
        $res = $query->select('d.identidaddatosnomenclador')->from(
                        'DatEntidaddatosnomenclador d'
                )->where(
                        'd.identidad=? AND d.iddatosnomenclador=?', array($identidad, 1)
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function getEntidaddatosnomenclador($arrayComport, $params) {
        $query = new Doctrine_Query();
        $query->addWhere('true');
        $queryTotal = new Doctrine_Query();
        //$array = array();
        if (is_array($params['filtros'])) {
            $nroalias = 1;
            $arrayAliasUris['cb'] = 'centrodebalance';
            $arrayAliasUris['oc'] = 'organoconsumidor';
            $arrayAliasUris['oe'] = 'ejecutor';
            $arrayAliasUris['rector'] = 'rectorbalance';
            $arrayAliasUris['rectorniveles'] = 'órganorectordeniveles';
            //$WHERE = "";
            $and = "";
            foreach ($params['filtros'] as $datos) {

                if ($datos ['field'] == 'denominacion') {

                    $integrator = ZendExt_IoC::getInstance();
                    $arrayIdsSentidadDos = Array();
                    $arrayIdsSentidad = $integrator->metadatos->obtenerEstructurasFiltroDenom(
                            $params['iddominio'], $datos ['data'] ['value']
                    );

                    if ($arrayIdsSentidad[0] != null) {
                        if (count($arrayIdsSentidad) != 0) {
                            foreach ($arrayIdsSentidad as $indice => $val) {
                                $arrayIdsSentidadDos[] = $val['idfila'];
                                unset($arrayIdsSentidad[$indice]);
                            }

                            $strIdsents = implode(",", $arrayIdsSentidadDos);
                        } else {
                            $strIdsents = '0';
                        }

                        $query->addWhere("d.identidad IN ({$strIdsents}) ");

                        $queryTotal->addWhere(
                                "d.identidad in ({$strIdsents}) "
                        );
                        $and = "AND";
                    } else {
                        return array();
                    }
                } elseif ($datos ['field'] == 'cb' || $datos ['field'] == 'oc' || $datos ['field'] == 'oe' || $datos ['field'] == 'rector' || $datos ['field'] == 'rectorniveles'
                ) {

                    $iddn = $arrayComport[$arrayAliasUris[$datos ['field']]];

                    $alias = $datos ['field'] . $nroalias;
                    $nroalias++;
                    $cond = " IS NULL ";
                    if ($datos ['data'] ['value'] == 'Sí') {
                        $cond = "IS NOT NULL";
                    }
                    $query->addWhere(
                            "( (SELECT {$alias}.iddatosnomenclador FROM DatEntidaddatosnomenclador {$alias}
                         WHERE {$alias}.identidad = d.identidad and {$alias}.iddatosnomenclador = {$iddn}) {$cond} )"
                    );
                    $queryTotal->addWhere(
                            "( (SELECT {$alias}.iddatosnomenclador FROM DatEntidaddatosnomenclador {$alias}
                         WHERE {$alias}.identidad = d.identidad and {$alias}.iddatosnomenclador = {$iddn}) {$cond} )"
                    );
                }
            }
        }

        $query->addSelect('d.identidad as identidad')->distinct();
        $query->addSelect(
                '(SELECT cb.iddatosnomenclador FROM DatEntidaddatosnomenclador cb WHERE cb.identidad = d.identidad
            AND cb.iddatosnomenclador = ? ) as cb'
        );
        $query->addSelect(
                '(SELECT oc.iddatosnomenclador FROM DatEntidaddatosnomenclador oc WHERE oc.identidad = d.identidad
             AND oc.iddatosnomenclador = ? ) as oc'
        );
        $query->addSelect(
                '(SELECT oe.iddatosnomenclador FROM DatEntidaddatosnomenclador oe WHERE oe.identidad = d.identidad
            AND oe.iddatosnomenclador = ? ) as oe'
        );
        $query->addSelect(
                '(SELECT rector.iddatosnomenclador FROM DatEntidaddatosnomenclador rector
            WHERE rector.identidad = d.identidad AND rector.iddatosnomenclador = ? ) as rector'
        );
        $query->from('DatEntidaddatosnomenclador d');
        $where = '';
        if ($strIdsents != null) {
            $where = "";
        } else {
            $where = " AND d.identidad IN ({$params['entidades']})";
        }

        $conn = Doctrine_Manager::connection();
        $sql = $query->getSqlQuery() . " $where ORDER BY d.identidad OFFSET ? LIMIT ?";

        $data->data = $conn->execute(
                $sql, array(
            $arrayComport['Centrodebalance'],
            $arrayComport['organoconsumidor'],
            $arrayComport['ejecutor'],
            $arrayComport['rectorbalance'],
            $params['start'],
            $params['limit'])
        );
        $data->data = $data->data->fetchAll(PDO::FETCH_ASSOC);
        $queryTotal->select('COUNT(DISTINCT (d.identidad)) as total');
        $queryTotal->from('DatEntidaddatosnomenclador d');
        $queryTotal->addWhere("d.identidad IN ({$params['entidades']})");

        $data->total = $conn->execute($queryTotal->getSqlQuery());
        $data->total = $data->total->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total[0]['d__0'];
        return $data;
    }

    public function getEntidadDadoIdDatos($identidaddatosnomenclador) {
        $query = new Doctrine_Query();
        $res = $query->select('d.identidad')->from(
                        'DatEntidaddatosnomenclador d'
                )->where(
                        'd.identidaddatosnomenclador=?', $identidaddatosnomenclador
                )->execute()->toArray();
        return $res;
    }

    public function getEntidadesOrganosDemandantesDadoArr($entidades) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT edn.identidad
                    FROM mod_planificacion.dat_entidaddatosnomenclador edn
                    INNER JOIN mod_planificacion.nom_datosnomenclador dn
                    ON edn.iddatosnomenclador=dn.iddatosnomenclador
                    where edn.identidad IN ($entidades)AND dn.uridatosnomenclador='organoconsumidor'";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    public function getEntidadesComportamiento($entidades, $comportamiento) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT edn.identidad
                    FROM mod_planificacion.dat_entidaddatosnomenclador edn
                    INNER JOIN mod_planificacion.nom_datosnomenclador dn
                    ON edn.iddatosnomenclador=dn.iddatosnomenclador
                    where edn.identidad IN ($entidades)AND dn.uridatosnomenclador='$comportamiento'";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    public function getEntidadDadoComportamiento($idcomportamiento) {
        $query = new Doctrine_Query();
        $res = $query->select('d.identidad')->from(
                        'DatEntidaddatosnomenclador d'
                )->where(
                        'd.iddatosnomenclador=?', $idcomportamiento
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function getComportamientoDadoEntidad($identidad) {
        $query = new Doctrine_Query();
        $res = $query->select('d.identidad, d.iddatosnomenclador')->from(
                        'DatEntidaddatosnomenclador d'
                )->where(
                        'd.identidad=?', $identidad
                )->execute()->toArray();
        return $res;
    }

    public function getComport($identidad) {
        $query = new Doctrine_Query();
        $res = $query->select('d.iddatosnomenclador')->from(
                        'DatEntidaddatosnomenclador d'
                )->where(
                        'd.identidad=?', $identidad
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function getEntidadesDadoIdPadre($idpadre) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT distinct entdanom.identidad, entdanom.identidaddatosnomenclador
                    FROM mod_datosmaestros.dat_indicadorcentrobalance incbl
                    INNER JOIN mod_planificacion.dat_entidaddatosnomenclador  entdanom
                    ON incbl.identidaddatosnomenclador = entdanom.identidaddatosnomenclador
                    WHERE incbl.idindicador = ?";
        $data = $conn->execute($query, array($idpadre))->fetchAll(
                PDO::FETCH_ASSOC
        );
        return $data;
    }

    public function IdEntidadExiste($identidad) {
        $query = new Doctrine_Query();
        $res = $query->select('d.identidad')->from(
                                'DatEntidaddatosnomenclador d'
                        )->where('d.identidad=?', $identidad)
                        ->execute()->toArray();

        if ($res[0] != null) {
            return true;
        } else {
            return false;
        }
    }

    //Obtiene el comportamiento de la entidad
    public function getIddatosnomenclador($identidad) {
        $query = new Doctrine_Query();
        $res = $query->select('d.iddatosnomenclador')->from(
                        'DatEntidaddatosnomenclador d'
                )->where(
                        'd.identidad=? ', array($identidad)
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    //SE OBTIENE UN ARREGLO CON LAS ENTIDADES QUE SON SOLAMENTE ORGANOS DEMANDANTES
    public function getEntDatNom($identidad) {
        $query = new Doctrine_Query();
        $res = $query->select('d.identidaddatosnomenclador')->from(
                        'DatEntidaddatosnomenclador d'
                )->where(
                        'd.identidad=? AND d.iddatosnomenclador=?', array($identidad, 2)
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function getTodosLosOrganosDemandantes() {
        $query = new Doctrine_Query();
        $res = $query->select('d.identidad')->from(
                        'DatEntidaddatosnomenclador d'
                )->where(
                        ' d.iddatosnomenclador=?', 2
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        foreach ($res as $key => $value) {
            $arreglo [$key] = $value['identidad'];
        }
        return $arreglo;
    }

    public function getCB() {
        $query = new Doctrine_Query();
        $res = $query->from('DatEntidaddatosnomenclador d')->where(
                        'd.iddatosnomenclador=?', 1
                )->setHydrationMode(
                        Doctrine::HYDRATE_ARRAY
                )->execute();
        return $res;
    }

    public function getCB1($identidad) {
        $query = new Doctrine_Query();
        $res = $query->from('DatEntidaddatosnomenclador d')->where(
                        'd.iddatosnomenclador=? And d.identidad=?', array(1, $identidad)
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function getOD() {
        $query = new Doctrine_Query();
        $res = $query->from('DatEntidaddatosnomenclador d')->where(
                        'd.iddatosnomenclador=?', 2
                )->setHydrationMode(
                        Doctrine::HYDRATE_ARRAY
                )->execute();
        return $res;
    }

    public function getIdDatosNom($identidad) {
        $query = new Doctrine_Query();
        $res = $query->select('d.identidaddatosnomenclador')
                        ->from('DatEntidaddatosnomenclador d')
                        ->where(
                                'd.identidad =? AND d.iddatosnomenclador=?', array($identidad, 1)
                        )
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return $res;
    }

    //Utilizado como servicio
    public function getCentrosDeBalance($arridentidad) {
        $query = new Doctrine_Query();
        $res = $query->select('d.identidad,d.identidaddatosnomenclador')
                ->from('DatEntidaddatosnomenclador d')
                ->whereIn('d.identidad', $arridentidad)
                ->addwhere(' d.iddatosnomenclador=?', 1)
                ->fetchArray();

        return $res;
    }

    public function getIdsDatosNomemclador($identidad) {
        $query = new Doctrine_Query();
        $res = $query->select('d.identidaddatosnomenclador, d.identidad')
                        ->from('DatEntidaddatosnomenclador d')
                        ->where('d.iddatosnomenclador=?', array(1))
                        ->whereIn('d.identidad', $identidad)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function obtenerOrgDemDadoArrEnt($identidades) {

        $conn = Doctrine_Manager::connection();
        $query = "SELECT identidad,
       estruct.denominacion
FROM mod_planificacion.dat_entidaddatosnomenclador d
     INNER JOIN mod_estructuracomp.nom_filaestruc f ON f.idfila = d.identidad
     INNER JOIN
     (
       select e.idestructura,
              e.denominacion,
              e.idproyecto
       from mod_estructuracomp.dat_estructura e
       union
       select eop.idestructuraop as idestructura,
              eop.denominacion,
              eop.idproyecto
       from mod_estructuracomp.dat_estructuraop eop
     ) estruct ON f.idfila = estruct.idestructura
WHERE d.iddatosnomenclador = 2 AND
      d.identidad IN ($identidades)
      AND
      estruct.idproyecto = 0";
        $data = $conn->execute($query)->fetchAll(
                PDO::FETCH_ASSOC
        );
        return $data;
    }

    public function getIdEntidadDadoIdDatoNom($identidaddatosnom) {
        $query = new Doctrine_Query();
        $res = $query->select('d.identidad')
                        ->from('DatEntidaddatosnomenclador d')
                        ->where('d.identidaddatosnomenclador=?', $identidaddatosnom)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function getIdDatosNomOD($identidad) {
        $query = new Doctrine_Query();
        $res = $query->select('d.identidaddatosnomenclador')
                        ->from('DatEntidaddatosnomenclador d')
                        ->where(
                                'd.identidad =? AND d.iddatosnomenclador=?', array($identidad, 2)
                        )
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function ExisteCompRector($iddatosnomenclador) {
        $query = new Doctrine_Query();
        $res = $query->select('d.identidad')->from(
                        'DatEntidaddatosnomenclador d'
                )->where(
                        ' d.iddatosnomenclador=?', array($iddatosnomenclador)
                )->execute()->toArray();
        if ($res) {
            return true;
        } else {
            return false;
        }
    }

    public function obtenerEntidades($identidad) {
        $query = new Doctrine_Query();
        $res = $query->select('d.identidaddatosnomenclador')->from(
                        'DatEntidaddatosnomenclador d'
                )->where(
                        'd.iddatosnomenclador = ? AND d.identidad = ?', array(1, $identidad)
                )->execute()->toArray();

        return $res;
    }

    public function getEntidadesCentrosDeBalanceRectorBalance() {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT identidad
                    FROM mod_planificacion.dat_entidaddatosnomenclador d
                    INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (d.iddatosnomenclador=dn.iddatosnomenclador)
                    WHERE  dn.uridatosnomenclador='centrodebalance' OR dn.uridatosnomenclador='rectorbalance' order by dn.uridatosnomenclador DESC";
        $data = $conn->execute($query)->fetchAll(
                PDO::FETCH_COLUMN
        );
        return $data;
    }

    /* metodos viejos */

    /*     * *
     * funcion que dado un id me dice si es centro balance o rector o algo mas
     * @param $identidad
     * @return mixed
     */

    public function getIdEntidadByIdNomen($idEntidad) {
        $query = new Doctrine_Query();
        $res = "SELECT
              entdatnom.iddatosnomenclador,
              entdatnom.identidaddatosnomenclador,
              dn.uridatosnomenclador
            FROM
              mod_planificacion.dat_entidaddatosnomenclador entdatnom
              inner join mod_planificacion.nom_datosnomenclador dn on(dn.iddatosnomenclador=entdatnom.iddatosnomenclador)
              where entdatnom.identidad= {$idEntidad}";

        $data = $query->execute($res)->fetchAll(PDO::FETCH_ASSOC);

        $cb = false;

        if (count($data) > 0) {
            foreach ($data as $resultado) {
                if ($data[0]['uridatosnomenclador'] == 'rectorbalance') {
                    return 1;
                }
                if ($resultado['uridatosnomenclador'] == 'centrodebalance') {
                    $cb = $resultado['identidaddatosnomenclador'];
                }
            }
            if ($cb)
                return $cb;
            else
                return 0;
        }
    }

    public function obtenerEntDadoCompArrayEnt($identidades, $comp) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT d.identidad
FROM mod_planificacion.dat_entidaddatosnomenclador d
INNER JOIN mod_planificacion.nom_datosnomenclador dn
ON(dn.iddatosnomenclador=d.iddatosnomenclador and dn.uridatosnomenclador='$comp')
WHERE  d.identidad IN ($identidades)";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    public function getComportamientoRector($entidades) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT edn.identidad
                    FROM mod_planificacion.dat_entidaddatosnomenclador edn
                    INNER JOIN mod_planificacion.nom_datosnomenclador dn
                    ON (edn.iddatosnomenclador=dn.iddatosnomenclador)
                    where edn.identidad IN ($entidades)AND dn.uridatosnomenclador='rectorbalance'";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    public function getComportamientoClienteProductor($params) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT d.identidad,
                    d.iddatosnomenclador
                    FROM mod_planificacion.dat_entidaddatosnomenclador d
                    WHERE d.identidad = {$params['identidad']}";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}
