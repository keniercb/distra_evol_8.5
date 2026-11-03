<?php

abstract class BaseDatGrupoIncidenciaDesviacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.dat_grupo_incidencia_desviacion');
        $this->hasColumn(
            'tipo', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idincidenciadesviacion', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idgrupo', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

