<?php

abstract class BaseDatReclamopedido extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logdistribucion.dat_reclamopedido');
        $this->hasColumn(
            'idreclamopedido', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_logdistribucion.sec_datreclamopedido')
        );
        $this->hasColumn(
            'idpedido', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtiporeclamoentidad', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechasugerida', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}

