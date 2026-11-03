<?php

abstract class BaseTempClienteproveedor extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_importar.temp_clienteproveedor');
        $this->hasColumn(
            'idclienteproveedor', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                'sequence' => 'mod_importar.sec_clienteproveedor')
        );
        $this->hasColumn(
            'iddatosnomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'tipo', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'subcodigoreeup', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'codigoreeup', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'nombre', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'codigonit','character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'correo', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'telefono', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'provincia', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'abreviatura', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'direccion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nombrecontacto', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cicontacto', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'movilcontacto', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'telefonocontacto', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'direccioncontacto', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cargocontacto', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'facultadcontacto', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'numcuentamn', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'titularmn', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'bancomn', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'sucursalmn', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'numcuentacuc', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'titularcuc', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'bancocuc', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'sucursalcuc', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'licbancariacuc', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'iddpa', 'character varying', 19,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idmonedamn', 'character varying', 19,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idmonedacuc', 'character varying', 19,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idbancomn', 'character varying', 19,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idbancocuc', 'character varying', 19,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcuentamn', 'character varying', 19,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcuentacuc', 'character varying', 19,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcontacto', 'character varying', 19,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcliente', 'character varying', 19,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idsucursalmn', 'character varying', 19,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idsucursalcuc', 'character varying', 19,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}


