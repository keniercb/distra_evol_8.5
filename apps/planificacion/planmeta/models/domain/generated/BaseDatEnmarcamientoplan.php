<?php

abstract class BaseDatEnmarcamientoplan extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_enmarcamientoplan');
        $this->hasColumn(
            'idenmarcamientoplan', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_enmarcamientoplan')
        );
        $this->hasColumn(
            'identidaddatosnomencladorod', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idmodelo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'identidaddatosnomencladorodpadre', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'enmarcamiento', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'enmarcamientodisponible', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idejercicio', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'DatEntidaddatosnomenclador',
            array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
        $this->hasOne(
            'DatEntidaddatosnomenclador',
            array('local'   => 'identidaddatosnomencladorod',
                  'foreign' => 'identidaddatosnomenclador')
        );
    }

}

