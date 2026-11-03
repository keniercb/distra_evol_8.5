<?php

class DatConsecutivosNominaPorPagos extends BaseDatConsecutivosNominaPorPagos
{

    public function setUp()
    {
        parent::setUp();

    }

    public static function obtenerDatConsecutivosNominaPorIdElaborarPagos($idelaborarpagos)
    {
        return Doctrine::getTable('DatConsecutivosNominaPorPagos')->find($idelaborarpagos);
    }


    public static function existeIdElaborarPagoConsecutivosNomina($idelaborarpagos)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatConsecutivosNominaPorPagos')
            ->where("idelaborarpagos = ?", array($idelaborarpagos))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();

        if (count($result)) {
            return 1;
        } else {
            return 0;
        }
    }
}
