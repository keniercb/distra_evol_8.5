<?php

abstract class BaseConfPerfilcalendario extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.conf_perfilcalendario');
        $this->hasColumn(
            'idconfiguracionperfil', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idvistaxdefecto', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idtipoactividad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcategoriaactividad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }


}

