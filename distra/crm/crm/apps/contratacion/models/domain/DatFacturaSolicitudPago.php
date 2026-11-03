<?php

class DatFacturaSolicitudPago extends BaseDatFacturaSolicitudPago
{

    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        parent::setUp();

    }

    public function eliminarFacturas($idfacturas){
        $query = Doctrine_Query::create();
        $query->delete()->from('DatFacturaSolicitudPago')
            ->whereIn('idfactura', $idfacturas)
            ->execute();
    }


}
