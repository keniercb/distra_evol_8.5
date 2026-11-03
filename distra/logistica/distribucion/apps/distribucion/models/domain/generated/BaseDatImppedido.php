<?php

abstract class BaseDatImppedido extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logdistribucion.dat_imppedido');
        $this->hasColumn(
            'idimppedido', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logdistribucion.sec_imppedido')
        );
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => false));
        /*$this->hasColumn('codigoempresa', 'character varying', null, array('notnull' => false, 'primary' => false));*/
        $this->hasColumn('nombrecliente', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('codigoproducto', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcionproducto', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('um', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('clasificacioncontable', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('precio', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importe', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechavencimiento', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('errorfecha', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nro', 'character varying', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
