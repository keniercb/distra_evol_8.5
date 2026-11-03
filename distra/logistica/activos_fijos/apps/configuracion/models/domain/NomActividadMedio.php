<?php

/**
 *
 */
class NomActividadMedio extends BaseNomMedioActividad
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatActividadMedioEntidad', array('local' => 'idactividad', 'foreign' => 'idactividad'));
        $this->hasOne('NomDepreciacion', array('local' => 'iddepreciacion', 'foreign' => 'iddepreciacion'));
        $this->hasOne('DatRegnumericoActivo', array('local' => 'idactividad', 'foreign' => 'idactividad'));
    }

    /**
     *
     */
    public function getActividades()
    {
        $query = Doctrine_Query::create();
        $query->from('NomActividadMedio act');
        $query->innerJoin("act.DatActividadMedioEntidad dam");
        return $query->fetchArray();
    }

}
