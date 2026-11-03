<?php

class DatFacturaArribo extends BaseDatFacturaArribo
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
        $query->delete()->from('DatFacturaArribo')
            ->whereIn('idfacturaarribo', $idfacturas)
            ->execute();
    }


}
