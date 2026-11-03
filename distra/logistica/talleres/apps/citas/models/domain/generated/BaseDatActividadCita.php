<?php

abstract class BaseDatActividadCita extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_actividadcita');
        $this->hasColumn(
            'idactividadcita', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_actividadcita')
        );
        $this->hasColumn('idindicador', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('duracion', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcita', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('precioventa', 'numeric', 25, array('notnull' => true, 'primary' => false));
        $this->hasColumn('importe', 'numeric', 25, array('notnull' => true, 'primary' => false));
        $this->hasColumn('precioventaalternativo', 'numeric', 25, array('notnull' => true, 'primary' => false));
        $this->hasColumn('importealternativo', 'numeric', 25, array('notnull' => true, 'primary' => false));
        $this->hasColumn('codigo', 'character varying', 25, array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacion', 'varchar', null, array('notnull' => false, 'primary' => false));

    }

    public function Setup()
    {
        parent::setUp();
    }


}

//fin clase 

