<?php

class DatEventoAviso extends BaseDatEventoAviso
{

    public function setUp()
    {
        parent::setUp();

        $this->hasOne(
            'DatEvent', array('local' => 'idevento', 'foreign' => 'idevento')
        );
        $this->hasOne(
            'DatAviso', array('local' => 'idaviso', 'foreign' => 'idaviso')
        );
    }

    public static function getIdAvisoByDenominacion($idevento, $denominacion)
    {
        return Doctrine_Query::create()
            ->select('dat_eventoaviso.idaviso idEventoAviso')
            ->from('DatEventoAviso dat_eventoaviso,DatAviso dat_aviso')
            ->where(
                'dat_eventoaviso.idevento = ? '
                . 'and dat_eventoaviso.idaviso = dat_aviso.idaviso
                and dat_aviso.denominacion = ?',
                array($idevento, $denominacion)
            )
            ->execute()
            ->toArray();
    }

}