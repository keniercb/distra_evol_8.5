<?php

class DatActividadmodelo extends BaseDatActividadmodelo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomActividad',
            array('local' => 'idactividad', 'foreign' => 'idactividad')
        );
        $this->hasOne(
            'DatModelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
    }

    public function getModeloActividad($idactividad)
    {
        $query = Doctrine_Query::create();
        return $query
            ->from('DatActividadmodelo am')
            ->where('am.idactividad = ?', $idactividad)->execute();
    }

    public function getModelo($idmodelo)
    {
        $query = Doctrine_Query::create();
        return $query
            ->from('DatModelo m')->where('am.idmodelo = ?', $idmodelo)->execute();
    }

}