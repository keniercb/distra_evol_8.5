<?php

class DatActividadcargo extends BaseDatActividadcargo {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'NomActividad', array('local' => 'idactividad', 'foreign' => 'idactividad')
        );
    }

    public function listarCargos($params) {
        $sqlWhere = "";
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
//                if ($datos ['field'] == 'denominacion') {
//                    $sqlWhere = "AND upper(i.denominacion) LIKE '%" . strtoupper($datos ['data'] ['value']) . "%' ";
//                } else
                if ($datos ['field'] == 'duracion') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $sqlWhere .= " AND ac.duracion > {$datos ['data'] ['value']} ";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $sqlWhere .= " AND ac.duracion < {$datos ['data'] ['value']} ";
                    } else {
                        $sqlWhere .= " AND ac.duracion = {$datos ['data'] ['value']} ";
                    }
                } elseif ($datos ['field'] == 'cantidad') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $sqlWhere .= " AND ac.cantidad > {$datos ['data'] ['value']} ";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $sqlWhere .= " AND ac.cantidad < {$datos ['data'] ['value']} ";
                    } else {
                        $sqlWhere .= " AND ac.cantidad = {$datos ['data'] ['value']} ";
                    }
                } elseif ($datos ['field'] == 'idusuario') {
                    $sqlWhere = " AND ac.idusuario = {$datos ['data'] ['value']} ";
                }
            }
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit']) {
            $delimitando = " LIMIT {$params['limit']} OFFSET {$params['start']} ";
        }

        $con = Doctrine_Manager::connection();
        $query = "SELECT 
                    ac.idcargo,
                    ac.idactividad,
                    ac.cantidad,
                    ac.idactividadcargo,
                    ac.duracion,
                    ac.idusuario,
                    ac.fecha,
                    COUNT(*) OVER() as total
                  FROM 
                    mod_planificacion.dat_actividadcargo ac
                    where ac.idactividad={$params['idactividad']}"
                . "$sqlWhere"
                . " ORDER BY ac.idactividadcargo"
                . "$delimitando";
        $data = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function adicionar_cargo($params) {
        $fechaActual = date("d-m-Y H:i:s");
        foreach ($params['cargos'] as $cargo) {


            $nuevasalida = new DatActividadcargo();
            $nuevasalida->idactividad = $params['idactividad'];
            $nuevasalida->idcargo = $cargo->idnomcargo;
            $nuevasalida->cantidad = 1;
            $nuevasalida->idusuario = $params['idusuario'];
            $nuevasalida->fecha = $fechaActual;
            $nuevasalida->save();
        }
        return true;
    }

}
