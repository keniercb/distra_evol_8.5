<?php

abstract class BaseNomTurnotrabajo extends Doctrine_Record
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
        $this->hasColumn('toleranciaentrada', 'time', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('toleranciasalida', 'time', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('horarioalmuerzo', 'time', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('tiempodescanso', 'time', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('horaentradaps', 'time', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('horasalidaps', 'time', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('horaentradass', 'time', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('horasalidass', 'time', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('otrodia', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('horas', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idestructura', 'numeric', 19, array ('notnull' => false,'primary' => false));
    }


}

