<?php

/**
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class NomTiporeporte extends BaseNomTiporeporte
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomTiporeporteNomCamporeporte',
            array('local' => 'idtiporeporte', 'foreign' => 'idtiporeporte')
        );
        $this->hasMany(
            'NomVersionreportes',
            array('local' => 'idtiporeporte', 'foreign' => 'idtiporeporte')
        );
    }

    public function ObtenerTiposDeReportesExistentes()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomTiporeporte')
                        ->where('orden is not NULL')->orderby('orden')
            ->execute();
        return $result->toArray();
    }


}//fin clase 



