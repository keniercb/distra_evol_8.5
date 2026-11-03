<?php

class DatPlan711Model extends ZendExt_Model {
    
    public function setUp() {
        parent::ZendExt_Model();
    }
    
    public function listarPlanes711($params){
        $result = DatPlan711::listarPlanes711($params);
        return $result;
    }
    
    public function listarFFyCC($params){
        $result = DatPlan711::listarFFyCC($params);
        return $result;
    }
    public function listarDistribucionCod($params){
        $result = DatPlan711::listarDistribucionCod($params);
        return $result;
    }
    
    public function listarMontoDisponible($params) {
        $result = DatPlan711::listarMontoDisponible($params);
        return $result;
    }
    
    public function listarMontoDisponibleFar($paramestros) {
        $cont = 0;
        $data = array();
        $montototal=0;
        $valor->uri = 'CCFar';
        $modeloplanes = new DatPlan711Model();
        $paramestros['uri'] = $valor->uri;
        $distribcod = $modeloplanes->listarFFyCC($paramestros);
        $distribindcod = $modeloplanes->listarDistribucionCod($paramestros);        
        for ($index1 = 0; $index1 < count($distribcod); $index1++) {
            $data[$cont]['denominacion']= $distribcod[$index1]['denominacioncc'];
            $data[$cont]['cantidad']= null;
            $data[$cont]['cantidadreal']= null;
            $data[$cont]['precio']= null;
            $data[$cont]['monto']= $distribcod[$index1]['monto'];
            $data[$cont]['montoreal']= $distribcod[$index1]['monto'];
            $data[$cont]['iddatoscodigo']= $distribcod[$index1]['iddatoscc'];
            $data[$cont]['idproducto711']= null;
            $data[$cont]['primario']= 1;
            $data[$cont]['um']=null;
            $montototal+= floatval($distribcod[$index1]['monto']);
            $cont++;
            for ($index2 = 0; $index2 < count($distribindcod); $index2++) {
                if ($distribindcod[$index2]['iddatoscodigo'] == $distribcod[$index1]['iddatoscc']) {
                    if($distribindcod[$index2]['denom2'] == '100.0.00'){
                        $data[$cont]['denominacion']=$distribindcod[$index2]['denominacion'].'('.$distribindcod[$index2]['denominaciondatoscodigo'].')';
                        $data[$cont]['cantidad'] = null;
                        $data[$cont]['cantidadreal'] = null;
                        $data[$cont]['precio'] = null;
                        $data[$cont]['um']=null;
                        $data[$cont]['primario']= 2;
                    }else{
                        $data[$cont]['denominacion'] =$distribindcod[$index2]['denominacion'];
                        $data[$cont]['cantidad'] = $distribindcod[$index2]['cantidad'];
                        $data[$cont]['cantidadreal'] = $distribindcod[$index2]['cantidad'];
                        $data[$cont]['precio'] = $distribindcod[$index2]['precio'];
                        $data[$cont]['um']=$distribindcod[$index2]['abreviaturaunidadmedida'];
                        $data[$cont]['primario']= 2;
                    }
                    $data[$cont]['monto'] = $distribindcod[$index2]['valor'];
                    $data[$cont]['montoreal'] = $distribindcod[$index2]['valor'];
                    $data[$cont]['iddatoscodigo'] = $distribindcod[$index2]['iddatoscodigo'];
                    $data[$cont]['idproducto711'] = $distribindcod[$index2]['idproducto711'];
                    $cont++;
                }
            }
        }
        $distribuido = DatDistribucioncodentidad::MontoTotal($paramestros);
        //print($data); die;
        //var_dump($distribuido); die;
        if(!is_null($distribuido)){
            $montodistribuido=0;
            for ($index2 = 0; $index2 < count($data); $index2++) {
                for ($index3 = 0; $index3 < count($distribuido); $index3++) {
                    if($data[$index2]['iddatoscodigo'] == $distribuido[$index3]['iddatoscodigo']){
                            //$data[$index2]['montoreal']=
                        if($data[$index2]['primario']==1 && $distribuido[$index3]['idproducto711']==null){
                            $a= floatval($data[$index2]['monto']);
                            $t= floatval($distribuido[$index3]['monto']);
                            $c=bcsub($a,$t, 6);
                            $data[$index2]['monto']= $c;
                            $montodistribuido+= floatval($distribuido[$index3]['monto']);
                                                        //var_dump($data[$index2]);
                                                        //var_dump('asda');
                        }
                        if($data[$index2]['primario']==2 && $data[$index2]['idproducto711']==$distribuido[$index3]['idproducto711']  && $distribuido[$index3]['idproducto711']!=null ){
                            $d= floatval($data[$index2]['monto']);
                            $e= floatval($distribuido[$index3]['monto']);
                            $f=bcsub($d,$e, 6);
                            $data[$index2]['monto']= $f;
                            if($distribuido[$index3]['cantidad']!=null){
                                $g= floatval($data[$index2]['cantidad']);
                                $s= floatval($distribuido[$index3]['cantidad']);
                                $q=bcsub($g,$s, 6);
                                $data[$index2]['cantidad']= $q;
                            }
                        }
                    }
                    
                }
            }
            $montototalreal=floatval($montototal);
            $h=bcsub($montototal,$montodistribuido, 6);
            $montototal=$h;
        }
        
        $dataresult['data']=$data;
        $dataresult['montototal']=$montototal;
        $dataresult['montototalreal']=$montototalreal;
        return $dataresult;
    }
    
