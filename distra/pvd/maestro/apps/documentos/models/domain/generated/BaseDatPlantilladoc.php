<?php
abstract class BaseDatPlantilladoc extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.dat_plantilladoc');
        $this->hasColumn(
            'idplantilladoc',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_rrhhmaestro.sec_plantilladoc')
        );
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('contenido', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('identidad', 'numeric', null, array('notnull' => false, 'primary' => false));
    }
}