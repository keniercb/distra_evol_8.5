<?php

abstract class BaseDimTiempo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_loganalisis.dim_tiempo');

        $this->hasColumn(
            'idtiempo', 'numeric', null, array(
            'notnull' => false,
            'primary' => true
            )
        );
        $this->hasColumn(
            'mes', 'character varying', 255,
            array(
            'notnull' => false,
            'primary' => false
            )
        );
        $this->hasColumn(
            'trimestre', 'character varying', 255,
            array(
            'notnull' => false,
            'primary' => false
            )
        );
        $this->hasColumn(
            'ano', 'numeric', null, array(
            'notnull' => false,
            'primary' => false
            )
        );
        $this->hasColumn(
            'num_dia', 'numeric', null, array(
            'notnull' => false,
            'primary' => false
            )
        );
        $this->hasColumn(
            'num_dia', 'numeric', null, array(
            'notnull' => false,
            'primary' => false
            )
        );
        $this->hasColumn(
            'num_mes', 'numeric', null, array(
            'notnull' => false,
            'primary' => false
            )
        );
        $this->hasColumn(
            'num_trimestre', 'numeric', null,
            array(
            'notnull' => false,
            'primary' => false
            )
        );
        $this->hasColumn(
            'fecha', 'date', null, array(
            'notnull' => false,
            'primary' => false
            )
        );
        $this->hasColumn(
            'dia', 'character varying', 50,
            array(
            'notnull' => false,
            'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
