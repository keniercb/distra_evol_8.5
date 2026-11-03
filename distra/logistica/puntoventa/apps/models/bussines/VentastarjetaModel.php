<?php

class VentastarjetaModel extends ComunpuntoventaModel
{ 
    public function __construct()
    {
        parent::__construct();
    }
	
public function ventasRealizadasPorTarjeta($params)
	{ 
       
	    $digitos = (isset ($params['criterio']) && $params['criterio'])? "'".$params['criterio']."'" : 'null';
        $filtroTienda = (isset ($params['tienda']) && $params['tienda'])? "'".$params['tienda']."'" : 'null';
        $filtroTargeta = (isset ($params['digitos']) && $params['digitos'])? "'".$params['digitos']."'" : 'null';
        $filtroNoVenta = (isset ($params['nroventa']) && $params['nroventa'])? "'".$params['nroventa']."'" : 'null';
        $filtroProducto = (isset ($params['denominacion']) && $params['denominacion'])? "'".$params['denominacion']."'" : 'null';
        $filtroNaturaleza = (isset ($params['naturaleza']) && $params['naturaleza'])? "'".$params['naturaleza']."'" : 'null';
        $filtroEntidad = (isset ($params['entidad']) && $params['entidad'])? "'".$params['entidad']."'" : 'null';
        $filtroTitular = (isset ($params['idtitular']) && $params['idtitular'])? "'".$params['idtitular']."'" : 'null';
        $ordenbase='ninguno';
        $Ordenar = (isset ($params['ordenar']) && $params['ordenar'])? "'".$params['ordenar']."'" : "'".$ordenbase."'";
       
        $limit = $params['limit'];
        $start = $params['start'];
       
       if($params['comparaciones']){
            foreach($params['comparaciones'] as $c){
               $filtroCampo="'".$c['campo']."'";
               $filtroValor=$c['valor'];
               
               if($c['signo']=="<"){
                   $filtroSigno=1;
               }else{
                   $filtroSigno=2;
               }
            }
           }else{
            /* if($params['nroventa']){
                $filtroCampo="'".'nroventa'."'";
                $filtroValor=$params['nroventa'];
                $filtroSigno=3;
                
            }else */ if($params['importetotal']){
                    $filtroCampo="'".'importetotal'."'";
                    $filtroValor=$params['importetotal'];
                    $filtroSigno=3;
                }else if($params['cantidad']){
                    $filtroCampo="'".'cantidad'."'";
                    $filtroValor=$params['cantidad'];
                    $filtroSigno=3;
                }else{
                $filtroCampo='null';
                $filtroValor='null';
                $filtroSigno='null';
            }
           }
				
        $sql = "select *, count(*) over() as cantidad from mod_logpuntoventa.f_ventastarjeta(
        {$digitos},{$filtroTienda},{$filtroTargeta},{$filtroNoVenta},
        {$filtroProducto},{$filtroNaturaleza},{$filtroEntidad},
        {$filtroCampo},{$filtroSigno},{$filtroValor},{$filtroTitular},{$Ordenar})";
       
        $conn = Zend_Registry::get('conexion');

        $result = $conn->execute($sql . " limit {$limit} offset {$start}")->fetchAll(PDO::FETCH_ASSOC);

        return array(
            'cantidad' => count($result) > 0 ? $result[0]['cantidad'] : 0,
            'datos' => $result
        );	
	}
}