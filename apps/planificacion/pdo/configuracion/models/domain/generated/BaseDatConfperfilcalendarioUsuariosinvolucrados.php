<?php

abstract class BaseDatConfperfilcalendarioUsuariosinvolucrados
    extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName(
            'mod_objetivos.dat_confperfilcalendario_usuariosinvolucrados'
        );
        $this->hasColumn(
            'idinvolucrado', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idtipo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idconfiguracionperfil', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

