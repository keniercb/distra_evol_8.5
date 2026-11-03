<?php

abstract class BaseDatUsuarioIncidenciaDesviacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.dat_usuario_incidencia_desviacion');
        $this->hasColumn(
            'tipo', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idincidenciadesviacion', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idusuario', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

