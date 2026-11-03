<?php
/*
* Version: 2.0
* Description:
*
* Este fichero se utiliza por la clase
*/
class CalculoRxetid extends ZendExt_Model {
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
    $arrayPersonasPago=$varAux['arrayPersonasPago'];
    $arraySumAreas=$varAux['arraySumAreas'];
    return $this->calcularSPRPorCadaTrabajador($arrayPersonasPago,$arraySumAreas,$montosPorAreas);

}

/* Calculando para cada persona (SBCT*ED*IPT)
 * Calculando para cada area la sum(SBCT*ED*IPT)
 * */
 public function CalculoPrimPartIDSSumPorAreas($arrayPersonaValores,$personasPorAreas){
     $arrayPersonasProblemas=Array();
     $arrayPersonasPago=Array();
     $arraySumAreas=Array();
     $conPersonasPago=0;
     $conPersonasNoPago=0;
     //Recorro las personas por de todas las areas
     foreach($personasPorAreas as $keyP=>$valorPersonas){
         $idpersona=$valorPersonas[idpersona];
         $idstAuxP=$arrayPersonaValores[$idpersona][SBCt]*$arrayPersonaValores[$idpersona][ED]*$arrayPersonaValores[$idpersona][IPC];
         if ($idstAuxP&&$arrayPersonaValores[$idpersona][ED]>=60){
             $arrayPersonasPago[$conPersonasPago]=$arrayPersonaValores[$idpersona];
             $arrayPersonasPago[$conPersonasPago][idpersona]=$valorPersonas[idpersona];
             $arrayPersonasPago[$conPersonasPago][area]=$valorPersonas[area];
             $arrayPersonasPago[$conPersonasPago][idarea]=$valorPersonas[idarea];
             $arrayPersonasPago[$conPersonasPago][auxIDS]=$idstAuxP;
             $arraySumAreas[$valorPersonas[idarea]]= $arraySumAreas[$valorPersonas[idarea]]+$idstAuxP;
             $conPersonasPago++;
         }else{
             $arrayPersonasProblemas[$conPersonasNoPago]=$arrayPersonaValores[$idpersona];
             $arrayPersonasProblemas[$conPersonasNoPago][area]=$valorPersonas[area];
             $arrayPersonasProblemas[$conPersonasNoPago][idarea]=$valorPersonas[idarea];
             $conPersonasNoPago++;
         }
     }

      $varRetorno['arrayPersonasPago']=$arrayPersonasPago;
      $this->arrayPersonasNopago=$arrayPersonasProblemas;
      $varRetorno['arraySumAreas']=$arraySumAreas;
     return  $varRetorno;
 }
 /* Calculando el  SPRT
  *
  * */

  public function calcularSPRPorCadaTrabajador($arrayPersonasPago,$arraySumAreas,$montosPorAreas){
      $mayorPago=0;
      $menorPago=999999999999999999999;
      $sumPromedio=0;
      //Recorro las personas que entran en el pago
      foreach($arrayPersonasPago as $keyP=> &$valorPersonas){
          $IDST=round($valorPersonas[auxIDS]/$arraySumAreas[$valorPersonas[idarea]],2) ;
          $SPRT=round($IDST*$montosPorAreas[$valorPersonas[idarea]],2);
          $sumPromedio=$sumPromedio+$SPRT;
          $mayorPago=($SPRT>$mayorPago) ? $SPRT  : $mayorPago;
          $menorPago=($SPRT<$menorPago) ? $SPRT  : $menorPago;
          $valorPersonas['IDSt']=$IDST;
          $valorPersonas['SPRt']=$SPRT;
      }
      $promedio=round($sumPromedio/count($arrayPersonasPago),2);
      $this->arrayDetalles['Mayor pago']=$mayorPago;
      $this->arrayDetalles['Menor pago']=$menorPago;
      $this->arrayDetalles['Promedio']=$promedio;
      $this->arrayDetalles['Monto repartido']= array_sum($montosPorAreas);
      $this->arrayDetalles['Diferencia']=$this->arrayDetalles['Monto repartido']-$sumPromedio;
      $this->arrayDetalles['Cant personas']=count($arrayPersonasPago);
      return $arrayPersonasPago;
  }



    public function dameDetallesPago(){
    return $this->arrayDetalles;
}
 public function damePersonasExcluidas(){
        return $this->arrayPersonasNopago;
  }
}
