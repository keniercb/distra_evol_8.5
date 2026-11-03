<?php

/**
 *    Jorge Luis Cuellar Mondeja 20/04/2014
 * */
class DatMovRegnumericoTransp extends BaseDatMovRegnumericoTransp
{

    public function setUp()
    {
        parent:: setUp();

        $this->hasOne(
            'DatMovRegnumericoActivo', array('local' => 'idmovregnumerico', 'foreign' => 'idmovregnumerico')
        );
        $this->hasMany(
            'NomTipocombustible', array('local' => 'idtipocombustible', 'foreign' => 'idtipocombustible')
        );

        $array[] = array('cardinalidad' => 'one',
            'relation' => 'DatMovRegnumericoTransp',
            'properties' => array('local' => 'idmovregnumerico',  'foreign' => 'idmovregnumerico')
        );

        $obj = new DatMovRegnumerico();
        LogisticaDoctrineHelper::__init()->tryInyectRelactions($obj, $array);
    }

    public function ClonarMovimiento($idmovregnumericoAclonar, $idmovregnumericoClonado)
    {
        $objMovimientoRegnumericoActivoTrans = Doctrine::getTable('DatMovRegnumericoTransp')
            ->find($idmovregnumericoAclonar);
        if ($objMovimientoRegnumericoActivoTrans) {
            $objMovimientoRegnumericoActivoTransClonado = new DatMovRegnumericoTransp();
            $objMovimientoRegnumericoActivoTransClonado->synchronizeWithArray(
                $objMovimientoRegnumericoActivoTrans->toArray()
            );
            $objMovimientoRegnumericoActivoTransClonado->idmovregnumerico = $idmovregnumericoClonado;
            $objMovimientoRegnumericoActivoTransClonado->save();
        }
    }

}
