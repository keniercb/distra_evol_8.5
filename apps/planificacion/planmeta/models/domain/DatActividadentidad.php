<?php

class DatActividadentidad extends BaseDatActividadentidad {

    public function setUp() {

        parent::setUp();
        $this->hasOne(
                'NomActividad', array('local' => 'idactividad', 'foreign' => 'idactividad')
        );

        $this->hasMany(
                'DatControlejecucionnivelactividad', array('local' => 'idactividadentidad',
            'foreign' => 'idactividadentidad')
        );
        $this->hasMany(
                'DatDesviacionnivelactividad', array('local' => 'idactividadentidad',
            'foreign' => 'idactividadentidad')
        );
        $this->hasMany(
                'DatDesviacionnivelactividadxsustitucion', array('local' => 'idactividadentidad',
            'foreign' => 'idactividadentidad')
        );
        $this->hasOne(
                'DatActividadentidadmanual', array('local' => 'idactividadentidad',
            'foreign' => 'idactividadentidad')
        );
        $this->hasOne(
                'DatActividadentidadautomatico', array('local' => 'idactividadentidad',
            'foreign' => 'idactividadentidad')
        );
        $this->hasOne(
                'NomEjercicioplanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
        $this->hasOne(
                'DatActividadentidadprodcartatec', array('local' => 'idactividadentidad',
            'foreign' => 'idactividadentidad')
        );
        $this->hasOne(
                'DatActividadentidadproduccion', array('local' => 'idactividadentidad',
            'foreign' => 'idactividadentidad')
        );
        $this->hasOne(
                'DatActividadentidadindustrial', array('local' => 'idactividadentidad',
            'foreign' => 'idactividadentidad')
        );
        $this->hasMany(
                'DatNivelactividadporfecha', array('local' => 'idactividadentidad',
            'foreign' => 'idactividadentidad')
        );
        $this->hasMany(
                'DatNivelactividadporfechareal', array('local' => 'idactividadentidad',
            'foreign' => 'idactividadentidad')
        );
        $this->hasMany(
                'DatActividadentidadnae', array('local' => 'idactividadentidad',
            'foreign' => 'idactividadentidad')
        );
        $this->hasMany(
                'DatDesglosecompleto', array('local' => 'idactividadentidad',
            'foreign' => 'idactividadentidad')
        );
        $this->hasMany(
                'DatDesgloseentidadnivel', array('local' => 'idactividadentidad',
            'foreign' => 'idactividadentidad')
        );
    }

    private function addWhereConParams(&$where, $columCond, $param
    ) {
        $where .= " AND " . $columCond . $param;
    }

    public function buscar(
            $identidad, $idactividad, $conAsocManual = false, $conAsocAuto = false, $conAsocProd = false, $conAsocProdcartatec = false
    ) {
        $queryBuscar = new Doctrine_Query();
        $queryBuscar->from('DatActividadentidad ae');

        if ($conAsocManual) {
            $queryBuscar->leftJoin('ae.DatActividadentidadmanual aem');
        }
        if ($conAsocAuto) {
            $queryBuscar->leftJoin('ae.DatActividadentidadautomatico aea');
        }
        if ($conAsocProd) {
            $queryBuscar->leftJoin('ae.DatActividadentidadproduccion aep');
        }
        if ($conAsocProdcartatec) {
            $queryBuscar->leftJoin('ae.DatActividadentidadprodcartatec aepct');
        }
        $queryBuscar->where(
                "ae.identidad=? AND ae.idactividad=?", array($identidad, $idactividad)
        );
        return $queryBuscar->execute();
    }

    //Utilizado como servicio
    public function buscarXEjercicio(
            $identidad, $idactividad, $idejercicio, $conAsocManual = false, $conAsocAuto = false, $conAsocProd = false
    ) {

        $queryBuscar = new Doctrine_Query();
        $queryBuscar->from('DatActividadentidad ae');

        if ($conAsocManual) {
            $queryBuscar->leftJoin('ae.DatActividadentidadmanual aem');
        }
        if ($conAsocAuto) {
            $queryBuscar->leftJoin('ae.DatActividadentidadautomatico aea');
        }
        if ($conAsocProd) {
            $queryBuscar->leftJoin('ae.DatActividadentidadproduccion aep');
        }
        /* if ($conAsocProdcartatec) {
          $queryBuscar->leftJoin('ae.DatActividadentidadprodcartatec aepct');
          } */
        $queryBuscar->where(
                "ae.identidad=? AND ae.idactividad=? AND ae.idejercicio=?", array($identidad, $idactividad, $idejercicio)
        );
        $result = $queryBuscar->execute();
        return $result;
    }

    public function buscarActEspProduccion($identidad, $idactividad, $comoarray = false
    ) {
        $queryBuscar = new Doctrine_Query();
        $queryBuscar->from('DatActividadentidad ae');
        $queryBuscar->leftJoin('ae.DatActividadentidadproduccion aep');
        $queryBuscar->where(
                "ae.identidad=? AND ae.idactividad=?", array($identidad, $idactividad)
        );
        return ($comoarray == true) ? $queryBuscar->execute()->toArray(true) : $queryBuscar->execute();
    }

    public function estaActAsociada($idactividad) {
        $query = Doctrine_Query::create();
        $result = $query->select('idactividadentidad')
                        ->from('DatActividadentidad ae')
                        ->innerJoin('ae.DatActespcomportamiento aed')
                        ->where('aed.idactividad = ?', $idactividad)->offset(0)
                        ->limit(1)->execute();
        return (($result[0]->idactividadentidad != null) ? true : false);
    }

    public function buscarActividadesAsociadasAEntidad($identidad, $idejercicio) {
        /* Garantizar que las actividades asociadas tengan normas asociadas */
        $query = Doctrine_Query::create();

        $resultparcial = $query->select('idactividad')
                        ->from('DatActividadentidad ae')
                        ->innerJoin('ae.NomActividad a')
                        ->innerJoin('a.DatNorma n')->addWhere(
                                'ae.idejercicio =?', $idejercicio
                        )
                        ->where('a.estado = 1 AND ae.identidad = ?', $identidad)
                        ->addWhere('ae.idejercicio = ?', $idejercicio)->execute();

        $actividades = array();
        foreach ($resultparcial as $asocActent) {
            $actividades[] = array($asocActent->idactividad);
        }
        return $actividades;
    }

    public function existeActividadAsociadaAEntidadAutomatica($identidad, $idactividad
    ) {
        /* busca las entidades asociadas a la entidad automatico */
        $query = Doctrine_Query::create();
        return ($query
                        ->from('DatActividadentidad ae')
                        ->innerJoin('ae.DatActividadentidadautomatico aea')
                        ->where(
                                'ae.identidad = ? AND ae.idactividad = ?', array($identidad, $idactividad)
                        )->execute()->getFirst()->idactividadentidad);
    }

    public function buscarEntidadesAsociadasAActividad($idact, $asocotrashijas = false
    ) {
        $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
        $query = Doctrine_Query::create();
        $query->from('DatActividadentidad ae');
        if ($asocotrashijas == true) {
            $query->leftJoin('ae.DatActividadentidadmanual aem');
            $query->leftJoin('ae.DatActividadentidadproduccion aep');
        }
        $resultado = $query->leftJoin('ae.DatActividadentidadautomatico aea')
                        ->leftJoin('aea.DatRegla r')->leftJoin('r.DatNorma n')
                        ->where('ae.idejercicio = ?', $arrayIdejercicio[0]['idejercicio'])
                        ->whereIn('ae.idactividad', $idact)->execute();
        return $resultado;
    }

    public function calcularNivelActividad($idactividad) {
        /* busca las entidades asociadas a la entidad automatico */
        $query = Doctrine_Query::create();
        $asocActentManualAuto = $query
                        ->from('DatActividadentidad ae')
                        ->innerJoin('ae.DatActividadentidadmanual aem')
                        ->leftJoin('ae.DatActividadentidadautomatico aea')
                        ->leftJoin('aea.DatRegla r')->leftJoin('r.DatNorma n')
                        ->where('ae.idactividad = ?', $idactividad)->execute()->getFirst();
        $nivelactividad = 0;
        if ($asocActentManualAuto->idactividadentidad != null) {
            $nivelactividad = $asocActentManualAuto->DatActividadentidadmanual->nivelactividadmanual;
            $nivelactividad += ($asocActentManualAuto->DatActividadentidadautomatico->nivelactividadautomatico != null) ? $asocActentManualAuto->DatActividadentidadautomatico->nivelactividadautomatico : 0;
        }
        return $nivelactividad;
    }

    public function buscarEntidadAsociadasConActividad($idactividad) {
        /* Garantizar que las actividades asociadas tengan normas asociadas */
        $query = Doctrine_Query::create();
        return $query->select('ae.idactividadentidad,ae.identidad')
                        ->from('DatActividadentidad ae')->where(
                                'ae.idactividad = ?', $idactividad
                        )
                        ->execute();
    }

    public function BuscarIdactividadEntidades1($identidad, $idactividades, $idejercicio
    ) {
        $query = Doctrine_Query::create();
        $query->select('a.idactividadentidad')
                ->from('DatActividadentidad a')
                ->addWhere('a.idactividad=?', $idactividades)
                ->addWhere('a.identidad = ?', $identidad)
                ->addWhere('a.idejercicio = ?', $idejercicio);
        //print_r($query->getSqlQuery());die;
        return $query->execute()->toArray(true);
    }

    public function obtenerIdActividadEntidad($identidad, $idactividad, $idejercicio
    ) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT idactividadentidad
                FROM mod_planificacion.dat_actividadentidad
                WHERE identidad = $identidad AND
                      idactividad = $idactividad AND
                      idejercicio = $idejercicio";
        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    public function obtenerTodosNivelesEntidad($identidad, $idespecialidad, $idejercicio
    ) {
        /* Obtener todos los niveles de actividad que coincidan con las actividades
          demandadas a esa especialidad, que puede ser una subespecialidad ,
          por lo que se idespecialidad puede ser distinto
         */
        $query = Doctrine_Query::create();
        return $query->from('DatActividadentidad ae')
                        ->leftJoin('ae.DatActividadentidadmanual aem')
                        ->leftJoin('ae.DatActividadentidadautomatico aea')
                        ->addWhere('ae.identidad = ?', $identidad)
                        ->addWhere('ae.idejercicio = ?', $idejercicio)
                        ->addWhere(
                                "ae.idactividad in (select idactividad from dat_actespcomportamiento where  idespecialidad = ? )", $idespecialidad
                        )->execute()->toArray(true);
    }

    public function obtenerRestoXDistribuir($idejercicio, $idespecialidad, $strEntidadesProductoras, $idactividad
    ) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT   DISTINCT aec.idactividad,
               ( COALESCE ( anp.nivelproduccion,0) -  SUM( COALESCE (aem.nivelactividadmanual,0)+
               COALESCE (aea.nivelactividadautomatico,0) +
               COALESCE (aep.nivelactividadproduccion,0) )) as restoxdistrib
               FROM mod_planificacion.dat_actespcomportamiento aec
               INNER JOIN mod_planificacion.nom_actividad a
               ON( a.idactividad = {$idactividad}
                AND a.idespecialidad = {$idespecialidad}
                AND a.idactividad = aec.idactividad
                AND a.idespecialidad = aec.idespecialidad
                AND ( a.idaprobacion = 3 OR a.idaprobacion = 4 )
                AND a.estado = 1
                AND aec.iddatosnomenclador IN (
                SELECT dn.iddatosnomenclador
                FROM mod_planificacion.nom_datosnomenclador dn
                WHERE dn.uridatosnomenclador IN('propia')
                ))
                LEFT JOIN mod_planificacion.dat_actividadentidad ae
                ON(a.idactividad = ae.idactividad
                AND ae.idactespcomportamiento = aec.idactespcomportamiento
                AND ae.idejercicio = {$idejercicio}
                AND identidad IN({$strEntidadesProductoras})
                )
                LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                ON(aem.idactividadentidad = ae.idactividadentidad)
                LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                ON(aea.idactividadentidad = ae.idactividadentidad)
                LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
                ON( aep.idactividadentidad = ae.idactividadentidad)
                LEFT JOIN mod_planificacion.dat_actividadnivelproduccion anp
                ON(anp.idactividad = a.idactividad)
                WHERE aec.idactividad IN ( SELECT n.idactividad
                                        FROM mod_planificacion.dat_norma n
                                        INNER JOIN mod_planificacion.nom_indicador ind
                                        ON( n.idactividad = a.idactividad AND n.idindicador = ind.idindicador
                                        AND ind.estado = 1 AND ind.nivel = 1
                                        AND (ind.idaprobacion = 3 OR  ind.idaprobacion = 4)  ) )
                GROUP BY aec.idactividad,anp.nivelproduccion";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult[0]['restoxdistrib'];
    }

