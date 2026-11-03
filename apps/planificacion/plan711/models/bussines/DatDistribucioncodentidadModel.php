<?php

class DatDistribucioncodentidadModel extends ZendExt_Model {
    public function setUp() {
        parent::ZendExt_Model();
    }
    
    public function MontoTotal($parametros){
        $data1 = DatDistribucioncodentidad::MontoTotal($parametros);
        $modelSolicitud = new DatSolicitud711Model();
        $datasol = $modelSolicitud->listarSolicitudes711($parametros);
        
        $aux1=0;
        $aux2=0;
//        foreach ($data1 as $value1) {
//            if($value1['idproducto711']==null){
//                $aux1+=floatval($value1['monto']);
//            }
//        }
//        var_dump($aux1);
//        var_dump($data1[0]['valor']);die;
        $aux1+=floatval($data1[0]['valor']);
//        foreach ($datasol as $value) {
          if($parametros['tipoplan']==1255){  
            $aux2+=floatval($datasol[0]['valorfar']);
          }else{
            $aux2+=floatval($datasol[0]['totalpresentado']);  
          }
//        }
        $result=bcsub($aux1,$aux2,6);
        return $result;
    }
    
    public function MontoTotalDist($parametros){
        $result = DatDistribucioncodentidad::MontoTotal($parametros);
        return $result;
    }
    
    public function listarDistribucion($parametros){
        $modeloplanes = new DatPlan711Model();
        $paramestros['uri'] = $valor->uri;
        $resultados3 = $modeloplanes->listarFFyCC($paramestros);
        //var_dump($resultados3); die;
        $data = $modeloplanes->listarDistribucionCod($paramestros);
        $cont = 0;
        for ($i = 0; $i < count($resultados3); $i++) {
            $data[$cont]['idplanfuentescc'] = $resultados3[$i]['idplanfuentescc'];
            $data[$cont]['iddatoscodigo'] = $resultados3[$i]['iddatoscc'];
            $data[$cont]['denominacion'] = $resultados3[$i]['denominacioncc'];
            $data[$cont]['monto'] = $resultados3[$i]['monto'];
            $cont++;
        }
        return $result;
    }
    
    public function adicionarModificarDistr($paramestros, $distribuc) {
        $result = DatDistribucioncodentidad::adicionarModificarDistr($paramestros, $distribuc);
        return $result;
    }

}
