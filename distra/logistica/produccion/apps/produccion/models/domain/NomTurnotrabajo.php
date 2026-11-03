<?php

class NomTurnotrabajo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_regimentrabajo.nom_turnotrabajo');
        $this->hasColumn('idturnotrabajo', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_turnotrabajo'));
        $this->hasColumn('denominacion', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('horainicio', 'time', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('horafin', 'time', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('horarioalmuerzo', 'time', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('tiempodescanso', 'numeric', null, array ('notnull' => true,'primary' => false));
    }

    public function setUp()
    {
       parent::setUp();
    }
}