    public function BuscarIdactividadEntidades($identidad, $idactividades) {
        $query = Doctrine_Query::create();
        $query->select('a.idactividadentidad')
                ->from('DatActividadentidad a')
                ->whereIn('a.idactividad', $idactividades)
                ->addWhere('a.identidad = ?', $identidad);
        return $query->execute()->toArray(true);
    }

    public function EliminarporEntidades($identidad, $idactividades) {
        $query = Doctrine_Query::create();
        return $query->delete('DatActividadentidad')
                        ->from('DatActividadentidad')->whereIn(
                                'idactividad', $idactividades
                        )
                        ->addWhere('identidad = ?', $identidad)->execute();
    }

    public function EliminarIdentidadIdActividad($identidad, $idactividad) {
        $query = Doctrine_Query::create();
        $query->delete('DatActividadentidad')
                ->from('DatActividadentidad')
                ->addWhere('identidad = ?', $identidad)
                ->addWhere('idactividad = ?', $idactividad);
        return $query->execute();
    }

    public function BuscarNivelesActEntidad($identidad, $idactividad) {
        $conn = Doctrine_Manager::connection();
        //$queryBuscar = new Doctrine_Query();
        $sql = "SELECT
                  (mod_planificacion.dat_actividadentidadautomatico.idactividadentidad IS NOT NULL OR
                  mod_planificacion.dat_actividadentidadmanual.idactividadentidad IS NOT NULL OR
                  mod_planificacion.dat_actividadentidadproduccion.idactividadentidad IS NOT NULL OR
                  mod_spouam.dat_actividadentidadprodcartatec.idactividadentidad IS NOT NULL) AS existe,
                  mod_planificacion.dat_actividadentidad.idactividadentidad
                FROM
                  mod_planificacion.dat_actividadentidad
                  LEFT OUTER JOIN mod_planificacion.dat_actividadentidadautomatico
                  ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
                  mod_planificacion.dat_actividadentidadautomatico.idactividadentidad)
                  LEFT OUTER JOIN mod_planificacion.dat_actividadentidadmanual
                   ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
                   mod_planificacion.dat_actividadentidadmanual.idactividadentidad)
                  LEFT OUTER JOIN mod_planificacion.dat_actividadentidadproduccion
                   ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
                   mod_planificacion.dat_actividadentidadproduccion.idactividadentidad)
                  LEFT OUTER JOIN mod_spouam.dat_actividadentidadprodcartatec
                  ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
                  mod_spouam.dat_actividadentidadprodcartatec.idactividadentidad)
                WHERE
                  mod_planificacion.dat_actividadentidad.identidad = ? AND
                  mod_planificacion.dat_actividadentidad.idactividad = ?";
        $result = $conn->execute($sql, array($identidad, $idactividad))
                ->fetchAll();
        return $result;
    }

    public function listarActividades($params) {
        $arrParams = array();
        $condicion = array();
        if ($params['codigo'] != '') {
            $condicion [] = 'na.codigo like ?';
            $arrParams [] = '' . $params['codigo'] . '%';
        }
        if ($params['denominacion'] != '') {
            $condicion [] = "upper(na.denominacion) like ?";
            $arrParams [] = '%' . strtoupper($params['denominacion']) . '%';
        }
        if ($params['nivelactividad'] != '') {
            $condicion [] = "(COALESCE(aea.nivelactividadautomatico,0) +
                COALESCE(aem.nivelactividadmanual,0) + COALESCE(aep.nivelactividadproduccion,0) ) "
                    . $params['nivelactividad']['condicion'] . ' ?';
            $arrParams [] = $params['nivelactividad']['nivelactividad'];
        }
        if ($params['nivelactividadreal'] != '') {
            $condicion [] = "COALESCE((SELECT sum(naxfr.nivelactividadreal)
                FROM mod_planificacion.dat_actividadentidad ae
                INNER JOIN  mod_planificacion.dat_nivelactividadporfechareal naxfr
                ON (ae.idactividadentidad = naxfr.idactividadentidad)
                WHERE identidad IN " . '(' . $params['identidad']
                    . ") AND ae.idactividad = dae.idactividad),0) "
                    . $params['nivelactividadreal']['condicion'] . ' ?';
            $arrParams [] = $params['nivelactividadreal']['nivelactividadreal'];
        }
        if ($params['porciento'] != '') {
            $having = "HAVING
		(((SELECT sum(naxfr.nivelactividadreal)
                FROM mod_planificacion.dat_actividadentidad ae
                INNER JOIN  mod_planificacion.dat_nivelactividadporfechareal naxfr
                ON (ae.idactividadentidad = naxfr.idactividadentidad)
                WHERE identidad IN " . '(' . $params['identidad'] . ")
                AND ae.idactividad = dae.idactividad) *100)/(COALESCE(aea.nivelactividadautomatico,0) +
                COALESCE(aem.nivelactividadmanual,0) +
                COALESCE(aep.nivelactividadproduccion,0) )) "
                    . $params['porciento']['condicion'] . ' ?';
            $arrParams [] = $params['porciento']['porciento'];
        }
        $addWhere = "";


        foreach ($condicion as $value) {
            $addWhere .= " AND " . $value;
        }
        $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
        $conn = Doctrine_Manager::connection();
        $query = "SELECT distinct(na.idactividad),
                (((SELECT sum(naxfr.nivelactividadreal)
                FROM mod_planificacion.dat_actividadentidad ae
                INNER JOIN  mod_planificacion.dat_nivelactividadporfechareal naxfr
                ON (ae.idactividadentidad = naxfr.idactividadentidad)
                WHERE identidad IN " . '(' . $params['identidad'] . ")
                AND ae.idactividad = dae.idactividad) *100)/(COALESCE(aea.nivelactividadautomatico,0) +
                COALESCE(aem.nivelactividadmanual,0) +
                COALESCE(aep.nivelactividadproduccion,0) )) as porciento,


                (COALESCE(aea.nivelactividadautomatico,0) +
                COALESCE(aem.nivelactividadmanual,0) +
                COALESCE(aep.nivelactividadproduccion,0) ) as nivelactividad," .
                "COALESCE((SELECT sum(naxfr.nivelactividadreal)
            FROM mod_planificacion.dat_actividadentidad ae
            INNER JOIN  mod_planificacion.dat_nivelactividadporfechareal naxfr
            ON (ae.idactividadentidad = naxfr.idactividadentidad)
            WHERE identidad IN " . '(' . $params['identidad'] . ") AND ae.idactividad = dae.idactividad),0)
                AS nivelactividadreal,
                na.codigo,
                UPPER(na.denominacion) AS denominacion
                FROM mod_planificacion.nom_actividad na
                INNER JOIN mod_planificacion.dat_actespcomportamiento daec
                ON (na.idactividad = daec.idactividad)
                INNER JOIN mod_planificacion.dat_actividadentidad dae
                ON (dae.idactespcomportamiento = daec.idactespcomportamiento
                AND dae.identidad IN " . '(' . $params['identidad'] . ")
                AND dae.idejercicio =  {$arrayIdejercicio[0]['idejercicio']})
                LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                ON(aem.idactividadentidad = dae.idactividadentidad)
                LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                ON(aea.idactividadentidad = dae.idactividadentidad)
                LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
                ON( aep.idactividadentidad = dae.idactividadentidad)
                LEFT JOIN mod_planificacion.dat_nivelactividadporfecha napf
                ON( napf.idactividadentidad = dae.idactividadentidad)"
                . "WHERE na.idaprobacion >= 3 AND na.estado = 1 AND dae.idaprobacion >= 3
               $addWhere GROUP BY na.codigo,na.denominacion,na.idactividad,dae.idactividad,
                nivelactividad,aea.nivelactividadautomatico,aem.nivelactividadmanual,
                aep.nivelactividadproduccion $having OFFSET ? LIMIT ?";
        $arrLimits [] = $params['start'];
        $arrLimits [] = $params['limit'];
        $data->data = $conn->execute(
                        $query, array_merge($arrParams, $arrLimits)
                )->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarnNivelesporActividad($params) {
        $arrParams = array();
        $condicion = array();
        $arrParams [] = $params['identidad'];
        $arrParams [] = $params['idactividad'];
        if ($params['usuario'] != '') {
            $condicion [] = "mod_planificacion.dat_nivelactividadporfechareal.idusuario= ?";
            $arrParams [] = $params['usuario'];
        }
        if ($params['fechareal'] != '') {
            $condicion [] = "mod_planificacion.dat_nivelactividadporfechareal.fechareal "
                    . $params['fechareal']['condicion']
                    . ' ?';
            $arrParams [] = $params['fechareal']['fechareal'];
        }
        if ($params['nivelactividadreal'] != '') {
            $condicion [] = "mod_planificacion.dat_nivelactividadporfechareal.nivelactividadreal "
                    . $params['nivelactividadreal']['condicion'] . ' ?';
            $arrParams [] = $params['nivelactividadreal']['nivelactividadreal'];
        }
        $addWhere = "";
        foreach ($condicion as $value) {
            $addWhere .= " AND " . $value;
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT
            mod_planificacion.dat_actividadentidad.idactividadentidad,
            mod_planificacion.dat_nivelactividadporfechareal.idnivelactividadporfechareal,
            mod_planificacion.dat_nivelactividadporfechareal.nivelactividadreal,
            mod_planificacion.dat_nivelactividadporfechareal.fechareal,
            mod_planificacion.dat_nivelactividadporfechareal.fin,
            mod_planificacion.dat_nivelactividadporfechareal.idusuario
            FROM mod_planificacion.dat_actividadentidad
            INNER JOIN mod_planificacion.dat_nivelactividadporfechareal
            ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
            mod_planificacion.dat_nivelactividadporfechareal.idactividadentidad)
            WHERE mod_planificacion.dat_actividadentidad.identidad = ?
            AND mod_planificacion.dat_actividadentidad.idactividad = ?
            $addWhere ORDER BY mod_planificacion.dat_nivelactividadporfechareal.fechareal
            OFFSET ? LIMIT ?";
        $queryTotal = "SELECT
            COUNT(mod_planificacion.dat_nivelactividadporfechareal.nivelactividadreal) AS total
            FROM mod_planificacion.dat_actividadentidad
            INNER JOIN mod_planificacion.dat_nivelactividadporfechareal
            ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
            mod_planificacion.dat_nivelactividadporfechareal.idactividadentidad)
            WHERE mod_planificacion.dat_actividadentidad.identidad = ?
            AND mod_planificacion.dat_actividadentidad.idactividad = ? $addWhere";
        $arrLimits [] = $params['start'];
        $arrLimits [] = $params['limit'];
        $data->data = $conn->execute(
                        $query, array_merge($arrParams, $arrLimits)
                )->fetchAll(PDO::FETCH_ASSOC);
        $res = $conn->execute($queryTotal, $arrParams)->fetchAll(
                PDO::FETCH_ASSOC
        );
        $data->total = $res[0]['total'];
        return $data;
    }

    public function eliminarNivelActividadporFechareal($params) {
        $deleted = Doctrine_Query:: create();
        if (!empty($params['idnivelactividadporfechareal'])) {
            $deleted->delete()
                    ->from('DatNivelactividadporfechareal n')
                    ->whereIn(
                            'n.idnivelactividadporfechareal', $params['idnivelactividadporfechareal']
            );
            return $deleted->execute();
        } else {
            return true;
        }
    }

    public function ObtenerIdUsuarios() {
        $query = Doctrine_Query::create();
        $res = $query->select('distinct(dnafr.idusuario) as idusuario')
                        ->from('DatNivelactividadporfechareal dnafr')
                        ->execute()->toArray(true);
        return $res;
    }

    public static function validarExistenciaDatos($idejercicio, $entidades) {
        //Devolviendo la cantidad.
        return Doctrine_Query::create()->select(
                                'COUNT(idactividadentidad) AS cantidad'
                        )->from('DatActividadentidad')
                        ->whereIn('identidad', $entidades)
                        ->addWhere('idejercicio=?', $idejercicio)
                        ->fetchOne()->cantidad;
    }

    public function listarTodasActividades($params, $identidad, $idejercicio) {

        $conn = Doctrine_Manager::connection();
        $condiciones = array();
        $addwhere = "";
        $ADDWHERE = "";
        $paramsQuery = array();
        foreach ($params['filtros'] as $s) {
            if ($s != null) {

                if ($s['field'] == 'codigo') {
                    self::addWhereConParams(
                            $addwhere, "upper(a.codigo)  LIKE", ("'%" . strtoupper($s['data']['value']) . "%'")
                    );
                } else {
                    if ($s['field'] == 'denominacion') {
                        self::addWhereConParams(
                                $addwhere, "upper(a.denominacion)  LIKE", ("'%" . strtoupper($s['data']['value']) . "%'")
                        );
                    } else {
                        if ($s['field'] == 'descripcion') {
                            self::addWhereConParams(
                                    $addwhere, "upper(a.descripcion)  LIKE", ("'%" . strtoupper($s['data']['value']) . "%'")
                            );
                        } else {
                            if ($s['field'] == 'nivelactividadmanual') { {
                                    $cond = "=";
                                    if ($s['data']['comparison'] == "gt") {
                                        $cond = ">";
                                    } elseif ($s['data']['comparison'] == "lt"
                                    ) {
                                        $cond = "<";
                                    }
                                    $condiciones[] = "aem.nivelactividadmanual {$cond} "
                                            . ($s['data']['value']);
                                }
                            }
                        }
                    }
                }
            }
        }
        $ADDWHERE = '';

        foreach ($condiciones as $condicion) {
            $ADDWHERE = $ADDWHERE . ' AND ' . $condicion;
        }

        $query = "SELECT a.idactividad,a.codigo, a.denominacion, a.descripcion, aem.nivelactividadmanual
                    FROM mod_planificacion.nom_actividad a
                    INNER JOIN mod_planificacion.dat_actividadentidad ae ON (ae.idactividad = a.idactividad)
                    INNER JOIN mod_planificacion.dat_actividadentidadmanual aem
                    ON(ae.idactividadentidad = aem.idactividadentidad)
                    WHERE ae.idejercicio=$idejercicio
                    AND a.estado = 1 AND ae.identidad=$identidad
                    and a.normada = 1 and a.idaprobacion  >= 3 $addwhere $ADDWHERE";
        $actividades = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);

        return $actividades;
    }

    public function devolverActEnt($idactividad, $params, $array) {
        $conn = Doctrine_Manager::connection();
        $newarray = array();
        if ($array == 1) {
            $arra = implode(',', $idactividad);
            $query = "SELECT a.idactividadentidad
                    FROM mod_planificacion.dat_actividadentidad a
                     INNER JOIN mod_planificacion.nom_actividad aem ON(a.idactividad = aem.idactividad)
                    WHERE a.idactividad IN " . '(' . $arra
                    . ") and a.idejercicio = " . $params['idEjercicio']
                    . "and a.identidad =" . $params['identidad']
                    . " and aem.estado = 1 and aem.idaprobacion >2 and aem.normada =1";
        } else {
            foreach ($idactividad as $key => $dat) {
                $newarray[] = $idactividad[$key + 1];
            }
            $arra = implode(',', $newarray);
            $query = "SELECT a.idactividadentidad
                    FROM mod_planificacion.dat_actividadentidad a
                     INNER JOIN mod_planificacion.nom_actividad aem ON(a.idactividad = aem.idactividad)
                    WHERE a.idactividad IN " . '(' . $arra
                    . ") and a.idejercicio = " . $params['idEjercicio']
                    . "and a.identidad =" . $params['identidad']
                    . " and aem.estado = 1 and aem.idaprobacion >2 and aem.normada =1";
        }
        $actividades = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);

        return $actividades;
    }

    //Utilizado como servicio
    public function obtenerEspecialidadesAct() {
        $con = Doctrine_Manager::connection();
        $query = "SELECT idespecialidad as id, denespecialidad as denominacion
  FROM mod_datosmaestros.nom_especialidad ;";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obtenerEspecialidadesDadoIdAct($idespecialidad) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT e.idespecialidad, e.denespecialidad, e.codespecialidad
  FROM mod_datosmaestros.nom_especialidad e where e.idespecialidad={$idespecialidad}";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obtenerEspecialidadesDadoCodAct($codigo) {
        $con = Doctrine_Manager::connection();
        $comilla = "'";
        $query = "SELECT e.idespecialidad, e.denespecialidad, e.codespecialidad
  FROM mod_datosmaestros.nom_especialidad e
  where e.codespecialidad like $comilla$codigo$comilla";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function buscarEntidadesPlanifNivAct($identidades, $idejercicio) {
        $query = "SELECT ae.idactividadentidad
FROM mod_planificacion.dat_actividadentidad ae
            LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON
              ae.idactividadentidad = aem.idactividadentidad
            LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON
              ae.idactividadentidad = aea.idactividadentidad
            LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON
              ae.idactividadentidad = aep.idactividadentidad
              INNER JOIN mod_planificacion.nom_actividad a ON (ae.idactividad =
              a.idactividad)
               INNER JOIN mod_planificacion.dat_norma n ON (n.idactividad =
              ae.idactividad AND n.idejercicio = $idejercicio)
            inner join mod_datosmaestros.nom_indicadorplanif ip on (
              n.idindicador = ip.idindicador)
 WHERE
            ae.identidad IN ($identidades)AND
            ae.idejercicio = $idejercicio AND
            a.estado = 1 AND
            (ae.idaprobacion = 5 OR
            ae.idaprobacion = 4) AND
            ip.idaprobacion = 4 AND
            ip.nivelplanif = 1 AND
            (COALESCE(aem.nivelactividadmanual, 0) + COALESCE(aea.nivelactividadautomatico, 0) + COALESCE(aep.nivelactividadproduccion, 0))>0
  LIMIT 1  ";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    public function listarDetallesN($identidades, $idejercicio, $porciento, $modelos
    ) {
        $modelo = new NomActividad();
        $nivel = $modelo->getNivel();
        $query = "--proyeccion de la planificacion
--ver detalles niveles
WITH consulta AS (
(SELECT x.idactividad as idactividad,
        x.codigo,
        x.denominacion,
        ((SUM(x.nivelactividad)) * $porciento) / 100 as cantidad,
        ((SUM(x.importegasto)) * $porciento) / 100 as importegasto,
        ((SUM(x.importeingreso)) * $porciento) / 100 as importeingreso
 FROM (
        SELECT a.idactividad as idactividad,
               a.codigo,
               a.denominacion,
               m.denominacion as plan,
               COALESCE(aea.nivelactividadautomatico, 0) + COALESCE(
                 aem.nivelactividadmanual, 0) + COALESCE(
                 aep.nivelactividadproduccion, 0)+ COALESCE(
                           ae.ajuste, 0) as nivelactividad,
               COALESCE((
                          select (round(Coalesce(SUM((n.necesidad)
                            * indp.precio) *(COALESCE(
                            aem.nivelactividadmanual, 0) + COALESCE(
                            aea.nivelactividadautomatico, 0) + COALESCE(
                            aep.nivelactividadproduccion, 0)), 0)
                            +(Coalesce(SUM
                            ((n.necesidad) * indp.precio) *(
                            COALESCE(aem.nivelactividadmanual, 0) + COALESCE(
                            aea.nivelactividadautomatico, 0) + COALESCE(
                            aep.nivelactividadproduccion, 0)), 0)) * indp.flete
                            / 100
                             +(Coalesce(SUM((n.necesidad) *
                            indp.precio) *(COALESCE(
                            aem.nivelactividadmanual, 0) + COALESCE(
                            aea.nivelactividadautomatico, 0) + COALESCE(
                            aep.nivelactividadproduccion, 0)), 0)) *
                            indp.contingencia / 100, 3)
                            +(round(SUM((
                            n.necesidad) * indp.precio) *
                            COALESCE(ae.ajuste, 0)
                             +(SUM((n.cantplanif /
                            n.cantbase) * indp.precio) * COALESCE(
                            ae.ajuste, 0)) * indp.flete / 100
                            +(SUM((
                            n.necesidad) * indp.precio) *
                            COALESCE(ae.ajuste, 0)) * indp.contingencia / 100, 3
                            ))) as importefinal
                          from mod_planificacion.dat_norma n
                               INNER JOIN mod_datosmaestros.nom_indicador ind ON
                                 (n.idindicador = ind.idindicador AND ind.estado
                                 = 1)
                               INNER JOIN mod_datosmaestros.nom_indicadorplanif
                                 indp ON (n.idindicador = indp.idindicador AND
                                 indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                               LEFT JOIN mod_datosmaestros.dat_indicadormodelo
                                 im ON (indp.idindicador = im.idindicador)
                          where n.idactividad = a.idactividad AND
                                n.idejercicio = $idejercicio AND
                                m.tipoplan = 0 AND
                                im.idindicador is null
                          group by indp.flete,
                                   indp.contingencia
               ), 0) as importegasto,
               COALESCE((
                          select (round(Coalesce(SUM((n.necesidad)
                            * indp.precioventa) *(COALESCE(
                            aem.nivelactividadmanual, 0) + COALESCE(
                            aea.nivelactividadautomatico, 0) + COALESCE(
                            aep.nivelactividadproduccion, 0)), 0)
                            +(Coalesce(SUM
                            ((n.necesidad) * indp.precioventa) *(
                            COALESCE(aem.nivelactividadmanual, 0) + COALESCE(
                            aea.nivelactividadautomatico, 0) + COALESCE(
                            aep.nivelactividadproduccion, 0)), 0)) * indp.flete
                            / 100
                             +(Coalesce(SUM((n.necesidad) *
                            indp.precioventa) *(COALESCE(
                            aem.nivelactividadmanual, 0) + COALESCE(
                            aea.nivelactividadautomatico, 0) + COALESCE(
                            aep.nivelactividadproduccion, 0)), 0)) *
                            indp.contingencia / 100, 3)
                            +(round(SUM((
                            n.necesidad) * indp.precioventa) *
                            COALESCE(ae.ajuste, 0)
                             +(SUM((n.cantplanif /
                            n.cantbase) * indp.precioventa) * COALESCE(
                            ae.ajuste, 0)) * indp.flete / 100
                            +(SUM((
                            n.necesidad) * indp.precioventa) *
                            COALESCE(ae.ajuste, 0)) * indp.contingencia / 100, 3
                            ))) as importefinal
                          from mod_planificacion.dat_norma n
                               INNER JOIN mod_datosmaestros.nom_indicador ind ON
                                 (n.idindicador = ind.idindicador AND ind.estado
                                 = 1)
                               INNER JOIN mod_datosmaestros.nom_indicadorplanif
                                 indp ON (n.idindicador = indp.idindicador AND
                                 indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                               LEFT JOIN mod_datosmaestros.dat_indicadormodelo
                                 im ON (ind.idindicador = im.idindicador)
                          where n.idactividad = a.idactividad AND
                                n.idejercicio = $idejercicio AND
                                m.tipoplan = 1 AND
                                im.idindicador is null
                          group by indp.flete,
                                   indp.contingencia
               ), 0) as importeingreso
        FROM mod_planificacion.nom_actividad a
             LEFT JOIN mod_planificacion.dat_actividadentidad ae ON (
               a.idactividad = ae.idactividad AND ae.idejercicio = $idejercicio AND
               ae.identidad IN ($identidades))
             LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
               aem.idactividadentidad = ae.idactividadentidad)
             LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
               aea.idactividadentidad = ae.idactividadentidad)
             LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
               aep.idactividadentidad = ae.idactividadentidad)
             INNER JOIN mod_planificacion.dat_actividadmodelo am ON (
               a.idactividad = am.idactividad)
             INNER JOIN mod_planificacion.dat_modelo m ON (m.idmodelo =
               am.idmodelo)
        WHERE m.idmodelo IN ($modelos) AND
              a.nivel = {$nivel} AND
              a.idaprobacion = 4 AND
              a.estado = 1 AND
              (ae.idaprobacion = 5 OR
              ae.idaprobacion = 4)
      ) as x
 GROUP BY x.idactividad,
          x.codigo,
          x.denominacion)),
