<?php

class DatCuotas extends BaseDatCuotas
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatTerminopago', array('local'   => 'idterminodepago',
                                           'foreign' => 'idterminodepago')
        );
    }

    static public function getCuotas($idterminopago)
    {
        $q = new Doctrine_Query();
        $result = $q->select("c.*")
            ->from('DatCuotas c')
            ->where("c.idterminodepago = '$idterminopago'")
            ->orderBy('c.idcuota')
            ->execute()->toArray();

        return $result;
    }

    static public function registrarPlazoCuotas($idterminopago, $plazoCuotas, $delplazo)
    {
        try {
            foreach ($plazoCuotas as $pc) {
                $objCuotas = ($pc->idPlazo) ? Doctrine::getTable('DatCuotas')->find($pc->idPlazo) : new DatCuotas();

                $a = Doctrine_Manager::getInstance();
                $va = $a->getCurrentConnection();

                $objCuotas->idterminodepago = $idterminopago;
                $objCuotas->idterminoaplicable = $pc->idcondicionpago;
                $objCuotas->porciento = $pc->prcentajePlazo;

                $objCuotas->save();

                $va->commit();
                $va->beginTransaction();
            }

            if(count($delplazo) > 0) {
                foreach ($delplazo as $idplazo) {
                    if($idplazo != "") {
                        $plazo = Doctrine::getTable('DatCuotas')->find($idplazo);
                        $a = Doctrine_Manager::getInstance();
                        $va = $a->getCurrentConnection();
                        $plazo->delete();
                        $va->commit();
                        $va->beginTransaction();
                    }
                }
            }
        }
        catch(Doctrine_Exception $e) {
            die($e);
            throw $e;
        }
    }

    static public function delCuotas($idterminodepago)
    {
        try {
            $query = Doctrine_Query::create();
            $a = Doctrine_Manager::getInstance();
            $va = $a->getCurrentConnection();
            $query->delete('DatCuotas m')
                ->where("m.idterminodepago = '$idterminodepago'")
                ->execute();
            $va->commit();
            $va->beginTransaction();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    static public function enUso($idterminopago)
    {
        $q = new Doctrine_Query();
        $result = $q->select("c.*")
            ->from('DatCuotas c')
            ->where("c.idterminoaplicable = '$idterminopago'")
            ->execute()->toArray();

        return (count($result) > 0) ? true : false;
    }

}


