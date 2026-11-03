<?php

class DatDemandaproduccionModel extends ZendExt_Model
{

    private $nivel;

    public function __construct()
    {
        $this->nivel = NomActividad::getNivel();
        parent::ZendExt_Model();
    }

    public function listarDemandaRector($params, $escont = null)
    {

        if ($params['idespecialidad'] == null) {
            return array('total' => 0, 'data' => array());
        }

        $iddatosnomanclador = DatActespcomportamiento::obtenerIdDatosNom();
        $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
        $conn = Doctrine_Manager::connection();
        $conditions = array();
        $where = '';
        $cont = 0;
        $having = "";
        $conditionsHaving = array();
        $contHaving = 0;

        $onActespdemanda = "";
        if (!empty($params['idespecialidad'])) {
            $onActespdemanda
                = "AND mod_planificacion.dat_actespcomportamiento.idespecialidad = ?";
            $conditions[$cont++] = $params['idespecialidad'];
        }

        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $p) {
                switch ($p['field']) {
                    case 'codigo':
                        $where = $where . " AND codigo LIKE ?";
                        $conditions[$cont++] = $p['data']['value'] . "%";
                        break;
                    case 'denominacion':
                        $where = $where . " AND upper(denominacion) LIKE ?";
                        $conditions[$cont++] = "%" . strtoupper(
                            $p['data']['value']
                        ) . "%";
                        break;
                    case 'na':
                        $condicion = "=";
                        if ($p['data']['comparison'] == "gt") {
                            $condicion = ">";
                        } elseif ($p['data']['comparison'] == "lt") {
                            $condicion = "<";
                        }
                        $having = $having
                            . " AND SUM(COALESCE(mod_planificacion.dat_actividadentidadmanual.nivelactividadmanual,0) +
                            COALESCE(mod_planificacion.dat_actividadentidadautomatico.nivelactividadautomatico,0))  "
                            . $condicion . " ? ";
                        $conditionsHaving[$contHaving++]
                            = $p['data']['value'];
                        break;
                    case 'naep':
                        $condicion = "=";
                        if ($p['data']['comparison'] == "gt") {
                            $condicion = ">";
                        } elseif ($p['data']['comparison'] == "lt") {
                            $condicion = "<";
                        }
                        if ($condicion == '=' && $p['data']['value'] == '0') {
                            $where
                                = $where
                                . " AND mod_planificacion.dat_actividadnivelproduccion.nivelproduccion IS NULL ";
                        } else {
                            $where = $where
                                . " AND mod_planificacion.dat_actividadnivelproduccion.nivelproduccion "
                                . $condicion . " ?";
                            $conditions[$cont++] = $p['data']['value'];
                        }
                        break;
                    case 'idaprobacion':

                        $having = $having . "AND AVG(
                    CASE WHEN
                            mod_planificacion.dat_actividadentidad.idaprobacion = 4
                    THEN mod_planificacion.dat_actividadentidad.idaprobacion + 2
                    ELSE mod_planificacion.dat_actividadentidad.idaprobacion
                    END
                  ) " . (($p['data']['value'] == "Si") ? " >= 3 " : " < 3 ");
                        break;
                }
            }
        }

        if ($params ['superrector'] == 'true'
            && $params ['idespecialidadrector'] == null
        ) {
            /* listar actividades de todas las especialidades rectoras */
            $especialidadesRectoras
                = NomActividad::obtenerRectoresDeActividades(true);
            $strEspecialidades = "";
            $coma = "";
            foreach ($especialidadesRectoras as $especialidad) {
                $strEspecialidades = $strEspecialidades . $coma . "'"
                    . $especialidad['idespecialidad'] . "'";
                $coma = ",";
            }
            $where = $where
                . " AND ( mod_planificacion.nom_actividad.idespecialidad NOT IN("
                . $strEspecialidades . ")
                              OR mod_planificacion.nom_actividad.idespecialidad <>
                              mod_planificacion.nom_actividad.idespecialidadrector ) ";

            $where
                = $where
                . " AND mod_planificacion.nom_actividad.idespecialidadrector IN("
                . $strEspecialidades . ")";
        } elseif ($params ['superrector'] == 'true'
            && $params ['idespecialidadrector'] != null
        ) {
            /* listar actividades de una especialidad rectora */
            $where = $where
                . " AND mod_planificacion.nom_actividad.idespecialidadrector = ?";
            $conditions[$cont++] = $params ['idespecialidadrector'];
            $where = $where
                . " AND mod_planificacion.nom_actividad.idespecialidad <> ?";
            $conditions[$cont++] = $params ['idespecialidadrector'];
        } elseif ($params ['superrector'] != 'true') {
            $idesplogeada = ZendExt_GlobalConcept::getInstance(
            )->Estructura->idespecialidad;
            $where = $where
                . " AND mod_planificacion.nom_actividad.idespecialidadrector = ?";
            $conditions[$cont++] = $idesplogeada;
            $where = $where
                . " AND mod_planificacion.nom_actividad.idespecialidad <> ?";
            $conditions[$cont++] = $idesplogeada;
        }

        $condtotal = $conditions;
        $limite = "OFFSET ? LIMIT ?";

        /* Las parametrizaciones de las condiciones deben de aparecer
         * en el orden en que aparecen en la consulta escrita
         */
        $conditions = array_merge($conditions, $conditionsHaving);
        $cont = ($cont > 1 && $contHaving > 1) ? ($cont + $contHaving - 1)
            : $cont + $contHaving;
        $conditions[$cont++] = $params['start'];
        $conditions[$cont++] = $params['limit'];

        $sql
            = "SELECT
                  DISTINCT mod_planificacion.nom_actividad.idactividad,
                  mod_planificacion.nom_actividad.codigo,
                  mod_planificacion.nom_actividad.denominacion,
                  SUM(COALESCE(mod_planificacion.dat_actividadentidadmanual.nivelactividadmanual,0) 
                      +COALESCE(mod_planificacion.dat_actividadentidadproduccion.nivelactividadproduccion,0)
                      +COALESCE(mod_planificacion.dat_actividadentidadautomatico.nivelactividadautomatico,0)) AS na,
                  mod_planificacion.dat_actividadnivelproduccion.nivelproduccion AS naep,
                  mod_planificacion.nom_actividad.idespecialidadrector,
                  AVG(
                    CASE WHEN
                            mod_planificacion.dat_actividadentidad.idaprobacion = 4
                    THEN mod_planificacion.dat_actividadentidad.idaprobacion + 2
                    ELSE mod_planificacion.dat_actividadentidad.idaprobacion
                    END
                  )AS idaprobacion
                  
                FROM
                  mod_planificacion.nom_actividad
                  LEFT JOIN mod_planificacion.dat_actividadnivelproduccion
                  ON (mod_planificacion.nom_actividad.idactividad =
                  mod_planificacion.dat_actividadnivelproduccion.idactividad)

                  INNER JOIN mod_planificacion.dat_actespcomportamiento
                  ON (mod_planificacion.nom_actividad.idactividad =
                  mod_planificacion.dat_actespcomportamiento.idactividad "
            . $onActespdemanda . ")
                  INNER JOIN mod_planificacion.dat_actividadentidad
                  ON (mod_planificacion.dat_actividadentidad.idactespcomportamiento =
                  mod_planificacion.dat_actespcomportamiento.idactespcomportamiento)

                  LEFT OUTER JOIN mod_planificacion.dat_actividadentidadautomatico
                  ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
                  mod_planificacion.dat_actividadentidadautomatico.idactividadentidad)
                  LEFT OUTER JOIN mod_planificacion.dat_actividadentidadmanual
                  ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
                  mod_planificacion.dat_actividadentidadmanual.idactividadentidad)
                  LEFT OUTER JOIN mod_planificacion.dat_actividadentidadproduccion
                  ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
                  mod_planificacion.dat_actividadentidadproduccion.idactividadentidad)
                  WHERE
                  mod_planificacion.dat_actividadentidad.idejercicio = {$arrayIdejercicio[0]['idejercicio']}
                  AND mod_planificacion.nom_actividad.nivel = {$this->nivel}
                  AND mod_planificacion.dat_actespcomportamiento.iddatosnomenclador = "
            . $iddatosnomanclador['demandada'] . "
                  AND ( mod_planificacion.nom_actividad.idaprobacion = 3 OR
                   mod_planificacion.nom_actividad.idaprobacion = 4 OR
                   mod_planificacion.nom_actividad.idaprobacion = 5  ) 
                   $where 
                GROUP BY
                  mod_planificacion.dat_actividadentidad.idejercicio,                  
                  mod_planificacion.nom_actividad.idactividad,
                  mod_planificacion.nom_actividad.codigo,
                  mod_planificacion.nom_actividad.denominacion,
                  mod_planificacion.nom_actividad.idespecialidadrector,
                  mod_planificacion.dat_actividadnivelproduccion.nivelproduccion
                HAVING
                    SUM(COALESCE(mod_planificacion.dat_actividadentidadmanual.nivelactividadmanual,0) +
                     COALESCE(mod_planificacion.dat_actividadentidadautomatico.nivelactividadautomatico,0))>0
                    $having
                ORDER BY
                  mod_planificacion.nom_actividad.codigo,
                  mod_planificacion.nom_actividad.denominacion $limite";
        if ($escont == null || $escont == false) {
            $arrayResult = $conn->execute($sql, $conditions)->fetchAll();
        }

        $sql
            = "SELECT COUNT(aliastotal.idactividad) as total
                FROM (SELECT
                 DISTINCT mod_planificacion.nom_actividad.idactividad
                FROM
                  mod_planificacion.nom_actividad
                  LEFT JOIN mod_planificacion.dat_actividadnivelproduccion
                  ON (mod_planificacion.nom_actividad.idactividad =
                  mod_planificacion.dat_actividadnivelproduccion.idactividad)

                  INNER JOIN mod_planificacion.dat_actespcomportamiento
                   ON (mod_planificacion.nom_actividad.idactividad =
                   mod_planificacion.dat_actespcomportamiento.idactividad "
            . $onActespdemanda . ")
                  INNER JOIN mod_planificacion.dat_actividadentidad
                  ON (mod_planificacion.dat_actividadentidad.idactespcomportamiento =
                  mod_planificacion.dat_actespcomportamiento.idactespcomportamiento)

                  LEFT OUTER JOIN mod_planificacion.dat_actividadentidadautomatico
                  ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
                  mod_planificacion.dat_actividadentidadautomatico.idactividadentidad)
                  LEFT OUTER JOIN mod_planificacion.dat_actividadentidadmanual
                  ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
                  mod_planificacion.dat_actividadentidadmanual.idactividadentidad)
                WHERE
                  mod_planificacion.dat_actividadentidad.idejercicio = {$arrayIdejercicio[0]['idejercicio']}
                  AND mod_planificacion.nom_actividad.nivel = {$this->nivel}
                  AND mod_planificacion.dat_actespcomportamiento.iddatosnomenclador = "
            . $iddatosnomanclador['demandada'] . "
                $where
                GROUP BY mod_planificacion.nom_actividad.idactividad
                HAVING
                    SUM(COALESCE(mod_planificacion.dat_actividadentidadmanual.nivelactividadmanual,0)
                    + COALESCE(mod_planificacion.dat_actividadentidadautomatico.nivelactividadautomatico,0))>0
                    $having) aliastotal";
        if ($escont == null || $escont == true) {
            $arrayResultTotal = $conn->execute(
                $sql, array_merge($condtotal, $conditionsHaving)
            )->fetchAll(
                PDO::FETCH_ASSOC
            );
        }
        return array('total' => $arrayResultTotal[0]['total'],
                     'data'  => $arrayResult);
    }

    public function listarDemandaProductor($params, $escont = null)
    {
        if ($params['entidades_productoras'][0] == null) {
            return array('total' => 0, 'data' => array());
        }
        $iddatosnomanclador = DatActespcomportamiento::obtenerIdDatosNom();
        $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();

        $conditions = array();
        $where = "";
        $cont = 0;

        $conditionsHaving = array();
        $having = "";
        $contHaving = 0;

        $conn = Doctrine_Manager::connection();
        $onActesPdemanda = "";
        $oNActespdemandaSoloProducto = "";
        if (!empty($params['idespecialidad'])) {
            /*$onActesPdemandaz
                = "AND mod_planificacion.dat_actespcomportamiento.idespecialidad = "
                . $params['idespecialidad'];*/

        }
        if ($params['superrector'] == 'true'
            && $params ['idespecialidadrector'] == null
        ) {
            $especialidadesProductoras
                = DatActespcomportamiento::obtenerProductoresDeActividades();
            foreach ($especialidadesProductoras as $especialidadProductora) {
                $strEspecialidades = $strEspecialidades . $coma . "'"
                    . $especialidadProductora[0] . "'";
                $coma = ",";
            }
            if ($strEspecialidades) {
                $where = $where
                    . " AND mod_planificacion.nom_actividad.idespecialidad IN("
                    . $strEspecialidades . ") ";
            }

        } elseif ($params['superrector'] == 'true'
            && $params ['idespecialidadrector'] != null
        ) {
            $where = $where
                . " AND mod_planificacion.nom_actividad.idespecialidad = ?"; /* especialidad creadora */
            $conditions[$cont++] = $params ['idespecialidadrector'];
        } elseif ($params['superrector'] != 'true') {
            $idesplogeada = ZendExt_GlobalConcept::getInstance(
            )->Estructura->idespecialidad;
            $where = $where
                . " AND mod_planificacion.nom_actividad.idespecialidad = ? "; /* especialidad creadora */
            $conditions[$cont++] = $idesplogeada;
            $oNActespdemandaSoloProducto
                = "AND mod_planificacion.dat_actespcomportamiento.idespecialidad <> $idesplogeada";
        }
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $p) {
                switch ($p['field']) {
                    case 'codigo':
                        $where = $where . " AND codigo LIKE ?";
                        $conditions[$cont++] = $p['data']['value'] . "%";
                        break;
                    case 'denominacion':
                        $where = $where . " AND upper(denominacion) LIKE ?";
                        $conditions[$cont++] = "%" . strtoupper(
                            $p['data']['value']
                        ) . "%";
                        break;
                    case 'nad':
                        $condicion = "=";
                        if ($p['data']['comparison'] == "gt") {
                            $condicion = ">";
                        } elseif ($p['data']['comparison'] == "lt") {
                            $condicion = "<";
                        }
                        $having = $having
                            . " AND SUM(COALESCE(mod_planificacion.dat_actividadentidadmanual.nivelactividadmanual,0) +
                            COALESCE(mod_planificacion.dat_actividadentidadautomatico.nivelactividadautomatico,0))  "
                            . $condicion . " ? ";
                        $conditionsHaving[$contHaving++]
                            = $p['data']['value'];
                        break;
                    case 'nae':
                        $condicion = "=";
                        if ($p['data']['comparison'] == "gt") {
                            $condicion = ">";
                        } elseif ($p['data']['comparison'] == "lt") {
                            $condicion = "<";
                        }
                        if ($condicion == '=' && $p['data']['value'] == '0') {
                            $where
                                = $where
                                . " AND mod_planificacion.dat_actividadnivelproduccion.nivelproduccion IS NULL ";
                        } else {
                            $where = $where
                                . " AND mod_planificacion.dat_actividadnivelproduccion.nivelproduccion "
                                . $condicion . " ?";
                            $conditions[$cont++] = $p['data']['value'];
                        }
                        break;
                    case 'idaprobacion':
                        $having = $having . "AND AVG(
                    CASE
                            WHEN
                            mod_planificacion.dat_actividadentidad.idaprobacion = 4
                    THEN
                            mod_planificacion.dat_actividadentidad.idaprobacion + 2
                    ELSE
                            mod_planificacion.dat_actividadentidad.idaprobacion
                    END
                  ) " . (($p['data']['value'] == "Si") ? " >= 3 " : " < 3 ");
                }
            }
        }
        $condtotal = $conditions;
        $limite = "OFFSET ? LIMIT ?";
        $conditions = array_merge($conditions, $conditionsHaving);
        $cont = ($cont > 1 && $contHaving > 1) ? ($cont + $contHaving - 1)
            : $cont + $contHaving;
        $conditions[$cont++] = $params['start'];
        $conditions[$cont++] = $params['limit'];

        $strEntidadesProductoras = implode(
            ",", $params['entidades_productoras']
        );

        $sql
            = "SELECT
                  mod_planificacion.nom_actividad.idactividad,
                  mod_planificacion.nom_actividad.codigo,
                  mod_planificacion.nom_actividad.denominacion,
                  SUM(COALESCE(mod_planificacion.dat_actividadentidadmanual.nivelactividadmanual,0) +
                  COALESCE(mod_planificacion.dat_actividadentidadproduccion.nivelactividadproduccion,0) +
                  COALESCE(mod_planificacion.dat_actividadentidadautomatico.nivelactividadautomatico,0)) AS nad,
                  mod_planificacion.dat_actividadnivelproduccion.nivelproduccion AS nae,
                  mod_planificacion.nom_actividad.idespecialidadrector,
                  mod_planificacion.dat_actividadnivelproduccion.idaprobacion,
                  (
                  SELECT SUM(
                    COALESCE (subaem.nivelactividadmanual,0)+ COALESCE (subaea.nivelactividadautomatico,0) +
                    COALESCE (subaep.nivelactividadproduccion,0)
                    )                    
                    FROM mod_planificacion.dat_actividadentidad subae 
                    LEFT JOIN mod_planificacion.dat_actividadentidadmanual subaem
                    ON(subaem.idactividadentidad = subae.idactividadentidad)
                    LEFT JOIN mod_planificacion.dat_actividadentidadautomatico subaea
                    ON(subaea.idactividadentidad = subae.idactividadentidad)
                    LEFT JOIN mod_planificacion.dat_actividadentidadproduccion subaep
                    ON( subaep.idactividadentidad = subae.idactividadentidad)                    
                    WHERE subae.idejercicio = {$arrayIdejercicio[0]['idejercicio']}
                    AND subae.idactividadentidad is not null
                    AND subae.identidad IN ({$strEntidadesProductoras})        
                    AND subae.idactividad = mod_planificacion.nom_actividad.idactividad   
                    /*AND ( subae.idaprobacion = 3 OR subae.idaprobacion = 4 )*/
               ) as nivelactividadpropio
            
               FROM
                 mod_planificacion.nom_actividad
                  LEFT JOIN mod_planificacion.dat_actividadnivelproduccion
                  ON (mod_planificacion.nom_actividad.idactividad =
                  mod_planificacion.dat_actividadnivelproduccion.idactividad)

                  INNER JOIN mod_planificacion.dat_actespcomportamiento
                  ON (mod_planificacion.nom_actividad.idactividad =
                  mod_planificacion.dat_actespcomportamiento.idactividad "
            . $onActesPdemanda . " " . $oNActespdemandaSoloProducto . ")
                  LEFT JOIN mod_planificacion.dat_actividadentidad
                  ON (mod_planificacion.dat_actividadentidad.idactespcomportamiento =
                  mod_planificacion.dat_actespcomportamiento.idactespcomportamiento
                  AND mod_planificacion.dat_actividadentidad.idejercicio = {$arrayIdejercicio[0]['idejercicio']})

                  LEFT OUTER JOIN mod_planificacion.dat_actividadentidadautomatico
                  ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
                  mod_planificacion.dat_actividadentidadautomatico.idactividadentidad)
                  LEFT OUTER JOIN mod_planificacion.dat_actividadentidadmanual
                  ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
                  mod_planificacion.dat_actividadentidadmanual.idactividadentidad)
                  LEFT OUTER JOIN mod_planificacion.dat_actividadentidadproduccion
                  ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
                  mod_planificacion.dat_actividadentidadproduccion.idactividadentidad)
                  WHERE
                  mod_planificacion.nom_actividad.nivel = {$this->nivel}
                  AND mod_planificacion.nom_actividad.estado = 1
                  AND ( mod_planificacion.nom_actividad.idaprobacion = 3 OR
                   mod_planificacion.nom_actividad.idaprobacion = 4 OR
                   mod_planificacion.nom_actividad.idaprobacion = 5
                  ) 
                  AND mod_planificacion.dat_actespcomportamiento.iddatosnomenclador = "
            . $iddatosnomanclador['demandada'] . "
                 $where 
                GROUP BY
                  mod_planificacion.dat_actividadentidad.idejercicio,
                  mod_planificacion.nom_actividad.idactividad,
                  mod_planificacion.nom_actividad.codigo,
                  mod_planificacion.nom_actividad.denominacion,
                  mod_planificacion.nom_actividad.idespecialidadrector,
                  mod_planificacion.dat_actividadnivelproduccion.nivelproduccion,
                  mod_planificacion.dat_actividadnivelproduccion.idaprobacion
                HAVING TRUE $having
        ORDER BY mod_planificacion.nom_actividad.codigo,
                  mod_planificacion.nom_actividad.denominacion $limite";

        if ($escont == null || $escont == false) {
            $arrayResult = $conn->execute($sql, $conditions)->fetchAll(
                PDO::FETCH_ASSOC
            );
        }
        $sql
            = "SELECT
                 COUNT( DISTINCT mod_planificacion.nom_actividad.idactividad ) as total
                FROM
              mod_planificacion.nom_actividad
                  LEFT JOIN mod_planificacion.dat_actividadnivelproduccion
                  ON (mod_planificacion.nom_actividad.idactividad =
                  mod_planificacion.dat_actividadnivelproduccion.idactividad)

                  INNER JOIN mod_planificacion.dat_actespcomportamiento
                  ON (mod_planificacion.nom_actividad.idactividad =
                  mod_planificacion.dat_actespcomportamiento.idactividad "
            . $onActesPdemanda . " " . $oNActespdemandaSoloProducto . " )
                  LEFT JOIN mod_planificacion.dat_actividadentidad
                  ON (mod_planificacion.dat_actividadentidad.idactespcomportamiento =
                   mod_planificacion.dat_actespcomportamiento.idactespcomportamiento
                   AND mod_planificacion.dat_actividadentidad.idejercicio = {$arrayIdejercicio[0]['idejercicio']})

                  LEFT OUTER JOIN mod_planificacion.dat_actividadentidadautomatico
                  ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
                  mod_planificacion.dat_actividadentidadautomatico.idactividadentidad)
                  LEFT OUTER JOIN mod_planificacion.dat_actividadentidadmanual
                   ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
                   mod_planificacion.dat_actividadentidadmanual.idactividadentidad)
                  WHERE
                  mod_planificacion.nom_actividad.nivel = {$this->nivel} /*temporal sustiur por servicio formato*/
                  AND ( mod_planificacion.nom_actividad.idaprobacion = 3 OR
                  mod_planificacion.nom_actividad.idaprobacion = 4 OR
                  mod_planificacion.nom_actividad.idaprobacion = 5
                  ) 
                  AND mod_planificacion.dat_actespcomportamiento.iddatosnomenclador = "
            . $iddatosnomanclador['demandada'] . "
                 $where  ";
        if ($escont == null || $escont == true) {
            $arrayResultTotal = $conn->execute($sql, $condtotal)->fetchAll(
                PDO::FETCH_ASSOC
            );
        }
        return array('total' => $arrayResultTotal[0]['total'],
                     'data'  => $arrayResult);
    }

    public function listarIdEspecialidadesRectoreo($params)
    {
        $iddatosnomanclador = DatActespcomportamiento::obtenerIdDatosNom();
        if ($params['idespecialidad'] == '') {
            $idesplogeada = ZendExt_GlobalConcept::getInstance(
            )->Estructura->idespecialidad;
        } else {
            $idesplogeada = $params['idespecialidad'];
        }

        $conn = Doctrine_Manager::connection();
        $query
            = "SELECT DISTINCT
                   mod_planificacion.dat_actespcomportamiento.idespecialidad
                 FROM
                  mod_planificacion.nom_actividad
                  INNER JOIN mod_planificacion.dat_actespcomportamiento
                   ON (mod_planificacion.nom_actividad.idactividad =
                   mod_planificacion.dat_actespcomportamiento.idactividad )
                  INNER JOIN mod_planificacion.dat_actividadentidad
                  ON (mod_planificacion.dat_actividadentidad.idactespcomportamiento =
                  mod_planificacion.dat_actespcomportamiento.idactespcomportamiento)

                  LEFT OUTER JOIN mod_planificacion.dat_actividadentidadautomatico
                  ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
                  mod_planificacion.dat_actividadentidadautomatico.idactividadentidad)
                  LEFT OUTER JOIN mod_planificacion.dat_actividadentidadmanual
                  ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
                  mod_planificacion.dat_actividadentidadmanual.idactividadentidad)
                 WHERE
                  mod_planificacion.nom_actividad.nivel = {$this->nivel} AND
                  mod_planificacion.nom_actividad.idespecialidadrector = ?
                  AND mod_planificacion.dat_actespcomportamiento.iddatosnomenclador = "
            . $iddatosnomanclador['demandada'] . "
                 GROUP BY
                  mod_planificacion.dat_actespcomportamiento.idespecialidad
                 HAVING
                  SUM(COALESCE(mod_planificacion.dat_actividadentidadmanual.nivelactividadmanual, 0) +
                  COALESCE(mod_planificacion.dat_actividadentidadautomatico.nivelactividadautomatico, 0))>0";

        $idespecialidades = $conn->execute($query, array($idesplogeada))
            ->fetchAll(PDO::FETCH_ASSOC);

        $idesp = array();

        foreach ($idespecialidades as $value) {
            $idesp[] = $value['idespecialidad'];
        }

        return $idesp;
    }

    public function adicionarNivelProduccion($niveles)
    {
        $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
        $almacenados = array();

        foreach ($niveles as $datos) {

            $nae = round(floatval($datos->nae), 0);
            $objActNivProd = DatActividadnivelproduccion::buscarActNivProd(
                $datos->idactividad, $arrayIdejercicio[0]['idejercicio']
            )->getFirst();

            if ($nae <= '0') {
                /* Eliminar */
                $query = Doctrine_Query::create();
                $query->delete('DatActividadnivelproduccion')
                    ->from('DatActividadnivelproduccion aep')
                    ->where('aep.idactividad = ?', $datos->idactividad)
                    ->execute();
            } else {
                /* Adicionar */
                if ($objActNivProd->idactividadnivelproduccion == null) {
                    $objActNivProd = new DatActividadnivelproduccion();
                    $objActNivProd->idactividad = $datos->idactividad;
                    $objActNivProd->nivelproduccion = $nae;
                    $objActNivProd->idejercicio
                        = $arrayIdejercicio[0]['idejercicio'];
                    $objActNivProd->idaprobacion = 1;
                    $objActNivProd->save();
                } else {
                    /* Actualizar */
                    $query = Doctrine_Query::create();
                    $query->update("DatActividadnivelproduccion")
                        ->set("nivelproduccion", $nae)
                        ->where("idactividad = ? ", $datos->idactividad)
                        ->execute();
                }
            }
            $almacenados [] = array('idactividad' => $datos->idactividad,
                                    'nae' => $nae,
                                    'idaprobacion' => $objActNivProd->idaprobacion);
        }
        return $almacenados;
    }

    public function listarIdEspecialidadesQueHanDemandado($params)
    {
        $iddatosnomanclador = DatActespcomportamiento::obtenerIdDatosNom();
        if ($params['idespecialidad'] == '') {
            $idesplogeada = ZendExt_GlobalConcept::getInstance(
            )->Estructura->idespecialidad;
        } else {
            $idesplogeada = $params['idespecialidad'];
        }
        $conn = Doctrine_Manager::connection();
        $query
            = "SELECT DISTINCT
                  mod_planificacion.dat_actespcomportamiento.idespecialidad
                  FROM
                  mod_planificacion.nom_actividad
                  INNER JOIN mod_planificacion.dat_actespcomportamiento
                   ON (mod_planificacion.nom_actividad.idactividad =
                   mod_planificacion.dat_actespcomportamiento.idactividad )
                  INNER JOIN mod_planificacion.dat_actividadentidad
                  ON (mod_planificacion.dat_actividadentidad.idactespcomportamiento =
                  mod_planificacion.dat_actespcomportamiento.idactespcomportamiento)
                  LEFT OUTER JOIN mod_planificacion.dat_actividadentidadautomatico
                   ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
                   mod_planificacion.dat_actividadentidadautomatico.idactividadentidad)
                  LEFT OUTER JOIN mod_planificacion.dat_actividadentidadmanual
                  ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
                  mod_planificacion.dat_actividadentidadmanual.idactividadentidad)
               WHERE
                  mod_planificacion.nom_actividad.nivel = {$this->nivel} AND
                  mod_planificacion.nom_actividad.idespecialidad = ?
                  AND mod_planificacion.dat_actespcomportamiento.iddatosnomenclador = "
            . $iddatosnomanclador['demandada'] . "
                GROUP BY
                  mod_planificacion.dat_actespcomportamiento.idespecialidad
                HAVING
                  SUM(COALESCE(mod_planificacion.dat_actividadentidadmanual.nivelactividadmanual, 0) +
                  COALESCE(mod_planificacion.dat_actividadentidadautomatico.nivelactividadautomatico, 0))>0";


        $idespecialidades = $conn->execute($query, array($idesplogeada))
            ->fetchAll(PDO::FETCH_ASSOC);
        $idesp = array();
        foreach ($idespecialidades as $value) {
            $idesp[] = $value['idespecialidad'];
        }
        if ($idesp[0] != null) {
            return $idesp;
        } else {
            return array();
        }
    }

    public function dameDatosEspecialidad($idespecialidades)
    {
        //EspecialidadById
        $ORWHERE = "";
        $ban = true;
        foreach ($idespecialidades as $value) {
            if ($ban) {
                $ORWHERE = $ORWHERE . "idespecialidad = " . $value;
                $ban = false;
            } else {
                $ORWHERE = $ORWHERE . " OR idespecialidad = " . $value;
            }
        }
        //$objeto = $this->nomenclador = new ZendExt_Nomencladores_ADT();
        $especialidades = $this->nomenclador->selectParam(
            'nom_especialidad', array('idespecialidad', 'denespecialidad'), 0,
            0, $ORWHERE
        );
        return $especialidades;
    }


    public function listarEspecialidadesSuper()
    {
        $conn = Doctrine_Manager::connection();
        $query
            = "SELECT DISTINCT
                      mod_planificacion.nom_actividad.idespecialidadrector
                    FROM
                      mod_planificacion.nom_actividad
                    WHERE
                      mod_planificacion.nom_actividad.idespecialidad <>
                      mod_planificacion.nom_actividad.idespecialidadrector";
        $idespecialidades = $conn->execute($query)->fetchAll();
        $idesp = array();
        foreach ($idespecialidades as $value) {
            $idesp[] = $value['idespecialidadrector'];
        }
        return $idesp;
    }

    public function cargarconfiguracionpermisos()
    {
        $idesplogeada = ZendExt_GlobalConcept::getInstance(
        )->Estructura->idespecialidad;
        $res = array("rectorActiv" => false, "esEjecutor" => false);
        if (DatActespcomportamiento::esEjecutorDeLaDemanda($idesplogeada)) {
            $res["rectorActiv"] = true;
        }
        if (NomActividad::esRectorDeActividades($idesplogeada)) {
            $res["esEjecutor"] = true;
        }
        return array('permisos' => $res);
    }

    public function guardaraprobacion($params)
    {

        $conn = Doctrine_Manager::connection();

        $cond [] = $params['idaprobacion'];
        if ($params['tipo'] == 'rector') {

            $where = " WHERE a.idespecialidadrector = ? ";
            $cond [] = ($params['idespecialidadrector'])
                ? $params['idespecialidadrector'] : $params['idesplogeada'];

            if (isset($params['actividades'][0])) {
                $where .= " AND ( a.idactividad = ? ";
                $cond [] = $params['actividades'][0];
                foreach ($params['actividades'] as $v) {
                    $where .= " OR a.idactividad = ? ";
                    $cond [] = $v;
                }
                $where .= " ) ";
                if ($params['idespecialidad']) {
                    $where .= " AND aed.idespecialidad = ? ";
                    $cond [] = $params['idespecialidad'];
                }
            }
            $whereactenidad = '';
            if ($params['rectorseguridad'] == 'false') {
                $whereactenidad = " AND idaprobacion <> 4 ";
            }

            $sql
                = "UPDATE mod_planificacion.dat_actividadentidad SET idaprobacion = ? WHERE idactespcomportamiento IN
                (SELECT aed.idactespcomportamiento FROM mod_planificacion.dat_actespcomportamiento aed
                  INNER JOIN mod_planificacion.nom_actividad a ON (a.idactividad = aed.idactividad)
                  $where ) $whereactenidad";
        } elseif ($params['tipo'] == 'productor') {

            $where .= " WHERE a.idespecialidad = ? ";
            if ($params['idespecialidadproductor']) {
                $cond [] = $params['idespecialidadproductor'];
            } else {
                $cond [] = $params['idesplogeada'];
            }

            if (isset($params['actividades'][0])) {
                $where .= " AND ( a.idactividad = ? ";
                $cond [] = $params['actividades'][0];
                foreach ($params['actividades'] as $v) {
                    $where .= " OR a.idactividad = ? ";
                    $cond [] = $v;
                }
                $where .= " ) ";
            }

            $whereactenidad = '';
            if ($params['rectorseguridad'] == 'false') {
                $whereactenidad = " AND idaprobacion <> 4 ";
            }

            $sql
                = "UPDATE mod_planificacion.dat_actividadnivelproduccion SET idaprobacion = ? WHERE idactividad IN
                (SELECT a.idactividad FROM mod_planificacion.nom_actividad a
                 $where ) $whereactenidad";
        }

        $conn->execute($sql, $cond)->fetchAll();

        return array('codMsg' => 24);
    }

    public function listarEspecialidadesProductoras()
    {
        $idespecialidades
            = DatActespcomportamiento::obtenerProductoresDeActividades();
        $idesp = array();
        foreach ($idespecialidades as $value) {
            $idesp[] = $value['idespecialidad'];
        }
        if ($idesp[0] != null) {
            return $idesp;
        } else {
            return array();
        }
    }

    public function exportarAExcel($params)
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $idioma = ZendExt_GlobalConcept::getInstance()->Perfil->idioma;
        $etiquetas = file_get_contents(
            $dirApps
            . "/planificacion/planmeta/views/idioma/{$idioma}/demandaproduccion/demandaproduccion.json"
        );
        unset($idioma);
        unset($dirApps);
        $etiquetas = str_replace("{", "", $etiquetas);
        $etiquetas = str_replace("}", "", $etiquetas);
        $etiquetas = str_replace("\n", "", $etiquetas);
        $etiquetas = str_replace("'", "", $etiquetas);
        $etiquetas = split(",", $etiquetas);
        $arrayEtiq = array();
        foreach ($etiquetas as $key => $valor) {
            $arrayEtiqueta = split(":", $valor);
            $indice = str_replace("\r", "", $arrayEtiqueta[0]);
            $indice = str_replace(" ", "", $indice);
            $arrayEtiq [$indice] = $arrayEtiqueta[1];
            unset($etiquetas[$key]);
        }
        unset($etiquetas);
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=demanda.xls");
        header("Content-Transfer-Encoding: binary ");
        if ($params['tipo'] == 'rector') {
            echo '<caption> ' . $arrayEtiq['lbDemandaRector'];
        } else {
            echo '<caption> ' . $arrayEtiq['lbDemandaDelProductor'];
        }
        echo "</caption>";

        echo "<table border=1 cellspacing=0 width=60%>       
        <tr>
             <th align=left>{$arrayEtiq['lbCodigo']}</th>
             <th align=left>{$arrayEtiq['lbDenominacion']}</th>";
        if ($params['tipo'] == 'rector') {
            echo "<th align=left >{$arrayEtiq['lbNivelActividad']}</th>
             <th align=left >{$arrayEtiq['lbNAEP']}</th>
             <th align=left >{$arrayEtiq['lbDiferencia']}</th>
             <th align=left >{$arrayEtiq['lbAprobado']}</th>
         </tr>";
        } else {
            echo "<th align=left >{$arrayEtiq['lbNAD']}</th>
             <th align=left >{$arrayEtiq['lbNAP']}</th>
             <th align=left >{$arrayEtiq['lbNAE']}</th>
             <th align=left >{$arrayEtiq['lbDiferencia']}</th>
             <th align=left >{$arrayEtiq['lbAprobado']}</th>
         </tr>";
        }
        $arrayIdsaprobacion = array();
        $arrayIdsaprobacion ['id_1'] = $arrayEtiq['lbNo'];
        $arrayIdsaprobacion ['id_3'] = $arrayEtiq['lbSi'];
        $arrayIdsaprobacion ['id_4'] = $arrayEtiq['lbRector'];
        $arrayIdsaprobacion ['id_5'] = $arrayEtiq['lbRector'];
        if ($params['tipo'] == 'rector') {
            $cant = DatDemandaproduccionModel::listarDemandaRector(
                $params, true
            );
        } else {
            $cant = DatDemandaproduccionModel::listarDemandaProductor(
                $params, true
            );
        }
        $cant = $cant['total'];
        $cantxpag = 10000;
        $cantpag = (int)($cant / $cantxpag);
        if (fmod($cant, $cantxpag) > 0) {
            $cantpag++;
        }
        unset($cant);
        $offset = 0; //start
        $paso = $cantxpag; //limit
        for ($i = 0; $i < $cantpag; $i++) {
            $params['start'] = $offset;
            $params['limit'] = $paso;
            if ($params['tipo'] == 'rector') {
                $arrayDem = DatDemandaproduccionModel::listarDemandaRector(
                    $params, false
                );
            } else {
                $arrayDem = DatDemandaproduccionModel::listarDemandaProductor(
                    $params, false
                );
            }
            foreach ($arrayDem['data'] as $value) {
                echo "<tr>";
                echo "<td align=right style=\"mso-number-format:'@';\">"
                    . $value['codigo'] . "</td>";
                echo "<td align=left>" . $value['denominacion'] . "</td>  ";
                if ($params['tipo'] == 'rector') {
                    echo "<td align=right>" . $value['na'] . "</td>";
                    echo "<td align=right >" . (($value['naep'] != null)
                            ? $value['naep'] : '0') . "</td>";
                    echo "<td align=right >" . ($value['naep'] - $value['na'])
                        . "</td>";
                    echo "<td align=right >" . ($value['nae'] - ($value['nad']
                                + $value['nivelactividadpropio']))
                        . "</td>";
                    echo "<td align=right >" . $arrayIdsaprobacion['id_'
                        . $value['idaprobacion']] . "</td>";
                } else { //prod
                    echo "<td align=right>" . $value['nad'] . "</td>";
                    echo "<td align=right >" . $value['nivelactividadpropio']
                        . "</td>";
                    echo "<td align=right >" . $value['nae'] . "</td>";
                    echo "<td align=right >" . ($value['nae'] - ($value['nad']
                                + $value['nivelactividadpropio']))
                        . "</td>";
                    echo "<td align=right >" . $arrayIdsaprobacion['id_'
                        . $value['idaprobacion']] . "</td>";
                }

                echo "</tr>";
            }
            $offset += $paso;
        }
        echo "</table>";
    }

}

//fin clase