consulta2 AS

(--esta es la de los ind directos
SELECT x.idactividad as idactividad,
       x.codigo,
       x.denominacion,

       ((SUM(x.nivelactividad)) * $porciento) / 100 as cantidad,
       ((SUM(x.importegasto)) * $porciento) / 100 as importegasto,
       ((SUM(x.importeingreso)) * $porciento) / 100 as importeingreso
FROM (
       SELECT a.idactividad as idactividad,
              a.codigo,
              a.denominacion,

              COALESCE(aea.nivelactividadautomatico, 0) + COALESCE(
                aem.nivelactividadmanual, 0) + COALESCE(
                aep.nivelactividadproduccion, 0)+ COALESCE(
                           ae.ajuste, 0) as nivelactividad,
              COALESCE((
                         select (round(Coalesce(SUM((n.necesidad)
                           * indp.precio) *(COALESCE(aem.nivelactividadmanual, 0
                           ) + COALESCE(aea.nivelactividadautomatico, 0) +
                           COALESCE(aep.nivelactividadproduccion, 0)), 0) +(
                           Coalesce(SUM((n.necesidad) *
                           indp.precio) *(COALESCE(aem.nivelactividadmanual, 0)
                           + COALESCE(aea.nivelactividadautomatico, 0) +
                           COALESCE(aep.nivelactividadproduccion, 0)), 0)) *
                           indp.flete / 100 +(Coalesce(SUM((n.cantplanif /
                           n.cantbase) * indp.precio) *(COALESCE(
                           aem.nivelactividadmanual, 0) + COALESCE(
                           aea.nivelactividadautomatico, 0) + COALESCE(
                           aep.nivelactividadproduccion, 0)), 0)) *
                           indp.contingencia / 100, 3) +(round(SUM((n.cantplanif
                           / n.cantbase) * indp.precio) * COALESCE(ae.ajuste, 0)
                           +(SUM((n.necesidad) * indp.precio) *
                           COALESCE(ae.ajuste, 0)) * indp.flete / 100 +(SUM((
                           n.necesidad) * indp.precio) * COALESCE(
                           ae.ajuste, 0)) * indp.contingencia / 100, 3))) as
                           importefinal
                         from mod_planificacion.dat_norma n
                              INNER JOIN mod_datosmaestros.nom_indicador ind ON
                                (n.idindicador = ind.idindicador AND ind.estado
                                = 1)
                              INNER JOIN mod_datosmaestros.nom_indicadorplanif
                                indp ON (n.idindicador = indp.idindicador AND
                                indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                                INNER JOIN mod_datosmaestros.dat_indicadormodelo im
                                ON (ind.idindicador
                                = im.idindicador)
                                INNER JOIN mod_planificacion.dat_modelo m ON (m.idmodelo =
              im.idmodelo)
                         where m.idmodelo IN ($modelos) AND
                          n.idactividad = a.idactividad AND
                               n.idejercicio = $idejercicio AND
                               m.tipoplan = 0
                         group by indp.flete,
                                  indp.contingencia
              ), 0) as importegasto,
              COALESCE((
                         select (round(Coalesce(SUM((n.necesidad)
                           * indp.precioventa) *(COALESCE(
                           aem.nivelactividadmanual, 0) + COALESCE(
                           aea.nivelactividadautomatico, 0) + COALESCE(
                           aep.nivelactividadproduccion, 0)), 0) +(Coalesce(SUM(
                           (n.necesidad) * indp.precioventa) *(COALESCE
                           (aem.nivelactividadmanual, 0) + COALESCE(
                           aea.nivelactividadautomatico, 0) + COALESCE(
                           aep.nivelactividadproduccion, 0)), 0)) * indp.flete /
                           100 +(Coalesce(SUM((n.necesidad) *
                           indp.precioventa) *(COALESCE(
                           aem.nivelactividadmanual, 0) + COALESCE(
                           aea.nivelactividadautomatico, 0) + COALESCE(
                           aep.nivelactividadproduccion, 0)), 0)) *
                           indp.contingencia / 100, 3) +(round(SUM((n.cantplanif
                           / n.cantbase) * indp.precioventa) * COALESCE(
                           ae.ajuste, 0) +(SUM((n.necesidad) *
                           indp.precioventa) * COALESCE(ae.ajuste, 0)) *
                           indp.flete / 100 +(SUM((n.necesidad) *
                           indp.precioventa) * COALESCE(ae.ajuste, 0)) *
                           indp.contingencia / 100, 3))) as importefinal
                         from mod_planificacion.dat_norma n
                              INNER JOIN mod_datosmaestros.nom_indicador ind ON
                                (n.idindicador = ind.idindicador AND ind.estado
                                = 1)
                              INNER JOIN mod_datosmaestros.nom_indicadorplanif
                                indp ON (n.idindicador = indp.idindicador AND
                                indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                              INNER JOIN mod_datosmaestros.dat_indicadormodelo im
                                ON (ind.idindicador
                                = im.idindicador)
                                INNER JOIN mod_planificacion.dat_modelo m ON (m.idmodelo =
              im.idmodelo)
                         where m.idmodelo IN ($modelos) AND
                         n.idactividad = a.idactividad AND
                               n.idejercicio = $idejercicio AND
                               m.tipoplan = 1
                         group by indp.flete,
                                  indp.contingencia
              ), 0) as importeingreso
       FROM mod_planificacion.nom_actividad a
            LEFT JOIN mod_planificacion.dat_actividadentidad ae ON (
              a.idactividad = ae.idactividad AND ae.idejercicio = $idejercicio AND
              ae.identidad IN ($identidades))
            LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
              aem.idactividadentidad = ae.idactividadentidad)
            LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
              aea.idactividadentidad = ae.idactividadentidad)
            LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
              aep.idactividadentidad = ae.idactividadentidad)
            INNER JOIN mod_planificacion.dat_actividadmodelo am ON (a.idactividad
              = am.idactividad)

       WHERE
             a.nivel = {$nivel} AND
             a.idaprobacion = 4 AND
             a.estado = 1 AND
             (ae.idaprobacion = 5 OR
             ae.idaprobacion = 4)
     ) as x
