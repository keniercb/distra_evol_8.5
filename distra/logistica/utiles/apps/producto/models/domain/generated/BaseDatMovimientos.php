<?php

abstract class BaseDatMovimientos extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_movimiento');
        $this->hasColumn(
            'idmovimiento', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logistica.sec_datmovimiento')
        );
        $this->hasColumn('idmoneda', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('recargodescuento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('recargodescuentoalt', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tienedualidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('preciocontable', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importecontable', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cronologia', 'numeric', 0, array('notnull' => false, 'primary' => false));
        $this->hasColumn('existenciaactual', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('preciopromedio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importetotal', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importetotalalt', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('signo', 'character varying', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idunidadmedida', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('factorconversion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn ('precioalternativo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn ('preciopromalt', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn ('importealternativo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn ('diferencia', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn ('idelementogasto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn ('idelementogastoalt', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn ('existenciaalmacen', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn ('idclasificacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn ('numerochip', 'character varying', 20, array('notnull' => false, 'primary' => false));
        $this->hasColumn ('fecha', 'date', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//
