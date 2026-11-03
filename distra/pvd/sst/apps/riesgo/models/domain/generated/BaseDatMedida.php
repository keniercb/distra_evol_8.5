<?php 
abstract class BaseDatMedida extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstriesgo.dat_medida');
        $this->hasColumn(
            'idmedida',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstriesgo.sec_medida')
        );
        $this->hasColumn('idriesgo', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('medida', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('responsable', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fcumplimiento', 'date', array('notnull' => false, 'primary' => false));
    }
}