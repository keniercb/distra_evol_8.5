<?php

class DatDemanda extends BaseDatDemanda {

    public function setUp() {
        parent::setUp();
        $this->hasOne('NomDatosnomenclador', array('local' => 'idprograma', 'foreign' => 'iddatosnomenclador'));
        $this->hasOne('NomDatosnomenclador', array('local' => 'iddestino', 'foreign' => 'iddatosnomenclador'));
        $this->hasOne('NomEjercicioplanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatDemandatiempo', array('local' => 'iddemanda', 'foreign' => 'iddemanda'));
        $this->hasMany('HisObservacion', array('local' => 'iddemanda', 'foreign' => 'iddemanda'));
    }

    public function listarIndicadoresEmpresaAddDemanda($params) {
        $condiciones = array();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['data']['value'] == "" && $datos['data']['value'] != 0) {
                    continue;
                }
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = "ind." . $datos['field'] . " LIKE '" . $datos['data']['value'] . "%'";
                } else
                if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
                    $condiciones[] = "upper(ind." . $datos['field'] . ") LIKE '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } else
                if ($datos['field'] == 'idumedida' || $datos['field'] == 'idnaturaleza') {
                    $condiciones[] = "ind." . $datos['field'] . " = " . $datos['data']['value'] . " ";
                } else if ($datos ['field'] == 'precio') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $condiciones[] = "indp.precio >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $condiciones[] = "indp.precio <" . $datos ['data'] ['value'];
                    } else {
                        $condiciones[] = "indp.precio =" . $datos ['data'] ['value'];
                    }
                } else if ($datos ['field'] == 'preciodivisa') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $condiciones[] = "indp.preciodivisa >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $condiciones[] = "indp.preciodivisa <" . $datos ['data'] ['value'];
                    } else {
                        $condiciones[] = "indp.preciodivisa =" . $datos ['data'] ['value'];
                    }
                }
            }
        }
        //Fin de los filtros
        $WHERE = "WHERE TRUE";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = "AND " . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT ind.idindicador,
                         ind.codigo,
                         ind.denominacion,                              
                         ind.idumedida,
                         ind.idnaturaleza,
                         (indp.precio)::numeric (19,3) as precio,
                         (indp.preciodivisa)::numeric (19,3) as preciodivisa,
                         count(*) OVER() as total
                         FROM mod_datosmaestros.nom_indicador ind
                         INNER JOIN mod_datosmaestros.nom_indicadorplanif indp 
                         ON (ind.idindicador = indp.idindicador AND indp.nivelplanif = 1 AND ind.estado = 1 AND indp.idaprobacion = 4)
                         INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface indos 
                         ON (ind.idindicador = indos.idindicador)  
                         INNER JOIN mod_planproeza.dat_entidadorganosatisface eos ON 
                         eos.idorganosatisface = indos.idorganosatisface
                         $WHERE ORDER BY ind.codigo $delimitando";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarEntidadesProductoras($identidades = false) {
        $whereEnt = "";
        if ($identidades)
            $whereEnt = "WHERE eos.identidad IN($identidades)";
        $conn = Doctrine_Manager::connection();
        $query = "SELECT eos.identidadorganosatisface,eos.identidad
                        FROM mod_planproeza.dat_entidadorganosatisface eos $whereEnt";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarEntidadesProductorasIndicador($idindicador) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT eos.identidadorganosatisface,
                         eos.identidad
                    FROM mod_planproeza.dat_entidadorganosatisface eos
                         INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface iviaos 
                         ON (eos.idorganosatisface = iviaos.idorganosatisface AND iviaos.idindicador = $idindicador)";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function obtenerNaturalezas() {
        $con = Doctrine_Manager::connection();
        $query = "SELECT idnaturaleza as naturaleza, denominacion
                    FROM mod_datosmaestros.nom_naturaleza";
        $res = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    public function listarDemandas($params) {
        $condiciones = array();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = "ind." . $datos['field'] . " LIKE '%" . $datos['data']['value'] . "%'";
                } else
                if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
                    $condiciones[] = "upper(ind." . $datos['field'] . ") LIKE '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } else
                if ($datos['field'] == 'idumedida') {
                    $condiciones[] = "ind.idumedida = " . $datos['data']['value'] . " ";
                } else
                if ($datos['field'] == 'idaprobacion' || $datos['field'] == 'tieneobservacion' || $datos['field'] == 'idprograma' || $datos['field'] == 'iddestino' || $datos['field'] == 'identidadcliente' || $datos['field'] == 'idusuario' || $datos['field'] == 'idusuariocrea') {
                    $condiciones[] = "dem." . $datos['field'] . " = " . $datos['data']['value'] . " ";
                } else
                if ($datos['field'] == 'identidadproveedor') {
                    $condiciones[] = "eos.identidad = " . $datos['data']['value'] . " ";
                } else
                if ($datos ['field'] == 'cantidadinicial' || $datos ['field'] == 'ajuste' || $datos ['field'] == 'cantidadconfirmada') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $condiciones[] = "dem." . $datos['field'] . " >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $condiciones[] = "dem." . $datos['field'] . "  <" . $datos ['data'] ['value'];
                    } else {
                        $condiciones[] = "dem." . $datos['field'] . " =" . $datos ['data'] ['value'];
                    }
                } else if ($datos ['field'] == 'precio' || $datos ['field'] == 'preciodivisa') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $condiciones[] = "indp." . $datos['field'] . " >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $condiciones[] = "indp." . $datos['field'] . "  <" . $datos ['data'] ['value'];
                    } else {
                        $condiciones[] = "indp." . $datos['field'] . " =" . $datos ['data'] ['value'];
                    }
                } else if ($datos ['field'] == 'importeestmn') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $condiciones[] = "(indp.precio * dem.cantidadinicial) >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $condiciones[] = "(indp.precio * dem.cantidadinicial)  <" . $datos ['data'] ['value'];
                    } else {
                        $condiciones[] = "(indp.precio * dem.cantidadinicial) =" . $datos ['data'] ['value'];
                    }
                } else if ($datos ['field'] == 'importeestcuc') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $condiciones[] = "(indp.preciodivisa * dem.cantidadconfirmada) >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $condiciones[] = "(indp.preciodivisa * dem.cantidadconfirmada)  <" . $datos ['data'] ['value'];
                    } else {
                        $condiciones[] = "(indp.preciodivisa * dem.cantidadconfirmada) =" . $datos ['data'] ['value'];
                    }
                } else if ($datos ['field'] == 'fecha') {
                    $fecha = explode('/', $datos ['data']['value']);
                    $fecha = $fecha[1] . '/' . $fecha[0] . '/' . $fecha[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $condiciones[] = " dem.fecha::date<'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $condiciones[] = " dem.fecha::date>'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $condiciones[] = "  dem.fecha::date='{$fecha}'";
                    }
                } else if ($datos ['field'] == 'fechalimite') {
                    $fecha = explode('/', $datos ['data']['value']);
                    $fecha = $fecha[1] . '/' . $fecha[0] . '/' . $fecha[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $condiciones[] = " dem.fechalimite::date<'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $condiciones[] = " dem.fechalimite::date>'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $condiciones[] = "  dem.fechalimite::date='{$fecha}'";
                    }
                }
            }
        }
        //Fin de los filtros
        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = "AND " . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }
        $RestTipoCompEnt = "";
        $VentanaDemandasPendientexAprobacion = "";
        $tieneDemandasPendientexAprobacion = "";
        if ($params['tipo'] == 1) {
            $RestTipoCompEnt = " AND dem.identidadcliente={$params['identidad']}" . " ";
        } else if ($params['tipo'] == 2) {
            $RestTipoCompEnt = " AND eos.identidad={$params['identidad']}" . " ";
        } else if ($params['tipo'] == 3) {
            $RestTipoCompEnt = "";
            $VentanaDemandasPendientexAprobacion = "WITH tienedemandasxaprobar AS (
SELECT count(dem.iddemanda) as cant
FROM mod_planproeza.dat_demanda dem
     INNER JOIN mod_datosmaestros.nom_indicador ind ON (dem.idindicador =
       ind.idindicador)
     INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON (ind.idindicador =
       indp.idindicador)
WHERE ind.estado = 1 AND
      (indp.idaprobacion = 4) AND
      indp.nivelplanif = 1 AND
      dem.idaprobacion = 3 AND
      dem.idejercicio = {$params['idejercicio']} AND
      dem.extraplan = 0)";
            $tieneDemandasPendientexAprobacion = " 
       (SELECT cant FROM tienedemandasxaprobar) AS cantdemandasxaprobar,";
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }
        $con = Doctrine_Manager::connection();
        $query = "
