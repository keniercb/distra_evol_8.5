<?php

abstract class BaseConfPerfilcargasxdefectoinvolucrado extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName(
            'mod_objetivos.conf_perfilcargasxdefectoinvolucrado'
        );
        $this->hasColumn(
            'idconfiguracionperfil', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'actual', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipoelemento', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );

    }


}

