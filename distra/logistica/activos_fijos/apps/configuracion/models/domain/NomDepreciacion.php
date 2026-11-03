<?php

/**
 *
 */
class NomDepreciacion extends BaseNomDepreciacion
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomActividadMedio', array('local' => 'iddepreciacion', 'foreign' => 'iddepreciacion'));
    }

    /**
     *
     */
    public function getMetodosDepreciacion()
    {
        $query = Doctrine_Query::create();

        return $query->select('iddepreciacion, denominacion as descripcion')
                ->from('NomDepreciacion g')
                ->fetchArray();
    }

}
