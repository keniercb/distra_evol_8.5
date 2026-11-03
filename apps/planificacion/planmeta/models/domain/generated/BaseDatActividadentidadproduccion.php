<?php

abstract class BaseDatActividadentidadproduccion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_actividadentidadproduccion');
        $this->hasColumn(
            'idactividadentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'nivelactividadproduccion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'version', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 1)
        );
    }

    public function Setup()
    {
        parent::setUp();

        $this->hasOne(
            'DatActividadentidad', array('local' => 'idactividadentidad',
                                         'foreign' => 'idactividadentidad')
        );
    }

}


