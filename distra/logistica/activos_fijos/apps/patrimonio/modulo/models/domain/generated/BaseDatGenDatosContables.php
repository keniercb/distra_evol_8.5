<?php

class BaseDatGenDatosContables extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.dat_gendatoscontcamp');
        $this->hasColumn('idregnumerico', 'numeric', 19, array('notnull' => true, 'primary' => true));
        $this->hasColumn('analisis', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cuenta', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('codigo', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestatustecnico', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', 19, array('notnull' => false, 'primary' => false));
     
    }
}
