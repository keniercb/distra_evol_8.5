<?php

/**
 *    Jorge Luis Cuellar Mondeja 20/04/2014
 * */
class DatMovRegnumBuque extends BaseDatMovRegnumBuque
{

    public function setUp()
    {
        parent:: setUp();

        $this->hasOne(
            'DatMovRegnumericoActivo', array('local' => 'idmovregnumerico', 'foreign' => 'idmovregnumbuque')
        );
       /* $this->hasMany(
            'NomTipocombustible', array('local' => 'idtipocombustible', 'foreign' => 'idtipocombustible')
        );*/

        $array[] = array('cardinalidad' => 'one',
            'relation' => 'DatMovRegnumBuque',
            'properties' => array('local' => 'idmovregnumerico',  'foreign' => 'idmovregnumbuque')
        );

        $obj = new DatMovRegnumerico();
        LogisticaDoctrineHelper::__init()->tryInyectRelactions($obj, $array);
    }

    public function ClonarMovimiento($idmovregnumericoAclonar, $idmovregnumericoClonado)
    {
        $objMovimientoRegnumericoActivoTrans = Doctrine::getTable('DatMovRegnumBuque')
            ->find($idmovregnumericoAclonar);
        if ($objMovimientoRegnumericoActivoTrans) {
            $objMovimientoRegnumericoActivoTransClonado = new DatMovRegnumBuque();
            $objMovimientoRegnumericoActivoTransClonado->synchronizeWithArray(
                $objMovimientoRegnumericoActivoTrans->toArray()
            );
            $objMovimientoRegnumericoActivoTransClonado->idmovregnumerico = $idmovregnumericoClonado;
            $objMovimientoRegnumericoActivoTransClonado->save();
        }
    }

}
