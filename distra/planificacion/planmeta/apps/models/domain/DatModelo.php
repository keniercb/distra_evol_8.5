<?php

class DatModelo extends BaseDatModelo {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'NomTipomodelo', array('local' => 'idtipomodelo', 'foreign' => 'idtipomodelo')
        );
        $this->hasOne(
                'DatPlan', array('local' => 'idplan', 'foreign' => 'idplan')
        );
        $this->hasMany(
                'DatPlanificacion', array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
        $this->hasMany(
                'DatEntidadmodelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
        $this->hasMany(
                'DatActividadmodelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
        $this->hasMany(
                'DatModeloclasifmodelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
        $this->hasMany(
                'DatModelodatosnomenclador', array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
        $this->hasMany(
                'DatIndicadormodelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
        $this->hasMany(
                'DatAjusteexistenciaod', array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
        $this->hasMany(
                'DatAjusteexistenciacb', array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
        $this->hasMany(
                'DatBasescalculo', array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
        $this->hasMany(
                'DatBasescalculosalida', array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
    }

    public function obtenerPlanesDadoEntidaddql($identidades) {
        $query = Doctrine_Query::create();
        $query->select('e.identidad')
                ->from('DatEntidadmodelo e')
                ->innerJoin('e.DatModelo modelo')
                ->whereIn('e.identidad', $identidades);
        return $query->execute()->toArray(true);
    }

    public function obtenerModelosDadoEntidades($identidades) {
        $query = Doctrine_Query::create();
        $query->select('m.idmodelo')
                ->from('DatModelo m')
                ->innerJoin('m.DatEntidadmodelo e')
                ->whereIn('e.identidad', $identidades);
        return $query->execute()->toArray(true);
    }

    //Utilizado como servicio
    public function obtenerPlanesDadoEntidad($identidades, $filtro) {
        //$identidades=0;
        $cadenawhere = "";
        //$cadenastartlimit = "";
        $cadenawhereDos = "";


        if (count($filtro) != 0) {
            foreach ($filtro as $value) {
                if ($value['tipo'] == 'denelemento') {
                    $cadenawhereDos .= "AND dat_modelo.denominacion LIKE '%"
                            . $filtro['valor'] . "%'";
                }
            }
        }

        if (count($identidades) != 0) {
            $array = implode(',', $identidades);

            $cadenawhere .= "AND dat_entidadmodelo.identidad   IN " . '(' . $array . ')' . " ";
        }

        $consulta = "SELECT
                  DISTINCT dat_modelo.idmodelo,
                  dat_modelo.denominacion,
                  dat_entidadmodelo.identidad
                FROM
                  mod_planificacion.dat_modelo
                 Inner JOIN  mod_planificacion.dat_entidadmodelo ON dat_modelo.idmodelo = dat_entidadmodelo.idmodelo
              WHERE true " . $cadenawhere . $cadenawhereDos;

        $connDos = Doctrine_Manager:: connection();

        $res = $connDos->execute($consulta);
        $result = $res->fetchAll();


        return $result;
    }

    public function obtenerIdsModelosBaseCalculo($identidad) {
        $integrator = ZendExt_IoC::getInstance();
        $query = Doctrine_Query::create();
        $query->select(
                        'calculo.idmodelo as id, calculo.idejercicio as idejercicio'
                )
                ->distinct()
                ->from('DatBasescalculo calculo')
                ->where(
                        'calculo.idmodelo is not null and calculo.identidad = ?', $identidad
                )
                ->where(
                        'calculo.idmodelo is not null and calculo.identidad = ?', $identidad
                )
                ->setHydrationMode(Doctrine::HYDRATE_NONE);
        $res = $query->execute();
        return $res;
    }

    public function obtenerIdsModelosBase($identidad, $idejercicio) {
        $integrator = ZendExt_IoC::getInstance();

        $ids[] = $identidad;

        $ids = implode(',', $ids);
        if (empty($ids)) {
            $ids = '-1';
        }
        $query = Doctrine_Query::create();
        $query->select('calculo.idmodelo as id')
                ->distinct()
                ->from('DatBasescalculo calculo')
                ->innerJoin("calculo.DatEntidadmodelo em WITH em.identidad = ?", $identidad)
                ->where('calculo.idmodelo is not null ')
                ->andWhere('calculo.identidad = ?', $identidad)
                ->andWhere('calculo.idejercicio = ?', $idejercicio)
                ->setHydrationMode(Doctrine::HYDRATE_NONE);
        $res = $query
                ->execute();
        return $res;
    }

    public function listarPlanesBaseCalculo($identidad) {
        $idsmodelos = self::obtenerIdsModelosBaseCalculo($identidad);
        if (!empty($idsmodelos)) {
            $arr = array();
            foreach ($idsmodelos as $re) {
                array_push($arr, $re['0']);
            }
            $query = Doctrine_Query::create();
            $query->select(
                            'plan.idpadre as parent, false as checked, false as leaf,
                 plan.denominacion as text, plan.idplan as id, 1 as tipo'
                    )
                    ->from('DatPlan plan')
                    ->innerJoin('plan.DatModelo modelo')
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            if (!empty($arr)) {
                $query->andWhereIn('modelo.idmodelo', $arr);
            }
            return $query->execute();
        }
    }

    public function getModelosPlanDesgloseTodos($identidad, $parametros
    ) {
        $conn = Doctrine_Manager::connection();

        $query = "SELECT DISTINCT(m.idmodelo) AS id,
                 m.denominacion,
                 m.descripcion,
                 m.fechaentrega,
                 m.idplan,
                 m.idtipomodelo,
                 m.denominacion as text,
                 true as leaf,
                 2 as tipo,
                 m.uriruta as ruta
                FROM  mod_planificacion.nom_actividad a
                Inner JOIN mod_planificacion.dat_norma n
                ON a.idactividad = n.idactividad
                Inner JOIN mod_planificacion.nom_indicador i
                ON i.idindicador = n.idindicador
                LEFT JOIN mod_planificacion.dat_indicadormodelo im
                ON i.idindicador = im.idindicador
                LEFT JOIN mod_planificacion.dat_actividadmodelo am
                ON a.idactividad = am.idactividad
                INNER JOIN mod_planificacion.dat_modelo m
                ON (am.idmodelo = m.idmodelo OR im.idmodelo = m.idmodelo)
                INNER JOIN mod_planificacion.dat_plan p
                 ON m.idplan = p.idplan
                INNER JOIN mod_planificacion.dat_actespcomportamiento aec
                ON n.idactividad = aec.idactividad AND (aec.idespecialidad = "
                . $parametros['idespecialidad'] . " )
                INNER JOIN mod_planificacion.dat_actividadentidad ae
                ON aec.idactespcomportamiento = ae.idactespcomportamiento
                LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                ON ae.idactividadentidad = aem.idactividadentidad
                LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                ON ae.idactividadentidad = aea.idactividadentidad
                LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
                ON ae.idactividadentidad = aep.idactividadentidad
                WHERE a.estado = 1 AND
                a.nivel = " . $parametros['nivel'] . " AND
                a.idaprobacion >= 3 AND
                (ae.identidad = " . $identidad . " AND ae.idejercicio = "
                . $parametros['idejercicio'] . ")
                ORDER BY m.idmodelo ";
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);

        return $res;
    }

    public function getPlanesEntidad($identidad, $idejercicio, $tipocalc) {
        $tablasalida = "";
        if ($tipocalc == 2) {
            $tablasalida = "salida";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT (p.idplan) as id,
                        CASE
                          WHEN m.idplan is NULL THEN true
                          ELSE false
                        END as leaf,
                        p.denominacion,
                        p.codigo,
                        p.descripcion,
                        1 as tipo
                 FROM mod_planificacion.dat_plan p
                      INNER JOIN mod_planificacion.dat_modelo m ON (p.idplan = m.idplan)
                      INNER JOIN mod_planificacion.dat_entidadmodelo em ON (m.idmodelo = em.idmodelo AND em.identidad = $identidad)
                      INNER JOIN mod_planificacion.dat_actividadmodelo$tablasalida ams ON m.idmodelo = ams.idmodelo
                      INNER JOIN mod_planificacion.nom_actividad n ON ams.idactividad = n.idactividad
                      INNER JOIN mod_planificacion.dat_actividadentidad ae ON (n.idactividad = ae.idactividad AND (ae.idaprobacion = 3 OR ae.idaprobacion = 4) AND ae.idejercicio = $idejercicio)
                      INNER JOIN mod_planificacion.dat_basescalculo$tablasalida bcs ON (bcs.idmodelo = m.idmodelo AND bcs.idejercicio = $idejercicio AND bcs.identidad = $identidad)
                 WHERE p.idplan = p.idpadre
                 order by p.denominacion";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function getPlanesNivAct($identidad, $idejercicio) {

        $conn = Doctrine_Manager::connection();
        $sql = "WITH cantdesg as ( SELECT DISTINCT m.idplan,
                          case
                            when SUM(des.nivelactivdesglosado) = 0 then 0
                            WHEN SUM(des.nivelactivdesglosado) =(ROUND(COALESCE(
                              aea.nivelactividadautomatico, 0), 4) + ROUND(
                              COALESCE(aem.nivelactividadmanual, 0), 4)  +
                              ROUND(COALESCE(ae.ajuste, 0), 4)) then 1
                            WHEN SUM(des.nivelactivdesglosado) > 0 then 2
                          end as desglosada
                   FROM mod_planificacion.dat_desgloseentidadnivel des
                        INNER JOIN mod_planificacion.dat_actividadentidad ae ON
                          (des.idactividadentidad = ae.idactividadentidad AND
                          ae.idejercicio = $idejercicio)
                        LEFT JOIN mod_planificacion.dat_actividadentidadmanual
                          aem ON (aem.idactividadentidad = ae.idactividadentidad
                          )
                        LEFT JOIN
                          mod_planificacion.dat_actividadentidadautomatico aea
                          ON (aea.idactividadentidad = ae.idactividadentidad)
                        LEFT JOIN
                          mod_planificacion.dat_actividadentidadproduccion aep
                          ON (aep.idactividadentidad = ae.idactividadentidad)
                        INNER JOIN mod_planificacion.dat_actividadmodelo am ON
                          am.idactividad = ae.idactividad
                        INNER JOIN mod_planificacion.dat_modelo m ON (
                          am.idmodelo = m.idmodelo)
                   WHERE ae.identidad = $identidad AND
                         (ae.idaprobacion = 3 OR
                         ae.idaprobacion = 4 OR
                         ae.idaprobacion = 5)
                   GROUP BY des.idactividadentidad,
                            aea.nivelactividadautomatico,
                            aem.nivelactividadmanual,
                            aep.nivelactividadproduccion,
                            ae.ajuste,
                            m.idplan)
SELECT DISTINCT (p.idplan) as id,
       CASE
         WHEN m.idplan is NULL THEN true
         ELSE false
       END as leaf,
       p.denominacion,
       p.codigo,
       p.descripcion,
       1 as tipo,
       min(COALESCE(d.desglosada, 0)) as desglosada
FROM mod_planificacion.dat_plan p
     INNER JOIN mod_planificacion.dat_modelo m ON (p.idplan = m.idplan)
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON (m.idmodelo =
       em.idmodelo AND em.identidad = $identidad)
     LEFT JOIN cantdesg d ON d.idplan = m.idplan
WHERE p.idplan = p.idpadre
GROUP BY p.idplan,
         m.idplan,
         p.denominacion,
         p.codigo,
         p.descripcion
order by p.denominacion";
//        print_r($sql);die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

//muestra todos los planes que tengan en su tipo de modelo
//al menos una columna dinamica numerica
    public function listarPlanesConTipoModeloColNumerica() {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT m.idmodelo,
                        m.denominacion
                FROM mod_planificacion.dat_modelo m
                      INNER JOIN mod_planificacion.nom_tipomodelo tm ON m.idtipomodelo =
                        tm.idtipomodelo
                      INNER JOIN mod_metadata.dat_tabla t ON tm.idtabla = t.idtabla
                      INNER JOIN mod_metadata.dat_campo c ON c.idtabla = t.idtabla
                      INNER JOIN mod_metadata.dat_componente comp ON (c.idcampo = comp.idcampo)
                      INNER JOIN mod_metadata.dat_tipodatogestor tdg ON (c.idtipodatogestor =
                        tdg.idtipodatogestor)
                      INNER JOIN mod_metadata.nom_tipodato td ON (tdg.idtipodato = td.idtipodato)
                 WHERE
                       td.denominacion = 'Numérico'
                 order by m.denominacion";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function listarModelosBaseCalculo($identidad, $node, $idejercicio, $tipocalc) {
        $tablasalida = "";
        if ($tipocalc == 2) {
            $tablasalida = "salida";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT (m.idmodelo) as id,
                        m.denominacion,
                        m.descripcion,
                        true as leaf,
                        2 as tipo,
                        tm.denominacion as tipomodelo,
                        m.uriruta as ruta
                 FROM mod_planificacion.dat_modelo m
                      INNER JOIN mod_planificacion.nom_tipomodelo tm ON (tm.idtipomodelo = m.idtipomodelo)
                      INNER JOIN mod_planificacion.dat_entidadmodelo em ON (m.idmodelo = em.idmodelo AND em.identidad = $identidad)
                      INNER JOIN mod_planificacion.dat_actividadmodelo$tablasalida ams ON m.idmodelo = ams.idmodelo
                      INNER JOIN mod_planificacion.nom_actividad n ON ams.idactividad = n.idactividad
                      INNER JOIN mod_planificacion.dat_actividadentidad ae ON (n.idactividad = ae.idactividad AND (ae.idaprobacion = 3 OR ae.idaprobacion = 4) AND ae.idejercicio = $idejercicio)
                      INNER JOIN mod_planificacion.dat_basescalculo$tablasalida bcs ON (bcs.idmodelo = m.idmodelo AND bcs.idejercicio = $idejercicio AND bcs.identidad = $identidad)
                 WHERE m.idplan = $node
                 order by m.denominacion";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    /**
     * ObtenerModelo
     * Devuelve el modelo dado un id
     *
     * @param
     * $idmodelo
     *
     * @return
     * modelo
     */
    public function ObtenerModelo($idmodelo) {
        $query = new Doctrine_Query();
        $temp = $query->from('DatModelo m')->where('m.idmodelo=?', $idmodelo)
                        ->execute()->toArray();
        return $temp;
    }

    /**
     * GetTodos
     * Devuelve todos los modelos que hay en la base de datos
     *
     * @return
     * lista de modelos
     */
    public function GetTodos() {
        $query = new Doctrine_Query();
        $result = $query->from('DatModelo')->execute();
        return $result->toArray();
    }

    /**
     * GetPorLimite
     * Devuelve todos los modelos por un limite
     *
     * @param
     * $limite
     * $inicio
     *
     * @return
     * lista de modelos paginados
     */
    public function GetPorLimite($limite = 0, $inicio = 20) {
        $query = new Doctrine_Query();
        $result = $query->from('DatModelo')->limit($limite = 0)->offset(
                        $inicio = 20
                )->execute();
        return $result->toArray();
    }

    /**
     * getModelosPlan
     * Devuelve los modelos de un plan
     *
     * @param
     * $plan
     *
     * @return
     * Lista de modelos que estan dentro del plan pasado por parametro
     */
    public function getModelosPlanDesglose($identidad, $parametros) {
        $conn = Doctrine_Manager::connection();

        $query = "SELECT DISTINCT(m.idmodelo) AS id,
                 m.denominacion,
                 m.descripcion,
                 m.fechaentrega,
                 m.idplan,
                 m.idtipomodelo,
                 m.denominacion as text,
                 true as leaf,
                 2 as tipo,
                 m.uriruta as ruta
                FROM  mod_planificacion.nom_actividad a
                Inner JOIN mod_planificacion.dat_norma n
                ON a.idactividad = n.idactividad
                Inner JOIN mod_planificacion.nom_indicador i
                ON i.idindicador = n.idindicador
                Inner JOIN mod_planificacion.dat_indicadormodelo im
                ON i.idindicador = im.idindicador
                LEFT JOIN mod_planificacion.dat_actividadmodelo am
                ON a.idactividad = am.idactividad
                INNER JOIN mod_planificacion.dat_modelo m
                ON (am.idmodelo = m.idmodelo OR im.idmodelo = m.idmodelo)
                INNER JOIN mod_planificacion.dat_plan p
                ON m.idplan = p.idplan
                INNER JOIN mod_planificacion.dat_actespcomportamiento aec
                ON n.idactividad = aec.idactividad AND (aec.idespecialidad = "
                . $parametros['idespecialidad'] . " )
                INNER JOIN mod_planificacion.dat_actividadentidad ae
                 ON aec.idactespcomportamiento = ae.idactespcomportamiento
                LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                ON ae.idactividadentidad = aem.idactividadentidad
                LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                ON ae.idactividadentidad = aea.idactividadentidad
                LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
                ON ae.idactividadentidad = aep.idactividadentidad
                WHERE a.estado = 1 AND
                a.nivel = " . $parametros['nivel'] . " AND
                a.idaprobacion >= 3 AND
                (ae.identidad = " . $identidad . " AND ae.idejercicio = "
                . $parametros['idejercicio'] . ")
                ORDER BY m.idmodelo ";
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    public function getModelosPlan($node, $identidad, $idejercicio, $identidades, $subc = true) {
        if ($subc == true) {
            $ventana = "WITH planificado AS (
                    SELECT DISTINCT em.idmodelo
                    FROM mod_planificacion.dat_planificacion p
                         INNER JOIN mod_planificacion.dat_entidadmodelo em ON (
                           em.identidadmodelo = p.identidadmodelo AND
                           p.idejercicio = $idejercicio)
                    WHERE em.identidad IN ($identidades)),
  cantdesg as ( SELECT am.idmodelo,
                       case
                         when SUM(des.nivelactivdesglosado) = 0 then 0
                         WHEN SUM(des.nivelactivdesglosado) =(ROUND(COALESCE(
                           aea.nivelactividadautomatico, 0), 4) + ROUND(COALESCE
                           (aem.nivelactividadmanual, 0), 4) + ROUND(COALESCE(
                           aep.nivelactividadproduccion, 0), 4) + ROUND(COALESCE
                           (ae.ajuste, 0), 4)) then 1
                         WHEN SUM(des.nivelactivdesglosado) > 0 then 2
                       end as desglosada
                FROM mod_planificacion.dat_desgloseentidadnivel des
                     INNER JOIN mod_planificacion.dat_actividadentidad ae ON (
                       des.idactividadentidad = ae.idactividadentidad AND
                       ae.idejercicio = $idejercicio)
                     LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                       ON (aem.idactividadentidad = ae.idactividadentidad)
                     LEFT JOIN mod_planificacion.dat_actividadentidadautomatico
                       aea ON (aea.idactividadentidad = ae.idactividadentidad)
                     LEFT JOIN mod_planificacion.dat_actividadentidadproduccion
                       aep ON (aep.idactividadentidad = ae.idactividadentidad)
                     INNER JOIN mod_planificacion.dat_actividadmodelo am ON
                       am.idactividad = ae.idactividad
                WHERE ae.identidad IN ($identidades) AND
                      (ae.idaprobacion = 3 OR
                      ae.idaprobacion = 4 OR
                      ae.idaprobacion = 5)
                GROUP BY des.idactividadentidad,
                         aea.nivelactividadautomatico,
                         aem.nivelactividadmanual,
                         aep.nivelactividadproduccion,
                         ae.ajuste,
        am.idmodelo)";
            $inner = "LEFT JOIN planificado p ON em.idmodelo = p.idmodelo
                         LEFT JOIN cantdesg d ON d.idmodelo = m.idmodelo";

            $group = ",p.idmodelo";
            $select = ",CASE
                             WHEN p.idmodelo IS NOT NULL THEN 1
                             ELSE 0
                           END as planif,min(COALESCE(d.desglosada, 0)) as desglosada";
        } else {
            $ventana = "";
            $inner = "";
            $group = "";
            $select = "";
        }
        $conn = Doctrine_Manager::connection();
        $query = "$ventana
                    SELECT DISTINCT m.idmodelo,
                           em.identidadmodelo,
                           m.idmodelo as id,
                           m.denominacion,
                           m.tipoplan,
                           m.descripcion,
                           m.fechaentrega,
                           m.idplan,
                           m.idtipomodelo,
                           true as leaf,
                           2 as tipo,
                           m.uriruta as ruta,
                           tm.denominacion as tipomodelo,
                           m.identidad as identidadcrea
                            $select
                    FROM mod_planificacion.dat_modelo m
                         LEFT JOIN mod_planificacion.dat_entidadmodelo em ON (
                           m.idmodelo = em.idmodelo)
                         INNER JOIN mod_planificacion.nom_tipomodelo tm ON (
                           tm.idtipomodelo = m.idtipomodelo)
                         $inner
                    WHERE m.idplan = $node AND
                          em.identidad = $identidad
                    GROUP BY m.idmodelo,
                             em.identidadmodelo,
                             m.denominacion,
                             m.tipoplan,
                             m.descripcion,
                             m.fechaentrega,
                             m.idplan,
                             m.idtipomodelo,
                             m.uriruta,
                             tm.denominacion,
                             m.identidad
                             $group
                order by m.denominacion";

        $res = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    function obtenerModelosDadoEntidad($identidad) {
        $query = new Doctrine_Query();
        $planes = $query->select('m.idmodelo,m.denominacion')->from(
                                'Datmodelo m'
                        )->where('m.identidad=?', $identidad)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $planes;
    }

    /**
     * getModeloPorEntidad
     * Devuelve los modelos de la entidad pasada por parametro
     *
     * @param
     * $identidad
     * $idpadre
     *
     * @return
     * Lista de modelos pertenecientes a la entidad pasada por parametro
     */
    public function getModeloPorEntidad($identidad, $idpadre) {
        $query = new Doctrine_Query();
        $query->from("DatModelo m")->where("m.identidad = ?", $identidad);
        $query->addWhere("m.idpadre = ?", $idpadre);
        return $query->execute()->toArray();
    }

    /**
     * getModelosPlanDeUnTipoModelo
     * Devuelve los modelos de un plan que tengan el mismo tipo de modelo
     * que el pasado por parametro, pero que no tengan el mismo id de modelo
     *
     * @param
     * $plan
     * $idtipomodelo
     * $idmodelo
     *
     * @return
     * listado de modelos
     */
    public function getModelosPlanDeUnTipoModelo($plan, $idtipomodelo, $idmodelo
    ) {
        $query = new Doctrine_Query();
        $res = $query->select(
                        'm.idmodelo,m.idmodelo as id,m.denominacion,m.descripcion,
            m.fechaentrega,m.idplan,m.idtipomodelo,m.denominacion as text,
            true as leaf, 2 as tipo'
                )->from('DatModelo m')->where(
                        'm.idplan =? AND m.idtipomodelo=? AND m.idmodelo<>?', array($plan, $idtipomodelo, $idmodelo)
                )->execute()->toArray();
        return $res;
    }

    /**
     * getTipoModeloDadoIdModelo
     * Devuelve el idtipomodelo de un idmodelo pasado por parametro
     *
     * @param
     * $idmodelo
     *
     * @return
     * idtipomodelo
     */
    public function getTipoModeloDadoIdModelo($idmodelo) {
        $query = new Doctrine_Query();
        $res = $query->select('m.idtipomodelo')->from('DatModelo m')->where(
                        'm.idmodelo =?', $idmodelo
                )->execute()
                ->toArray();
        return $res;
    }

    /**
     * getModelosPlanCons
     * Devuelve los modelos de un plan pasado por parametro y con clasifmodelo =1
     *
     * @param
     * $plan
     *
     * @return
     * lista de modelos
     */
    public function getModelosPlanCons($plan) {
        $query = new Doctrine_Query();
        $res = $query->select(
                                'm.idmodelo,m.idmodelo as id,m.denominacion,m.descripcion,
            m.fechaentrega,m.idaprobacion,m.idplan,m.idtipomodelo,
            m.denominacion as text,true as leaf,false  as checked, 2 as tipo, '
                                . "'modelo'" . ' as iconCls'
                        )->from('DatModelo m,m.DatModeloclasifmodelo d')->where(
                                'm.idplan =? AND d.idclasifmodelo=?', array($plan, 1)
                        )
                        ->execute()->toArray();
        return $res;
    }

    /**
     * getModelosPlanConsAsociados
     * Devuelve los modelos con clasifmodelo =2(asociados)
     *
     * @param
     * $idmodelo
     *
     * @return
     * lista de modelos asociados
     */
    public function getModelosPlanConsAsociados($idmodelo) {
        $query = new Doctrine_Query();
        $res = $query->select(
                        'm.idmodelo,m.idmodelo as id,m.denominacion,m.descripcion,m.fechaentrega,
            m.idaprobacion,m.idplan,m.idtipomodelo,m.denominacion as text,
            true as leaf,false  as checked, 3 as tipo, '
                        . "'asociado'" . ' as iconCls'
                )->from('DatModelo m,m.DatModeloclasifmodelo d')->where(
                        'm.idpadre =? AND d.idclasifmodelo=?', array($idmodelo, 2)
                )->execute()->toArray();

        return $res;
    }

    /**
     * ObtenerModelosDeUnTipo
     * Devuelve el id y la denominacion de los modelos de un mismo tipo de modelo
     *
     * @param
     * $idtipomodelo
     *
     * @return
     * idmodelo y denominacion de los modelos de igual tipo al pasado por parametro
     */
    public function ObtenerModelosDeUnTipo($idtipomodelo) {
        $query = new Doctrine_Query();
        $temp = $query->select('m.idmodelo, m.denominacion')->from(
                        'DatModelo m'
                )->where(
                        'm.idtipomodelo=?', $idtipomodelo
                )->execute()->toArray();
        return $temp;
    }

    /**
     * ObtenerModelosTipo
     * Devuelve todos los datos de los modelos que tienen el mismo tipo que el pasado por parametro
     *
     * @param
     * $idtipomodelo
     *
     * @return
     * lista de modelos
     */
    public function ObtenerModelosTipo($idtipomodelo) {
        $query = new Doctrine_Query();
        $temp = $query->from('DatModelo m')->where(
                        'm.idtipomodelo=?', $idtipomodelo
                )->execute()->toArray();
        return $temp;
    }

    /**
     * ObtenerModelosTipoDistinto
     * Obtiene modelos del mismo tipo dintinto del idmodelo
     *
     * @param
     * $idtipomodelo
     * $idmodelo
     *
     * @return
     * lista de modelos
     */
    public function ObtenerModelosTipoDistinto($idtipomodelo, $idmodelo) {
        $query = new Doctrine_Query();
        $temp = $query->from('DatModelo m')->where(
                        'm.idtipomodelo=? AND m.idmodelo<>?', array($idtipomodelo, $idmodelo)
                )->execute()->toArray();
        return $temp;
    }

    /**
     * contarIndPlanificadosEnModelo
     * Cuenta los indicadores planificados dentro del modelo pasado por parametro
     *
     * @param
     * $idmodelo
     *
     * @return
     * total de indicadores
     */
    public function contarIndPlanificadosEnModelo($idmodelo) {
        $query = Doctrine_Query::create(); //********AQUI
        return $query->select('COUNT(idplanificacion) as total')->from(
                        'DatPlanificacion'
                )->where(
                        'idmodelo = ?', $idmodelo
                )->execute()->getFirst()->total;
    }

    /**
     * obtenerTodosIndPlanificadosEnModelo
     * devuelve el id de los indicadores planificados en un modelo pasado por parametro
     *
     * @param
     * $idmodelo
     *
     * @return
     * lista de indicadores
     */
    public function obtenerTodosIndPlanificadosEnModelo($idmodeloentidad) {
        $query = Doctrine_Query::create(); //********AQUI
        return $query->from('DatPlanificacion d')->where(
                        'd.identidadmodelo = ?', $idmodeloentidad
                )->setHydrationMode(
                        Doctrine::HYDRATE_ARRAY
                )->execute(); //;
    }

    /**
     * dameIndPlanificadoEnModelo
     * devuelve los datos de un indicador planificado en un modelo
     *
     * @param
     * $idmodelo
     * $idind
     *
     * @return
     * indicador
     */
    public function dameIndPlanificadoEnModelo($identidadmodelo, $idind) {
        $query = Doctrine_Query::create();
        return $query->from('DatPlanificacion d')->where(
                        'd.identidadmodelo = ? AND d.idindicador = ?', array($identidadmodelo, $idind)
                )->execute()->getFirst();
    }

    public function dameindmodeloplanif($idplanificacion) {

        $query = new Doctrine_Query();
        $result = $query->from(
                        'DatPlanificacion d,d.DatEntidadmodelo e,e.DatModelo p,p.NomTipomodelo l'
                )->where(
                        'd.idplanificacion=?', $idplanificacion
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function devolverModelos() {
        $query = new Doctrine_Query();
        $result = $query->select(
                        'dm.idmodelo, dm.denominacion, dm.fechaentrega, dm.identidad,
            dm.idplan, dm.idtipomodelo, dm.version, dm.descripcion'
                )->from('DatModelo dm')->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function verUsoEnModelo($idtipomodelo) {
        $query = new Doctrine_Query();
        $enuso = $query->select('d.idtipomodelo')->from('DatModelo d')->where(
                                'd.idtipomodelo= ?', $idtipomodelo
                        )
                        ->execute()->toArray();
        if ($enuso [0] ['idtipomodelo'] != null) {
            return true;
        }
        return false;
    }

    public function aprobarDesaprobarFamilia($params) {

        $q = new Doctrine_Query();
        $q->update('DatPlanificacion p')
                ->set('idaprobaciondemanda', $params['aprobado'])
                ->whereIn('p.idplanificacion', $params['arrayidplanificacion']);
        if (($params['aprobado'] == 3 || $params['aprobado'] == 4)
        ) { //si se quiere aprobar y la necesidad es cero
            $q->addWhere('(p.cantidad+p.ajuste) <> 0');
        }
        if ($params['rectora'] != 'true'
        ) { //si se quiere desaprobar aprobado=1, y esta aprobado por el rector, y el no es rector no se puede
            $q->addWhere('p.idaprobaciondemanda <> 4');
            $q->addWhere('p.idaprobaciondemanda <> 5');
        }

        $q->execute();
    }

    public function aprobarDesaprobarAjusteFamilia($params) {
        $q = new Doctrine_Query();
        $q->update('DatPlanificacion p')
                ->set('idaprobaciondemanda', $params['aprobado'])
                ->whereIn('p.idplanificacion', $params['idplanificacion'])
                ->addWhere('p.ajuste <> 0');

        if ($params['aprobado'] == 5) { //si se quiere aprobar el ajuste
            $q->addWhere('p.idaprobaciondemanda =4');
        } else {
            if ($params['aprobado'] == 4) {
                $q->addWhere('p.idaprobaciondemanda = 5');
            }
        }

        $q->execute();
        $result->codMsg = 1;
        return $result;
    }

    public function aprobarDesaprobarTodosFamilia($identidadmodelo, $aprobado, $rectora, $idejercicio
    ) {
        $addWhere = "";
        if (($aprobado == 3 || $aprobado == 4)) { //si se quiere aprobar y la necesidad es cero
            $addWhere .= 'AND (cantidad+ajuste) <> 0';
        }
        if ($rectora != 'true') { //si se quiere desaprobar aprobado=1, y esta aprobado por el rector, y el no es rector no se puede
            $addWhere .= 'AND idaprobaciondemanda <> 4';
            $addWhere .= 'AND idaprobaciondemanda <> 5';
        }
        $identidadmodeloaux = implode(",", $identidadmodelo);
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planificacion.dat_planificacion SET idaprobaciondemanda = $aprobado
                WHERE (identidadmodelo IN ($identidadmodeloaux) AND idejercicio = $idejercicio) $addWhere";
        $con->execute($sql)->fetchAll();
    }

    public function aprobarDesaprobarTodosAjusteFamilia($params) {
        $q = new Doctrine_Query();
        $q->update('DatPlanificacion p')
                ->set('idaprobaciondemanda', $params['aprobado'])
                ->whereIn('p.identidadmodelo', $params['identidadmodelo'])
                ->addWhere('p.idejercicio=?', $params['idejercicio'])
                ->addWhere('p.ajuste<>0');
        if ($params['aprobado'] == 5) { //si se quiere aprobar el ajuste
            $q->addWhere('p.idaprobaciondemanda =4');
        } else {
            if ($params['aprobado'] == 4) {
                $q->addWhere('p.idaprobaciondemanda = 5');
            }
        }
        if ($params['rectora'] == 'true') {
            $q->execute();
            $result->codMsg = 1;
        } else {
            $result->codMsg = 2;
        }

        return $result;
    }

    public function dameIdModelo($denominacion) {
        $query = new Doctrine_Query();
        $result = $query->select(
                                'dm.idmodelo'
                        )->from('DatModelo dm')
                        ->where("dm.denominacion LIKE ? ", $denominacion)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function listarModelos() {
        $query = new Doctrine_Query();
        $res = $query->select('m.idmodelo,m.denominacion,')
                ->from('DatModelo m')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $res;
    }

    public function listarModelosIngresosGastos($parametros) {
        $con = Doctrine_Manager::connection();
        $sql = "WITH plan as
            (SELECT DISTINCT CASE WHEN m.tipoplan = 1 THEN sum(COALESCE(planif.cantidad + planif.ajuste, 0))
                ELSE 0 END as cantidadingreso,
       CASE WHEN m.tipoplan = 0 THEN COALESCE(sum(planif.cantidad + planif.ajuste),0)
       ELSE 0 END as cantidadgasto
       FROM mod_planificacion.dat_modelo m
       INNER JOIN mod_planificacion.dat_entidadmodelo entm ON (m.idmodelo = entm.idmodelo)
       INNER JOIN mod_planificacion.dat_planificacion planif ON (entm.identidadmodelo = planif.identidadmodelo)
       WHERE entm.identidad IN ($parametros->entidadesseparadas) AND planif.idejercicio = $parametros->idejercicio
       GROUP BY m.tipoplan )
       SELECT sum(p.cantidadingreso) as cantidadingreso, sum(p.cantidadgasto) as cantidadgasto FROM plan p;";
        $result = $con->execute($sql)->fetchAll();
        return $result;
    }

    public function listarModelosIngresosGastosReales($parametros) {
        $con = Doctrine_Manager::connection();
        $sql = "WITH plan as
            (SELECT DISTINCT CASE WHEN m.tipoplan = 1 THEN sum(COALESCE(ejec.cantidadreal, 0))
                ELSE 0 END as cantidadingresoreal,
       CASE WHEN m.tipoplan = 0 THEN COALESCE(sum(ejec.cantidadreal),0)
       ELSE 0 END as cantidadgastoreal
       FROM mod_planificacion.dat_modelo m
       INNER JOIN mod_planificacion.dat_entidadmodelo entm ON (m.idmodelo = entm.idmodelo)
       INNER JOIN mod_planificacion.dat_planificacion planif ON (entm.identidadmodelo = planif.identidadmodelo)
       INNER JOIN mod_planificacion.dat_controlejecucionplan ejec ON (planif.idplanificacion = ejec.idplanificacion)
       WHERE entm.identidad IN ($parametros->entidadesseparadas) AND planif.idejercicio = $parametros->idejercicio
       GROUP BY m.tipoplan )
       SELECT sum(p.cantidadingresoreal) as cantidadingresoreal, sum(p.cantidadgastoreal) as cantidadgastoreal FROM plan p;";

        $result = $con->execute($sql)->fetchAll();
        return $result;
    }

    public function adicionarEntidadModelo($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planificacion.dat_entidadmodelo (identidad,idmodelo,prioridad)
                VALUES ($params->identidad,$params->idmodelo,$params->prioridad);";
        $conn->execute($sql);
    }

    public function getDatosExportarEnm($params) {
        $con = Doctrine_Manager::connection();
        $sql = "
SELECT p.idindicador,
       ind.codigo,
       ind.denominacion,
       SUM(p.cantidad + p.ajuste) as cantplanif,
       p.viasadquisicion as via,
       p.organossatisface as organo,
       p.idaprobaciondemanda,
       indp.precio,
       indp.preciodivisa as preciomlc,
       ind.idumedida,
       SUM((p.precio *(p.cantidad + p.ajuste)) +((p.precio *(p.cantidad + p.ajuste)) * indp.flete) / 100 +((p.precio *(p.cantidad + p.ajuste)) * indp.contingencia) / 100) as
         importefinal,
       SUM(p.importe +((p.importe * indp.flete) / 100) +((p.importe * indp.contingencia) / 100)) as importeinicial,
       (SUM(p.ajuste) * indp.precio) +(((SUM(p.ajuste) * indp.precio) * indp.flete) / 100) +(((SUM(p.ajuste) * indp.precio) * indp.contingencia) / 100) as importeajustado
FROM mod_planificacion.dat_planificacion p
     INNER JOIN mod_datosmaestros.nom_indicador ind ON (p.idindicador = ind.idindicador)
     INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON (p.idindicador = indp.idindicador)
     INNER JOIN mod_planificacion.dat_entidadmodelo entmod ON (p.identidadmodelo = entmod.identidadmodelo)
WHERE p.idejercicio = {$params->idejercicio} AND
      indp.nivelplanif = 1 AND
      ind.estado = 1 AND
      entmod.identidad IN ($params->arryhijosAux) AND
      (p.idaprobaciondemanda = 4 OR
      p.idaprobaciondemanda = 5)
GROUP BY p.idindicador,
         ind.codigo,
         ind.denominacion,
         p.viasadquisicion,
         p.organossatisface,
         p.idaprobaciondemanda,
         indp.precio,
         indp.preciodivisa,
         ind.idumedida,
         indp.flete,
         indp.contingencia";
        $result = $con->execute($sql)->fetchAll();
        return $result;
    }

    //Saber si el modelo nuevo Tiene el MismoTipo de Modelo del viejo
    public function modeloTieneelMismoTipodeModelo($idmodeloviejo, $idmodelonuevo) {
        $conn = Doctrine_Manager::connection();
        $sql = "WITH tmviejo AS (
                    SELECT m.idtipomodelo
                    FROM mod_planificacion.dat_modelo m
                    WHERE m.idmodelo = $idmodeloviejo), tmnuevo AS (
                    SELECT m.idtipomodelo
                    FROM mod_planificacion.dat_modelo m
                    WHERE m.idmodelo = $idmodelonuevo)

                    SELECT CASE
                             WHEN v.idtipomodelo = n.idtipomodelo THEN 1
                             ELSE 0
                           END AS tipomodelo
                    FROM tmviejo v,
                         tmnuevo n ";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $arrayResult;
    }

    public function getModelosNivActividad($identidad, $node, $idejercicio) {

        $conn = Doctrine_Manager::connection();
        $query = "WITH cantdesg as (
SELECT am.idmodelo,
       case
         when SUM(des.nivelactivdesglosado) = 0 then 0
         WHEN SUM(des.nivelactivdesglosado) =(ROUND(COALESCE(
           aea.nivelactividadautomatico, 0), 4) + ROUND(COALESCE(
           aem.nivelactividadmanual, 0), 4) + ROUND(COALESCE(ae.ajuste, 0), 4))
           then 1
         WHEN SUM(des.nivelactivdesglosado) > 0 then 2
       end as desglosada
FROM mod_planificacion.dat_desgloseentidadnivel des
     INNER JOIN mod_planificacion.dat_actividadentidad ae ON (
       des.idactividadentidad = ae.idactividadentidad AND ae.idejercicio = $idejercicio)
     LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
       aem.idactividadentidad = ae.idactividadentidad)
     LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
       aea.idactividadentidad = ae.idactividadentidad)
     INNER JOIN mod_planificacion.dat_actividadmodelo am ON am.idactividad =
       ae.idactividad
WHERE ae.identidad = $identidad AND
      (ae.idaprobacion = 3 OR
      ae.idaprobacion = 4 OR
      ae.idaprobacion = 5)
GROUP BY des.idactividadentidad,
         aea.nivelactividadautomatico,
         aem.nivelactividadmanual,
         ae.ajuste,
         am.idmodelo)
SELECT DISTINCT m.idmodelo,
       em.identidadmodelo,
       m.idmodelo as id,
       m.denominacion,
       m.tipoplan,
       m.descripcion,
       m.fechaentrega,
       m.idplan,
       m.idtipomodelo,
       true as leaf,
       2 as tipo,
       m.uriruta as ruta,
       tm.denominacion as tipomodelo,
       m.identidad as identidadcrea,
       min(COALESCE(d.desglosada, 0)) as desglosada
FROM mod_planificacion.dat_modelo m
     LEFT JOIN mod_planificacion.dat_entidadmodelo em ON (m.idmodelo =
       em.idmodelo)
     INNER JOIN mod_planificacion.nom_tipomodelo tm ON (tm.idtipomodelo =
       m.idtipomodelo)
     LEFT JOIN cantdesg d ON d.idmodelo = m.idmodelo
WHERE m.idplan = $node AND
      em.identidad = $identidad
GROUP BY m.idmodelo,
         em.identidadmodelo,
         m.denominacion,
         m.tipoplan,
         m.descripcion,
         m.fechaentrega,
         m.idplan,
         m.idtipomodelo,
         m.uriruta,
         tm.denominacion,
         m.identidad
order by m.denominacion";
//        print_r($query);        die;
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

}
