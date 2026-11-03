<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2017 xetid
   */
class DatPersonarecomendacion extends BaseDatPersonarecomendacion
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($id)
    {
        return Doctrine::getTable('DatPersonarecomendacion')->find($id);
    }

    public function getRecomendaciones($idpersonaproceso, $start, $limit)
    {
        $select = "dd.*";
        $query = Doctrine_Query::create()->select($select)
            ->from('DatPersonarecomendacion dd')
            ->where("dd.idpersonaproceso = '$idpersonaproceso'")
            ->offset($start)->limit($limit);
        return $query->fetchArray();
    }

    public function cantRecomendaciones($idpersonaproceso)
    {
        $select = "dd.*";
        $query = Doctrine_Query::create()->select($select)
            ->from('DatPersonarecomendacion dd')
            ->where("dd.idpersonaproceso = '$idpersonaproceso'");
        return count($query->fetchArray());
    }
}