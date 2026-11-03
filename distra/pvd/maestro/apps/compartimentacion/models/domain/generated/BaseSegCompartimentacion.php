<?php
abstract class BaseSegCompartimentacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.seg_compartimentacion');
        $this->hasColumn(
            'idcompartimentacion',
            'numeric',
            null,
            array ('notnull' => true,'primary' => true, 'sequence' => 'mod_rrhhmaestro.sec_compartimentacion')
        );
        $this->hasColumn('denominacion', 'character varying', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('editable', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('pordefecto', 'numeric', null, array ('notnull' => true,'primary' => false));
    }
}