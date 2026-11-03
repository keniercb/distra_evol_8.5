<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of DatEstadoalmacen
 *
 * @author kenier
 */
class DatEstadoalmacen extends BaseDatEstadoalmacen
{

    public function Setup()
    {
        parent::Setup();
    }

    public function abrirAlmacen($idDeposito, $fecha)
    {
        $existe = Doctrine_Query::create()->select('e.iddeposito')->from('DatEstadoalmacen e')->where('iddeposito = ?',
                array($idDeposito))->count();
        if ($existe == 0) {
            $alm = new DatEstadoalmacen();
            $alm->iddeposito = $idDeposito;
            $alm->estado = 1;
            $alm->fechaapertura = $fecha;            
            $alm->save();
        }
        return true;
    }

    public function cerrarAlmacen($idDeposito, $fecha)
    {
        if ($this->abrirAlmacen($idDeposito, $fecha)) {
            Doctrine_Query::create()->update('DatEstadoalmacen')->set('estado', 0)->set('fechacierre', "'{$fecha}'")
                ->where('iddeposito = ?', array($idDeposito))->execute();
        }
        return true;
    }

}
