<?php

class Carteraproductos {

    public function listarCarteraProductos($params) {
        $condiciones = array();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['data']['value'] == "" && $datos['data']['value'] != 0) {
                    continue;
                } else
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = "ind." . $datos['field'] . " LIKE '" . $datos['data']['value'] . "%'";
                } else
                if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
                    $condiciones[] = "upper(ind." . $datos['field'] . ") LIKE '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } else
                if ($datos['field'] == 'idunidadmedida') {
                    $condiciones[] = "ind.idumedida = " . $datos['data']['value'] . " ";
                } else
                if ($datos['field'] == 'estado') {
                    $condiciones[] = "ind.estado = " . $datos['data']['value'] . " ";
                } else
                if ($datos['field'] == 'nivel') {
                    $condiciones[] = "indp.nivelplanif = " . $datos['data']['value'] . " ";
                } else
                if ($datos['field'] == 'idaprobacion') {
                    $condiciones[] = "indp.idaprobacion = " . $datos['data']['value'] . " ";
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
            $delimitando = " OFFSET " . $params['start'] . "LIMIT " . $params['limit'];
        }
        $conn = Doctrine_Manager::connection();
        $query = " SELECT ind.idindicador,
                            ind.codigo,
                            ind.denominacion,
                            ind.idumedida as idunidadmedida,
                            (indp.precio)::numeric (19,3) as precio,
                            (indp.preciodivisa)::numeric (19,3) as preciodivisa,
                            indp.idaprobacion,
                            ind.estado,
                            indp.nivelplanif as nivel,
                            count(*) OVER() as total
        FROM mod_planproeza.dat_entidadorganosatisface eos
        INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ios
            ON eos.idorganosatisface = ios.idorganosatisface AND 
            eos.identidad = {$params['identidad']}
        INNER JOIN mod_datosmaestros.nom_indicador ind ON 
            ind.idindicador = ios.idindicador
        INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON 
            ind.idindicador = indp.idindicador  
        $WHERE
        ORDER BY ind.codigo $delimitando";
        //print_r($query);die;
        $data->data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];
        return $data;
    }

}
