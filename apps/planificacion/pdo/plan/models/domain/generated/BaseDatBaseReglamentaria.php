<?php

abstract class BaseDatBaseReglamentaria extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.dat_basereglamentaria');

        $this->hasColumn(
          'idbase', 'numeric', null,
          array('notnull'  => false, 'primary' => true,
                'sequence' => 'mod_objetivos.sec_dat_basereglamentaria')
        );

        $this->hasColumn(
          'denominacion', 'character varying', null,
          array('notnull' => false, 'primary' => false)
        );

        $this->hasColumn(
          'nombrearchivo', 'character varying', null,
          array('notnull' => false, 'primary' => false)
        );

        $this->hasColumn(
          'fechacreacion', 'TIMESTAMP', null,
          array('notnull' => true, 'primary' => false)
        );

        $this->hasColumn(
              'idautor', 'numeric', null,
              array('notnull' => true, 'primary' => false)
        );

    }

    public function Setup()
    {
      parent::setUp();
    }


}

