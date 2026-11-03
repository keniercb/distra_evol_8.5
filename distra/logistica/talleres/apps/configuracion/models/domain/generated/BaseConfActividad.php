<?php

abstract class BaseConfActividad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.conf_actividad');
        $this->hasColumn(
            'idactividad', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_confactividad')
        );
        $this->hasColumn(
            'idindicador', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idpadre', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idarbol', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'varchar', 150, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'codigo', 'varchar', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'usatodasnormas', 'numeric', 1, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'porcentual', 'numeric', 1, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'tiempoplanificado', 'numeric', 25, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'um', 'varchar', 150, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'minimo', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'maximo', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'medida', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'modificado', 'numeric', 1, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'tempario', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

