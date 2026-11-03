<?php

abstract class BaseDatDesglosecontroldivisa extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_desglosecontroldivisa');
        $this->hasColumn(
            'iddesglosecontroldivisa', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_desglosecontroldivisa')
        );
        $this->hasColumn(
            'idcontroldivisa', 'numeric', null,
            array('notnull'  => true, 'primary' => false)
        );
          $this->hasColumn(
            'identidad', 'numeric', null,
            array('notnull'  => true, 'primary' => false)
        );
        $this->hasColumn(
            'importeliquido', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'importecredito', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
      
    }

    public function Setup()
    {
        parent::setUp();

       
        $this->hasOne(
            'NomControldivisa',
            array('local' => 'idcontroldivisa', 'foreign' => 'idcontroldivisa')
        );
    }

}


