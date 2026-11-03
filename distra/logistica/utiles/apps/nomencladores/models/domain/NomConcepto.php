<?php

class NomConcepto extends BaseNomConcepto
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatConceptoEntidad',
            array('local' => 'idnomconcepto', 'foreign' => 'idnomconcepto')
        );
    }

    public function GetTodosActuales($idestructura)
    {
        $query = new Doctrine_Query();
        $result = $query
            ->select('*')
            ->from('NomConcepto nomc')
            ->innerJoin('nomc.DatConceptoEntidad dce')
            ->where("nomc.estado=1 and dce.idestructuracomun = $idestructura")
            ->fetchArray();
        //print_r($result);die('llego');
        return $result;
    }
}

//fin clase