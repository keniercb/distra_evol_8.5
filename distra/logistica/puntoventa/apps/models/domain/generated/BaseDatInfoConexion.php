<?php

abstract class BaseDatInfoConexion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_infoconexion');
        $this->hasColumn(
            'idinfoconexion', 'numeric', null,
            array(
                'notnull' => true, 'primary' => true,
                'sequence' => 'mod_logpuntoventa.sec_datinfoconexion'
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
            'nombreconexion', 'character varying', 100,
            array(
                'notnull' => true, 'primary' => false
            )
        );

        $this->hasColumn(
            'codigotienda', 'character varying', 100,
            array(
                'notnull' => true, 'primary' => false
            )
        );

        $this->hasColumn(
            'consumerkey', 'character varying', 150,
            array(
                'notnull' => true, 'primary' => false
            )
        );

        $this->hasColumn(
            'consumersecret', 'character varying', 150,
            array(
                'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'modocatalogo', 'numeric', null,
            array(
                'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'usuario_api', 'character varying', 100,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'password_api', 'character varying', 100,
            array(
                'notnull' => false, 'primary' => false
            )
        );

    }

    public function Setup()
    {
        parent::setUp();
    }
}
