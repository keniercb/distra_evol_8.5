<?php
abstract class BaseDatEstructuracontrol extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.dat_estructuracontrol');
        $this->hasColumn(
            'idestructuracontrol',
            'numeric',
            null,
            array ('notnull' => true,'primary' => true, 'sequence' => 'mod_rrhhmaestro.sec_estructuracontrol')
        );
        $this->hasColumn('denominacion', 'character varying', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('identidad', 'numeric', null, array ('notnull' => true,'primary' => false));
    }
}