<?php

abstract class BaseCubMovimiento extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_loganalisis.cub_movimiento');

        $this->hasColumn(
            'idmovimiento', 'numeric', null,
            array(
            'notnull' => true,
            'primary' => true,
            'sequence' => 'mod_loganalisis.sec_movimiento'
            )
        );
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idoperacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtiempo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcliente', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcategoria', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('preciocontable', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nrodoc', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('existenciaactual', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('preciopromedio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importe', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importetotal', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('signo', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmovimientoorigen', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cronologia', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
