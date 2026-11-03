<?php

class DatMora extends BaseDatMora
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatTerminopago', array('local' => 'idterminodepago',
                'foreign' => 'idterminodepago')
        );
    }

    static public function getMora($idterminopago)
    {
        $q = new Doctrine_Query();
        $result = $q->select("m.*")
            ->from('DatMora m')
            ->where("m.idterminodepago = '$idterminopago'")
            ->orderBy('m.idmora')
            ->execute()->toArray();

        return $result;
    }

    static public function registrarMora($idterminopago, $mora, $delmora)
    {
        try {
            foreach ($mora as $m) {
                $objMora = ($m->idMora) ? Doctrine::getTable('DatMora')->find($m->idMora) : new DatMora();
                $a = Doctrine_Manager::getInstance();
                $va = $a->getCurrentConnection();

                $objMora->idterminodepago = $idterminopago;
                $objMora->porciento = $m->prcentaje;
                $objMora->dias = $m->aplicabledespues;

                $objMora->save();
                $va->commit();
                $va->beginTransaction();
            }

            if (count($delmora) > 0) {
                foreach ($delmora as $idmora) {
                    $mora = Doctrine::getTable('DatMora')->find($idmora);
                    $a = Doctrine_Manager::getInstance();
                    $va = $a->getCurrentConnection();
                    $mora->delete();
                    $va->commit();
                    $va->beginTransaction();
                }
            }
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function delMora($idterminodepago)
    {
        try {
            $query = Doctrine_Query::create();
            $a = Doctrine_Manager::getInstance();
            $va = $a->getCurrentConnection();
            $query->delete('DatMora m')
                ->where("m.idterminodepago = '$idterminodepago'")
                ->execute();
            $va->commit();
            $va->beginTransaction();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}


