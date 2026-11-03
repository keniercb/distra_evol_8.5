<?php

/**
 * @author    Jesus Ariel Guerra Lopez
 * @version   3.0.0
 * @copyright XETID
 */
class NomTipoinvolucrado extends BaseNomTipoinvolucrado
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomNomenclador',
            array('local' => 'idtipoinvolucrado', 'foreign' => 'idnomenclador')
        );

    }

    public function ActualizarInicial()
    {
        $query = new Doctrine_Query();
        $query->update('NomTipoinvolucrado nom')
            ->set('nom.inicial', '?', 0)
            ->where("nom.inicial = 1")
            ->execute();
    }

}//fin clase 



