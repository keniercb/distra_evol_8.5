<?php

abstract class BaseDatEnmarcamiento extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_enmarcamiento');
        $this->hasColumn(
            'idenmarcamiento', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_enmarcamiento')
        );
        $this->hasColumn(
            'identidaddatosnomencladorod', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'identidaddatosnomencladorcb', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'identidaddatosnomencladorodpadre', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idenmarcamientopadre', 'numeric', null,
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
            array('local'   => 'identidaddatosnomencladorcb',
                  'foreign' => 'identidaddatosnomenclador')
        );
        $this->hasOne(
            'DatEntidaddatosnomenclador',
            array('local'   => 'identidaddatosnomencladorod',
                  'foreign' => 'identidaddatosnomenclador')
        );
    }

}

