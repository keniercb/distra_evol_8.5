<?php

class NomTipoareatipoproducto extends BaseNomTipoareatipoproducto
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatTipoareaEntidad', array('local' => 'idtipoareaentidad', 'foreign' => 'idtipoareaentidad'));
        if (class_exists('NomNaturaleza')) {
            $this->hasOne('NomNaturaleza', array('local' => 'idnaturaleza', 'foreign' => 'idnaturaleza'));
            $relations[] = array(
                    'cardinalidad' => 'many', 'relation' => 'NomTipoareatipoproducto',
                    'properties' => array('local' => 'idnaturaleza', 'foreign' => 'idnaturaleza'
                )
            );
            LogisticaDoctrineHelper::__init()->tryInyectRelactions(new NomNaturaleza(), $relations);
        }

        /* if (class_exists('NomNaturaleza')) {
          $array[] = array('cardinalidad' => 'many',
          'relation' => 'NomTipoareatipoproducto',
          'properties' => array('local' => 'idnaturaleza',
          'foreign' => 'idnaturaleza'));
          $natururaleza = new NomNaturaleza();
          UtilesDoctrineModel::tryInyectRelactions($natururaleza, $array);
          } */
    }

}

