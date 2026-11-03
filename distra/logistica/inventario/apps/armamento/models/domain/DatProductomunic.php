<?php

class DatProductomunic extends BaseDatProductomunic
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatProductomunic', array('local' => 'checksum', 'foreign' => 'checksum'));
        $this->hasMany('DatMovproductomunic', array('local' => 'idproductomunic', 'foreign' => 'idproductomunic'));
        $this->hasMany(
            'DatProductomunicComprometido', array('local' => 'idproductomunic', 'foreign' => 'idproductomunic')
        );
        $this->hasOne('DatUbicacionComprometida', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->hasOne('DatProductoLogistica', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->hasMany('DatMovimientos', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->hasOne('DatMovtransferenciamunic', array('local' => 'idproductomunic', 'foreign' => 'idpartidadestino'));
        $this->hasOne('DatMovtransferenciamunic', array('local' => 'idproductomunic', 'foreign' => 'idpartidaorigen'));
        $this->hasOne('NomMarcaarmamento', array('local' => 'idmarcapolvuno', 'foreign' => 'idmarcaarmamento'));
        $this->hasOne(
            'DatEstructuraubicacion', array('local' => 'idestructuraubicacion', 'foreign' => 'idestructuraubicacion')
        );
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatProductomunic',
            'properties' => array('local' => 'idestructuraubicacion', 'foreign' => 'idestructuraubicacion')
        );
        LogisticaDoctrineHelper::__init()->tryInyectRelactions(new DatEstructuraubicacion(), $relations);
    }

}


