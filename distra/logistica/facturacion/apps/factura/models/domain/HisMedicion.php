<?php

class HisMedicion extends BaseHisMedicion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('MedCliente', array('local' => 'idmedicioncliente', 'foreign' => 'idmedicioncliente'));
    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        try {
            $query = new Doctrine_Query ();
            $result = $query->from('HisMedicion')
                ->limit($limite)
                ->offset($inicio)
                ->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function getFechaUltimaLectura($idcontrato, $idmedicioncliente)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('hm.fechamedicion as fechamedicion, hm.consumo as consumo')
                ->from('HisMedicion hm')
                ->innerJoin('hm.MedCliente m')
                ->where('m.idcontrato =? and hm.idmedicioncliente <> ?', array($idcontrato, $idmedicioncliente))
                ->orderBy('hm.idhismedicion desc')
                ->limit(1);
            $result = $query->fetchArray();
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function getDataByIdmedicionCliente($idmedicioncliente)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('hm.*')
                ->from('HisMedicion hm')
                ->where('hm.idmedicioncliente =?', $idmedicioncliente);
            $result = $query->fetchArray();
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function modificar($id, $datos)
    {
        try {
            $q = Doctrine_Query::create()
                ->update('HisMedicion')
                ->set($datos)
                ->where("idmedicioncliente = ?", $id);
            return $q->execute();
        } catch (Doctrine_Exception $e) {
            return false;
        }
    }
}

