<?php

class DatSalida extends BaseDatSalida {

    public function setUp() {
        parent::setUp();

        $this->hasOne(
                'NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->hasOne(
                'NomActividad', array('local' => 'idactividad', 'foreign' => 'idactividad')
        );
    }

    public function listarSalidas(Array $params) {
        $sqlWhere = "";
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $sqlWhere = "AND i.codigo  LIKE  '%{$datos ['data'] ['value']}%' ";
                } elseif ($datos ['field'] == 'numeropieza') {
                    $sqlWhere = "AND upper(i.numeropieza)  LIKE " . "'" . ("%" . strtoupper($datos ['data'] ['value']) . "%") . "'";
                } elseif ($datos ['field'] == 'denominacion') {
                    $sqlWhere = "AND upper(i.denominacion) LIKE '%" . strtoupper($datos ['data'] ['value']) . "%' ";
                } elseif ($datos ['field'] == 'idumedida') {
                    $sqlWhere = "AND i.idumedida  = {$datos ['data'] ['value']} ";
                } elseif ($datos ['field'] == 'precio') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $sqlWhere = "AND ip.precio > {$datos ['data'] ['value']} ";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $sqlWhere = "AND ip.precio < {$datos ['data'] ['value']} ";
                    } else {
                        $sqlWhere = "AND ip.precio = {$datos ['data'] ['value']} ";
                    }
                } elseif ($datos ['field'] == 'cantidad') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $sqlWhere = "AND s.cantidad > {$datos ['data'] ['value']} ";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $sqlWhere = "AND s.cantidad < {$datos ['data'] ['value']} ";
                    } else {
                        $sqlWhere = "AND s.cantidad = {$datos ['data'] ['value']} ";
                    }
                } elseif ($datos ['field'] == 'idusuario') {
                    $sqlWhere = "AND s.idusuario = {$datos ['data'] ['value']} ";
                }
            }
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit']) {
            $delimitando = " LIMIT {$params['limit']} OFFSET {$params['start']} ";
        }

        $con = Doctrine_Manager::connection();
        $query = "SELECT i.idindicador,i.denominacion,ip.precio,i.idumedida,i.numeropieza,s.cantidad,s.idusuario,s.fecha,
                  i.codigo,COUNT(*) OVER() as total
                FROM mod_planificacion.dat_salida s
                INNER JOIN mod_datosmaestros.nom_indicador i ON(s.idindicador = i.idindicador)
                INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON(i.idindicador = ip.idindicador)
                WHERE s.idactividad = {$params ['idactividad']} $sqlWhere  ORDER BY i.codigo $delimitando ;";

        $data->data = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];
        return $data;
    }

    public function buscarSalida($idactividad, $idindicador) {
        $query = Doctrine_Query::create();
        return $query->from('DatSalida s')
                        ->where(
                                's.idactividad = ? and s.idindicador = ? ', array($idactividad, $idindicador)
                        )
                        ->execute()->getFirst();
    }

    public function getSalida($idactividad) {
        $con = Doctrine_Manager::connection();
        $query = "Select s.cantidad,s.idusuario,s.idindicador
                FROM mod_planificacion.dat_salida s
                WHERE s.idactividad = $idactividad";

        $data = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}