    public function listarDistribucion($paramestros) {
        $data = array();
        $cont = 0;
        $montototal = 0;
        $distribcod = DatPlan711::listarFFyCCAux($paramestros);
        $distribindcod = DatDistribucioncodentidad::listarDistribucionAux($paramestros);
        for ($index1 = 0; $index1 < count($distribcod); $index1++) {
            $data[$cont]['denominacion'] = $distribcod[$index1]['denominacioncc'];
            $data[$cont]['cantidad'] = null;
            $data[$cont]['precio'] = null;
            $data[$cont]['monto'] = $distribcod[$index1]['monto'];
            $data[$cont]['iddatoscodigo'] = $distribcod[$index1]['iddatoscc'];
            $data[$cont]['idproducto711'] = null;
            $data[$cont]['um']=null;
            $cont++;
            for ($index2 = 0; $index2 < count($distribindcod); $index2++) {
                if ($distribindcod[$index2]['iddatoscodigo'] == $distribcod[$index1]['iddatoscc'] && $distribindcod[$index2]['idproducto711'] != NULL) {
                    if ($distribindcod[$index2]['denom2'] == '100.0.00' && $distribindcod[$index2]['idproducto711'] != NULL) {
                        $data[$cont]['denominacion'] = $distribindcod[$index2]['denominacion'] . '(' . $distribindcod[$index2]['dem'] . ')';
                        $data[$cont]['cantidad'] = null;
                        $data[$cont]['precio'] = null;
                        $data[$cont]['um']=null;
                    } else if ($distribindcod[$index2]['idproducto711'] != NULL) {
                        $data[$cont]['denominacion'] = $distribindcod[$index2]['denominacion'];
                        $data[$cont]['cantidad'] = $distribindcod[$index2]['cantidad'];
                        $data[$cont]['precio'] = $distribindcod[$index2]['precio'];
                        $data[$cont]['um']=$distribindcod[$index2]['abreviaturaunidadmedida'];
                    }
                    $data[$cont]['monto'] = $distribindcod[$index2]['monto'];;
                    $data[$cont]['iddatoscodigo'] = $distribindcod[$index2]['iddatoscodigo'];
                    $data[$cont]['idproducto711'] = $distribindcod[$index2]['idproducto711'];
                    $cont++;
                }
            }
        }
        $dataresult['band']=0;
        $ver = DatDistribucioncodentidad::listarDistribucion($paramestros);
        if($ver!=null){
            $dataresult['band']=1;
        }
        $dataresult['data']=$data;
        return $dataresult;
    }
    
