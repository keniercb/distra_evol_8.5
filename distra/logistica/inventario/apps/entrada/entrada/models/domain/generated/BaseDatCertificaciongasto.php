<?php

abstract class BaseDatCertificaciongasto extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_cetificaciongastos');
        $this->hasColumn(
            'idcertificaciongasto', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_loginventario.sec_certificaciongastos')
        );
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcuenta', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importe', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuarioregistra', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuariocertifica', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuarioaprueba', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