GROUP BY x.idactividad,
         x.codigo,
         x.denominacion)
    SELECT DISTINCT q.codigo,
                q.denominacion,
                sum(q.cantidad) as cantidad,
                sum(COALESCE(c.importegasto, 0) + COALESCE(q.importegasto, 0))
                  as importegasto,
                sum(COALESCE(c.importeingreso, 0) + COALESCE(q.importeingreso, 0
                  )) as importeingreso
         from consulta c
              RIGHT JOIN consulta2 q ON c.codigo = q.codigo
         GROUP BY q.codigo,
                  q.denominacion";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function listarDetallesNcont($identidades, $idejercicio, $modelos
    ) {
        $modelo = new NomActividad();
        $nivel = $modelo->getNivel();
        $query = "WITH consulta AS ( (SELECT x.idactividad as idactividad,
                           x.codigo
                    FROM (
                           SELECT a.idactividad as idactividad,
                                  a.codigo
                           FROM mod_planificacion.nom_actividad a
                                LEFT JOIN mod_planificacion.dat_actividadentidad
                                  ae ON (a.idactividad = ae.idactividad AND
                                  ae.idejercicio = $idejercicio AND ae.identidad IN (
                                  $identidades))
                                LEFT JOIN
                                  mod_planificacion.dat_actividadentidadmanual
                                  aem ON (aem.idactividadentidad =
                                  ae.idactividadentidad)
                                LEFT JOIN
                                  mod_planificacion.dat_actividadentidadautomatico
                                  aea ON (aea.idactividadentidad =
                                  ae.idactividadentidad)
                                LEFT JOIN
                                  mod_planificacion.dat_actividadentidadproduccion
                                  aep ON (aep.idactividadentidad =
                                  ae.idactividadentidad)
                                INNER JOIN mod_planificacion.dat_actividadmodelo
                                  am ON (a.idactividad = am.idactividad)
                                INNER JOIN mod_planificacion.dat_modelo m ON (
                                  m.idmodelo = am.idmodelo)
                           WHERE m.idmodelo IN ($modelos) AND
                                 a.nivel = {$nivel} AND
                                 a.idaprobacion = 4 AND
                                 a.estado = 1 AND
                                 (ae.idaprobacion = 5 OR
                                 ae.idaprobacion = 4)
                         ) as x
                    GROUP BY x.idactividad,
                             x.codigo)),
                              consulta2 AS (
                               --esta es la de los ind directos
                               SELECT x.idactividad as idactividad,
                                      x.codigo
                               FROM (
                                      SELECT a.idactividad as idactividad,
                                             a.codigo
                                      FROM mod_planificacion.nom_actividad a
                                           LEFT JOIN
                                             mod_planificacion.dat_actividadentidad
                                             ae ON (a.idactividad =
                                             ae.idactividad AND ae.idejercicio =
                                             $idejercicio AND ae.identidad IN ($identidades))
                                           LEFT JOIN
                                             mod_planificacion.dat_actividadentidadmanual
                                             aem ON (aem.idactividadentidad =
                                             ae.idactividadentidad)
                                           LEFT JOIN
                                             mod_planificacion.dat_actividadentidadautomatico
                                             aea ON (aea.idactividadentidad =
                                             ae.idactividadentidad)
                                           LEFT JOIN
                                             mod_planificacion.dat_actividadentidadproduccion
                                             aep ON (aep.idactividadentidad =
                                             ae.idactividadentidad)
                                           INNER JOIN
                                             mod_planificacion.dat_actividadmodelo
                                             am ON (a.idactividad =
                                             am.idactividad)
                                      WHERE a.nivel = {$nivel} AND
                                            a.idaprobacion = 4 AND
                                            a.estado = 1 AND
                                            (ae.idaprobacion = 5 OR
                                            ae.idaprobacion = 4)
                                    ) as x
                               GROUP BY x.idactividad,
                                        x.codigo)
                                  SELECT count(DISTINCT q.idactividad) as cont
                                  from consulta c
                                       RIGHT JOIN consulta2 q ON c.codigo =
                                         q.codigo
