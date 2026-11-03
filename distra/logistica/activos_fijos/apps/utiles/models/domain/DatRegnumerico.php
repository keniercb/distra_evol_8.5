<?php

/**
 *  Jorge Luis Cuellar Mondeja 28/10/2011
 */
class DatRegnumerico extends BaseDatRegnumerico
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();

        $this->hasMany('DatMovRegnumerico', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico'));
        $this->hasMany('HisRegNumericoEstatus', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico'));
        $this->hasOne('DatProductoLogistica', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->hasOne('DatRegnumericoActivo', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico'));
        $this->hasMany('DatImagenRegnumerico', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico'));
        
        $array[] = array('cardinalidad' => 'one',
                         'relation' => 'DatRegnumerico',
                         'properties' => array('local' => 'idproducto',
                                               'foreign' => 'idproducto'));
        $obj = new DatProductoLogistica();
        LogisticaDoctrineHelper::__init()->tryInyectRelactions($obj, $array);
    }

}
