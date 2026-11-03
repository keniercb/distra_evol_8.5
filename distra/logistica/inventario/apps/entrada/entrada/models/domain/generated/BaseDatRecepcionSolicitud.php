<?php

abstract class BaseDatRecepcionSolicitud extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_recepcionsolicitud');
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idsolicitudpadre', 'numeric', null, array('notnull' => false, 'primary' => false));

    }

    public function Setup()
    {
        parent::setUp();
    }

}
