<?php

  abstract class BaseDatEspacioporpersona extends Doctrine_Record
  {
    public function setTableDefinition()
    {
      $this->setTableName('mod_evaluaciones.dat_espacioporpersona');
      $this->hasColumn(
        'idespaciopersona', 'numeric', null,
        array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_espacioporpersona')
      );
      $this->hasColumn('espacio', 'character varying', 500, array('notnull' => true, 'primary' => false));
      $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
    
    }

    public function Setup()
    {
      parent::setUp();
    }
  }//fin clase