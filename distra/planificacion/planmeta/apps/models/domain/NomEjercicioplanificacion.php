<?php

class NomEjercicioplanificacion extends BaseNomEjercicioplanificacion {

    public function setUp() {
        parent::setUp();
        $this->hasMany('DatPlanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatAjusteexistencia', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatAjusteexistenciaod', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatAjusteexistenciacb', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatActividadentidad', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatActividadnivelproduccion', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatAnteproyecto', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatBasescalculo', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatBasescalculosalida', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatAjusteplanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatRegla', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatNorma', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasOne('NomDatosnomenclador', array('local' => 'idestado', 'foreign' => 'iddatosnomenclador'));
        $this->hasMany('DatProcesofuncionalidadestado', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatNecesidaddesglose', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatDesglosecompleto', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatControldivisaindicadormodelo', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatPlanificacionnae', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatDesgloseentidadnivel', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatDesviacionplan', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatContrataciondemanda', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatProyeccion', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatPronostico', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatControlpermiso', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
    }

    public function listarEjercicioActual() {
        $query = new Doctrine_Query();
        $data = $query->from('NomEjercicioplanificacion n')
                ->where('n.actual=?', 1)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $data;
    }

    public function listar() {
        $query = new Doctrine_Query();
        $data = $query->select("n.idejercicio,n.ejercicio")
                        ->from('NomEjercicioplanificacion n')
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
        return $data;
    }

    public function listarOrdenado() {
        $query = new Doctrine_Query();
        $data = $query->select("n.idejercicio,n.ejercicio")
                ->from('NomEjercicioplanificacion n')
                ->orderBy('n.ejercicio')->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $data;
    }

    public function listarEjercicio() {
        $sqlQuery = "SELECT n.idejercicio,n.ejercicio,ndn.uridatosnomenclador
                            FROM mod_planificacion.nom_ejercicioplanificacion n
                            INNER JOIN mod_planificacion.nom_datosnomenclador ndn 
                            ON(n.idestado = ndn.iddatosnomenclador)
                            ORDER BY n.ejercicio::NUMERIC";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarEjercicioEnElabyEjec() {
        $sqlQuery = "SELECT n.idejercicio,
                            n.ejercicio
                    FROM mod_planificacion.nom_ejercicioplanificacion n
                    INNER JOIN mod_planificacion.nom_datosnomenclador dn 
                    ON (n.idestado = dn.iddatosnomenclador)
                    WHERE dn.uridatosnomenclador = 'elaboracion' OR
                          dn.uridatosnomenclador = 'ejecucion'
                    ORDER BY n.ejercicio::NUMERIC";
        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function getAnno($idejercicio) {
        $query = new Doctrine_Query();
        $data = $query->select("n.idejercicio,n.ejercicio")
                        ->from('NomEjercicioplanificacion n')
                        ->where('n.idejercicio=?', $idejercicio)->execute()
                        ->getFirst()->ejercicio;
        return $data;
    }

    public function listarEjercicioActualByUri() {
        $query = new Doctrine_Query();
        $data = $query->select('n.idejercicio,n.ejercicio')
                        ->from('NomEjercicioplanificacion n')
                        ->orderBy('n.ejercicio')
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
        return $data;
    }

    public function obtenerDenEjercicioActual() {
        $query = new Doctrine_Query();
        $data = $query->select('n.ejercicio,n.idejercicio')
                        ->from('NomEjercicioplanificacion n')->WHERE('n.actual =?', 1)
                        ->execute()->getFirst()->toArray();
        return $data;
    }

    //Listar los ejercicios existentes.
    public static function obtenerListadoEjercicios($parametros) {
        $addWhere = "";
        if (is_array($parametros['filtros'])) {
            foreach ($parametros['filtros'] as $datos) {
                if ($datos ['field'] == 'ejercicio') {
                    $addWhere = " AND upper(m.ejercicio) LIKE '%" . strtoupper($datos ['data'] ['value']) . "%' ";
                }
                if ($datos['field'] == 'denominacion') {
                    $addWhere = $addWhere . " AND m.idestado =" . $datos ['data'] ['value'];
                }
                if ($datos['field'] == 'actual') {
                    if ($datos ['data'] ['value'] == 'true') {
                        $addWhere = $addWhere . " AND m.actual = 1 ";
                    } elseif ($datos ['data'] ['value'] == 'false') {
                        $addWhere = $addWhere . " AND m.actual = 0 ";
                    }
                } elseif ($datos['field'] == 'idusuario') {
                    $addWhere .= " AND m.idusuario ={$datos['data']['value']}";
                } elseif ($datos ['field'] == 'fecha') {
                    $fecha = explode('/', $datos ['data']['value']);
                    $fecha = $fecha[1] . '/' . $fecha[0] . '/' . $fecha[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= "AND m.fecha::date<'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= "AND m.fecha::date>'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= "AND m.fecha::date='{$fecha}'";
                    }
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT    m.idejercicio,
                            m.ejercicio,
                            m.actual,
                            m.idestado,
                            m2.uridatosnomenclador,
                            m2.denominacion,
                            m.idjerciciocontable,
                            m.idusuario,
                            m.fecha,
                            COUNT(*) OVER() as total
                FROM mod_planificacion.nom_ejercicioplanificacion m
                     LEFT JOIN mod_planificacion.nom_datosnomenclador m2 ON m.idestado = m2.iddatosnomenclador
                WHERE true $addWhere
                ORDER BY m.ejercicio  OFFSET {$parametros ['start']}
                LIMIT {$parametros ['limit']}";
        $result->data = $conn->execute($query)->fetchAll();
        $result->total = $result->data[0]['total'];
        return $result;
    }

    //para asegurar que sea siempre un solo ejercicio actual
    public function cambiarActual() {
        $query = Doctrine_Query::create();
        $query->update('NomEjercicioplanificacion ep')
                ->set('ep.actual', 0)->where('ep.actual=1');
        $result = $query->execute();
        return $result;
    }

    //para asegurar que sea siempre un solo ejercicio en estado de ejecucion
    public function cambiarEjecucion($idestadonuevo, $idestadoviejo) {
        $query = Doctrine_Query::create();
        $query->update('NomEjercicioplanificacion ep')
                ->set('ep.idestado', $idestadonuevo)
                ->where('ep.idestado=?', $idestadoviejo);
        $result = $query->execute();
        return $result;
    }

    public function duplicarDesglose($ejdestino, $ejorigen, $entidades) {
        $arrayParametros = array();
        $conn = Doctrine_Manager::connection();
        $arrayParametros[0] = $ejorigen;
        $arrayParametros[1] = $ejdestino;
        $arrayParametros[2] = '{' . $entidades . '}';
        $query = "select * from mod_planificacion.f_duplicardesglose(?,?,?)";
        $conn->execute($query, $arrayParametros);
    }

    public function duplicarPlanes($ejdestino, $ejorigen, $porciento, $entidades) {
        $conn = Doctrine_Manager::connection();
        $arrayParametros = array();
        $arrayParametros[0] = $ejorigen;
        $arrayParametros[1] = $ejdestino;
        $arrayParametros[2] = $porciento;
        $arrayParametros[3] = '{' . $entidades . '}';
        $query = "select *from mod_planificacion.f_duplicarplanificacion(?,?,?,?)";
        $conn->execute($query, $arrayParametros);
    }

    public function duplicarNormaRegla($ejdestino, $ejorigen, $idusuario) {
        $conn = Doctrine_Manager::connection();
        $query = "select * from mod_planificacion.f_duplicarnormayregla(" . ($ejorigen) . "," . ($ejdestino) . "," . ($idusuario) . ")";
        $res = $conn->execute($query);
        $res->fetchAll();
    }

    public function duplicarNorma($ejdestino, $ejorigen, $idusuario) {
        $conn = Doctrine_Manager::connection();
        $query = "select * from mod_planificacion.f_duplicarnorma(" . ($ejorigen) . "," . ($ejdestino) . "," . ($idusuario) . ")";
        $res = $conn->execute($query);
        $res->fetchAll();
    }

    public function duplicarNiveles($ejdestino, $ejorigen, $porciento, $entidades) {
        $conn = Doctrine_Manager::connection();
        $arrayParametros = array();
        $arrayParametros[0] = $ejorigen;
        $arrayParametros[1] = $ejdestino;
        $arrayParametros[2] = $porciento;
        $arrayParametros[3] = '{' . $entidades . '}';
        $query = "select * from mod_planificacion.f_duplicarnivelesactividad(?,?,?,?)";
        $res = $conn->execute($query, $arrayParametros);
    }

    public function eliminarTodo($idejercicio, $planes, $niveles, $normas, $entidades) {
        $conn = Doctrine_Manager::connection();
        $arrayParametros = array();
        $arrayParametros[0] = $idejercicio;
        $arrayParametros[1] = $planes;
        $arrayParametros[2] = $niveles;
        $arrayParametros[3] = $normas;
        $arrayParametros[4] = '{' . $entidades . '}';
        $query = "select * from mod_planificacion.f_eliminardatosejercicio(?,?,?,?,?)";
        $res = $conn->execute($query, $arrayParametros);
    }

    public function listarEjerciciosActDesact($parametros) {
        $cadenaSELECT = "";
        $cadenaJOIN = "";
        $cadenaWHERE = "";
        $cadenaQUERY = "";
        $cadenaSELECT = " SELECT DISTINCT(n.idejercicio) as id,
                                n.ejercicio as text,
                                pfest.idprocesofuncionalidad, 
                                case when n.idejercicio IS NOT NULL
                                then true end as leaf ";
        $cadenaJOIN = " FROM mod_planificacion.nom_ejercicioplanificacion n
				INNER JOIN mod_planificacion.dat_procesofuncionalidadestado pfest
				ON n.idejercicio=pfest.idejercicio";
        $cadenaWHERE = " WHERE pfest.idprocesofuncionalidad=" . ($parametros->idprocesofuncionalidad) . " 
                               and pfest.idestado=" . ($parametros->idestado) . " 
                               and pfest.activo=" . (($parametros->activar == 1) ? 0 : 1) . " ";

        if ($parametros->activar == 1) {
            $cadenaWHERE .= " AND n.idejercicio NOT IN 
                                                        ( SELECT idejercicio
                                                        FROM mod_planificacion.dat_procesofuncionalidadestado
                                                        WHERE activo=1 
                                                        AND idprocesofuncionalidad=" . ($parametros->idprocesofuncionalidad) . ") ";
        }

        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
        $conex = Doctrine_Manager:: connection();
        $data = $conex->execute($cadenaQUERY)->fetchAll();
        return $data;
    }

    public function getEjerciciosAntePosteriores($parametros) {
        $ejercicio = '';
        $arrayejercicios = array();
        $numejercicio = null;
        for ($i = 1; $i <= $parametros->anteriores; $i++) {
            $numejercicio = "'" . ($parametros->ejercicio - $i) . "'";
            $ejercicio = Doctrine::getTable('NomEjercicioplanificacion')->findByDql("ejercicio = {$numejercicio}");
            if ($ejercicio[0]->idejercicio != null) {
                $arrayejercicios[] = $ejercicio[0]->idejercicio;
            }
        }
        $numejercicio = "'" . $parametros->ejercicio . "'";
        $ejercicio = Doctrine::getTable('NomEjercicioplanificacion')->findByDql("ejercicio = {$numejercicio}");
        if ($ejercicio[0]->idejercicio != null) {
            $arrayejercicios[] = $ejercicio[0]->idejercicio;
        }
        for ($i = 1; $i <= $parametros->posteriores; $i++) {
            $numejercicio = "'" . ($parametros->ejercicio + $i) . "'";
            $ejercicio = Doctrine::getTable('NomEjercicioplanificacion')->findByDql("ejercicio = {$numejercicio}");
            if ($ejercicio[0]->idejercicio != null) {
                $arrayejercicios[] = $ejercicio[0]->idejercicio;
            }
        }
        return $arrayejercicios;
    }

    public static function obtenerEjercicioDadoId($idejercicio) {
        $query = new Doctrine_Query();
        $data = $query->select('n.ejercicio')
                        ->from('NomEjercicioplanificacion n')
                        ->WHERE('n.idejercicio =?', $idejercicio)->execute()->toArray();
        return $data;
    }

    public static function obtenerEjercicoDedatosMaestros($idejercicio) {
        $incluirejercicio = "";
        if ($idejercicio != null) {
            $incluirejercicio = " and idejercicio<>$idejercicio";
        }
        $sqlQuery = "SELECT ejer.idejercicio,
                            ejer.nombre as ejercicio
                     FROM mod_datosmaestros.dat_ejerciciocontable ejer
                     where ejer.idejercicio not in (
                                                         select idjerciciocontable
                                                         from mod_planificacion.nom_ejercicioplanificacion
                                                         where idjerciciocontable is not null $incluirejercicio
                                                    ) 
                     and ejer.nombre not in (
                                                    select ejercicio
                                                    from mod_planificacion.nom_ejercicioplanificacion 
                                                    where true $incluirejercicio
                                             )
                     order by ejercicio";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    /* ---SERVICIOS PARA PLANMETA--- */

    //Utilizado como servicio
    public function servicioObtenerEjercicioActual() {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT n.idejercicio,
                            n.ejercicio,
                            ndn.uridatosnomenclador
                     FROM mod_planificacion.nom_ejercicioplanificacion n
                     INNER JOIN mod_planificacion.nom_datosnomenclador ndn 
                     ON (n.idestado = ndn.iddatosnomenclador)
                     WHERE n.actual = 1";
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data[0];
    }

    //Utilizado como servicio
    public function servicioObtenerEjercicios($uriestado, $idejercicio) {
        $addwhereestado = "";
        if ($uriestado) {
            $addwhereestado = " and ndn.uridatosnomenclador = '$uriestado'";
        }
        $addwhereIdejercicio = "";
        if ($idejercicio) {
            $addwhereIdejercicio = " and n.idejercicio <> $idejercicio";
        }
        //con esta consulta se obtiene la uri del ejercicio y asi controlar las acciones en el componente en
        //dependencia del estado del Ejercicio seleccionado
        $sqlQuery = "SELECT n.idejercicio,n.ejercicio,
                            ndn.uridatosnomenclador,
                            ndn.denominacion as denomestado
                        FROM mod_planificacion.nom_ejercicioplanificacion n
                        INNER JOIN mod_planificacion.nom_datosnomenclador ndn 
                        ON(n.idestado = ndn.iddatosnomenclador)
                        where true
                        $addwhereestado
                        $addwhereIdejercicio
                        ORDER BY n.ejercicio::NUMERIC";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Utilizado como servicio    
    public function servicioObtenerEjercicioPorDenom($demonejercicio) {
        $query = new Doctrine_Query();
        $data = $query->select('n.ejercicio,n.idejercicio')
                ->from('NomEjercicioplanificacion n')
                ->WHERE('n.ejercicio =?', $demonejercicio)
                ->execute(); //->getFirst()->toArray(); 
        //El getFirst da error 500 cuando la consulta no devuelve datos.
        //No se ha identificado quién esté usando este servicio.


        return $data;
    }

    //Utilizado como servicio
    public function servicioObtenerEjercicioFecha($fecha) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT idejercicio
                     FROM mod_planificacion.nom_ejercicioplanificacion 
                     where '$fecha' BETWEEN fechainicio and fechafin";
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_COLUMN);
        return $data[0];
    }

    //Utilizado como servicio
    public function servicioObtenerEjercicioActualYAnteriores($excluirActual = false) {
        $operador = "<=";
        if ($excluirActual) {
            $operador = "<";
        }

        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT ep.idejercicio,
                            ep.ejercicio || ' (' ||dn.denominacion || ')' as ejercicio,
                            dn.uridatosnomenclador
                     FROM mod_planificacion.nom_ejercicioplanificacion ep
                          INNER JOIN mod_planificacion.nom_datosnomenclador dn ON ep.idestado = dn.iddatosnomenclador
                     WHERE fechainicio $operador
                           (
                             SELECT fechainicio
                             FROM mod_planificacion.nom_ejercicioplanificacion ep
                             WHERE actual = 1
                           )
                     ORDER BY ep.ejercicio::NUMERIC";
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function getEjerciciosBaseTraspasar() {
        $sqlQuery = "SELECT n.idejercicio,
                            n.ejercicio||'('||dn.denominacion||')' as ejercicio
                    FROM mod_planificacion.nom_ejercicioplanificacion n
                    INNER JOIN mod_planificacion.nom_datosnomenclador dn 
                    ON (n.idestado = dn.iddatosnomenclador)
                    WHERE dn.uridatosnomenclador != 'elaboracion'
                    ORDER BY n.ejercicio::NUMERIC";
        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarEjercicioEjecucion() {
        $query = new Doctrine_Query();
        $data = $query->select('n.idejercicio')
                        ->from('NomEjercicioplanificacion n')
                        ->innerJoin('n.NomDatosnomenclador dn')
                        ->where('dn.uridatosnomenclador=?', 'ejecucion')
                        ->orderBy('n.ejercicio')
                        ->execute()->getFirst()->toArray();
        return $data;
    }

}
