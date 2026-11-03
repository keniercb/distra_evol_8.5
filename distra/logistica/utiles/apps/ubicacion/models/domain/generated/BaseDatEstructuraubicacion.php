<?php

abstract class BaseDatEstructuraubicacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logubicacion.dat_estructuraubicacion');
        $this->hasColumn(
            'idestructuraubicacion', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logubicacion.sec_datestructuraubicacion')
        );
        $this->hasColumn('descripcion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ordender', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('codigo', 'character varying', 20, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idarea', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nivel', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipoubicacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ordenizq', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idarbol', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('parentpath', 'string', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}


