<?php
/*
* Author: Milena Gainza Rodríguez
* Version: 2.0
* Description:
*
* Este fichero se utiliza por la clase

*/

class CalculoRcayococo extends ZendExt_Model {
    //Arreglo que contiene los principales elementos de interes del pago
    public  $arrayDetalles;
    public $arrayPersonasNopago;
    function __construct(){
        $this->arrayDetalles=Array();
        $this->arrayPersonasNopago=Array();
    }

    public function Calcular($arrayPersonaValores,$indicadoresPago,$personasPorAreas,$montosPorAreas)
    {
        $arraypersonasnopago = array();
        $arraypersonaspago = array();
        $arraysumasbcxcoefarea = array();
        $contpersonasnopago = 0;
        $contpersonaspago = 0;
        //Calculando los sbc*coef y sumandolos por areas
        foreach($personasPorAreas as $ipa=>$rpa){
            $idpersona = $rpa['idpersona'];
            $sbcxcoefpersona = $arrayPersonaValores[$idpersona]['SBC']*$arrayPersonaValores[$idpersona]['Coef'];
            if($sbcxcoefpersona){
                $arraypersonaspago[$contpersonaspago]['idpersona'] = $idpersona;
                $arraypersonaspago[$contpersonaspago]['id'] = $idpersona;
                $arraypersonaspago[$contpersonaspago]['nombreapellido'] = $rpa['nombreapellido'];
                $arraypersonaspago[$contpersonaspago]['idarea'] = $rpa['idarea'];
                $arraypersonaspago[$contpersonaspago]['area'] = $rpa['area'];;
                $arraypersonaspago[$contpersonaspago]['Coef'] = $arrayPersonaValores[$idpersona]['Coef'];
                $arraypersonaspago[$contpersonaspago]['SBCxCoef'] = $sbcxcoefpersona;
                $arraysumasbcxcoefarea[$rpa['idarea']] = $arraysumasbcxcoefarea[$rpa['idarea']] + $sbcxcoefpersona;
                $contpersonaspago++;
            }else{
                $arraypersonasnopago[$contpersonasnopago]['idpersona'] = $idpersona;
                $arraypersonasnopago[$contpersonasnopago]['id'] = $idpersona;
                $arraypersonasnopago[$contpersonasnopago]['nombreapellido'] = $rpa['nombreapellido'];
                $arraypersonasnopago[$contpersonasnopago]['idarea'] = $rpa['idarea'];
                $arraypersonasnopago[$contpersonasnopago]['area'] = $rpa['area'];
                $arraypersonasnopago[$contpersonasnopago]['SBC'] = $arrayPersonaValores[$idpersona]['SBC'];
                $arraypersonasnopago[$contpersonasnopago]['Coef'] = $arrayPersonaValores[$idpersona]['Coef'];
                $contpersonasnopago++;
            }
        }
        $this->arrayPersonasNopago=$arraypersonasnopago;
        //Calculando los cds por areas para calcular el pago por resultados
        $montototal = 0;
        $mayorsalario = 0;
        $menorsalario = 999999999999999;
        foreach($arraypersonaspago as $ipp=>$rpp){
            $idarea = $rpp['idarea'];
            $montoarea = $montosPorAreas[$idarea];
            $cdsarea = number_format($montoarea/$arraysumasbcxcoefarea[$idarea], 7,'.', '');
            $arraypersonaspago[$ipp]['CDS'] = $cdsarea;
            $arraypersonaspago[$ipp]['PR'] = number_format($arraypersonaspago[$ipp]['SBCxCoef'] * $cdsarea, 2,'.', '');
            $montototal += $arraypersonaspago[$ipp]['PR'];
            $mayorsalario = ($arraypersonaspago[$ipp]['PR']>$mayorsalario)?$arraypersonaspago[$ipp]['PR']:$mayorsalario;
            $menorsalario = ($arraypersonaspago[$ipp]['PR']<$menorsalario)?$arraypersonaspago[$ipp]['PR']:$menorsalario;
        }

        //Salvando los datos globales
        $this->arrayDetalles['Mayor pago']=$mayorsalario;
        $this->arrayDetalles['Menor pago']=$menorsalario;
        $this->arrayDetalles['Monto repartido']= number_format($montototal, 2, '.', '');
        $this->arrayDetalles['Cant personas']=count($arraypersonaspago);
        return $arraypersonaspago;

    }

    public function dameDetallesPago(){
        return $this->arrayDetalles;
    }
    public function damePersonasExcluidas(){
        return $this->arrayPersonasNopago;
    }
}
