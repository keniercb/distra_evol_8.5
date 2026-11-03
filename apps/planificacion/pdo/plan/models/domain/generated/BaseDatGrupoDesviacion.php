<?php

abstract class BaseDatGrupoDesviacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.dat_grupo_desviacion');
        $this->hasColumn(
            'iddesviacion', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idgrupo', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

