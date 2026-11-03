<?php

class ConfHabhorarionocturnidadModel extends ZendExt_Model
{
    protected $ConfHabhorarionocturnidad;

    function __construct()
    {
        $this->ConfHabhorarionocturnidad = new ConfHabhorarionocturnidad();
    }

    public function setUp()
    {
        parent::ZendExt_Model();

    }

    public function getlistadoHorarioNoct()
    {
        $ConfListadoHorario = new ConfHabhorarionocturnidad();
        $horarionocturnidad = $ConfListadoHorario->getHabilitarhorarionocturnidad();
        foreach ($horarionocturnidad as $k => $v) {
            $h = explode(':', $v['horainicio']);
            $h1 = explode(':', $v['horafin']);
            $horarionocturnidad[$k]['horainicio'] = $h[0] . ':' . $h[1];
            $horarionocturnidad[$k]['horafin'] = $h1[0] . ':' . $h1[1];
        }
        return $horarionocturnidad;
    }

    public function setHabilitarlistadoHorarioNoct($horarios)
    {
        try {
            $objhorariop = new ConfHabhorarionocturnidad();
            $objhorariop->EliminarHorario();
            foreach ($horarios as $v) {
                $objhorario = new ConfHabhorarionocturnidad();
                $objhorario->denominacion = $v->denominacion;
                $objhorario->horainicio = $v->horainicio;
                $objhorario->horafin = $v->horafin;
                $objhorario->save();
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

}
