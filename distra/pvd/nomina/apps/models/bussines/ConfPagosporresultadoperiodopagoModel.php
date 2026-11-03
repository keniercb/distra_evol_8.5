<?php

class ConfPagosporresultadoperiodopagoModel extends ZendExt_Model
{
    public $objConfPagoPeriodo;
    public function setUp()
    {
        $this->objConfPagoPeriodo=new ConfPagosporresultadoperiodopago();
        parent::ZendExt_Model();
    }

    /* Devuelve los pagos elaborados que se incluyen el pago por resultado para el Calculo del SBC
      *
      *
      * */
    public function devPeriodosDelPago($idpagoresultado){
        return  $this->objConfPagoPeriodo->getPeriodosdePagosPorIdPago($idpagoresultado);
    }

}

