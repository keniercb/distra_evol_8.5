<?php

class DatGestpersonadel711 extends BaseDatGestpersonadel711 {
    
    public function setUp() {
        parent::setUp();
    }
    
    public function listarPersonas711($params){
        $conn = Doctrine_Manager::connection();
        $addWhere = "true";
//        if ($params['filtros']) {
//            foreach ($params['filtros'] as $datos) {
//                if ($datos['field'] == 'ejercicio') {
//                    $addWhere .= " AND upper(nom_ejercicioplanificacion.ejercicio) LIKE " . "'%" . $datos['data']['value']. "%'";
//                }elseif ($datos ['field'] == 'actual') {
//                    $addWhere .= " AND dat_plan711.actual= ".$datos['data']['value'];                    
//                }elseif ($datos ['field'] == 'montototal') {
//                    if ($datos['data']['comparison'] == 'lt') {
//                        $addWhere .= " AND dat_plan711.montotoal <{$datos['data']['value']}";
//                    }
//                    if ($datos['data']['comparison'] == 'gt') {
//                        $addWhere .= " AND dat_plan711.montototal >{$datos['data']['value']}";
//                    }
//                    if ($datos['data']['comparison'] == 'eq') {
//                        $addWhere .= " AND dat_plan711.montototal ={$datos['data']['value']}";
//                    }
//                }elseif ($datos ['field'] == 'idestado') {
//                    $addWhere .= " AND nom_ejercicioplanificacion.idestado= ".$datos['data']['value'];                    
//                }
//            }
//        } 
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }
                
        $sql = "SELECT idpersonadel711, nombre||' '||apellidos as nombreapellidos, n2.denominacion AS iddatostp, nombrepertenece as identidad, iddatosempimp, 
                    iddatoscategoria, correoelec, telefono, idunidadcompra AS iddatosuc, activo
                FROM mod_plan711.dat_personadel711 
                left join mod_planificacion.nom_datosnomenclador n2 on (n2.iddatosnomenclador = dat_personadel711.idtipopersona) where $addWhere
                $delimitando";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    
    
}
