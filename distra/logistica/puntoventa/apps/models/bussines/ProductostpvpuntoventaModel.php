<?php

/**
 * Created by PhpStorm.
 * User: Gabriel
 * Date: 29/08/2016
 * Time: 3:56
 */
class ProductostpvpuntoventaModel extends ComunpuntoventaModel
{
    public function __construct()
    {
        parent::__construct();
    }
	
	public function cargarProductostpv($params)
	{ 
       // print_r($params);die;
        $filtroNaturaleza=(isset ($params['naturaleza']) && $params['naturaleza'])? "'".$params['naturaleza']."'" : 'null';
        $filtroCliente=(isset ($params['cliente']) && $params['cliente'])? "'".$params['cliente']."'" : 'null';
        $filtroProducto=(isset ($params['producto']) && $params['producto'])? "'".$params['producto']."'" : 'null';
        $idnaturaleza = (isset ($params['idnaturaleza']) && $params['idnaturaleza'])? $params['idnaturaleza'] : 'null';
        $criterio = (isset ($params['criterio']) && $params['criterio'])? "'".$params['criterio']."'" : 'null';
		$desde = (isset ($params['desde']) && $params['desde'])? "'".$params['desde']."'" : 'null';
        $hasta = (isset ($params['hasta']) && $params['hasta'])? "'".$params['hasta']."'" : 'null';
        
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
           
            if($params['importe']){
                $filtroCampo="'".'importe'."'";
                $filtroValor=$params['importe'];
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
		
        
		$limit = $params['limit'];
		$start = $params['start'];
        $p_idestructuraop = null;
        $p_idnaturaleza = null;
        $p_criterio = null;
      
      
       
        $sql = "select * from mod_logpuntoventa.f_ventaproductocliente ({$criterio},{$idnaturaleza},{$desde},{$hasta},
        {$filtroNaturaleza},{$filtroCliente},{$filtroProducto},{$filtroCampo},{$filtroSigno},{$filtroValor})";
        //print_r($sql);die;
        $conn = Zend_Registry::get('conexion');
        return array(
            'cantidad' => $conn->execute($sql)->rowCount(),
            'datos' => $conn->execute($sql . " limit {$limit} offset {$start}")->fetchAll(PDO::FETCH_ASSOC)
        );	
	}
}
