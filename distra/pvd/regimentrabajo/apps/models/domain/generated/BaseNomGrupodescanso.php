<?php

abstract class BaseNomGrupodescanso extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_regimentrabajo.nom_grupodescanso');
        $this->hasColumn('idregimentrabajo', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idgrupodescanso', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_grupodescanso'));
        $this->hasColumn('idestructura', 'numeric', 19, array ('notnull' => false,'primary' => false));
        $this->hasColumn('predeterminado', 'numeric', 1, array ('notnull' => true,'primary' => false));
    }


}

