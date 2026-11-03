<?php
class BaseDatComision extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.dat_comision');
        $this->hasColumn('idcomision', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_rrhhmaestro.sec_comision'));
        $this->hasColumn('denominacion', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', array('notnull' => false, 'primary' => false));
        $this->hasColumn('identidad ', 'numeric', array('notnull' => true, 'primary' => false));
    }
}