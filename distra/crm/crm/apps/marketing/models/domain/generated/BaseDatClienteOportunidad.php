<?php

abstract class BaseDatClienteOportunidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmmarketing.dat_clienteoportunidad');
        $this->hasColumn('idclienteoportunidad', 'numeric', 19,array('notnull'  => true, 'primary' => true,'sequence' => 'mod_crmmarketing.sec_clienteoportunidad'));
        $this->hasColumn('idclientesproveedores', 'numeric', 19,array('notnull'  => true, 'primary' => false));
        $this->hasColumn('idoportunidad', 'numeric', 19,array('notnull'  => true, 'primary' => false));
    }

}
