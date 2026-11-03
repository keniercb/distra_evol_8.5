<?php

class HisTrazasinversiones extends BaseHisTrazasinversiones {

    public function setUp() {
        parent:: setUp();
    }
    
private function addWhereConParams(&$Where, &$params_query, $colum_cond, $param
    ) {
        $Where .= " AND " . $colum_cond . $param;
    }
    
    public function getTrazasInversiones($params) {
        $conn = Doctrine_Manager::connection();
        $addwhere =  "where 1 = 1";
        $params_query = array();
        foreach ($params['filtros'] as $p => $s) {
            if ($s != null) {
                if ($s['field'] == 'estructura') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "upper(hti.estructura)  LIKE ",  ("'%" . strtoupper($s['data']['value']) . "%'")
                    );
                }  else if ($s['field'] == 'inversion') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "upper(hti.inversion)  LIKE ", ("'%" . strtoupper($s['data']['value']) . "%'")
                    );
                } 
        } 
       }
        $sql = "select hti.idtrazasinversiones,
                        hti.estructura,
                        hti.inversion,
                        hti.componente,
                        hti.tabla,
                        hti.idinversion,
                        hti.accion,
                        hti.denominacion,
                        hti.descripcion,
                        hti.usuario,
                        hti.fecha,
                        count(*) over() as total
                FROM mod_planifinversiones.his_trazasinversiones hti
                $addwhere
                order by hti.fecha DESC";
        $sql .= " OFFSET(" . $params['start'] . ") LIMIT(" . $params['limit'] . ")";
      // print_r($sql);die;
       
        $data = $conn->execute($sql);
        return $data->fetchAll(PDO::FETCH_ASSOC);
    }

    public function seveTrazasInversiones($componente, $accion, $tabla, $idInversion, $des, $user,$denom,$inversion,$idestructura) {
        $conn = Doctrine_Manager::connection();
        $traza = "INSERT INTO 
                    mod_planifinversiones.his_trazasinversiones
                  (
                    componente,
                    tabla,
                    idinversion,
                    accion,
                    descripcion,
                    usuario,                    
                    inversion,
                    idestructura,
                    estructura,
                    denominacion
                  )
                VALUES (
                    '{$componente}',
                    '{$tabla}',
                    '{$idInversion}',
                    '{$accion}',
                    '{$des}',
                    '{$user}',
                    '{$inversion}',
                    '{$idestructura}',
                    (select coalesce (
                            (select denominacion  
                          FROM 
                            mod_estructuracomp.dat_estructura 
                            where idestructura = '{$idestructura}'),   
                            (select denominacion  
                          FROM 
                            mod_estructuracomp.dat_estructuraop 
                            where idestructuraop = '{$idestructura}')) ),    
                    '{$denom}'
                  )";
//    print_r($traza);die('ddd');
        $conn->execute($traza);
        unset($traza);
    }
    
    
        public function listarAccionesTraza() {
        $conn = Doctrine_Manager::connection();
        $sql = "select distinct
                        hti.accion
                        FROM mod_planifinversiones.his_trazasinversiones hti
                        order by hti.accion ";
        $datosListar = $conn->execute($sql);
        $datos['data'] = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }
    
}
