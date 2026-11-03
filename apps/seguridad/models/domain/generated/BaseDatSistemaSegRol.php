<?php

abstract class BaseDatSistemaSegRol extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_seguridad.dat_sistemarol');
        $this->hasColumn(
            'idrol', 'decimal', null, array(
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
            'idsistema', 'decimal', null, array(
            'ntype' => 'numeric',
            'alltypes' =>
            array(
                0 => 'decimal',
            ),
            'notnull' => true,
            'primary' => false,
            'sequence' => 'sec_sistema',
            )
        );
    }

}
