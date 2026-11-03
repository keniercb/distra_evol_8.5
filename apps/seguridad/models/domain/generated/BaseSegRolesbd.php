<?php

abstract class BaseSegRolesbd extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('seg_rolbd');
        $this->hasColumn(
            'idrolesbd', 'decimal', null, array(
            'ntype' => 'numeric',
            'alltypes' =>
            array(
                0 => 'decimal',
            ),
            'notnull' => true,
            'primary' => true,
            'sequence' => 'sec_rolbd',
            )
        );

        $this->hasColumn(
            'idservidor', 'decimal', null, array(
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
            'idgestor', 'decimal', null, array(
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
            'nombrerol', 'string', null, array(
            'ntype' => 'varchar',
            'alltypes' =>
            array(
                0 => 'string',
            ),
            'fixed' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'passw', 'string', null, array(
            'ntype' => 'varchar',
            'alltypes' =>
            array(
                0 => 'string',
            ),
            'fixed' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
    }

}
