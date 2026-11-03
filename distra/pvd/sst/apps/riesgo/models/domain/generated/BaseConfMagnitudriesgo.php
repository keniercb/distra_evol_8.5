<?php 
abstract class BaseConfMagnitudriesgo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstriesgo.conf_magnitudriesgo');
        $this->hasColumn(
            'idmagnitudriesgo',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstriesgo.sec_magnitudriesgo')
        );
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idexpresionmatematica', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('orden', 'numeric', array('notnull' => true, 'primary' => false));
    }
}