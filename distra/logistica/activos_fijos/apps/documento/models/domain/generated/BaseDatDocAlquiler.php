<?php

/**
 *
 */
class BaseDatDocAlquiler extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_docalquiler');
        $this->hasColumn('iddocalquiler', 'numeric', null, array('notnull' => true, 'primary' => true));
//        $this->hasColumn('direccion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcliente', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nrocontrato', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('direccion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false)); 
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false)); 
        /*  $this->hasColumn('fechainicio', 'date', null, array('notnull' => true, 'primary' => false));
          $this->hasColumn('fechafin', 'date', null, array('notnull' => true, 'primary' => false)); */
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
