<?php

class NomActividadInversionesSisplan extends NomActividad {

    public function listarActividadesInversiones($params) {

        $nivel = self::getNivel();
        $addWhere = "";

        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacion') {
                    $addWhere .= "  AND upper(a.denominacion) LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                } elseif ($datos['field'] == 'codigo') {
                    $addWhere .= " AND upper(a.codigo) LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                } elseif ($datos['field'] == 'nivelactividadinversion') {
                    if ($datos['data']['comparison'] == "gt") {
                        $addWhere .= " AND eiac.nivelactividadinversion  >" . $datos['data']['value'] .
                                "";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $addWhere .= " AND eiac.nivelactividadinversion <" . $datos['data']['value'] .
                                "";
                    } else {
                        $addWhere .= " AND eiac.nivelactividadinversion =" . $datos['data']['value'] .
                                "";
                    }
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT a.idactividad, a.codigo, a.denominacion,COALESCE( eiac.nivelactividadinversion,0) as nivelactividadinversion, 
                       eiac.idinversnivelactividad, aec.idactespcomportamiento
                FROM mod_planificacion.nom_actividad a
                INNER JOIN mod_planificacion.dat_actespcomportamiento aec ON a.idactividad = aec.idactividad AND aec.idespecialidad = " . $params['idespecialidad'] . "
                LEFT JOIN mod_planifintegracion.dat_inversnivelactividad eiac ON aec.idactespcomportamiento = eiac.idactespcomportamiento
                AND eiac.idetapainversion = " . $params['idetapainversion'] . "                                 
                WHERE a.nivel={$nivel}
                AND a.idaprobacion =3 OR a.idaprobacion =4
                AND a.estado=1
                $addWhere
                OFFSET " . $params['start'] . "
                LIMIT  " . $params['limit'] . "";
        $temp = $conn->execute($sql);
        $data->data = $temp->fetchAll(PDO::FETCH_ASSOC);
        $sqltotal = "SELECT COUNT (a.codigo)
                FROM mod_planificacion.nom_actividad a
                INNER JOIN mod_planificacion.dat_actespcomportamiento aec ON a.idactividad = aec.idactividad AND aec.idespecialidad = " . $params['idespecialidad'] . "
                LEFT JOIN mod_planifintegracion.dat_inversnivelactividad eiac ON aec.idactespcomportamiento = eiac.idactespcomportamiento
                AND eiac.idetapainversion = " . $params['idetapainversion'] . "                                 
                WHERE a.nivel={$nivel}
                AND a.idaprobacion =3 OR a.idaprobacion =4
                AND a.estado=1
                $addWhere";
				//print_r($sql);die;
        $temp = $conn->execute($sqltotal);
        $data->total = $temp->fetchAll(PDO::FETCH_COLUMN);
        $data->total = $data->total[0];
        return $data;
    }

    public function getNivel() {
        $select = " SELECT f.idformato,MAX(df.nivel) as nivel
                FROM mod_planificacion.nom_formatopredefinido f
                INNER JOIN mod_datosmaestros.dat_parteformato df ON df.idformato = f.idformato
                GROUP BY f.idformato";
        $conex = Doctrine_Manager:: connection();
        $result = $conex->execute($select)->fetchAll(PDO::FETCH_ASSOC);
        if (count($result)) {
            $result = $result[0]['nivel'];
        } else {
            $result = 4;
        }
        return $result;
    }

}

?>
