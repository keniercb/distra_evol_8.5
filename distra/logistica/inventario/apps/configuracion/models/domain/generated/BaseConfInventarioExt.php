<?php

abstract class BaseConfInventarioExt extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.conf_inventarioext'); 
        $this->hasColumn('idestructuracomun', 'numeric', null,array('notnull' => true, 'primary' => true));
        $this->hasColumn('minimo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fondofijo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('reserva', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('normabast', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('minarea', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ptoreposicion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('diaconsignado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('diaminvencido', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('diamintarjeta', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('diaproxvencer', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('lotevencido', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
