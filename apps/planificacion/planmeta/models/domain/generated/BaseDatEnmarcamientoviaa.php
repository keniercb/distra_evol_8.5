<?php

abstract class BaseDatEnmarcamientoviaa extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_enmarcamientoviaa');
        $this->hasColumn(
            'idenmarcamientoviaa', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_enmarcamientoviaa')
        );
        $this->hasColumn(
            'idenmarcamiento', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idviaadquisicion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'enmarcamientodisponiblevia', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'enmarcamientovia', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'DatEnmarcamiento',
            array('local' => 'idenmarcamiento', 'foreign' => 'idenmarcamiento')
        );
        $this->hasOne(
            'NomViaadquisicion', array('local'   => 'idviaadquisicion',
                                       'foreign' => 'idviaadquisicion')
        );
    }

}

