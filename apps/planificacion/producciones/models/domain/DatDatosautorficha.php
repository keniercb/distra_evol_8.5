<?php

class DatDatosautorficha extends BaseDatDatosautorficha {

    public function setUp() {
        parent::setUp();
    }

    public function obtenerDatosAutor($params) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT 
                      iddatosautorficha,
                      empresasubordinada,
                      confeccionada,
                      aprobada,
                      cargoconf,
                      cargoaprob,
                      telefonoaprob,
                      telefonoconf
                    FROM 
                      mod_spouam.dat_datosautorficha
                    WHERE iddatosautorficha={$params['iddatosautorficha']} 
                      ";
        $res = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    public function eliminarconfautor($params) {
        $conn = Doctrine_Manager::connection();
        $query = "DELETE FROM 
                      mod_spouam.dat_datosautorficha 
                    WHERE 
                      iddatosautorficha IN($params)";
        $conn->execute($query);
        return true;
    }
    public function listarautorficha($params)
    {
        $condiciones = array();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'empresasubordinada' || $datos['field'] == 'confeccionada'||
                    $datos['field'] == 'aprobada' || $datos['field'] == 'cargoconf'||
                    $datos['field'] == 'cargoaprob' || $datos['field'] == 'telefonoaprob'||
                    $datos['field'] == 'telefonoconf') {
                    $condiciones[] = "upper(af." .$datos['field']. ") LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                }
            }
        }//Fin de los filtros
        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'WHERE ' . $condicion;
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
        $con = Doctrine_Manager::connection();
        $query = "SELECT 
                      iddatosautorficha,
                      empresasubordinada,
                      confeccionada,
                      aprobada,
                      cargoconf,
                      cargoaprob,
                      telefonoaprob,
                      telefonoconf,
                      count(*) over() as total
                    FROM 
                      mod_spouam.dat_datosautorficha af 
                      $WHERE $delimitando;";
        $res = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }
}
