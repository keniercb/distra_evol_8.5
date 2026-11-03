<?php

/**
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class NomCamporeporte extends BaseNomCamporeporte
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomTiporeporteNomCamporeporte',
            array('local' => 'idcamporeporte', 'foreign' => 'idcamporeporte')
        );
        $this->hasMany(
            'NomVersionreportesNomCamporeporte',
            array('local' => 'idcamporeporte', 'foreign' => 'idcamporeporte')
        );
    }


    public function ObtenerCamposParaActividades()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomCamporeporte cr')
            ->where("cr.paraactividad = '1'")
            ->execute();
        return $result->toArray();
    }


    public function ObtenerCamposParaObjetivos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomCamporeporte cr')
            ->where("cr.paraobjetivo = '1'")
            ->execute();
        return $result->toArray();
    }

    public function ObtenerCamposParaCalendario()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomCamporeporte cr')
            ->where("cr.paracalendario = '1'")
            ->execute();
        return $result->toArray();
    }


}//fin clase 



