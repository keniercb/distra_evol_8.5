<?php

abstract class BaseDatSistemaSegRolDatFuncionalidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_seguridad.dat_sistemarolfuncionalidad');
        $this->hasColumn(
            'idfuncionalidad', 'decimal', null, array(
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
