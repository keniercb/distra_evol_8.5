<?php 
abstract class BaseDatRconsecuencia extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstriesgo.dat_rconsecuencia');
        $this->hasColumn(
            'idrconsecuencia',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstriesgo.sec_rconsecuencia')
        );
        $this->hasColumn('idriesgo', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idconsecuencia', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fregistro', 'date', array('notnull' => false, 'primary' => false));
        $this->hasColumn('observaciones', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('principal', 'numeric', array('notnull' => true, 'primary' => false));
    }
}