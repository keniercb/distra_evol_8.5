<?php

class DatRegla extends BaseDatRegla {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'NomActividad', array('local' => 'idactividadquegenera', 'foreign' =>
            'idactividad')
        );
        $this->hasOne(
                'DatNorma', array('local' => 'idnorma', 'foreign' => 'idnorma')
        );
        $this->hasOne(
                'NomEjercicioplanificacion', array('local' => 'idejercicio',
            'foreign' => 'idejercicio')
        );
    }

    public function listarReglas(Array $params) {
        //filtros
        $addWhereFiltros = "";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacion') {
                    $addWhereFiltros .= " AND upper(r.denominacion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos['field'] == 'denoindicador') {
                    $addWhereFiltros .= " AND upper(ind.denominacion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos['field'] == 'valorcontrol') {
                    if ($datos['data']['comparison'] == 'lt') {

                        $addWhereFiltros .= " and r.valorcontrol < {$datos['data']['value']}";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {

                            $addWhereFiltros .= " and r.valorcontrol > {$datos['data']['value']}";
                        } else {
                            $addWhereFiltros .= " and r.valorcontrol = {$datos['data']['value']}";
                        }
                    }
                } elseif ($datos['field'] == 'denoactividad') {
                    $addWhereFiltros .= " AND upper(a.denominacion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos['field'] == 'nivelactividadbase') {
                    if ($datos['data']['comparison'] == 'lt') {

                        $addWhereFiltros .= " and r.nivelactividadbase < {$datos['data']['value']}";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {

                            $addWhereFiltros .= " and r.nivelactividadbase > {$datos['data']['value']}";
                        } else {
                            $addWhereFiltros .= " and r.nivelactividadbase = {$datos['data']['value']}";
                        }
                    }
                } elseif ($datos['field'] == 'tipo') {
                    if ($datos['data']['value'] == 'Generada') {
                        $addWhereFiltros .= " AND r.idactividadorigen <>{$params['idactividad']}";
                    } else {
                        $addWhereFiltros .= " AND r.idactividadorigen ={$params['idactividad']}";
                    }
                } elseif ($datos['field'] == 'idusuario') {
                    $addWhereFiltros .= " AND r.idusuario ={$datos['data']['value']}";
                } elseif ($datos ['field'] == 'fecha') {
                    $fechafin = explode('/', $datos ['data']['value']);
                    $fechafin = $fechafin[1] . '/' . $fechafin[0] . '/' . $fechafin[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhereFiltros .= "AND r.fecha::date<'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhereFiltros .= "AND r.fecha::date>'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhereFiltros .= "AND r.fecha::date='{$fechafin}'";
                    }
                }
            }
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit']) {
            $delimitando = " LIMIT {$params['limit']} OFFSET {$params['start']} ";
        }

        $con = Doctrine_Manager::connection();
        $query = "SELECT 
                        r.idregla,
                        r.denominacion,
                        COALESCE(ind.denominacion, '-') as denoindicador,
                        r.valorcontrol,
                        a.denominacion as denoactividad,
                        r.nivelactividadbase,
                        r.idusuario,
                        r.fecha,
                        CASE WHEN r.idactividadorigen <> {$params['idactividad']}
                        THEN 'Generada'
                        ELSE 'Generadora' END AS tipo,
                        r.idactividadorigen,
                        r.idactividaddestino,
                        COUNT(*) OVER() as total
                FROM mod_planificacion.dat_regla r
                     LEFT JOIN mod_planificacion.dat_norma n ON (r.idnorma = n.idnorma)
                     LEFT JOIN mod_datosmaestros.nom_indicador ind ON (ind.idindicador =
                       n.idindicador)
                     INNER JOIN mod_planificacion.nom_actividad a ON (a.idactividad =
                       r.idactividaddestino)
                WHERE (r.idactividadorigen = {$params['idactividad']} OR r.idactividaddestino = {$params['idactividad']})
                      AND r.idejercicio = {$params['idejercicio']}
                     $addWhereFiltros 
                     $delimitando";

        $data->data = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];

        return $data;
    }

    public function eliminarRegla($idreglas) {
        $conn = Doctrine_Manager::connection();
        $query = "DELETE 
                    FROM mod_planificacion.dat_regla
                  WHERE 
                    idregla IN($idreglas) ;";
        $conn->execute($query);
        return true;
    }

    public function select() {
        $consulta = "SELECT r.nivelactividadbase, r.valorcontrol, r.idregla,
            na.denominacion as denominacionindicador,r.idactividadquegenera, na.idactividad,
            r.denominacion";
        return $consulta;
    }

    public function selectUno() {
        $consulta = "SELECT r.denominacion,r.valorcontrol,ni.denominacion as denominacionindicador,
  r.nivelactividadbase,n.idnorma,r.idregla,na.denominacion as denomicionactgenera,
  round( (r.valorcontrol / r.nivelactividadbase),3)*100 as porciento";
        return $consulta;
    }

    public function selectDos() {
        $consulta = "SELECT r.valorcontrol,r.denominacion,r.denominacion as denominacionindicador,
  r.nivelactividadbase,na.denominacion as denomicionactgenera,r.idactividadquegenera,
  na.idactividad,r.idregla,round( (r.valorcontrol / r.nivelactividadbase),3)*100 as porciento";
        return $consulta;
    }

    public function listarReglasPorActividad($idactividad, $params, $start = 0, $limit = 20
    ) {
        $query = new Doctrine_Query();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacion') {
                    $query->addWhere(
                            "upper( r.denominacion ) LIKE '%" . strtoupper(
                                    $datos['data']['value']
                            ) .
                            "%' "
                    );
                } elseif ($datos['field'] == 'denominacionindicador') {
                    $query->addWhere(
                            "upper(in.denominacion)  LIKE '%" . strtoupper(
                                    $datos['data']['value']
                            ) .
                            "%' "
                    );
                } elseif ($datos['field'] == 'denomicionactgenera') {
                    $query->addWhere(
                            "upper(ac.denominacion)  LIKE '%" . strtoupper(
                                    $datos['data']['value']
                            ) .
                            "%' "
                    );
                } elseif ($datos['field'] == 'valorcontrol' || $datos['field'] ==
                        'nivelactividadbase'
                ) {
                    $cond = "=";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = ">";
                    }
                    $query->addWhere(
                            "r.{$datos ['field']} {$cond} ? ", $datos['data']['value']
                    );
                }
            }
        }

        if ($params['idejercicio'] && $params['eliminar'] != 2) {
            $query->addWhere("n.idejercicio = " . $params['idejercicio'] . "");
            $query->addWhere("r.idejercicio = " . $params['idejercicio'] . "");
        }

        $data->dataTres = $query->select(
                                "r.idregla, r.denominacion, r.idactividadquegenera, r.valorcontrol, r.idnorma,
                                r.nivelactividadbase, r.version,n.idnorma,ac.denominacion as denomicionactgenera,
        in.denominacion as denominacionindicador,
        round( (r.valorcontrol / r.nivelactividadbase),3)*100 as porciento"
                        )->from("DatRegla r")->innerJoin(
                                "r.DatNorma n WITH n.idactividad = ?", $idactividad
                        )->innerJoin("n.NomIndicador in")->innerJoin("r.NomActividad ac")
                        ->offset($start)->limit($limit)->orderby("r.denominacion"); //->execute()->toArray(true);
        //
        $data->totalUno = $query->count();

        $select = self::select();

        $sqlQueryTres = " $select FROM mod_planificacion.dat_regla r
                    INNER JOIN mod_planificacion.dat_actividadregla ar on(r.idregla = ar.idregla)
                    INNER JOIN mod_planificacion.nom_actividad na on(na.idactividad = ar.idactividad)
                    WHERE na.idactividad = '$idactividad'";
        if ($params['idejercicio'] && $params['eliminar'] != 2) {

            $sqlQueryTres .= " AND  r.idejercicio = "
                    . $params['idejercicio'] . "";
        }
        $conn = Doctrine_Manager::connection();

        $res = $conn->execute($sqlQueryTres);
        $data->dataCuatro = $res->fetchAll(PDO::FETCH_ASSOC);

        $indice = 0;
        foreach ($data->dataCuatro as $valores) {
            $actvidades[$indice] = DatRegla::DameActividaddadoId(
                            $valores['idactividadquegenera']
            );
            $indice++;
        }

        $indiceUno = 0;
        foreach ($actvidades as $valor) {
            $data->dataCuatro[$indiceUno]['denomicionactgenera'] = $valor[0]['denominacion'];
            $indiceUno++;
        }
        $data->data = array_merge($data->dataTres, $data->dataCuatro);
        $selectUno = self::selectUno();
        $sqlQuery = "$selectUno FROM mod_planificacion.dat_norma n
          inner join mod_planificacion.dat_regla r on (r.idnorma = n.idnorma) 
          inner join mod_datosmaestros.nom_indicador ni on (n.idindicador = ni.idindicador) 
          inner join mod_planificacion.nom_actividad na on (na.idactividad = r.idactividadquegenera)
          WHERE r.idactividadquegenera = '$idactividad'";
        if ($params['idejercicio'] && $params['eliminar'] != 2) {
            $sqlQuery .= " AND  r.idejercicio = " . $params['idejercicio'] . "";
        }

        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($sqlQuery);
        $data->dataUno = $res->fetchAll(PDO::FETCH_ASSOC);


        $denominacionacti = array();
        foreach ($data->dataUno as $value) {
            $denominacionacti[] = DatRegla::DameDenomActividadDadoIdNorma(
                            $value['idnorma']
            );
        }
        foreach ($denominacionacti as $value) {
            foreach ($data->dataUno as $k => $d) {
                $data->dataUno[$k]['denominacion'] = $value[0]['denominacion'];
                $data->dataUno[$k]['denomicionactgenera'] = $value[0]['denominacion'];
            }
        }
        $selectDos = self::selectDos();
        $sqlQueryUno = "$selectDos FROM  mod_planificacion.dat_actividadregla ar,
          mod_planificacion.dat_regla r, mod_planificacion.nom_actividad na
          WHERE ar.idregla = r.idregla AND na.idactividad = ar.idactividad AND
          r.idactividadquegenera = '$idactividad' ";
        if ($params['idejercicio'] && $params['eliminar'] != 2) {
            $sqlQueryUno .= " AND  r.idejercicio = " . $params['idejercicio']
                    . "";
        }
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($sqlQueryUno);
        $data->dataDos = $res->fetchAll(PDO::FETCH_ASSOC);

        $rty = array();
        $rtyUno = array();
        foreach ($data->dataDos as $value) {
            $rty[] = DatRegla::DameActividaddadoId(
                            $value['idactividadquegenera']
            );
            $rtyUno[] = DatRegla::DameActividaddadoId($value['idactividad']);
        }
        $k = 0;
        foreach ($rtyUno as $valueAux) {
            $data->dataDos[$k]['denominacionindicador'] = $valueAux[0]['denominacion'];
            $k++;
        }

        $k = 0;
        foreach ($rty as $value) {
            $data->dataDos[$k]['denomicionactgenera'] = $value[0]['denominacion'];
            $k++;
        }

        $data->total = $data->totalUno + count($data->dataUno) + count(
                        $data->dataDos
        );


        return $data;
    }

    private function DameActividaddadoId($valor) {

        $sqlQuery = "SELECT na.denominacion FROM mod_planificacion.nom_actividad na
WHERE na.idactividad = '$valor';";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($sqlQuery);
        $resAux = $res->fetchAll(PDO::FETCH_ASSOC);

        return $resAux;
    }

    public function DameIdRegladadoActividad($valor) {

        $sqlQuery = "SELECT r.idregla
FROM mod_planificacion.dat_regla r
INNER JOIN mod_planificacion.dat_actividadregla ar on(r.idregla = ar.idregla)
INNER JOIN mod_planificacion.nom_actividad na on(na.idactividad = ar.idactividad)
WHERE na.denominacion = '$valor'";

        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($sqlQuery);
        $resAux = $res->fetchAll(PDO::FETCH_ASSOC);

        return $resAux;
    }

    public function DameIddadoActividad($valor) {

        $sqlQuery = "SELECT na.idactividad FROM mod_planificacion.nom_actividad na
WHERE na.denominacion = '$valor';";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($sqlQuery);
        $resAux = $res->fetchAll(PDO::FETCH_ASSOC);

        return $resAux;
    }

    /* private function DameIdsActividadesGeneradasPorActividades($data)
      {

      $sqlQuery
      = "SELECT
      r.denominacion,
      r.valorcontrol,
      ni.denominacion as denominacionindicador,
      r.nivelactividadbase,
      na.denominacion as denomicionactgenera
      FROM
      mod_planificacion.dat_regla r,
      mod_datosmaestros.nom_indicador ni,
      mod_planificacion.nom_actividad na
      WHERE
      dat_norma.idindicador = ni.idindicador AND
      na.idactividad = r.idactividadquegenera AND r.idactividadquegenera = '';";
      $conn = Doctrine_Manager::connection();
      $res = $conn->execute($sqlQuery);
      $data->dataAux = $res->fetchAll(PDO::FETCH_ASSOC);
      } */

    public function DameDenomActividadDadoIdNorma($idnorma) {

        $sqlQuery = "SELECT na.denominacion,na.idactividad,n.idnorma
FROM mod_planificacion.dat_norma n
INNER JOIN mod_planificacion.dat_regla r on(n.idnorma = r.idnorma)
INNER JOIN mod_planificacion.nom_actividad na on(n.idactividad = na.idactividad)
WHERE n.idnorma = '$idnorma'";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($sqlQuery);
        $resAux = $res->fetchAll(PDO::FETCH_ASSOC);

        return $resAux;
    }

    public function eliminarReglas($idactividad, $idejercicio) {
        $idreglas = DatRegla::DameIdReglaDadoIdActividad($idactividad);

        foreach ($idreglas as $value) {
            $valor = $value['idregla'];
            $sqlQuery = " DELETE FROM mod_planificacion.dat_regla
 WHERE dat_regla.idregla='$valor' AND dat_regla.idejercicio=$idejercicio;";

            $conn = Doctrine_Manager::connection();
            $conn->execute($sqlQuery);
        }
    }

    public function buscarReglas($idnorma) {
        $query = Doctrine_Query::create();
        return $query->from('DatRegla r')->where('r.idnorma = ?', $idnorma)
                        ->execute();
    }

    public function buscarReglasDirectas($idejercicio, $idactividadorigen) {

        $sqlQuery = "SELECT r.idregla,
                            r.idactividaddestino,
                            r.valorcontrol,
                            r.denominacion,
                            r.nivelactividadbase
                    FROM mod_planificacion.dat_regla r                       
                         
                    WHERE 
                          r.idejercicio = {$idejercicio} AND
                          r.idactividadorigen = {$idactividadorigen} and r.idnorma is null";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($sqlQuery);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /* funcion para obtener las actividades relacionadas a las reglas de una actividad */

    public function buscarActividadesRelacionadasPorReglasAUnaActiv($idactividad, $idejercicio, $especialidad = null
    ) {

        $sqlQuery = "SELECT r.idregla,
                            r.idactividaddestino
                    FROM mod_planificacion.dat_regla r                       
                         INNER JOIN mod_planificacion.dat_actespcomportamiento actc ON (
                           r.idactividaddestino = actc.idactividad AND actc.idespecialidad =
                           {$especialidad})
                         INNER JOIN mod_planificacion.nom_actividad a ON (a.idactividad =
                           r.idactividaddestino)
                    WHERE (a.idaprobacion = 3 OR
                          a.idaprobacion = 4) AND
                          a.estado = 1 and
                          r.idejercicio = {$idejercicio} AND
                          r.idactividadorigen = {$idactividad}";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($sqlQuery);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function buscarActividadQueLaGerenePorRegla($idactividad) {

        $sqlQuery = "SELECT n.idactividad FROM mod_planificacion.dat_regla r,
INNER JOIN mod_planificacion.dat_norma n on(r.idnorma = n.idnorma)
WHERE r.idactividadquegenera = '$idactividad';";

        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($sqlQuery);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function buscarActividadQueLaGenerePorReglaDeOtraActividad($idactividad
    ) {
        $sqlQuery = "SELECT  ar.idactividad FROM mod_planificacion.dat_actividadregla ar
           inner join mod_planificacion.dat_regla r on(ar.idregla = r.idregla)
           WHERE r.idactividadquegenera=$idactividad;";

        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($sqlQuery);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function DameIdReglaDadoIdActividad($idactividad) {


        $sqlQuery = "SELECT r.idregla FROM  mod_planificacion.dat_actividadregla ar
 INNER JOIN  mod_planificacion.dat_regla r ON( ar.idregla = r.idregla)
 WHERE  ar.idactividad = $idactividad";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($sqlQuery);
        $ress = $res->fetchAll(PDO::FETCH_ASSOC);

        return $ress;
    }

    public function getIdActividadGeneradora() {
        $query = Doctrine_Query::create();
        return $query->from("DatRegla r")->innerJoin("r.DatNorma n")->where(
                        "r.idnorma = ?", $this->idnorma
                )->execute()->getFirst()->DatNorma->idactividad;
    }

    public function getNorma() {
        $query = Doctrine_Query::create();
        return $query->from('DatRegla r')->innerJoin('r.DatNorma n')->where(
                        'r.idnorma = ?', $this->idnorma
                )->execute()->getFirst()->DatNorma;
    }

    public function getNormaById($params) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT
                          r.idregla,
                          r.denominacion,
                          COALESCE(ind.denominacion, '-') as denoindicador,
                          r.valorcontrol,
                          a.denominacion as denoactividad,
                          r.nivelactividadbase,
                          r.idusuario,
                          r.idactividaddestino,
                          r.fecha
                  FROM mod_planificacion.dat_regla r
                       LEFT JOIN mod_planificacion.dat_norma n ON (r.idnorma = n.idnorma)
                       LEFT JOIN mod_datosmaestros.nom_indicador ind ON (ind.idindicador = n.idindicador)
                       INNER JOIN mod_planificacion.nom_actividad a ON (a.idactividad = r.idactividaddestino)
                  WHERE (r.idnorma = {$params['idnorma']}) AND (r.idactividadorigen = {$params['idactividad']})
                        AND r.idejercicio = {$params['idejercicio']}";

        $res = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);

        return $res;
    }

    public function obtenerSecuenciaActvGenPorRegla($idactividad) {
        return DatRegla::obtenerSecuencia($idactividad);
    }

    private function obtenerSecuencia($idactividad, $arraySecuenciaActvs = array()) {
        /* temporal sustituir la  consulta recursiva */
        $query = Doctrine_Query::create();
        $query->from("DatRegla r")->innerJoin(
                "r.DatNorma n WITH n.idactividad = ?", $idactividad
        );
        $query->addWhere(
                "r.idactividadquegenera in (select idactividad
             from nom_actividad WHERE idactividad = idactividadquegenera
             AND idaprobacion > 1 AND estado = 1 ) "
        );
        $arrayReglaquegenera = $query->execute();
        foreach ($arrayReglaquegenera as $regla) {
            $arraySecuenciaActvs[] = $regla->idactividadquegenera;
            $arraySecuenciaActvs = DatRegla::obtenerSecuencia(
                            $regla->idactividadquegenera, $arraySecuenciaActvs
            );
        }
        return $arraySecuenciaActvs;
    }

    public function obtenerActConReglas($idactividades) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT a.idactividad
                    FROM mod_planificacion.nom_actividad a   
                         INNER JOIN mod_planificacion.dat_regla r 
                    ON (r.idactividadorigen = a.idactividad OR r.idactividaddestino = a.idactividad)                           
                    WHERE  a.idactividad IN ($idactividades)";

        $data = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    public function listarActividadesAddRegla($params) {
        $delimitando = "";
        if ($params['start'] != null && $params['limit']) {
            $delimitando = " LIMIT {$params['limit']} OFFSET {$params['start']} ";
        }
        $comportamiento = "";
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
                } elseif ($datos['field'] == 'idespecialidad') {
                    $params['idespecialidades'] == $datos['data']['value'];
                } elseif ($datos['field'] == 'comportamiento') {
                    if ($datos['data']['value'] == 'Propia') {
                        $comportamiento = " AND dn.uridatosnomenclador = 'propia'";
                    } elseif ($datos['data']['value'] == 'Compartida') {
                        $comportamiento = "AND dn.uridatosnomenclador = 'compartida'";
                    }
                }
            }
        }
        if ($comportamiento == "") {

            $comportamiento = " AND
                       (dn.uridatosnomenclador = 'propia' OR
                       dn.uridatosnomenclador = 'compartida') ";
        }

        $conn = Doctrine_Manager::connection();
        $query = "SELECT a.idactividad,
                        a.codigo,
                        a.denominacion,
                        a.descripcion,
                        dn.denominacion as comportamiento,
                        a.idespecialidad,
                        COUNT(*) OVER() as total
                 FROM mod_planificacion.nom_actividad a
                      INNER JOIN mod_planificacion.dat_actespcomportamiento aec ON (
                        aec.idactividad = a.idactividad)
                      INNER JOIN mod_planificacion.nom_datosnomenclador dn ON
                        aec.iddatosnomenclador = dn.iddatosnomenclador
                 WHERE a.nivel = {$params['ultimonivel']} AND
                       a.idaprobacion = 4 AND
                       a.estado = 1 AND
                       a.idactividad <> {$params['idactividad']} AND
                       a.normada = 1 $comportamiento AND
                       aec.idespecialidad = {$params['idespecialidad']} AND
      a.idactividad NOT IN (
                             SELECT DISTINCT a.idactividad
                             FROM mod_planificacion.dat_regla r
                                  INNER JOIN mod_planificacion.nom_actividad a
                                    ON (a.idactividad = r.idactividaddestino)
                             WHERE (r.idactividadorigen = {$params['idactividad']} OR
                                   r.idactividaddestino = {$params['idactividad']}) AND
                                   r.idejercicio = {$params['idejercicio']}
      )$addWhereFiltros $delimitando";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function buscarReglaByDuplicar($params, $idactorigen) {
        $params['idactividad'] = $idactorigen;
        $reglas = array();
        $reglas = $this->listarReglas($params);
        return $reglas->data;
    }

    public function getRegla($idnorma) {
        $con = Doctrine_Manager::connection();
        $query = "Select r.nivelactividadbase,r.idactividaddestino,r.denominacion
                FROM mod_planificacion.dat_regla r
                WHERE s.idactividad = $idnorma";

        $data = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public static function validarExistenciaDatos($idejercicio) {
        //Devolviendo la cantidad.
        return Doctrine_Query::create()->select(
                                'COUNT(idregla) AS cantidad'
                        )->from('DatRegla')
                        ->addWhere('idejercicio=?', $idejercicio)
                        ->fetchOne()->cantidad;
    }

}
