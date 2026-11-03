<?php

abstract class BaseDatClienteActividad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmmarketing.dat_clienteactividad');
        $this->hasColumn('idclienteactividad', 'numeric', 19,array('notnull'  => true, 'primary' => true,'sequence' => 'mod_crmmarketing.sec_clienteactividad'));
        $this->hasColumn('idclientesproveedores', 'numeric', 19,array('notnull'  => true, 'primary' => false));
        $this->hasColumn('idactividad', 'numeric', 19,array('notnull'  => true, 'primary' => false));
    }

}
