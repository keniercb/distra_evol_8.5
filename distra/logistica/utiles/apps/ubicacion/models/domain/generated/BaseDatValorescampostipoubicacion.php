<?php

abstract class BaseDatValorescampostipoubicacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logubicacion.dat_valorescampostipoubicacion');
        $this->hasColumn('idestructuraubicacion', 'numeric', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('idunidadmedida', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('largo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ancho', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('alto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('capacidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('peso', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

