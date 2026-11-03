<?php

class DatDescuentosVenta extends BaseDatDescuentosVenta
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatTerminopago', array('local'   => 'idterminodepago',
                                           'foreign' => 'idterminodepago')
        );
    }

    static public function getDescuentosVenta($idterminopago)
    {
        $q = new Doctrine_Query();
        $result = $q->select("d.*")
            ->from('DatDescuentosVenta d')
            ->where("d.idterminodepago = '$idterminopago'")
            ->orderBy('d.iddescuentosventa')
            ->execute()->toArray();

        return $result;
    }

    static public function registrarDescuentoVenta($idterminopago, $descuentos, $deldescuentos)
    {
        foreach ($descuentos as $d) {
            $objDescuentoVenta = ($d->idDescVenta) ? Doctrine::getTable('DatDescuentosVenta')->find($d->idDescVenta) : new DatDescuentosVenta();

            $a = Doctrine_Manager::getInstance();
            $va = $a->getCurrentConnection();

            $objDescuentoVenta->idterminodepago = $idterminopago;
            $objDescuentoVenta->porciento = $d->porciento;
            $objDescuentoVenta->min = $d->cantMinima;
            $objDescuentoVenta->max = $d->cantMaxima;

            $objDescuentoVenta->save();
            $va->commit();
            $va->beginTransaction();
        }

        if(count($deldescuentos) > 0) {
            foreach ($deldescuentos as $iddesc) {
                $desc = Doctrine::getTable('DatDescuentosVenta')->find($iddesc);
                $a = Doctrine_Manager::getInstance();
                $va = $a->getCurrentConnection();
                $desc->delete();
                $va->commit();
                $va->beginTransaction();
            }
        }
    }

    static public function delDescuentosVenta($idterminodepago)
    {
        try {
            $query = Doctrine_Query::create();
            $a = Doctrine_Manager::getInstance();
            $va = $a->getCurrentConnection();
            $query->delete('DatDescuentosVenta m')
                ->where("m.idterminodepago = '$idterminodepago'")
                ->execute();
            $va->commit();
            $va->beginTransaction();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}


