<?php

class DatCategoriaPrecioFactura extends BaseDatCategoriaPrecioFactura
{
    private $logisticaDoctrine;

    public function setUp()
    {
        parent::setUp();
        $this->logisticaDoctrine = LogisticaDoctrineHelper::__init();
        $this->hasOne(
            'DatDocfactura', array('local' => 'idfactura', 'foreign' => 'idfactura')
        );
        $this->hasMany(
            'NomCategoriaprecio', array('local' => 'idcategoriaprecio', 'foreign' => 'idcategoriaprecio')
        );
        $this->hasMany(
            'NomClasificacioncontablelog', array('local' => 'idcuenta', 'foreign' => 'idclasificacioncontable')
        );
        $this->hasMany(
            'DatDesglosecategoriapreciofactura',
            array('local' => 'idcategoriafactura', 'foreign' => 'idcategoriafactura')
        );
    }
}
