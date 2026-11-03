<?php
abstract class BaseDatPersonaentidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_persona.dat_personaentidad');
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false,'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true,'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true,'primary' => false));
        $this->hasColumn('identidad', 'numeric', null, array('notnull' => true,'primary' => false));
        $this->hasColumn('idprocedenciasocial', 'numeric', null, array('notnull' => false,'primary' => false));
        $this->hasColumn(
            'idpersonaentidad',
            'numeric',
            null,
            array('notnull' => true,'primary' => true, 'sequence' => 'mod_persona.sec_personaentidad')
        );
    }
}