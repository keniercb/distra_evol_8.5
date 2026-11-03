<?php

abstract class BaseSegRestricclaveacceso extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('seg_restricclaveacceso');
        $this->hasColumn(
            'idrestricclaveacceso', 'decimal', null, array(
            'ntype' => 'numeric',
            'alltypes' =>
            array(
                0 => 'decimal',
            ),
            'notnull' => true,
            'primary' => true,
            'sequence' => 'sec_restricclaveacceso',
            )
        );

        $this->hasColumn(
            'diascaducidad', 'integer', 4, array(
            'ntype' => 'int4',
            'alltypes' =>
            array(
                0 => 'integer',
            ),
            'unsigned' => false,
            'notnull' => true,
            'primary' => false,
            )
        );

        $this->hasColumn(
            'numerica', 'boolean', 1, array(
            'ntype' => 'bool',
            'alltypes' =>
            array(
                0 => 'boolean',
            ),
            'notnull' => false,
            'default' => false,
            'primary' => false,
            )
        );

        $this->hasColumn(
            'alfabetica', 'boolean', 1, array(
            'ntype' => 'bool',
            'alltypes' =>
            array(
                0 => 'boolean',
            ),
            'notnull' => false,
            'default' => false,
            'primary' => false,
            )
        );

        $this->hasColumn(
            'signo', 'boolean', 1, array(
            'ntype' => 'bool',
            'alltypes' =>
            array(
                0 => 'boolean',
            ),
            'notnull' => false,
            'default' => false,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'minimocaracter', 'integer', 4, array(
            'ntype' => 'int4',
            'alltypes' =>
            array(
                0 => 'integer',
            ),
            'unsigned' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'historico', 'integer', 4, array(
            'ntype' => 'int4',
            'alltypes' =>
            array(
                0 => 'integer',
            ),
            'unsigned' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'mayuscula', 'boolean', 1, array(
            'ntype' => 'bool',
            'alltypes' =>
            array(
                0 => 'boolean',
            ),
            'notnull' => false,
            'default' => false,
            'primary' => false,
            )
        );
    }

}
