<?php

class DatEstudiomatrizdofaModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getFactoresClaves() {
        $a = new NomFactorclave();
        $p = $a->getFactoresClaves();
        return $p;
    }

    public function getTreeAmbitos(){
        $a = new NomAmbitodofa();
        $p = $a->getTreeAmbitos();
        return $p;
    }

    public function getMatrizDofa($idproyecto){
       $a = new DatEstudiomatrizdofa();
       $p = $a->getMatrizDofa($idproyecto);
       return $p;
    }




}

