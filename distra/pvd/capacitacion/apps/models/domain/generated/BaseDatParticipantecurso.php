<?php
abstract class BaseDatParticipantecurso extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_capacitacion.dat_participantecurso');
        $this->hasColumn(
            'idparticipantecurso',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_capacitacion.sec_participantecurso')
        );
        $this->hasColumn('idaccionparticipante', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idaccioncurso', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('resultado', 'character varying', null, array('notnull' => false, 'primary' => false));
    }
}