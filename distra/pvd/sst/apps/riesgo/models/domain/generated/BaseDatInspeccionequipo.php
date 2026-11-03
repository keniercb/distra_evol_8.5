<?php 
abstract class BaseDatInspeccionequipo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstriesgo.dat_inspeccionequipo');
        $this->hasColumn(
            'idinspeccionequipo',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstriesgo.sec_inspeccionequipo')
        );
        $this->hasColumn('idequipoaltoriesgo', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtipoinspeccion', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idresultadoinspeccion', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fplan', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('finspeccion', 'date', array('notnull' => true, 'primary' => false));
    }
}