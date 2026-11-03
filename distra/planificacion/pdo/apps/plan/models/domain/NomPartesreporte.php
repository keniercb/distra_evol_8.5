<?php

/**
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class NomPartesreporte extends BaseNomPartesreporte
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomVersionreportesNomPartesreporte',
            array('local' => 'idpartereporte', 'foreign' => 'idpartereporte')
        );
    }


    public function ObtenerPartesReporte()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomPartesreporte cr')
            //->where("cr.paraactividad = '1'")
            ->execute();
        return $result->toArray();
    }


}//fin clase 



