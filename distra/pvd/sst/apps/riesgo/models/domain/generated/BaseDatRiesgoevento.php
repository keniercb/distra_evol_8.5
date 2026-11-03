<?php 
abstract class BaseDatRiesgoevento extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstriesgo.dat_riesgoevento');
        $this->hasColumn(
            'idriesgoevento',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstriesgo.sec_riesgoevento')
        );
        $this->hasColumn('idriesgo', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idevento', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fregistro', 'date', array('notnull' => false, 'primary' => false));
        $this->hasColumn('observaciones', 'character varying', null, array('notnull' => false, 'primary' => false));
    }
}