";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    public function calcularImporteTotalN($parametros) {
        $modelo = new NomActividad();
        $nivel = $modelo->getNivel();
        $query = "
--proyeccion de la planificacion
--ver detalles niveles
WITH
consulta AS (
(SELECT x.codigo,
        ((SUM(x.importegasto)))  as importegasto,
        ((SUM(x.importeingreso)))  as importeingreso
 FROM (
        SELECT a.codigo,
               COALESCE((
                          select (round(Coalesce(SUM((n.necesidad) * indp.precio) * (
                          COALESCE(aem.nivelactividadmanual, 0) +
                          COALESCE(aea.nivelactividadautomatico, 0) +
                          COALESCE(aep.nivelactividadproduccion, 0)), 0) + (

                          Coalesce(SUM((n.necesidad) * indp.precio) *(
                          COALESCE(aem.nivelactividadmanual, 0) +
                          COALESCE(aea.nivelactividadautomatico, 0) +
                          COALESCE(aep.nivelactividadproduccion, 0)), 0)) * indp.flete / 100 +(

                          Coalesce(SUM((n.necesidad) *indp.precio) *(
                          COALESCE(aem.nivelactividadmanual, 0) +
                          COALESCE(aea.nivelactividadautomatico, 0) +
                          COALESCE(aep.nivelactividadproduccion, 0)), 0)) *  indp.contingencia / 100, 3) +

                          (round(SUM((n.necesidad) * indp.precio) *
                           COALESCE(ae.ajuste, 0)  +(

                           SUM((n.cantplanif /n.cantbase) * indp.precio) *
                           COALESCE(ae.ajuste, 0)) * indp.flete / 100  +(

                           SUM((n.necesidad) * indp.precio) *
                            COALESCE(ae.ajuste, 0)) * indp.contingencia / 100, 3))) as importefinal

                          from mod_planificacion.dat_norma n
                               INNER JOIN mod_datosmaestros.nom_indicador ind
                               ON (n.idindicador = ind.idindicador AND ind.estado = 1)
                               INNER JOIN mod_datosmaestros.nom_indicadorplanif indp
                               ON (n.idindicador = indp.idindicador AND indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                               LEFT JOIN mod_datosmaestros.dat_indicadormodelo im
                               ON (indp.idindicador = im.idindicador)
                          where n.idactividad = a.idactividad AND
                                n.idejercicio = {$parametros['idejercicio']} AND
                                m.tipoplan = 0 AND
                                im.idindicador is null
                          group by indp.flete,
                                   indp.contingencia), 0) as importegasto,

               COALESCE((
                          select (round(Coalesce(SUM((n.necesidad) * indp.precioventa) *(
                          COALESCE(aem.nivelactividadmanual, 0) +
                          COALESCE(aea.nivelactividadautomatico, 0) +
                          COALESCE(aep.nivelactividadproduccion, 0)), 0) + (

                          Coalesce(SUM((n.necesidad) * indp.precioventa) *(
                          COALESCE(aem.nivelactividadmanual, 0) +
                          COALESCE(aea.nivelactividadautomatico, 0) +
                          COALESCE(aep.nivelactividadproduccion, 0)), 0)) * indp.flete  / 100 + (

                          Coalesce(SUM((n.necesidad) *indp.precioventa) *(
                          COALESCE(aem.nivelactividadmanual, 0) +
                          COALESCE(aea.nivelactividadautomatico, 0) +
                          COALESCE(aep.nivelactividadproduccion, 0)), 0)) * indp.contingencia / 100, 3) +

                          (round(SUM((n.necesidad) * indp.precioventa) *
                          COALESCE(ae.ajuste, 0) +(

                          SUM((n.necesidad) * indp.precioventa) *
                          COALESCE( ae.ajuste, 0)) * indp.flete / 100  +(

                          SUM((n.necesidad) * indp.precioventa) *
                            COALESCE(ae.ajuste, 0)) * indp.contingencia / 100, 3))) as importefinal

                          from mod_planificacion.dat_norma n
                               INNER JOIN mod_datosmaestros.nom_indicador ind
                               ON (n.idindicador = ind.idindicador AND ind.estado = 1)
                               INNER JOIN mod_datosmaestros.nom_indicadorplanif indp
                               ON (n.idindicador = indp.idindicador AND indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                               LEFT JOIN mod_datosmaestros.dat_indicadormodelo im
                               ON (ind.idindicador = im.idindicador)
                          where n.idactividad = a.idactividad AND
                                n.idejercicio = {$parametros['idejercicio']} AND
                                m.tipoplan = 1 AND
                                im.idindicador is null
                          group by indp.flete,
                                   indp.contingencia), 0) as importeingreso

        FROM mod_planificacion.nom_actividad a
             LEFT JOIN mod_planificacion.dat_actividadentidad ae
             ON (a.idactividad = ae.idactividad AND ae.idejercicio = {$parametros['idejercicio']} AND ae.identidad IN ({$parametros['identidades']}))
             LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
             ON (aem.idactividadentidad = ae.idactividadentidad)
             LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
             ON (aea.idactividadentidad = ae.idactividadentidad)
             LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
             ON (aep.idactividadentidad = ae.idactividadentidad)
             INNER JOIN mod_planificacion.dat_actividadmodelo am
             ON (a.idactividad = am.idactividad)
             INNER JOIN mod_planificacion.dat_modelo m
             ON (m.idmodelo = am.idmodelo)
        WHERE m.idmodelo IN ({$parametros['planes']}) AND
              a.nivel = {$nivel} AND
              a.idaprobacion = 4 AND
              a.estado = 1 AND
              (ae.idaprobacion = 5 OR
              ae.idaprobacion = 4) ) as x
      GROUP BY
      x.codigo
)),
consulta2 AS
(--esta es la de los ind directos
SELECT
		x.codigo,
       ((SUM(x.importegasto)) ) as importegasto,
       ((SUM(x.importeingreso)) ) as importeingreso
FROM (
       SELECT
             a.codigo,
              COALESCE((
                         select (round(Coalesce(SUM((n.necesidad) * indp.precio) *(
                         COALESCE(aem.nivelactividadmanual, 0) +
                         COALESCE(aea.nivelactividadautomatico, 0) +
                         COALESCE(aep.nivelactividadproduccion, 0)), 0) +(

                          Coalesce(SUM((n.necesidad) * indp.precio) *(
                          COALESCE(aem.nivelactividadmanual, 0) +
                          COALESCE(aea.nivelactividadautomatico, 0) +
                          COALESCE(aep.nivelactividadproduccion, 0)), 0)) *  indp.flete / 100 +(

                          Coalesce(SUM((n.necesidad) * indp.precio) *(
                          COALESCE(aem.nivelactividadmanual, 0) +
                          COALESCE(aea.nivelactividadautomatico, 0) +
                          COALESCE(aep.nivelactividadproduccion, 0)), 0)) * indp.contingencia / 100, 3) +(

                          round(SUM((n.necesidad) * indp.precio) *
                          COALESCE(ae.ajuste, 0) +(

                          SUM((n.necesidad) * indp.precio) *
                          COALESCE(ae.ajuste, 0)) * indp.flete / 100 +(

                           SUM((n.necesidad) * indp.precio) *
                           COALESCE(ae.ajuste, 0)) * indp.contingencia / 100, 3))) as  importefinal

                         from mod_planificacion.dat_norma n
                              INNER JOIN mod_datosmaestros.nom_indicador ind
                              ON (n.idindicador = ind.idindicador AND ind.estado= 1)
                              INNER JOIN mod_datosmaestros.nom_indicadorplanif indp
                              ON (n.idindicador = indp.idindicador AND indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                              INNER JOIN mod_datosmaestros.dat_indicadormodelo im
                              ON (ind.idindicador  = im.idindicador)
                              INNER JOIN mod_planificacion.dat_modelo m
                              ON (m.idmodelo = im.idmodelo)
                         where m.idmodelo IN ({$parametros['planes']}) AND
                         	   n.idactividad = a.idactividad AND
                               n.idejercicio = {$parametros['idejercicio']} AND
                               m.tipoplan = 0
                         group by indp.flete,
                                  indp.contingencia), 0) as importegasto,

              COALESCE((
                         select (round(Coalesce(SUM((n.necesidad) * indp.precioventa) *(
                         COALESCE(aem.nivelactividadmanual, 0) +
                         COALESCE(aea.nivelactividadautomatico, 0) +
                         COALESCE(aep.nivelactividadproduccion, 0)), 0) +(

                         Coalesce(SUM((n.necesidad) * indp.precioventa) *(
                         COALESCE(aem.nivelactividadmanual, 0) +
                         COALESCE(aea.nivelactividadautomatico, 0) +
                         COALESCE(aep.nivelactividadproduccion, 0)), 0)) * indp.flete /  100 +(

                         Coalesce(SUM((n.necesidad) * indp.precioventa) *(
                         COALESCE(aem.nivelactividadmanual, 0) +
                         COALESCE(aea.nivelactividadautomatico, 0) +
                         COALESCE(aep.nivelactividadproduccion, 0)), 0)) * indp.contingencia / 100, 3) +(

                         round(SUM((n.cantplanif/ n.cantbase) * indp.precioventa) *
                         COALESCE(ae.ajuste, 0) +

                         (SUM((n.necesidad) * indp.precioventa) *
                          COALESCE(ae.ajuste, 0)) * indp.flete / 100 +(

                          SUM((n.necesidad) * indp.precioventa) *
                          COALESCE(ae.ajuste, 0)) * indp.contingencia / 100, 3))) as importefinal

                         from mod_planificacion.dat_norma n
                              INNER JOIN mod_datosmaestros.nom_indicador ind
                              ON (n.idindicador = ind.idindicador AND ind.estado = 1)
                              INNER JOIN mod_datosmaestros.nom_indicadorplanif indp
                              ON (n.idindicador = indp.idindicador AND indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                              INNER JOIN mod_datosmaestros.dat_indicadormodelo im
                              ON (ind.idindicador = im.idindicador)
                              INNER JOIN mod_planificacion.dat_modelo m
                              ON (m.idmodelo = im.idmodelo)
                         where m.idmodelo IN ({$parametros['planes']}) AND
                         	   n.idactividad = a.idactividad AND
                               n.idejercicio = {$parametros['idejercicio']} AND
                               m.tipoplan = 1
                         group by indp.flete,
                                  indp.contingencia), 0) as importeingreso

       FROM mod_planificacion.nom_actividad a
            LEFT JOIN mod_planificacion.dat_actividadentidad ae
            ON (a.idactividad = ae.idactividad AND ae.idejercicio = {$parametros['idejercicio']} AND  ae.identidad IN ({$parametros['identidades']}))
            LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
            ON (aem.idactividadentidad = ae.idactividadentidad)
            LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
            ON (aea.idactividadentidad = ae.idactividadentidad)
            LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
            ON (aep.idactividadentidad = ae.idactividadentidad)
            INNER JOIN mod_planificacion.dat_actividadmodelo am
            ON (a.idactividad = am.idactividad)

       WHERE
             a.nivel = {$nivel} AND
             a.idaprobacion = 4 AND
             a.estado = 1 AND
             (ae.idaprobacion = 5 OR
             ae.idaprobacion = 4) ) as x
     GROUP BY x.codigo)
     SELECT DISTINCT
        ((sum(COALESCE(c.importegasto,0)+COALESCE(q.importegasto,0)))* {$parametros['porc']})/100 as importegasto,
        ((sum(COALESCE(c.importeingreso,0)+COALESCE(q.importeingreso,0)))* {$parametros['porc']})/100 as importeingreso
        from consulta c
        RIGHT JOIN consulta2 q ON c.codigo = q.codigo";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getDatosDesgloseActividad($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT actvent.idactividadentidad, desentniv.iddesgloseentidadnivel, ROUND(desentniv.nivelactivdesglosado,4) as nivelactivdesglosado,
list(nom.denominacion) as denominacion
FROM mod_planificacion.dat_actividadentidad actvent
INNER JOIN mod_planificacion.dat_desgloseentidadnivel desentniv ON (actvent.idactividadentidad = desentniv.idactividadentidad)
INNER JOIN mod_planificacion.dat_desglosedatosnomenclador desdatnom ON (desentniv.iddesgloseentidadnivel = desdatnom.iddesgloseentidadnivel)
INNER JOIN mod_planificacion.nom_datosnomenclador nom ON (desdatnom.iddatosnomenclador = nom.iddatosnomenclador)
WHERE actvent.idactividad = " . $params['idactividad'] . " AND actvent.identidad = " . $params['identidad'] . " AND actvent.idejercicio = " . $params['idejercicio'] . "
GROUP BY actvent.idactividadentidad,desentniv.iddesgloseentidadnivel,desentniv.nivelactivdesglosado
ORDER BY desentniv.iddesgloseentidadnivel";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    /* Este metodo obtiene el nivel de actividad para el desglose multiple */

    public function ObtenerNivelesActEntidad($idactividadentidad) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
 COALESCE(aem.nivelactividadmanual,0)+ COALESCE(aep.nivelactividadproduccion,0)+ COALESCE(aea.nivelactividadautomatico,0) as na
FROM
  mod_planificacion.dat_actividadentidad ae
  LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem on  ae.idactividadentidad=aem.idactividadentidad
  LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep on  ae.idactividadentidad=aep.idactividadentidad
  LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea on  ae.idactividadentidad=aea.idactividadentidad
  where ae.idactividadentidad=$idactividadentidad";
        return $result = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
    }

    public function listarNivelesActividad($params) {
        //trabajo con los filtros
        $addWhereFiltros = "";
        $addWhereFiltrosAfuera = "";
        $addHavingFiltros = "";
        $addJoinFiltros = "";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $addWhereFiltros .= " AND a.codigo  LIKE '{$datos ['data'] ['value']}%'";
                } elseif ($datos ['field'] == 'denominacion') {
                    $addWhereFiltros .= " AND upper(a.denominacion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos ['field'] == 'descripcion') {
                    $addWhereFiltros .= " AND upper(a.descripcion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos['field'] == 'idespecialidad') {
                    $addWhereFiltros .= " AND a.idespecialidad={$datos['data']['value']}";
                } elseif ($datos['field'] == 'idmodelo') {
                    if ($datos['data']['value'] == '-') {
                        $addWhereFiltros .= " AND am.idmodelo IS NULL";
                    } else {
                        $addWhereFiltros .= " AND am.idmodelo={$datos['data']['value']}";
                    }
                } elseif ($datos['field'] == 'idcomportamiento') {
                    $addJoinFiltros .= " INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (dn.iddatosnomenclador = aec.iddatosnomenclador)";
                    if ($datos['data']['value'] == 'Propia')
                        $addWhereFiltros .= " AND dn.uridatosnomenclador = 'propia'";
                    else
                    if ($datos['data']['value'] == 'Compartida')
                        $addWhereFiltros .= "  AND dn.uridatosnomenclador = 'compartida'";
                    else
                        $addWhereFiltros .= "  AND dn.uridatosnomenclador = 'demandada'";
                } elseif ($datos ['field'] == 'nivelactividadmanual') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addHavingFiltros .= " AND sum(x.nivelactividadmanual) >" . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addHavingFiltros .= " AND sum(x.nivelactividadmanual) <" . $datos ['data'] ['value'] . "";
                    } else {
                        $addHavingFiltros .= " AND sum(x.nivelactividadmanual) =" . $datos ['data'] ['value'] . "";
                    }
                } elseif ($datos ['field'] == 'nivelactividadautomatico') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addHavingFiltros .= " AND sum(x.nivelactividadautomatico) >" . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addHavingFiltros .= " AND sum(x.nivelactividadautomatico) <" . $datos ['data'] ['value'] . "";
                    } else {
                        $addHavingFiltros .= " AND sum(x.nivelactividadautomatico) =" . $datos ['data'] ['value'] . "";
                    }
                } elseif ($datos ['field'] == 'nivelactividadfinal') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addHavingFiltros .= " AND sum(x.nivelactividadfinal) >" . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addHavingFiltros .= " AND sum(x.nivelactividadfinal) <" . $datos ['data'] ['value'] . "";
                    } else {
                        $addHavingFiltros .= " AND sum(x.nivelactividadfinal) =" . $datos ['data'] ['value'] . "";
                    }
                } elseif ($datos ['field'] == 'nivelactividad') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addHavingFiltros .= " AND sum(x.nivelactividad) >" . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addHavingFiltros .= " AND sum(x.nivelactividad) <" . $datos ['data'] ['value'] . "";
                    } else {
                        $addHavingFiltros .= " AND sum(x.nivelactividad) =" . $datos ['data'] ['value'] . "";
                    }
                } elseif ($datos ['field'] == 'ajuste') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addHavingFiltros .= " AND sum(x.ajuste) >" . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addHavingFiltros .= " AND sum(x.ajuste) <" . $datos ['data'] ['value'] . "";
                    } else {
                        $addHavingFiltros .= " AND sum(x.ajuste) =" . $datos ['data'] ['value'] . "";
                    }
                } elseif ($datos ['field'] == 'importe') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addHavingFiltros .= " AND sum(x.importe) >" . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addHavingFiltros .= " AND sum(x.importe)<" . $datos ['data'] ['value'] . "";
                    } else {
                        $addHavingFiltros .= " AND sum(x.importe) =" . $datos ['data'] ['value'] . "";
                    }
                } elseif ($datos ['field'] == 'importeajuste') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addHavingFiltros .= " AND sum(x.importeajuste) >" . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addHavingFiltros .= " AND sum(x.importeajuste)<" . $datos ['data'] ['value'] . "";
                    } else {
                        $addHavingFiltros .= " AND sum(x.importeajuste) =" . $datos ['data'] ['value'] . "";
                    }
                } elseif ($datos ['field'] == 'importefinal') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addHavingFiltros .= " AND sum(x.importefinal) >" . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addHavingFiltros .= " AND sum(x.importefinal) <" . $datos ['data'] ['value'] . "";
                    } else {
                        $addHavingFiltros .= " AND sum(x.importefinal) =" . $datos ['data'] ['value'] . "";
                    }
                } elseif ($datos['field'] == 'idaprobacion') {

                    if ($datos['data']['value'] == 'Especialista')
                        $addWhereFiltrosAfuera .= " AND x.idaprobacion = 3";
                    else
                    if ($datos['data']['value'] == 'Rector')
                        $addWhereFiltrosAfuera .= "  AND  x.idaprobacion = 4";
                    else
                    if ($datos['data']['value'] == 'Ajuste')
                        $addWhereFiltrosAfuera .= "  AND  x.idaprobacion = 5";
                    else
                    if ($datos['data']['value'] == 'No')
                        $addWhereFiltrosAfuera .= "  AND  (x.idaprobacion = 1 OR x.idaprobacion IS NULL)";
                } elseif ($datos['field'] == 'desglosada') {

                    if ($datos['data']['value'] == 'Sí')
                        $addHavingFiltros .= " AND COALESCE(MIN(x.desglosada),0)=1";
                    else
                    if ($datos['data']['value'] == 'No')
                        $addHavingFiltros .= " AND COALESCE(MIN(x.desglosada),0)=0";
                    else
                    if ($datos['data']['value'] == 'Parcial')
                        $addHavingFiltros .= " AND COALESCE(MIN(x.desglosada),0)=2";
                } elseif ($datos['field'] == 'idusuario') {
                    $addWhereFiltrosAfuera .= " AND x.idusuario ={$datos['data']['value']}";
                } elseif ($datos ['field'] == 'fecha') {
                    $fecha = explode('/', $datos ['data']['value']);
                    $fecha = $fecha[1] . '/' . $fecha[0] . '/' . $fecha[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhereFiltrosAfuera .= "AND x.fecha::date<'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhereFiltrosAfuera .= "AND x.fecha::date>'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhereFiltrosAfuera .= "AND x.fecha::date='{$fecha}'";
                    }
                }
            }
        }
        //si se ha filtrado por un plan para listar las actividades
        // de ese plan que estan listas para ir a plan(aprobadas y desglosadas total)
        $datActPlan = "";
        $datActPlanDesg = "";
        $joinNormas = "LEFT";
        //cuando se filtra por un plan determinado
        //solo se muestran las actividades listas para actualizar
        if ($params['idmodelo'] != -1) {
            $datActPlan = " AND x.idmodelo = {$params['idmodelo']} AND x.idaprobacion >= 3 ";
            $datActPlanDesg = " AND COALESCE(MIN(x.desglosada),0)=1";
            //si se va a actualizar tiene que tener normas obligatoriamente
            $joinNormas = "INNER";
        }
        //si es exportar solo deben salir las actividades con nivel mayor que 0
        $nivelMayorCero = "";
        $delimitador = "";
        if ($params['exportar']) {
            $nivelMayorCero = "AND sum(x.nivelactividadfinal) > 0";
        } else {
            //el delimitador solo se pone si es el listar
            $delimitador = "OFFSET {$params['start']} LIMIT {$params['limit']}";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT  count(*) OVER() as total,
		x.idactividad,
    	x.codigo,
    	x.denominacion,
        x.descripcion,
        x.idespecialidad,
        x.idcomportamiento,
    	sum(x.nivelactividadautomatico) AS nivelactividadautomatico,
        sum(x.nivelactividadmanual) AS nivelactividadmanual,
        sum(x.nivelactividad) as nivelactividad,
    	sum(x.ajuste) as ajuste,
        sum(x.nivelactividadfinal) as nivelactividadfinal,
        sum(x.importe) as importe,
        sum(x.importeajuste) as importeajuste,
        sum(x.importefinal) as importefinal,
    	x.idaprobacion,
        x.idmodelo,
    	COALESCE(MIN(x.desglosada),0) as desglosada,
        sum(x.importe) OVER() as importetotal,
        sum(x.importeajuste) OVER() as importeajustetotal,
        sum(x.importefinal) OVER() as importefinaltotal,
        x.idtipomodelo,
        x.idusuario,
        x.fecha
FROM (
WITH cantdesg as (SELECT SUM(des.nivelactivdesglosado) as desglose,
                		des.idactividadentidad
                    FROM mod_planificacion.dat_desgloseentidadnivel des
                    GROUP BY des.idactividadentidad)

SELECT a.idactividad,
       a.codigo,
       a.denominacion,
       a.descripcion,
       a.idespecialidad,
       aec.iddatosnomenclador as idcomportamiento,
       ROUND(COALESCE(aea.nivelactividadautomatico, 0), 4) AS nivelactividadautomatico,
       ROUND(COALESCE(aem.nivelactividadmanual, 0), 4) AS nivelactividadmanual,
       ROUND(COALESCE(aea.nivelactividadautomatico, 0) + COALESCE(aem.nivelactividadmanual, 0),4) as nivelactividad,
       ROUND(COALESCE(ae.ajuste, 0), 4) as ajuste,
       ROUND((COALESCE(aea.nivelactividadautomatico, 0) + COALESCE(aem.nivelactividadmanual, 0)) + COALESCE(ae.ajuste, 0),4) as nivelactividadfinal,

      ROUND( COALESCE(SUM(n.necesidad * indp.precio),0)*
            (COALESCE(aea.nivelactividadautomatico, 0) +
              COALESCE(aem.nivelactividadmanual, 0))  +

              COALESCE(SUM(n.necesidad * indp.precio * indp.flete),0)*
            (COALESCE(aea.nivelactividadautomatico, 0) +
              COALESCE(aem.nivelactividadmanual, 0)) +

              COALESCE(SUM(n.necesidad * indp.precio * indp.contingencia),0)*
            (COALESCE(aea.nivelactividadautomatico, 0) +
              COALESCE(aem.nivelactividadmanual, 0))  ,4) as importe,

              ROUND( COALESCE(SUM(n.necesidad * indp.precio),0)*
            (COALESCE(ae.ajuste, 0) )  +

              COALESCE(SUM(n.necesidad * indp.precio * indp.flete),0)*
            (COALESCE(ae.ajuste, 0) ) +

              COALESCE(SUM(n.necesidad * indp.precio * indp.contingencia),0)*
            (COALESCE(ae.ajuste, 0))  ,4)  as importeajuste,

                  ROUND( COALESCE(SUM(n.necesidad * indp.precio),0)*
            (COALESCE(aea.nivelactividadautomatico, 0) +
              COALESCE(aem.nivelactividadmanual, 0) +
              COALESCE(ae.ajuste, 0))  +

              COALESCE(SUM(n.necesidad * indp.precio * indp.flete),0)*
            (COALESCE(aea.nivelactividadautomatico, 0) +
              COALESCE(aem.nivelactividadmanual, 0) +
              COALESCE(ae.ajuste, 0)) +

              COALESCE(SUM(n.necesidad * indp.precio * indp.contingencia),0)*
            (COALESCE(aea.nivelactividadautomatico, 0) +
              COALESCE(aem.nivelactividadmanual, 0) +
              COALESCE(ae.ajuste, 0))  ,4) as importefinal,


       COALESCE((SELECT DISTINCT MIN(idaprobacion)
                  FROM mod_planificacion.dat_actividadentidad
                  WHERE identidad IN ({$params['identidades']}) AND
                        idactividad = a.idactividad AND
                        idejercicio = {$params['idejercicio']}), 1) as idaprobacion,
       am.idmodelo,

      case
         when c.desglose = 0 then 0
         WHEN c.desglose =(ROUND((COALESCE(aea.nivelactividadautomatico, 0) + COALESCE(aem.nivelactividadmanual, 0)) + COALESCE(ae.ajuste, 0),4)) then 1
         WHEN c.desglose > 0 then 2
       end as desglosada,
       CASE WHEN m.idtipomodelo IS NULL
       THEN -1
       ELSE m.idtipomodelo END AS idtipomodelo,
       ae.idusuario,
       ae.fecha

FROM mod_planificacion.nom_actividad a
     INNER JOIN mod_planificacion.dat_actespcomportamiento aec
        ON (a.idactividad = aec.idactividad AND
        aec.idespecialidad IN ({$params['idespecialidades']}))
     $addJoinFiltros
     LEFT JOIN mod_planificacion.dat_actividadentidad ae
        ON (ae.idactespcomportamiento = aec.idactespcomportamiento AND
        ae.idejercicio = {$params['idejercicio']} AND
        ae.identidad IN ({$params['identidades']}))
     LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
        ON (aea.idactividadentidad = ae.idactividadentidad)
     LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
        ON (aem.idactividadentidad = ae.idactividadentidad)
     LEFT JOIN mod_planificacion.dat_actividadmodelo am
        ON (am.idactividad = a.idactividad)
     LEFT JOIN mod_planificacion.dat_modelo m
        ON m.idmodelo = am.idmodelo
     $joinNormas JOIN mod_planificacion.dat_norma n
        ON(n.idactividad = a.idactividad AND
        n.idejercicio = {$params['idejercicio']})
     LEFT JOIN mod_datosmaestros.nom_indicador ind
        ON (n.idindicador = ind.idindicador AND
        ind.estado = 1)
     LEFT JOIN mod_datosmaestros.nom_indicadorplanif indp
        ON (n.idindicador = indp.idindicador AND
        indp.nivelplanif = 1 AND
        indp.idaprobacion = 4)
     LEFT JOIN cantdesg c
        ON ae.idactividadentidad = c.idactividadentidad
WHERE a.nivel = 4 AND
      a.idaprobacion = 4 AND
      a.estado = 1
     $addWhereFiltros
GROUP BY a.idactividad,
         a.codigo,
         a.denominacion,
         aec.iddatosnomenclador,
         aea.nivelactividadautomatico,
         aem.nivelactividadmanual,
         ae.ajuste,
         am.idmodelo,
         c.desglose,
         ae.idactividadentidad,
         m.idtipomodelo
ORDER BY a.codigo

) as x
WHERE TRUE $addWhereFiltrosAfuera
     $datActPlan
GROUP BY x.idactividad,
         x.codigo,
         x.denominacion,
         x.descripcion,
         x.idespecialidad,
         x.idcomportamiento,
         x.idaprobacion,
         x.idmodelo,
         x.importe,
         x.importeajuste,
         x.importefinal,
         x.idtipomodelo,
         x.idusuario,
         x.fecha
         HAVING true
         $addHavingFiltros
                $datActPlanDesg
                $nivelMayorCero
ORDER BY x.codigo $delimitador
";
//         print_r($sql);die;
        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];

        return $data;
    }

    public function obtenerEntidadesHijasByEntidadArray($identidad, $denom = false, $arrayEntidades) {
        if ($identidad) {
            $integrator = ZendExt_IoC::getInstance();
            $arrayResult = $integrator->metadatos->BuscarArrIdsEstructurasHijasArbolCompleto($identidad, array(0, 1, 2, 3, 4, 5, 6));
            if ($denom) {
                foreach ($arrayResult as $key => $value) {
                    $cont = 0;
                    foreach ($arrayEntidades as $idEntidadProd) {
                        if ($value == $idEntidadProd) {
                            $cont++;
                        }
                    }
                    if ($cont > 0) {
                        $temp[$key]['idestructura'] = $value;
                        $datosEntidad = $integrator->metadatos->DameEstructura($value);
                        $temp[$key]['denominacion'] = $datosEntidad[0]->denominacion;
                    }
                }
                $arrayResult = $temp;
            }
        } else
            $arrayResult = array();
        return $arrayResult;
    }

    //Permite obtener las entidades hijas de una entidad
    //OJO metodo comun de casi todo el sistema
    public function auxObtenerEntidadesHijasComun($identidad, $denom = false) {
        if ($identidad) {
            $integrator = ZendExt_IoC::getInstance();
            $arrayResult = $integrator->metadatos->BuscarArrIdsEstructurasHijasArbolCompleto($identidad, array(0, 1, 2, 3, 4, 5, 6));
            if ($denom) {
                foreach ($arrayResult as $key => $value) {
                    $temp[$key]['idestructura'] = $value;
                    $datosEntidad = $integrator->metadatos->DameEstructura($value);
                    $temp[$key]['abreviatura'] = $datosEntidad[0]->abreviatura;
                    $temp[$key]['denominacion'] = $datosEntidad[0]->denominacion;
                }
                $arrayResult = $temp;
            }
        } else
            $arrayResult = array();
        return $arrayResult;
    }

    //Permite obtener todas las entidades que son Organo Demandantes
    public function auxObtenerTodasEntidadesOrganoDemandantes() {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT ednom.identidad
                    FROM mod_planificacion.dat_entidaddatosnomenclador ednom
                         INNER JOIN mod_planificacion.nom_datosnomenclador dn ON
                           ednom.iddatosnomenclador = dn.iddatosnomenclador AND
                           dn.uridatosnomenclador = 'organoconsumidor'";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    /* public function auxObtenerEntidadesHijasComun($identidad, $denom = false) {
      if ($identidad) {
      $conn = Doctrine_Manager::connection();
      $sql = "SELECT f5.idfila
      FROM mod_estructuracomp.nom_filaestruc f5
      WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3 WHERE f3.idfila = $identidad)
      AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4 WHERE f4.idfila = $identidad)
      and f5.fechafin IS NULL and f5.idconcepto <> 7";
      $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
      if ($denom) {
      $integrator = ZendExt_IoC::getInstance();
      foreach ($arrayResult as $key => $value) {
      $temp[$key]['idestructura'] = $value;
      $datosEntidad = $integrator->metadatos->DameEstructura($value);
      $temp[$key]['denominacion'] = $datosEntidad[0]->denominacion;
      }
      $arrayResult = $temp;
      }
      } else
      $arrayResult = array();
      return $arrayResult;
      } */
    /* Importar NA */

    public function listarDatosAImportar($idusuario) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT e.idtabla,
                        e.codigo,
                        e.namanual,
                        e.idactespcomportamiento,
                        e.idactividadentidad,
                        e.iddatosnomenclador,
                        e.idactividad
                 FROM mod_planifimportacion.temp_importarniveles" . $idusuario . " e
                 WHERE e.iddatosnomenclador=312";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarDatosTablaTemporal($idusuario, $idejercicio, $idespecialidad, $identidad) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT e.idtabla,
                        act.idactividad,
                        act.idaprobacion,
                        act.estado,
                        act.nivel,
                        e.namanual,
                        ae.idaprobacion as aprobadonivel,
                        n.idactividad as norma,
                        ae.idactividadentidad,
                        aesp.idactespcomportamiento
                 FROM mod_planifimportacion.temp_importarniveles" . $idusuario . " e
                      LEFT JOIN mod_planificacion.nom_actividad act ON (e.codigo = act.codigo)
                      LEFT JOIN mod_planificacion.dat_norma n ON (n.idactividad = act.idactividad and n.idejercicio=$idejercicio)
                      LEFT JOIN mod_planificacion.dat_actespcomportamiento aesp ON (aesp.idactividad = act.idactividad and aesp.idespecialidad=$idespecialidad)
                      LEFT JOIN mod_planificacion.dat_actividadentidad ae ON (ae.idactividad = act.idactividad and ae.idejercicio=$idejercicio and ae.identidad=$identidad)
                ";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //listar datos validados a importar
    public function listarDatosValidados($idusuario, $start, $limit, $filtros) {
        $addWhere = "where true";
        if ($filtros) {
            foreach ($filtros as $datos) {
                if ($datos['field'] == 'codigo') {
                    $addWhere .= " and e.codigo like '%" . $datos['data']['value'] . "%'";
                } else
                if ($datos['field'] == 'denominacion') {
                    $addWhere .= " and upper(e." . $datos['field'] . ") LIKE '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } else
                if ($datos['field'] == 'namanual') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlSigno = "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlSigno = ">";
                        } else {
                            $sqlSigno = "=";
                        }
                    }
                    $addWhere .= " and e." . $datos['field'] . $sqlSigno . $datos['data']['value'];
                }
            }
        }

        $conn = Doctrine_Manager::connection();
        $query = "SELECT e.idtabla,
                        e.codigo,
                        act.denominacion,
                        e.namanual,
                        e.iddatosnomenclador,
                        ndn.denominacion as denominaciondato,
                        count(*) over () as total
                 FROM mod_planifimportacion.temp_importarniveles" . $idusuario . " e
                 LEFT JOIN mod_planificacion.nom_actividad act ON (e.codigo = act.codigo)
                 LEFT JOIN mod_planificacion.nom_datosnomenclador ndn ON (ndn.iddatosnomenclador = e.iddatosnomenclador)
                      $addWhere
                ORDER BY e.codigo OFFSET $start LIMIT $limit";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function obtenerDatosCargados($idusuario) {
        //eliminando tabla temporal dinámica
        $conn = Doctrine_Manager::connection();
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importarniveles" . $idusuario);

        //obteniendo los datos del excel guardados en BD en la petición anterior(importarfichero)
        $query = "SELECT  xls FROM  mod_planifimportacion.temp_importarnivelesxls" . $idusuario;
        $result = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        $datos = unserialize($result[0]);
        return $datos;
    }

    public function crearTablaTemporal($idusuario) {
        $conn = Doctrine_Manager::connection();
        //creando tabla temporal dinamica
        $conn->execute("CREATE TABLE mod_planifimportacion.temp_importarniveles" . $idusuario . " (
          idtabla SERIAL,
          codigo VARCHAR(255) NOT NULL,
          namanual NUMERIC(19,4) NOT NULL,
          idactespcomportamiento NUMERIC(19,0),
          idactividad NUMERIC(19,0),
          idactividadentidad NUMERIC(19,0),
          iddatosnomenclador NUMERIC(19,0))");
    }

    public function insertarDatosTablaTemporal($idusuario, $codigo, $namanual) {
        $conn = Doctrine_Manager::connection();
        //insertando los datos en la tabla temporal
        $conn->execute("INSERT INTO mod_planifimportacion.temp_importarniveles" . $idusuario . "
                        (
                        codigo,
                        namanual)
                        VALUES (
                              '$codigo',
                              $namanual
                        )");
    }

    //Actualizar los datos validados
    public function actualizarValidacion($idusuario, $idtabla, $iddatosnomenclador) {
        $conn = Doctrine_Manager::connection();
        $query = "UPDATE
                    mod_planifimportacion.temp_importarniveles" . $idusuario . "
                  SET
                    iddatosnomenclador = $iddatosnomenclador
                  WHERE
                    idtabla = $idtabla;";
        $conn->execute($query);
    }

    public function insertarEnLaTablaTemporal($value, $idusuario, $array_ests_uri) {
        //Validado correctamente
        //insertar en la tabla temporal los valores necesarios para la importacion
        $conn = Doctrine_Manager::connection();
        $actActEntidad = "";
        if ($value['idactividadentidad'] != null)
            $actActEntidad = " idactividadentidad = {$value['idactividadentidad']},";
        $query = "UPDATE mod_planifimportacion.temp_importarniveles" . $idusuario . "
                  SET
                 $actActEntidad
                  idactespcomportamiento = {$value['idactespcomportamiento']},
                  iddatosnomenclador = {$array_ests_uri['ok']},
                  idactividad =  {$value['idactividad']}
                  WHERE  idtabla = {$value['idtabla']}";
        $conn->execute($query);
    }
   
    //Permite obtener todas las entidades para renderizar en la vista
    public function auxObtenerEntidadesTodas() {
          $conn = Doctrine_Manager::connection();
        $query = "
                SELECT f.idfila as identidad,
                       CASE
                         WHEN e.idestructura IS NULL THEN eop.denominacion
                         ELSE e .denominacion
                       END as entidad,
                       CASE
                         WHEN e.idestructura IS NULL THEN eop.abreviatura
                         ELSE e.abreviatura
                       END as abreviatura,
                       e.codigo,
                       e.direccion

                FROM mod_estructuracomp.nom_filaestruc f
                     LEFT JOIN mod_estructuracomp.dat_estructura e ON e.idestructura = f.idfila
                     LEFT JOIN mod_estructuracomp.dat_estructuraop eop ON eop.idestructuraop = f.idfila";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}
