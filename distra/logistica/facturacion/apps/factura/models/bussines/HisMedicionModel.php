<?php

class HisMedicionModel extends ZendExt_Model
{

    public function HisMedicionModel()
    {
        parent::ZendExt_Model();
    }

    /*     * ----------------------Guardar una nueva medicion-------------* */
    public function guardar($medicion)
    {
        try {
            $obj = new HisMedicion();
            $obj->fechamedicion = ($medicion->fechamedicion) ? $medicion->fechamedicion : 0;
            $obj->consumo = ($medicion->cantidad) ? $medicion->cantidad : 0;
            $obj->importe = ($medicion->importe) ? $medicion->importe : 0;
            $obj->idmedicioncliente = $medicion->idmedicioncliente;
            return $obj->save();
        } catch (Doctrine_Exception $e) {
            return false;
        }
    }
}