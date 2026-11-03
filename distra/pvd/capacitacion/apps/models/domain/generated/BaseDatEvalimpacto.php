<?php 
abstract class BaseDatEvalimpacto extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_capacitacion.dat_evalimpacto');
        $this->hasColumn(
            'idevalimpacto',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_capacitacion.sec_evalimpacto')
        );
        $this->hasColumn('idaccionparticipante', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idperiodo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idvalorescala', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fecha', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('complemento', 'numeric', null, array('notnull' => false, 'primary' => false));
    }
}