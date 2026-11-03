<?php

abstract class BaseCubExistencia extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_loganalisis.cub_existencia');
        $this->hasColumn(
            'idexistencia', 'numeric', null,
            array(
            'notnull' => true,
            'primary' => false,
            'sequence' => 'mod_loganalisis.sec_existencia'
            )
        );
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtiempo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcategoria', 'numeric', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('precio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('disponible', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importe', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

