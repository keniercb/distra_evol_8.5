<?php

abstract class BaseDatTiporeclamoEntidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logdistribucion.dat_tiporeclamoentidad');
        $this->hasColumn(
            'idtiporeclamoentidad', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_logdistribucion.sec_tiporeclamoentidad')
        );
        $this->hasColumn(
            'idtiporeclamo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}

