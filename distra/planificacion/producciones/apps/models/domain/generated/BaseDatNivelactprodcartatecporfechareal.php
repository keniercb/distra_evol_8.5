<?php

abstract class BaseDatNivelactprodcartatecporfechareal extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_spouam.dat_nivelactprodcartatecporfechareal');
        $this->hasColumn(
            'fechareal', 'timestamp without time zone', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fin', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'idnivelactprodcartatecporfecha', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idnivelactprodcartatecporfechareal', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_spouam.sec_nivelactprodcartatecporfechareal')
        );
        $this->hasColumn(
            'nivelactividadreal', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'DatNivelactprodcartatecporfecha',
            array('local'   => 'idnivelactprodcartatecporfecha',
                  'foreign' => 'idnivelactprodcartatecporfecha')
        );
    }

}


