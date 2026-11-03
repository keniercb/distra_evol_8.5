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
        $this->hasMany('DatIndicadoruamtipodepreciacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatCaractcampo', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
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
        $this->hasMany('DatDesgloseentidad', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatControldivisaindicadormodelo', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatPlanificacionnae', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatDesgloseentidadnivel', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatControlejecucionoace', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
		$this->hasMany('DatEtapainversionactespcomportamiento', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
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
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $data;
    }

    public function listarOrdenado() {
        $query = new Doctrine_Query();
        $data = $query->select("n.idejercicio,n.ejercicio")
                ->from('NomEjercicioplanificacion n')
                ->orderBy('n.ejercicio')
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $data;
    }

    public function getAnno($idejercicio) {
        $query = new Doctrine_Query();
        $data = $query->select("n.idejercicio,n.ejercicio")
                        ->from('NomEjercicioplanificacion n')
                        ->where('n.idejercicio=?', $idejercicio)
                        ->execute()->getFirst()->ejercicio;
        return $data;
    }
 
    public function listarEjercicioActualByUri($params) {
        $query = new Doctrine_Query();

        if ($params['ejercicios']) {
            try{
                $query->addWhere("n.ejercicio IN (".$params['ejercicios'].")");
                $data = $query->select('nd.uridatosnomenclador as nombreestado, n.ejercicio')
                    ->from('NomEjercicioplanificacion n')
                    ->innerJoin('n.NomDatosnomenclador nd')
                    ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                    ->execute();

                //print_r($data);die;
            }
            catch(Exception $e){
                print_r($e);die;
            }


        }
        else{
            $data = $query->select('n.idejercicio,n.ejercicio')
                ->from('NomEjercicioplanificacion n')
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        }

        return $data;
    }

    public function obtenerDenEjercicioActual() {
        $query = new Doctrine_Query();
        $data = $query->select('n.ejercicio,n.idejercicio')
                        ->from('NomEjercicioplanificacion n')
                        ->WHERE('n.actual =?', 1)
                        ->execute()->getFirst()->toArray();
        return $data;
    }

    //------------------------
    //Listar los ejercicios existentes.
    public static function obtenerListadoEjercicios($parametros) {

        $addWhere = "";
        $filtros = "";
        $param = array();
        if (is_array($parametros['filtros'])) {
            foreach ($parametros['filtros'] as $key => $datos) {
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
                }
            }
        }
        if ($parametros['idejercicio'] && $parametros['accion'] == 'Modificar') {
            $addWhere = $addWhere . " AND  m.idejercicio <> " . $parametros['idejercicio'] . " ";
        }

        $conn = Doctrine_Manager::connection();
        $query
                = "SELECT m.idejercicio,
                                m.ejercicio,
                                m.actual,
                                m.margenc,
                                m.idestado,
                                m2.denominacion
                        FROM mod_planificacion.nom_ejercicioplanificacion m
                        LEFT JOIN mod_planificacion.nom_datosnomenclador m2 ON m.idestado = m2.iddatosnomenclador
                        WHERE true" . $addWhere . "
                        ORDER BY m.ejercicio ";


        $result['total'] = count($conn->execute($query)->fetchAll());
        $query .= " LIMIT(" . $parametros['limit'] . ") OFFSET(" . $parametros['start'] . ") ";
        $result['data'] = $conn->execute($query)->fetchAll();
        return $result;
    }

    //para asegurar que sea siempre un solo ejercicoi actual
    public function cambiarActual() {
        $query = Doctrine_Query::create();
        $query->update('NomEjercicioplanificacion ep')
                ->set('ep.actual', 0)
                ->where('ep.actual=1');
        $result = $query->execute();
        return $result;
    }

    public function cambiarActual1() {
        $query = Doctrine_Query::create();
        $query->update('NomEjercicioplanificacion ep')
                ->set('ep.actual', 1)
                ->where('ep.actual=0');
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

    public function duplicarDesglose($ejdestino, $ejorigen) {
        $array_parametros = array();
        $conn = Doctrine_Manager::connection();
        $array_parametros[0] = $ejorigen;
        $array_parametros[1] = $ejdestino;
        $query = "select * from mod_planificacion.f_duplicardesglose(?,?)";
        $res = $conn->execute($query, $array_parametros);
        $result1 = $res->fetchAll();
    }

    public function duplicarPlanes($ejdestino, $ejorigen) {
        $array_parametros = array();
        $conn = Doctrine_Manager::connection();
        $query = "select *from mod_planificacion.f_duplicarplanificacion(" . $ejorigen . "," . $ejdestino . ")";
        $res = $conn->execute($query);
        $result1 = $res->fetchAll();
    }

    public function duplicarNormaRegla($ejdestino, $ejorigen) {
        $array_parametros = array();
        $conn = Doctrine_Manager::connection();
        $query = "select * from mod_planificacion.f_duplicarnormayregla(" . ($ejorigen) . "," . ($ejdestino) . ")"; //print_r($query);die;
        $res = $conn->execute($query);
        $result1 = $res->fetchAll();
    }

    public function duplicarNiveles($ejdestino, $ejorigen) {
        $array_parametros = array();
        $conn = Doctrine_Manager::connection();
        $query = "select * from mod_planificacion.f_duplicarnivelesactividad(" . $ejorigen . "," . $ejdestino . ")";
        $res = $conn->execute($query);
        $result1 = $res->fetchAll();
    }

    public function eliminarTodo($idejercicio, $planes, $niveles, $normas) {
        $conn = Doctrine_Manager::connection();
        $query
                =
                "select * from mod_planificacion.f_eliminardatosejercicio(" . $idejercicio . "," . $planes . "," . $niveles
                . "," . $normas . ")";

        $res = $conn->execute($query);
    }

    public function listarEjerciciosActDesact($parametros) {


        $cadenaSELECT = "";
        $cadenaJOIN = "";
        $cadenaWHERE = "";
        $cadenaQUERY = "";

        $cadenaSELECT
                = " SELECT DISTINCT(n.idejercicio) as id,n.ejercicio as text,pfest.idprocesofuncionalidad, case when n.idejercicio IS NOT NULL then true end as leaf ";
        $cadenaJOIN
                = " FROM mod_planificacion.nom_ejercicioplanificacion n
						INNER JOIN mod_planificacion.dat_procesofuncionalidadestado pfest ON n.idejercicio=pfest.idejercicio";
        $cadenaWHERE
                = " WHERE pfest.idprocesofuncionalidad=" . ($parametros->idprocesofuncionalidad) . " and pfest.idestado="
                . ($parametros->idestado) . " and pfest.activo=" . (($parametros->activar == 1) ? 0 : 1) . " ";

        if ($parametros->activar == 1) {
            $cadenaWHERE
                    .=
                    " AND n.idejercicio NOT IN ( SELECT idejercicio FROM mod_planificacion.dat_procesofuncionalidadestado WHERE activo=1 AND idprocesofuncionalidad="
                    . ($parametros->idprocesofuncionalidad) . ") ";
        }

        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
        $conex = Doctrine_Manager :: connection();
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
            if ($ejercicio[0]->idejercicio != null)
                $arrayejercicios[] = $ejercicio[0]->idejercicio;
        }

        $numejercicio = "'" . $parametros->ejercicio . "'";
        $ejercicio = Doctrine::getTable('NomEjercicioplanificacion')->findByDql("ejercicio = {$numejercicio}");
        if ($ejercicio[0]->idejercicio != null)
            $arrayejercicios[] = $ejercicio[0]->idejercicio;


        for ($i = 1; $i <= $parametros->posteriores; $i++) {
            $numejercicio = "'" . ($parametros->ejercicio + $i) . "'";
            $ejercicio = Doctrine::getTable('NomEjercicioplanificacion')->findByDql("ejercicio = {$numejercicio}");
            if ($ejercicio[0]->idejercicio != null)
                $arrayejercicios[] = $ejercicio[0]->idejercicio;
        }
        return $arrayejercicios;
    }

    public static function obtenerEjercicioDadoId($idejercicio) {
        $query = new Doctrine_Query();
        $data = $query->select('n.ejercicio')
                        ->from('NomEjercicioplanificacion n')
                        ->WHERE('n.idejercicio =?', $idejercicio)
                        ->execute()->toArray();
        return $data;
    }

}

?>