    public function adicionarPlan($parametros, $idejercicio, $distribuc){ 
        
        $insertarplan = DatPlan711::adicionarPlan($parametros, $idejercicio);
        $result = Doctrine::getTable('DatPlan711')
                ->findByDql("idejercicio= $idejercicio and idtipoplan = {$parametros['tipoplan']}");

        $idplan = $result[0]->idplan711;
        
        DatPlan711::insertarPlanFuentes($idplan, $distribuc);
        if($parametros['tipoplan']==1255){
            DatPlan711::insertarDistribuncionCod($idplan, $distribuc, $parametros);
        }
        return 1;
    }
    
    public function modificarPlan($parametros, $distribuc){
        $idplan = $parametros['idp711'];
        $plan = Doctrine::getTable('DatPlan711')
                ->find($idplan);
        if(!is_null($parametros['montototal'])){
            $plan->montototal = $parametros['montototal'];
            $plan->save();
        }
        $result= DatPlan711::ActualizarFFyCC($parametros, $idplan, $distribuc);
        if($parametros['tipoplan']==1255){
            DatPlan711::EliminarDistribCod($idplan);
            DatPlan711::insertarDistribuncionCod($idplan, $distribuc, $parametros);
            $result= DatPlan711::ActualizarMontoPrecios($parametros, $idplan, $distribuc);
        }        
//        if($parametros['tipoplan']==1255){
//            
//        }
        return 1;
    }
    
    public function cambiarEstado($param) {
        $result= DatPlan711::cambiarEstado($param);
        return $result;
    }
    
    public function EliminarPlan($param){
        $idplan = $param['idplan711'];
        $plan = Doctrine::getTable('DatPlan711')
                ->find($idplan);
        $plan->activo = false;
        $plan->save();
        return 1;
    }
    
    public function listarDatos($uri){
        if($uri==1){
            $valor->uri='FuentesdeFinanciamiento';
        }
        if($uri==2){
            $valor->uri='Conceptodecompra';
        }
        if($uri==3){
            $valor->uri='EmpresaImportadora';
        }
        if($uri==4){
            $valor->uri='SituaciondelPedido';
        }
        if($uri==5){
            $valor->uri='Categoriapersona';
        }
        if($uri==6){
            $valor->uri='Tipopersona';
        }
        if($uri==7){
            $valor->uri='Unidaddecompra';
        }
        if($uri==14){
            $valor->uri='Cubicaje';
        }
        if($uri==15){
            $valor->uri='Accionesencontrato';
        }
        if($uri==16){
            $valor->uri='Tipoplan711';
        }
        if($uri==17){
            $valor->uri='DelCodigo100';
        }
        if($uri==18){
            $valor->uri='CCFar';
        }
        if($uri==19){
            $valor->uri='Formasdepago';
        }
        if($uri==20){
            $valor->uri='GrupoComercial';
        }
        if($uri==21){
            $valor->uri='Condiciondecompra';
        }
        if($uri==22){
            $valor->uri='Proveedor';
        }
        if($uri==23){
            $valor->uri='Estadodesolicitud';
        }
        if($uri==24){
            $valor->uri='codigocupdunas';
        }
        $data = array();
        $modelonomenclador = new NomDatosnomenclador();
        $resultados = $modelonomenclador->getDatosNomPorUriTipoNomIdestado($valor);
        for ($index = 0; $index < count($resultados); $index++) {
            if ($resultados[$index]['denominacion'] != '-') {
                $resultados[$index]['iddatos'] = $resultados[$index]['iddatosnomenclador'];                
                if($uri==24){
                    $resultados[$index]['denominacion'] = $resultados[$index]['denominacion'].'-'.$resultados[$index]['descripcion']; 
                }
                $data[] = $resultados[$index];
            }
        }
        return $data;
    }

}