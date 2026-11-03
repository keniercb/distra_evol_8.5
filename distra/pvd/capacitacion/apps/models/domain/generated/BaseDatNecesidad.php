<?php 
abstract class BaseDatNecesidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_capacitacion.dat_necesidad');
        $this->hasColumn(
            'iddnecesidad',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_capacitacion.sec_dnecesidad')
        );
        $this->hasColumn('idpersona', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idnecesidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fregistro', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmodoformacion', 'numeric', null, array('notnull' => true, 'primary' => false));
    }
}