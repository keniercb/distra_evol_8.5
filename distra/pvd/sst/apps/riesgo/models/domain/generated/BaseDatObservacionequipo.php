<?php 
abstract class BaseDatObservacionequipo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstriesgo.dat_observacionequipo');
        $this->hasColumn(
            'idobservacionequipo',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstriesgo.sec_observacionequipo')
        );
        $this->hasColumn('idequipoaltoriesgo', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('observacion', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fregistro', 'date', array('notnull' => true, 'primary' => false));
    }
}