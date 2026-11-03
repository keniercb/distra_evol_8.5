<?php

class DatValeProduccion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logproduccion.dat_valeproduccion');
        $this->hasColumn('idvaleproduccion', 'numeric', 19, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idordenproduccion', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idturnotrabajo', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('identrega', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        $this->hasOne('DatOrdenProduccion', array('local' => 'idordenproduccion', 'foreign' => 'idordenproduccion'));
        $this->hasMany('DatManoObra', array('local' => 'idvaleproduccion', 'foreign' => 'idvaleproduccion'));
        $this->hasMany('DatValeEquipo', array('local' => 'idvaleproduccion', 'foreign' => 'idvaleproduccion'));
        $this->hasMany('DatValeMateriaPrima', array('local' => 'idvaleproduccion', 'foreign' => 'idvaleproduccion'));
        $this->hasMany('DatValeProductos', array('local' => 'idvaleproduccion', 'foreign' => 'idvaleproduccion'));
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'idvaleproduccion'));
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'identrega'));
    }
}