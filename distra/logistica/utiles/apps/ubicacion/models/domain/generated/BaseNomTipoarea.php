<?php

abstract class BaseNomTipoarea extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logubicacion.nom_tipoarea');
        $this->hasColumn(
            'idnomtipoarea', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logubicacion.sec_nomtipoarea')
        );
        $this->hasColumn('codigo', 'character varying', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'character varying', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('productounico', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tipooperacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

