<?php
/*
* Author: Milena Gainza Rodríguez
* Version: 2.0
* Description:
*
* Este fichero se utiliza por la clase

*/

class Calculo extends ZendExt_Model {
    //Arreglo que contiene los principales elementos de interes del pago
    public  $arrayDetalles;
    public $arrayPersonasNopago;
    function __construct(){
         $this->arrayDetalles=Array();
         $this->arrayPersonasNopago=Array();
    }

public function Calcular($arrayPersonaValores,$indicadoresPago,$personasPorAreas,$montosPorAreas)
{

   //Realizando la primera parte del calculo
   $varAux=$this->CalculoPrimPartIDSSumPorAreas($arrayPersonaValores,$personasPorAreas);
    $arrayPersonasPago = $varAux[arrayPersonasPago];
    $arraySumAreas = $varAux[arraySumAreas];
    return $this->calcularSPRPorCadaTrabajador($arrayPersonasPago,$arraySumAreas,$montosPorAreas);

}

  public function dameDetallesPago(){
    return $this->arrayDetalles;
}
 public function damePersonasExcluidas(){
        return $this->arrayPersonasNopago;
  }
}