$VentanaDemandasPendientexAprobacion            
SELECT  dem.iddemanda,
                                        ind.codigo,
                                        ind.denominacion,
                                        ind.descripcion,
                                        ind.idumedida,
                                        dem.cantidadinicial,
                                        dem.ajuste,
                                        dem.cantidadconfirmada,
                                        indp.precio,
                                        indp.preciodivisa,
                                        eos.identidad as identidadproveedor,
                                        dem.idaprobacion,
                                        dem.tieneobservacion,
                                        dem.identidadcliente,
                                        dem.idprograma,
                                        dem.iddestino,
                                        dem.idusuario,
                                        dem.idusuariocrea,
                                        dem.fecha,
                                        dem.fechalimite,
                                        (indp.precio * dem.cantidadconfirmada) as importeestmn,
                                        (indp.preciodivisa * dem.cantidadconfirmada) as importeestcuc,                                       
$tieneDemandasPendientexAprobacion                                    
count(*) OVER() as total
                 FROM mod_planproeza.dat_demanda dem
                      INNER JOIN mod_datosmaestros.nom_indicador ind 
                      ON (dem.idindicador  = ind.idindicador)
                      INNER JOIN mod_datosmaestros.nom_indicadorplanif indp 
                      ON (ind.idindicador = indp.idindicador)
                      INNER JOIN  mod_planproeza.dat_entidadorganosatisface eos 
                      ON(eos.identidadorganosatisface=dem.identidadorganosatisface $RestTipoCompEnt)  
                 WHERE ind.estado = 1 
                 AND (indp.idaprobacion = 4)                     
                 AND indp.nivelplanif = 1 
                 AND dem.idejercicio={$params['idejercicio']}
                 AND dem.extraplan = 0
                 $WHERE ORDER BY ind.codigo, dem.iddemanda $delimitando";
