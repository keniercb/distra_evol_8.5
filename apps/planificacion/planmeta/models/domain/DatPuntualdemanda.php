<?php
class DatPuntualdemanda extends BaseDatPuntualdemanda
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function guardarPuntual($arrep)
    {

        $eje = new DatPuntualdemanda();
        $eje->idejecucionoace = $arrep['idejecucionoace'];
        $eje->importe = $arrep['importe'];
        $eje->cantidad = $arrep['cantidad'];
        $eje->save();
        return 1;
    }

}
