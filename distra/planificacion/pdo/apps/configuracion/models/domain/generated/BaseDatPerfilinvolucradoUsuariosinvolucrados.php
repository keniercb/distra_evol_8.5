<?php

abstract class BaseDatPerfilinvolucradoUsuariosinvolucrados
    extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName(
            'mod_objetivos.dat_perfilinvolucrado_usuariosinvolucrados'
        );
        $this->hasColumn(
            'idtipoinvolucrado', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idtipo', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idinvolucrado', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idconfiguracionperfil', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idtipoelemento', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