//      print_r($query);die;
        $data = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function cargarProgramas() {
        $con = Doctrine_Manager::connection();
        $query = "SELECT dn.iddatosnomenclador , dn.denominacion 
                    FROM mod_planificacion.nom_datosnomenclador dn
                    INNER JOIN mod_planificacion.nom_tiponomenclador tn 
                    ON (dn.idtiponomenclador = tn.idtiponomenclador)
                    WHERE uritiponomenclador = 'Programa'";
        $data = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function cargarDestinos() {
        $con = Doctrine_Manager::connection();
        $query = "SELECT dn.iddatosnomenclador , dn.denominacion 
                        FROM mod_planificacion.nom_datosnomenclador dn
                        INNER JOIN mod_planificacion.nom_tiponomenclador tn 
                        ON (dn.idtiponomenclador = tn.idtiponomenclador)
                        WHERE uritiponomenclador = 'Destino'";
        $data = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

//    public function selecIdDatosnomenclador($params) {
//        $con = Doctrine_Manager::connection();
//        $query = "SELECT iddatosnomenclador
//                    FROM mod_planificacion.nom_datosnomenclador
//                    WHERE idtiponomenclador = $params AND uridatosnomenclador = '-'";
//        $data = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
//        return $data;
//    }

    public function eliminarDemanda($params) {
        $con = Doctrine_Manager::connection();
        $query = "DELETE FROM 
                    mod_planproeza.dat_demanda 
                  WHERE 
                    iddemanda = {$params['iddemanda']}";
        $con->execute($query);
        return 1;
    }

//fin clase
}
