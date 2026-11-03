<?php

class DatMotivoModificacion extends BaseDatMotivoModificacion {
    
    public function setUp() {
        parent::setUp();
    }
    
    public function listarModif($paramestros){      
        $conn = Doctrine_Manager::connection();
        $addWhere = "true";
        $idenificador = '';
        
         if($paramestros['tipo']==1){
            $idenificador = ''.$paramestros['tipo'].'/'.$paramestros['idejercicio'].'/'.$paramestros['idplan711'];
        }
        if($paramestros['tipo']==2){
            $idenificador = ''.$paramestros['tipo'].'/'.$paramestros['idejercicio'].'/'.$paramestros['identidad'];
        }
        if($paramestros['tipo']==3){
            $idenificador = ''.$paramestros['tipo'].'/'.$paramestros['idsolicitud711'];
        }
        
//        if ($params['filtros']) {
//            foreach ($params['filtros'] as $datos) {
//                if ($datos['field'] == 'ejercicio') {
//                    $addWhere .= " AND upper(nom_ejercicioplanificacion.ejercicio) LIKE  " . "'" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
//                }elseif ($datos ['field'] == 'actual') {
//                    $addWhere .= " AND dat_plan711.actual= ".$datos['data']['value'];                    
//                }elseif ($datos ['field'] == 'montotoal') {
//                    if ($datos['data']['comparison'] == 'lt') {
//                        $addWhere .= " AND dat_plan711.montotoal <{$datos['data']['value']}";
//                    }
//                    if ($datos['data']['comparison'] == 'gt') {
//                        $addWhere .= " AND dat_plan711.montototal >{$datos['data']['value']}";
//                    }
//                    if ($datos['data']['comparison'] == 'eq') {
//                        $addWhere .= " AND dat_plan711.montototal ={$datos['data']['value']}";
//                    }
//                }
//            }
//        }        
//        $delimitando = "";
//        if ($params['start'] != null && $params['limit'] != null) {
//            $start = $params['start'];
//            $limit = $params['limit'];
//            $delimitando = " OFFSET $start LIMIT $limit ";
//        }
                
        $sql = "SELECT idmotivomodif, identificador, motivo, usuario, fechamodificacion
  FROM mod_plan711.dat_motivomodificacion where identificador like '$idenificador'";
        if($paramestros['ultimo']){
            //order by idmotivomodif DESC LIMIT 1
            $sql.= " order by idmotivomodif DESC LIMIT 1";
        }
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

}
