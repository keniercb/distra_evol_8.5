<?php

abstract class BaseCfgParametrosGenerales extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.conf_parametrosgenerales');
        $this->hasColumn(
            'idestructura', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'depreciacion', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'transporte', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'buque', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'generacomprobante', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'enuso', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'explotacionadquisicion', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fecha', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'maxunidarrastporremolcadoras', 'numeric', null, array('notnull' => false, 'primary' => false)
        );

        $this->hasColumn(
            'autogenerado', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'prefijo', 'character varying', 8, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'numinicial', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'ultimoinventario', 'character varying', 25, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'contabilidad', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'inventario', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'persona', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'talleres', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'firmadigital', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'usarcompletamiento', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
