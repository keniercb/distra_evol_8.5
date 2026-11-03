<?php

abstract class BaseDatActividadOrdenPersonas extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_ordenactividadpersonas');
        $this->hasColumn(
            'idordenactividadpersona', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_datactividadpersonas')
        );
        $this->hasColumn('idordenactividad', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idresponsable', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('coeficiente', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('dimension', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importecobrar', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('observacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estadoeliminado', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('minimo', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('maximo', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tipo', 'numeric', 1, array('notnull' => false, 'primary' => false));
//        $this->hasColumn('aprobado', 'numeric', 1, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }


}

//fin clase 

