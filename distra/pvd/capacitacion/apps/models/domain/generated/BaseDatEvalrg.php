<?php 
abstract class BaseDatEvalrg extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_capacitacion.dat_evalrg');
        $this->hasColumn(
            'idevalrg',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_capacitacion.sec_evalrg')
        );
        $this->hasColumn('idrgindicador', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idvalorescala', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idrgperiodo', 'numeric', array('notnull' => true, 'primary' => false));
    }
}