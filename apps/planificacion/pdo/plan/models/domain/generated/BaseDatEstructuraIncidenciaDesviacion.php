<?php

abstract class BaseDatEstructuraIncidenciaDesviacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName(
            'mod_objetivos.dat_estructura_incidencia_desviacion'
        );
        $this->hasColumn(
            'tipo', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idincidenciadesviacion', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idestructura', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

