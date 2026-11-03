<?php

class ConfPagosporresultadoareaModel extends ZendExt_Model
{
    public $objAreaPago;
    public function setUp()
    {
        $this->objAreaPago=new ConfPagosporresultadoarea();
        parent::ZendExt_Model();
    }

    /* Devuelve todas las areas configuradas en el pago con sus montos en caso de tenerlos
  *  dado el $idpagoresultado
  *
  * */

    public function getAreasConfigPagoPorResultado($idpagoporresultado)
    {
       return $this->objAreaPago->getAreasPagoPorResultadoDadoIdPago($idpagoporresultado);
    }

    /*Devuelve las areas asociadas al pago con sus respectivos montos
     *
     * */
    public function getAreasInsertadasPorPago($idpagoporresultado)
    {
        return $this->objAreaPago->getAreasConfiguradasPorPago($idpagoporresultado);

    }
}

