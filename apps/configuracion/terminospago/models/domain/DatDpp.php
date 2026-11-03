<?php

class DatDpp extends BaseDatDpp
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatTerminopago', array('local'   => 'idterminodepago',
                                           'foreign' => 'idterminodepago')
        );
    }

    static public function getDpp($idterminopago)
    {
        $q = new Doctrine_Query();
        $result = $q->select("d.*")
            ->from('DatDpp d')
            ->where("d.idterminodepago = '$idterminopago'")
            ->orderBy('d.iddpp')
            ->execute()->toArray();

        return $result;
    }

    static public function registrarDpp($idterminopago, $dpp, $deldpp)
    {
        try{
            foreach ($dpp as $d) {
                $objDpp = ($d->idDPP) ? Doctrine::getTable('DatDpp')->find($d->idDPP) : new DatDpp();

                $a = Doctrine_Manager::getInstance();
                $va = $a->getCurrentConnection();

                $objDpp->idterminodepago = $idterminopago;
                $objDpp->porciento = $d->porciento;
                $objDpp->dias = $d->antesde;

                $objDpp->save();
                $va->commit();
                $va->beginTransaction();
            }

            if(count($deldpp) > 0) {
                foreach ($deldpp as $iddpp) {
                    $dpp = Doctrine::getTable('DatDpp')->find($iddpp);
                    $a = Doctrine_Manager::getInstance();
                    $va = $a->getCurrentConnection();
                    $dpp->delete();
                    $va->commit();
                    $va->beginTransaction();
                }
            }
        }catch (Exception $e){
            throw $e;
        }

    }

    static public function delDpp($idterminodepago)
    {
        try {
            $query = Doctrine_Query::create();
            $a = Doctrine_Manager::getInstance();
            $va = $a->getCurrentConnection();
            $query->delete('DatDpp m')
                ->where("m.idterminodepago = '$idterminodepago'")
                ->execute();
            $va->commit();
            $va->beginTransaction();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}


