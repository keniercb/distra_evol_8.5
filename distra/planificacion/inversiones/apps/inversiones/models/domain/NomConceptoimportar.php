<?php

class NomConceptoimportar extends BaseNomConceptoimportar {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatConfiguracionimportar', array('local' => 'idconcepto', 'foreign' => 'idconcepto'));
    }

    public function listar() {
        $query = new Doctrine_Query();
        return $query->from('NomConceptoimportar')->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
    }

    public function getConfigGrid($idconcepto) {
        $query = new Doctrine_Query();
        return $query->from('DatConfiguracionimportar dc')
                        ->innerJoin('dc.DatColumnaconcepto cc')
                        ->where('dc.idconcepto = ?', $idconcepto)
                        ->orderBy('cc.orden')
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
    }

    public function getCriterioOrdenenar() {
        $query = new Doctrine_Query();
        $first = $query->select('cc.nombrecampo')->from('DatColumnaconcepto cc')
                        ->addwhere('cc.idconfiguracion = ?', $this->DatConfiguracionimportar->idconfiguracion)
                        ->addwhere("cc.nombrecampo like 'codigo%' ")
                        ->execute()->getFirst()->toArray();
        return $first['nombrecampo'];
    }

}

//fin clase 
