<?php

abstract class BaseDatEntidadSegUsuarioSegRol extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_seguridad.dat_entidadusuariorol');
        $this->hasColumn(
            'idusuario', 'decimal', null, array(
                'ntype' => 'numeric',
                'alltypes' =>
                array(
                    0 => 'decimal',
                ),
                'notnull' => true,
                'primary' => true,
            )
        );

        $this->hasColumn(
            'identidad', 'decimal', null, array(
                'ntype' => 'numeric',
                'alltypes' =>
                array(
                    0 => 'decimal',
                ),
                'notnull' => true,
                'primary' => false,
            )
        );
        $this->hasColumn(
            'idrol', 'decimal', null, array(
                'ntype' => 'numeric',
                'alltypes' =>
                array(
                    0 => 'decimal',
                ),
                'notnull' => true,
                'primary' => false,
            )
        );
    }

}