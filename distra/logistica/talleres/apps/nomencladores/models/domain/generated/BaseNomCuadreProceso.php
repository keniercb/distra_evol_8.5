<?php

abstract class BaseNomCuadreProceso extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.nom_cuadreproceso');
        $this->hasColumn(
            'idcuadreproceso', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_nomcuadreproceso')
        );
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcuenta', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cuenta', 'character varying', null, array('notnull' => false, 'primary' => false));

    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

