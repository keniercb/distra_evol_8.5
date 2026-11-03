<?php

abstract class BaseDatSistemaSegRolDatFuncionalidadDatAccion 
extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_seguridad.dat_sistemarolfuncionalidadaccion');
        $this->hasColumn(
            'idaccion', 'decimal', null, array(
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
            'idfuncionalidad', 'decimal', null, array(
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
        $this->hasColumn(
            'idsistema', 'decimal', null, array(
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
            'idrecurso', 'decimal', null, array(
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
