<?php
abstract class BaseConfPersona extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.conf_firma');
        $this->hasColumn('idfirma', 'numeric', null, array ('notnull' => false,'primary' => true,'sequence' => 'mod_rrhhmaestro.sec_firma'));
        $this->hasColumn('idpersona', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('identidad', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('elabora', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('aprueba', 'numeric', null, array ('notnull' => true,'primary' => false));
    }
}