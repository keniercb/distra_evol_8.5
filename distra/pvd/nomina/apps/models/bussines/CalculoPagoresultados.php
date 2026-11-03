 <?php
/*
* Author: Milena Gainza Rodríguez
* Version: 2.0
* Description:
*
* Este fichero se utiliza por la clase

*/

class CalculoPagoresultados extends ZendExt_Model {
    //Arreglo que contiene los principales elementos de interes del pago
    public  $arrayDetalles;
    public $arrayPersonasNopago;
    function __construct(){
         $this->arrayDetalles=Array();
         $this->arrayPersonasNopago=Array();
    }

public function Calcular($arrayPersonaValores,$indicadoresPago,$personasPorAreas,$montosPorAreas)
{
    //print_r($montosPorAreas);die;
    $arraypersonasnopago = array();
    $arraypersonaspago = array();
    $arraysumasbcxcoefarea = array();
    $contpersonasnopago = 0;
    $contpersonaspago = 0;
     //Calculando los sbc*coef y sumandolos por areas
    foreach($personasPorAreas as $ipa=>$rpa){
        foreach($rpa as $ipersona => $ra){
            $idpersona = $ra['idpersona'];
            $sbcxcoefpersona = $arrayPersonaValores[$idpersona]['SBC']*$arrayPersonaValores[$idpersona]['EI'];
            if($sbcxcoefpersona){
                $arraypersonaspago[$contpersonaspago]['idpersona'] = $idpersona;
                $arraypersonaspago[$contpersonaspago]['nombreapellido'] = $ra['nombreapellido'];
                $arraypersonaspago[$contpersonaspago]['idarea'] = $ra['idarea'];
                $arraypersonaspago[$contpersonaspago]['area'] = $ra['area'];;
                $arraypersonaspago[$contpersonaspago]['SBC'] = $arrayPersonaValores[$idpersona]['SBC'];
                $arraypersonaspago[$contpersonaspago]['EI'] = $arrayPersonaValores[$idpersona]['EI'];
                $arraypersonaspago[$contpersonaspago]['EC'] = $arrayPersonaValores[$idpersona]['EC'];
                $arraypersonaspago[$contpersonaspago]['SBCXEVAL'] = $sbcxcoefpersona;
                $arraysumasbcxcoefarea[$ra['idarea']] = $arraysumasbcxcoefarea[$ra['idarea']] + $sbcxcoefpersona;
                $contpersonaspago++;
            }else{
                $arraypersonasnopago[$contpersonasnopago]['idpersona'] = $idpersona;
                $arraypersonasnopago[$contpersonasnopago]['id'] = $idpersona;
                $arraypersonasnopago[$contpersonasnopago]['nombreapellido'] = $ra['nombreapellido'];
                $arraypersonasnopago[$contpersonasnopago]['idarea'] = $ra['idarea'];
                $arraypersonasnopago[$contpersonasnopago]['area'] = $ra['area'];
                $arraypersonasnopago[$contpersonaspago]['SBC'] = $arrayPersonaValores[$idpersona]['SBC'];
                $arraypersonasnopago[$contpersonaspago]['EI'] = $arrayPersonaValores[$idpersona]['EI'];
                $arraypersonasnopago[$contpersonaspago]['EC'] = $arrayPersonaValores[$idpersona]['EC'];
                $contpersonasnopago++;
            }
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
        $arraypersonaspago[$ipp]['PR'] = number_format($arraypersonaspago[$ipp]['SBCXEVAL'] * $cdsarea, 2,'.', '');
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
