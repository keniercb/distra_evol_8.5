<?php

abstract class BaseNomTipoanteproyecto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_tipoanteproyecto');
        $this->hasColumn(
            'color', 'character varying', 20,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idtipoanteproyecto', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_tipoanteproyecto')
        );
        $this->hasColumn(
            'uritipoanteproyecto', 'character varying', 100,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->HasMany(
            'DatAnteproyecto', array('local'   => 'idtipoanteproyecto',
                                     'foreign' => 'idtipoanteproyecto')
        );
    }

}


