<?php

abstract class BaseTempPersona extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_importar.temp_persona');
        $this->hasColumn(
            'idpersona', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                'sequence' => 'mod_importar.sec_persona')
        );
        $this->hasColumn(
            'iddatosnomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'nombre', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'sexo', 'character varying', 19,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'apellido', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idsuin', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cuentabancariacuc','character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cuentabancariacup', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'correoelectronico', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'provincia', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'municipio', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'direccion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'colorpiel', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechanacimiento', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'expedientefar', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'segapellido', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'segnombre', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'bancocuc', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'bancocup', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'iddpaprovincia', 'character varying', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'iddpamunicipio', 'character varying', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcolorpiel', 'character varying', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idbancomn', 'character varying', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idbancocuc', 'character varying', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idmodpersona', 'character varying', 19,
            array('notnull' => false, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}


