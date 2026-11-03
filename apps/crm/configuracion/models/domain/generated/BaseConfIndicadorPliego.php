<?php

abstract class BaseConfIndicadorPliego extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmadministracion.conf_indicadorpliego');
        $this->hasColumn(
            'idindicadorpliego', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_crmadministracion.sec_indicadorpliego')
        );
        $this->hasColumn('nombre', 'string', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'string', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('calcularrelevancia', 'int', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('atributo', 'string', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nombrerelevancia', 'string', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('mostrargrafica', 'int', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('mostrargrid', 'int', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('configgrafica', 'string', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('configgrid', 'string', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idusuario', 'int', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'int', null, array('notnull' => true, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
