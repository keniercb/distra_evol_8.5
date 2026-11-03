<?php

abstract class BaseDatInfoConexioncr extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_infoconexioncr');
        $this->hasColumn(
            'idinfoconexioncr', 'numeric', null,
            array(
                'notnull' => true, 'primary' => true,
                'sequence' => 'mod_logpuntoventa.sec_datinfoconexioncr'
            )
        );
        $this->hasColumn(
            'tipo', 'character varying', 10,
            array(
                'notnull' => true, 'primary' => false
            )
        );
		
        $this->hasColumn(
            'url', 'character varying', 150,
            array(
                'notnull' => true, 'primary' => false
            )
        );
		
        $this->hasColumn(
            'clave', 'character varying', 150,
            array(
                'notnull' => true, 'primary' => false
            )
        );

        $this->hasColumn(
            'keypublic', 'character varying', 150,
            array(
                'notnull' => true, 'primary' => false
            )
        );

        $this->hasColumn(
            'keysecret', 'character varying', 150,
            array(
                'notnull' => true, 'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
