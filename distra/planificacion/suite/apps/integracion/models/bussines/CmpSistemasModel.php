<?php

/**
 * @author
 * @version
 * @copyright XETID, ERP-CUBA
 */
class CmpSistemasModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }



    public function CargarAreasNegocio($parametros){

        $objModulo = new NomModulo();
        $arrayAreasNegocio = $objModulo->CargarAreasNegocio($parametros);

        return $arrayAreasNegocio;
    }



}
