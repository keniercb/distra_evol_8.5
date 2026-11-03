<?php

/**
 *    Jorge Luis Cuellar Mondeja 28/10/2011
 */
class DatMovRegnumericoActivo extends BaseDatMovRegnumericoActivo
{

    public function setUp()
    {
        parent:: setUp();

        $this->hasOne('NomEstatustecnico', array('local' => 'idestatustecnico', 'foreign' => 'idestatustecnico'));
        $this->hasOne('NomColor', array('local' => 'idcolorprim', 'foreign' => 'idcolor'));
        $this->hasOne('NomColor', array('local' => 'idcolorsec', 'foreign' => 'idcolor'));
        $this->hasOne('NomActividadMedio', array('local' => 'idactividad', 'foreign' => 'idactividad'));
        $this->hasOne('NomCategoriasproducto', array('local' => 'idcategoria', 'foreign' => 'idcategoria'));
        $this->hasOne('DatEstructuraubicacion', array('local' => 'idubicacion', 'foreign' => 'idestructuraubicacion'));
        $this->hasOne('DatMovRegnumerico', array('local' => 'idmovregnumerico', 'foreign' => 'idmovregnumerico'));
        $this->hasOne(
            'DatMovRegnumericoInventario', array('local' => 'idmovregnumerico', 'foreign' => 'idmovregnumerico')
        );
        $this->hasOne('DatResponsable', array('local' => 'idresponsable', 'foreign' => 'idresponsable'));

        $relaciones[] = array('cardinalidad' => 'one',
            'relation' => 'DatMovRegnumericoActivo',
            'properties' => array('local' => 'idmovregnumerico',
                'foreign' => 'idmovregnumerico'));

        $obj = new DatMovRegnumerico();
        LogisticaDoctrineHelper::__init()->tryInyectRelactions($obj, $relaciones);
    }

}
