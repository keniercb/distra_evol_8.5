<?php
abstract class BaseConfRangoedades extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.conf_rangoedades');
        $this->hasColumn('idrangoedades', 'numeric', null, array ('notnull' => false,'primary' => true,'sequence' => 'mod_rrhhmaestro.sec_confrangoedades'));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructura', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('valorinicial', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('valorfinal', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('orden', 'numeric', null, array ('notnull' => false,'primary' => false));
    }
}