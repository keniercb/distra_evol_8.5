<?php

class DatModelo extends BaseDatModelo {

    public function setUp() {
        parent::setUp();
        $this->hasOne('NomTipomodelo', array('local' => 'idtipomodelo', 'foreign' => 'idtipomodelo'));
        $this->hasOne('DatPlan', array('local' => 'idplan', 'foreign' => 'idplan'));
        $this->hasMany('DatPlanificacion', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
        $this->hasMany('DatEntidadmodelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
        $this->hasMany('DatActividadmodelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
        $this->hasMany('DatModeloclasifmodelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
        $this->hasMany('DatModelodatosnomenclador', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
        $this->hasMany('DatIndicadormodelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
        $this->hasMany('DatAjusteexistenciaod', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
        $this->hasMany('DatAjusteexistenciacb', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
        $this->hasMany('DatBasescalculo', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
        $this->hasMany('DatBasescalculosalida', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
    }

    public function devolverarbolgeneologicoEntidad($identidad, $integrator) {
        $entidades = $integrator->metadatos->DameHijosEstructura($identidad);
        $ids = array();
        if ($entidades [0] != null) {
            foreach ($entidades as $valor_entidad) {
                array_push($ids, $valor_entidad->idestructura);
                $ids = array_merge(
                        $ids, self::devolverarbolgeneologicoEntidad($valor_entidad->idestructura, $integrator)
                );
            }
        }
        return $ids;
    }

    public function obtenerPlanesDadoEntidaddql($identidades) {
        $query = Doctrine_Query::create();
        $query->select('e.identidad')
                ->from('DatEntidadmodelo e')
                ->innerJoin('e.DatModelo modelo')
                ->whereIn('e.identidad', $identidades);
        return $query->execute()->toArray(true);
    }

    public function obtenerPlanesDadoEntidad($identidades, $filtro, $start, $limit) {
        $cadenawhere = "";
        $cadenastartlimit = "";
        $cadenawhere2 = "";


        if (count($filtro) != 0) {
            foreach ($filtro as $key => $value) {
                if ($value['tipo'] == 'denelemento') {
                    $cadenawhere2.="AND dat_modelo.denominacion LIKE '%" . $filtro['valor'] . "%'";
                }
            }
        }

        if (count($identidades) != 0) {
            $array = implode(',', $identidades);

            $cadenawhere.="dat_entidadmodelo.identidad   IN " . '(' . $array . ')' . " ";
        }

        $consulta = "SELECT 
  dat_modelo.denominacion, 
  dat_modelo.idmodelo, 
  dat_entidadmodelo.identidad
FROM 
  mod_planificacion.dat_modelo 
 Inner JOIN  mod_planificacion.dat_entidadmodelo ON dat_modelo.idmodelo = dat_entidadmodelo.idmodelo 
WHERE 
   " . $cadenawhere . $cadenawhere2;

        $conn2 = Doctrine_Manager :: connection();

        $res = $conn2->execute($consulta);
        $result = $res->fetchAll();


        return $result;
    }

    public function obtenerIdsModelosBaseCalculo($identidad) {
        $integrator = ZendExt_IoC::getInstance();
        $ids = self::devolverarbolgeneologicoEntidad($identidad, $integrator);
        $ids = implode(',', $ids);
        if (empty($ids)) {
            $ids = '-1';
        }
        $query = Doctrine_Query::create();
        $query->select('calculo.idmodelo as id, calculo.idejercicio as idejercicio')
                ->distinct()
                ->from('DatBasescalculo calculo')
                ->where('calculo.idmodelo is not null and calculo.identidad = ?', $identidad)
                ->where('calculo.idmodelo is not null and calculo.identidad = ?', $identidad)
                ->setHydrationMode(Doctrine::HYDRATE_NONE);
        $res = $query->execute();
        return $res;
    }

    public function obtenerIdsModelosBase($identidad, $idejercicio) {
        $integrator = ZendExt_IoC::getInstance();
        $ids = self::devolverarbolgeneologicoEntidad($identidad, $integrator);
        $ids = implode(',', $ids);
        if (empty($ids)) {
            $ids = '-1';
        }
        $query = Doctrine_Query::create();
        $query->select('calculo.idmodelo as id')
                ->distinct()
                ->from('DatBasescalculo calculo')
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
                            'plan.idpadre as parent, false as checked, false as leaf, plan.denominacion as text, plan.idplan as id, 1 as tipo'
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

    public function getModelosPlanDesgloseTodos($idplan, $identidad, $parametros) {
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
                Inner JOIN mod_planificacion.dat_norma n ON a.idactividad = n.idactividad 
                Inner JOIN mod_planificacion.nom_indicador i ON i.idindicador = n.idindicador
                LEFT JOIN mod_planificacion.dat_indicadormodelo im ON i.idindicador = im.idindicador
                LEFT JOIN mod_planificacion.dat_actividadmodelo am ON a.idactividad = am.idactividad 
                INNER JOIN mod_planificacion.dat_modelo m ON (am.idmodelo = m.idmodelo OR im.idmodelo = m.idmodelo)                        
                INNER JOIN mod_planificacion.dat_plan p ON m.idplan = p.idplan   
                INNER JOIN mod_planificacion.dat_actespcomportamiento aec ON n.idactividad = aec.idactividad AND (aec.idespecialidad = " . $parametros['idespecialidad'] . " )
                INNER JOIN mod_planificacion.dat_actividadentidad ae ON aec.idactespcomportamiento = ae.idactespcomportamiento
                LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON ae.idactividadentidad = aem.idactividadentidad
                LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON ae.idactividadentidad = aea.idactividadentidad
                LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON ae.idactividadentidad = aep.idactividadentidad 
                WHERE a.estado = 1 AND 
                a.nivel = " . $parametros['nivel'] . " AND 
                a.idaprobacion >= 3 AND
                (ae.identidad = " . $identidad . " AND ae.idejercicio = " . $parametros['idejercicio'] . ") 
                ORDER BY m.idmodelo ";
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);

        return $res;
    }

    public function listarPlanesActualizados($identidad, $idejercicio) {
        $idsmodelos = self::obtenerIdsModelosBase($identidad, $idejercicio);
        if (!empty($idsmodelos)) {
            $arr = array();

            foreach ($idsmodelos as $re) {
                array_push($arr, $re['0']);
            }
            $query = Doctrine_Query::create();
            $query->select(' DISTINCT plan.idpadre as parent,
                             false as checked, 
                             false as leaf,
                             plan.denominacion as text,
                             plan.idplan as id,
                             1 as tipo'
                    )
                    ->from('DatPlan plan')
                    ->innerJoin('plan.DatModelo modelo')
                    ->innerJoin('modelo.DatActividadmodelo am')
                    ->innerJoin('am.NomActividad a')
                    ->innerJoin('a.DatActividadentidad ae')
                    ->addwhere('ae.idaprobacion <>?', '1')
                    ->addwhere('ae.idaprobacion <>?', '5')
                    ->addwhere('ae.idejercicio =?', $idejercicio)
                    ->addwhere('ae.idaprobacion=? OR ae.idaprobacion=?', array(3, 4))
                    ->addwhere('ae.idejercicio =?', $idejercicio)
                    ->setHydrationMode(Doctrine::HYDRATE_NONE);

            if (!empty($arr)) {
                $query->andWhereIn('modelo.idmodelo', $arr);
            }
            return $query->execute();
        }
    }

    public function listarPlanesHijosBaseCalculo($idpadre, $identidad, $idejercicio) {
        $idsmodelos = self::obtenerIdsModelosBase($identidad, $idejercicio);
        if (!empty($idsmodelos)) {
            $arr = array();
            foreach ($idsmodelos as $re) {
                array_push($arr, $re['0']);
            }
            $arr = implode(',', $arr);
            if (empty($arr)) {
                $arr = '-1';
            }
            $query = Doctrine_Query::create();
            $query->select(
                            'plan.idpadre as parent, false as checked, false as leaf, plan.denominacion as text, plan.idplan as id, 1 as tipo'
                    )
                    ->from('DatPlan plan')
                    ->innerJoin('plan.DatModelo modelo')
                    ->innerJoin('modelo.DatActividadmodelo am')
                    ->innerJoin('am.NomActividad a')
                    ->innerJoin('a.DatActividadentidad ae')
                    ->andWhere('ae.idaprobacion=? OR ae.idaprobacion=?', array(3, 4))
                    ->where('plan.idplan <> ?', $idpadre)
                    ->andWhere('plan.idpadre = ?', $idpadre)
                    ->andWhere('ae.idejercicio = ?', $idejercicio)
                    ->andWhere('modelo.idmodelo in (' . $arr . ')')
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            return $query->execute();
        }
    }

    public function listarModelosBaseCalculo($idplan, $identidad, $idejercicio) {
        $idsmodelos = self::obtenerIdsModelosBase($identidad, $idejercicio);
        if (!empty($idsmodelos)) {
            $arr = array();
            foreach ($idsmodelos as $re) {
                array_push($arr, $re['0']);
            }
            $arr = implode(',', $arr);
            if (empty($arr)) {
                $arr = '-1';
            }

            $cadenaQUERY = "SELECT d.idplan AS parent,
                     " . $idejercicio . " AS idejercicio, 
                     false AS checked,
                     true AS leaf,
                     d.denominacion AS text,
                     d.idmodelo AS id,
                     2 AS tipo 
                     FROM mod_planificacion.dat_modelo d 
                     INNER JOIN mod_planificacion.dat_actividadmodelo d2 ON d.idmodelo = d2.idmodelo 
                     INNER JOIN mod_planificacion.nom_actividad n ON d2.idactividad = n.idactividad 
                     INNER JOIN mod_planificacion.dat_actividadentidad d3 ON n.idactividad = d3.idactividad 
                     WHERE ((d.idplan = " . $idplan . " AND d.idmodelo in (" . $arr . ")) 
                     AND (d3.idaprobacion = 3 OR d3.idaprobacion = 4) AND d3.idejercicio = " . $idejercicio . ") 
                     GROUP BY d.idplan, d.denominacion, d.idmodelo";

            $conex = Doctrine_Manager :: connection();
            $result = $conex->execute($cadenaQUERY)->fetchAll();

            return $result;
        }
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
        $query = new Doctrine_Query ();
        $temp = $query->from('DatModelo m')->where('m.idmodelo=?', $idmodelo)->execute()->toArray();
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
        $query = new Doctrine_Query ();
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
        $query = new Doctrine_Query ();
        $result = $query->from('DatModelo')->limit($limite = 0)->offset($inicio = 20)->execute();
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
    public function getModelosPlanDesglose($node, $identidad, $parametros) {
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
                Inner JOIN mod_planificacion.dat_norma n ON a.idactividad = n.idactividad 
                Inner JOIN mod_planificacion.nom_indicador i ON i.idindicador = n.idindicador
                Inner JOIN mod_planificacion.dat_indicadormodelo im ON i.idindicador = im.idindicador
                LEFT JOIN mod_planificacion.dat_actividadmodelo am ON a.idactividad = am.idactividad 
                INNER JOIN mod_planificacion.dat_modelo m ON (am.idmodelo = m.idmodelo OR im.idmodelo = m.idmodelo)                        
                INNER JOIN mod_planificacion.dat_plan p ON m.idplan = p.idplan   
                INNER JOIN mod_planificacion.dat_actespcomportamiento aec ON n.idactividad = aec.idactividad AND (aec.idespecialidad = " . $parametros['idespecialidad'] . " )
                INNER JOIN mod_planificacion.dat_actividadentidad ae ON aec.idactespcomportamiento = ae.idactespcomportamiento
                LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON ae.idactividadentidad = aem.idactividadentidad
                LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON ae.idactividadentidad = aea.idactividadentidad
                LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON ae.idactividadentidad = aep.idactividadentidad 
                WHERE a.estado = 1 AND 
                a.nivel = " . $parametros['nivel'] . " AND 
                a.idaprobacion >= 3 AND
                (ae.identidad = " . $identidad . " AND ae.idejercicio = " . $parametros['idejercicio'] . ") 
                ORDER BY m.idmodelo ";
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    public function getModelosPlan($node, $identidad) {
        $query = new Doctrine_Query ();
        $res = $query->select(
                        'm.idmodelo,d.identidadmodelo,m.idmodelo as id,m.denominacion,m.descripcion,m.fechaentrega,m.idplan,m.idtipomodelo,m.denominacion as text,true as leaf, 2 as tipo, m.uriruta as ruta'
                )
                ->from('DatModelo m,m.DatEntidadmodelo d,m.DatModelodatosnomenclador dmdn')
                ->where('m.idplan =? AND d.identidad=?', array($node, $identidad))
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();

        return $res;
    }

    function obtenerModelosDadoEntidad($identidad) {
        $query = new Doctrine_Query ();
        $planes = $query->select('m.idmodelo,m.denominacion')->from('Datmodelo m')->where('m.identidad=?', $identidad)
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
        $query = new Doctrine_Query ();
        $query->from("DatModelo m")->where("m.identidad = ?", $identidad);
        $query->addWhere("m.idpadre = ?", $idpadre);
        return $query->execute()->toArray();
    }

    /**
     * getModelosPlanDeUnTipoModelo
     * Devuelve los modelos de un plan que tengan el mismo tipo de modelo que el pasado por parametro, pero que no tengan el mismo id de modelo
     *
     * @param
     * $plan
     * $idtipomodelo
     * $idmodelo
     *
     * @return
     * listado de modelos
     */
    public function getModelosPlanDeUnTipoModelo($plan, $idtipomodelo, $idmodelo) {
        $query = new Doctrine_Query ();
        $res = $query->select(
                        'm.idmodelo,m.idmodelo as id,m.denominacion,m.descripcion,m.fechaentrega,m.idplan,m.idtipomodelo,m.denominacion as text,true as leaf, 2 as tipo'
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
        $query = new Doctrine_Query ();
        $res = $query->select('m.idtipomodelo')->from('DatModelo m')->where('m.idmodelo =?', $idmodelo)->execute()
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
        $query = new Doctrine_Query ();
        $res = $query->select(
                                'm.idmodelo,m.idmodelo as id,m.denominacion,m.descripcion,m.fechaentrega,m.idaprobacion,m.idplan,m.idtipomodelo,m.denominacion as text,true as leaf,false  as checked, 2 as tipo, '
                                . "'modelo'" . ' as iconCls'
                        )->from('DatModelo m,m.DatModeloclasifmodelo d')->where('m.idplan =? AND d.idclasifmodelo=?', array($plan, 1))
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
        $query = new Doctrine_Query ();
        $res = $query->select(
                        'm.idmodelo,m.idmodelo as id,m.denominacion,m.descripcion,m.fechaentrega,m.idaprobacion,m.idplan,m.idtipomodelo,m.denominacion as text,true as leaf,false  as checked, 3 as tipo, '
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
        $query = new Doctrine_Query ();
        $temp = $query->select('m.idmodelo, m.denominacion')->from('DatModelo m')->where(
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
        $query = new Doctrine_Query ();
        $temp = $query->from('DatModelo m')->where('m.idtipomodelo=?', $idtipomodelo)->execute()->toArray();
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
        $query = new Doctrine_Query ();
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
        return $query->select('COUNT(idplanificacion) as total')->from('DatPlanificacion')->where(
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
        return $query->from('DatPlanificacion d')->where('d.identidadmodelo = ?', $idmodeloentidad)->setHydrationMode(
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

        $query = new Doctrine_Query ();
        $result = $query->from('DatPlanificacion d,d.DatEntidadmodelo e,e.DatModelo p,p.NomTipomodelo l')->where(
                        'd.idplanificacion=?', $idplanificacion
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function devolverModelos() {
        $query = new Doctrine_Query ();
        $result = $query->select(
                        'dm.idmodelo, dm.denominacion, dm.fechaentrega, dm.identidad, dm.idplan, dm.idtipomodelo, dm.version, dm.descripcion'
                )->from('DatModelo dm')->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function verUsoEnModelo($idtipomodelo) {
        $query = new Doctrine_Query ();
        $enuso = $query->select('d.idtipomodelo')->from('DatModelo d')->where('d.idtipomodelo= ?', $idtipomodelo)
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
        if (($params['aprobado'] == 2 || $params['aprobado'] == 4)) { //si se quiere aprobar y la necesidad es cero
            $q->addWhere('p.cantidad <> 0');
        }
        if ($params['rectora'] != 'true') { //si se quiere desaprobar aprobado=1, y esta aprobado por el rector, y el no es rector no se puede
            $q->addWhere('p.idaprobaciondemanda <> 4');
            $q->addWhere('p.idaprobaciondemanda <> 5');
        }

        $result = $q->execute();
    }

    public function aprobarDesaprobarAjusteFamilia($params) {
        $q = new Doctrine_Query();
        $res = $q->update('DatPlanificacion p')
                ->set('idaprobaciondemanda', $params['aprobado'])
                ->whereIn('p.idplanificacion', $params['idplanificacion'])
                ->addWhere('p.ajuste <> 0');

        if ($params['aprobado'] == 5) { //si se quiere aprobar el ajuste
            $q->addWhere('p.idaprobaciondemanda =4');
        } else if ($params['aprobado'] == 4) {
            $q->addWhere('p.idaprobaciondemanda = 5');
        }

        $q->execute();
        $result->codMsg = 1;
        return $result;
    }

    public function aprobarDesaprobarTodosFamilia($identidadmodelo, $aprobado, $rectora, $idejercicio) {
        $q = new Doctrine_Query();
        $q->update('DatPlanificacion p')
                ->set('idaprobaciondemanda', $aprobado)
                ->whereIn('p.identidadmodelo', $identidadmodelo)
                ->addWhere('p.idejercicio=?', $idejercicio);
        if (($aprobado == 2 || $aprobado == 4)) { //si se quiere aprobar y la necesidad es cero
            $q->addWhere('p.cantidad <> 0');
        }
        if ($rectora != 'true') { //si se quiere desaprobar aprobado=1, y esta aprobado por el rector, y el no es rector no se puede
            $q->addWhere('p.idaprobaciondemanda <> 4');
            $q->addWhere('p.idaprobaciondemanda <> 5');
        }

        $result = $q->execute();
    }

    public function aprobarDesaprobarTodosAjusteFamilia($params) {
        $q = new Doctrine_Query();
        $res = $q->update('DatPlanificacion p')
                ->set('idaprobaciondemanda', $params['aprobado'])
                ->whereIn('p.identidadmodelo', $params['identidadmodelo'])
                ->addWhere('p.idejercicio=?', $params['idejercicio'])
                ->addWhere('p.ajuste<>0');
        if ($params['aprobado'] == 5) { //si se quiere aprobar el ajuste
            $q->addWhere('p.idaprobaciondemanda =4');
        } else if ($params['aprobado'] == 4) {
            $q->addWhere('p.idaprobaciondemanda = 5');
        }
        if ($params['rectora'] == 'true') {
            $q->execute();
            $result->codMsg = 1;
        }
        else
            $result->codMsg = 2;

        return $result;
    }

    public function dameIdModelo($denominacion) {
        $query = new Doctrine_Query ();
        $result = $query->select(
                                'dm.idmodelo'
                        )->from('DatModelo dm')
                        ->where("dm.denominacion LIKE ? ", $denominacion)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

}

//fin clase 
?>


