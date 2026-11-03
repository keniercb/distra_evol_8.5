<?php

class IndicadordeinventarioModel extends RecuperacionesInventarioModel
{
    private $_serviciosConfiguracionGeneral;

    public function __construct()
    {
        parent::__construct();
        $this->_serviciosConfiguracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
    }
    public function getEstructuras() {
        $estructuras = ServiciosEstructuraComposicionHelper::__init()->obtenerEstructuras();
        return array('datos'=>$estructuras, 'cantidad'=>count($estructuras));
    }

    public function getcargarindicadordeinventario($params){
        $conn = Zend_Registry::get('conexion');
        //eliminar  datos

       // $sql = "DELETE FROM 
       // mod_loginventario.dat_indicador_inventario dd
       // where dd.idusuario = {$params['idusuario']}

        /*";
        $conn->fetchAll($sql);*/

        //invocar funcion

      /*  $sql = "select  dd.*
        from mod_loginventario.dat_indicador_inventario dd

        LIMIT $limit
        OFFSET $start 
   
        ";
        
        $result = $conn->fetchAll($sql);
        return array('datos' => $result, 'cantidad' => $result[0] ? $result[0]['cantidad'] : 0);*/
           
        //listar datos       
        $start = ($params['start']) ? $params['start'] : 0;
        $limit = ($params['limit']) ? $params['limit'] : 30;
       //$usuario =($params['idusuario']) ?  $params['idusuario'] : 'null'; 
       // print_r($params);die;
        $arrCondicion = [];
        $where = '';
        if ($params['comparaciones'] && count($params['comparaciones']) > 0 ) {
            foreach ($params['comparaciones'] as $comparacion) {
                $campo = $comparacion['campo'];
                $valor = $comparacion['valor']; 
                $signo = $comparacion['signo'];
               
              $arrCondicion[] = "$campo $signo $valor";         
            
            }
        }
        if ($params['naturaleza']) {
            $acd = $params['naturaleza'];
            // $arrCondicion[] = "naturaleza = '{$params['naturaleza']}'";
            $arrCondicion[] = "naturaleza = '$acd'";
        }
        if ($params['codigo']) {
            $arrCondicion[] = "codigo = {$params['codigo']}";
        }
        if ($params['producto']) {
            $arrCondicion[] = "producto = {$params['producto']}";
        }
        if ($params['covertura']) {
            $arrCondicion[] = "covertura = {$params['covertura']}";
        }
        if ($params['rotacion']) {
            $arrCondicion[] = "rotacion = {$params['rotacion']}";
        }
        if ($params['coastoxunidad']) {
            $arrCondicion[] = "coastoxunidad = {$params['coastoxunidad']}";
        }
        if ($params['existenciamedia']) {
            $arrCondicion[] = "existenciamedia = {$params['existenciamedia']}";
        }
        if ($params['diaspresencia']) {
            $arrCondicion[] = "diaspresencia = {$params['diaspresencia']}";
        }
        if ($params['consumomedio']) {
            $arrCondicion[] = "consumomedio = {$params['consumomedio']}";
        }
        if ($params['periodo']) {
            $arrCondicion[] = "periodo = {$params['periodo']}";
        }
        if ($params['diascero']) {
            $arrCondicion[] = "diascero = {$params['diascero']}";
        }
        if ($params['periodo']) {
            $arrCondicion[] = "periodo = {$params['periodo']}";
        }
        if ($params['unidades']) {
            $arrCondicion[] = "unidades = {$params['unidades']}";
        }
        if ($params['diascero']) {
            $arrCondicion[] = "diascero = {$params['diascero']}";
        }

        
        if (count($arrCondicion) > 0) {
            $where = 'where ' . implode(' and ' ,$arrCondicion);
        }
     
       $sql = "select  dd.*
        from mod_loginventario.dat_indicador_inventario dd

        $where 
        LIMIT $limit
        OFFSET $start 
   
        ";
   
        $result = $conn->fetchAll($sql);
        return array('datos' => $result, 'cantidad' => $result[0] ? $result[0]['cantidad'] : 0);

    

    }

   public function cargarnaturaleza($params){
    
        $sql =  "select ii.naturaleza
        from mod_loginventario.dat_indicador_inventario ii
        order by naturaleza
        ";
        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll($sql);
        return array('datos' => $result);
        
    }
    public function getcargardeposito($params){

        $sql =  "select (deop.codigo ||' '||deop.denominacion) as deposito 
        from  mod_estructuracomp.dat_estructuraop deop
       where deop.codigo is not null AND deop.denominacion is not null
        order by deposito
        ";
        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll($sql);
        return array('datos' => $result);
        
    }
    public function obtenerLineasProductoBusqueda($idconf = null)
    {
        $this->conexion->execute("SET enable_indexscan TO TRUE;");
        $this->conexion->execute("SET enable_seqscan TO FALSE;");
        if(empty($idconf)){
            return $this->conexion->fetchAll( "SELECT idnaturaleza as idlineaproducto, idnaturaleza, denominacion as lineaproducto, denominacion FROM mod_datosmaestros.nom_naturaleza order by denominacion");
        }
        $arN = $this->obtenerLineasProductosPeriodoConfig($idconf);
        $lp = json_decode($arN['naturalezas']);
        $sql = "SELECT idnaturaleza as idlineaproducto, idnaturaleza, denominacion as lineaproducto, denominacion FROM mod_datosmaestros.nom_naturaleza WHERE idnaturaleza IN (".implode(',',$lp).
            ") order by denominacion;";
        return $this->conexion->fetchAll($sql);
    }
   
   
    
   /* where i.codigo  is not null

    where deop.deposito  is not null*/
   
   
   
      
 }


