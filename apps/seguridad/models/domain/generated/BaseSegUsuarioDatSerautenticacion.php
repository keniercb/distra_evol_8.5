<?php

abstract class BaseSegUsuarioDatSerautenticacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('seg_usuarioserautenticacion');
        $this->hasColumn(
            'idservidor', 'decimal', null, array(
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
            'idusuario', 'decimal', null, array(
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
