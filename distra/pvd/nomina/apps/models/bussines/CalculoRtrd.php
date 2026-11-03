<?php
/*
* Author: Milena Gainza Rodríguez
* Version: 2.0
* Description:
*
* Este fichero se utiliza por la clase

*/

class CalculoRtrd extends ZendExt_Model {
    //Arreglo que contiene los principales elementos de interes del pago
    public  $arrayDetalles;
    public $arrayPersonasNopago;
    function __construct(){
         $this->arrayDetalles=Array();
         $this->arrayPersonasNopago=Array();
    }

public function Calcular($arrayPersonaValores,$indicadoresPago,$personasPorAreas,$montosPorAreas)
{//print_r($arrayPersonaValores);die;

   //Realizando la primera parte del calculo
   $varAux=$this->CalcularCDS($arrayPersonaValores,$personasPorAreas);
    $arrayPersonasPago = $varAux['arrayPersonasPago'];
    $arraySumAreas = $varAux['arraySumAreas'];
    return $this->calcularSPRPorCadaTrabajador($arrayPersonasPago,$arraySumAreas,$montosPorAreas);

}


   public function CalcularCDS($arrayPersonaValores,$personasPorAreas)
{

    $arrayPersonasProblemas=Array();
    $arrayPersonasPago=Array();
    $arraySumAreas=Array();
    $conPersonasPago=0;
    $conPersonasNoPago=0;
   // print_r($personasPorAreas);die;
    foreach($personasPorAreas as $keyP=>$valorAreas){

        foreach($valorAreas as $valorPersonas){
            $idpersona=$valorPersonas[idpersona];

            $idstAuxP = /*$arrayPersonaValores[$idpersona][STRTBC]*/$arrayPersonaValores[$idpersona][CPL];

            if( $idstAuxP){
                $arrayPersonasPago[$conPersonasPago][idpersona]=$valorPersonas[idpersona];
                $arrayPersonasPago[$conPersonasPago][id]=$valorPersonas[idpersona];
                $arrayPersonasPago[$conPersonasPago][area]=$valorPersonas[area];
                $arrayPersonasPago[$conPersonasPago][idarea]=$valorPersonas[idarea];
                //  $arrayPersonasPago[$conPersonasPago][STRTBC]=$arrayPersonaValores[$idpersona][STRTBC];
                $arrayPersonasPago[$conPersonasPago][nombreapellido]=$arrayPersonaValores[$idpersona][nombreapellido];
                $arrayPersonasPago[$conPersonasPago][CPL]=$arrayPersonaValores[$idpersona][CPL];
               // $arrayPersonasPago[$conPersonasPago][auxIDS]=$idstAuxP;
               // $arrayPersonasPago[$conPersonasPago][auxCDS]=$idstAuxP;
                $arraySumAreas[$valorPersonas[idarea]]= $arraySumAreas[$valorPersonas[idarea]]+$idstAuxP;

                $conPersonasPago++;
                //$arrayPersonasPago[$conPersonasPago][auxCDS]=$idstAuxP;
                //$arrayPersonasPago[$conPersonasPago][STRTBC]=$arrayPersonaValores[$idpersona][STRTBC];

                // $arraySumAreas = $arraySumAreas+$idstAuxP;
                // $conPersonasPago++;
            }else{
                //  print_r($arrayPersonaValores);die;
                $arrayPersonasProblemas[$conPersonasNoPago]=$arrayPersonaValores[$idpersona];
                $arrayPersonasProblemas[$conPersonasNoPago][area]=$valorPersonas[area];
                $arrayPersonasProblemas[$conPersonasNoPago][idarea]=$valorPersonas[idarea];
                $arrayPersonasProblemas[$conPersonasNoPago][idpersona]=$valorPersonas[idpersona];
                $arrayPersonasProblemas[$conPersonasNoPago][id]=$valorPersonas[idpersona];
                //este fue el cambio
                $arrayPersonasProblemas[$conPersonasNoPago][nombreapellido]=$valorPersonas[nombreapellido];
                $arrayPersonasProblemas[$conPersonasNoPago][id]=$valorPersonas[idpersona];
                $arrayPersonasProblemas[$conPersonasNoPago][CPL]=$arrayPersonaValores[$idpersona][CPL];
                $conPersonasNoPago++;
            }
        }
    }


       $varRetorno['arrayPersonasPago']=$arrayPersonasPago;
       // $this->arrayPersonasNopago=$arrayPersonasProblemas;
       $varRetorno['arraySumAreas']=$arraySumAreas;
    return $varRetorno;
   

}

    public function calcularSPRPorCadaTrabajador($arrayPersonasPago,$arraySumAreas,$montosPorAreas){
        $mayorPago=0;
        $menorPago=999999999999999999999;
        $sumPromedio=0;

        //Recorro las personas que entran en el pago
        foreach($arrayPersonasPago as $keyP=> &$valorPersonas){

           // $IDST=round($arraySumAreas[$valorPersonas[idarea]/$valorPersonas[auxCDS]],2) ;
            $SPRT=round($montosPorAreas[$valorPersonas[idarea]]/$arraySumAreas[$valorPersonas[idarea]],2);
           // $sumPromedio=$sumPromedio+$SPRT;
            $mayorPago=($SPRT>$mayorPago) ? $SPRT  : $mayorPago;
            $menorPago=($SPRT<$menorPago) ? $SPRT  : $menorPago;
           // $valorPersonas['IDSt']=$IDST;
            $valorPersonas['CDS']=$SPRT;
            $montoarea=$montosPorAreas[$valorPersonas[idarea]];
        }

       // $promedio=round($sumPromedio/count($arrayPersonasPago),2);
        $this->arrayDetalles['Mayor pago']=$mayorPago;
        $this->arrayDetalles['Menor pago']=$menorPago;
        //$this->arrayDetalles['Promedio']=$promedio;
        $this->arrayDetalles['Monto repartido']= $montoarea;//array_sum($montosPorAreas);
       // $this->arrayDetalles['Diferencia']=$this->arrayDetalles['Monto repartido']-$sumPromedio;
        $this->arrayDetalles['Cant personas']=count($arrayPersonasPago);
        //print_r($arrayPersonasPago);die;
        return $arrayPersonasPago;
    }


  public function dameDetallesPago(){
    return $this->arrayDetalles;
}
 public function damePersonasExcluidas(){
    // print_r($this->arrayPersonasNopago);die;
        return $this->arrayPersonasNopago;
  }
}
