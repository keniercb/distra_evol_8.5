<?php 
abstract class BaseConfGradopeligrosidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstriesgo.conf_gradopeligrosidad');
        $this->hasColumn(
            'idgradopeligrosidad',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstriesgo.sec_gradopeligrosidad')
        );
        $this->hasColumn('idexpresionmatematica', 'numeric', array('notnull' => true, 'primary' => false));
    }
}