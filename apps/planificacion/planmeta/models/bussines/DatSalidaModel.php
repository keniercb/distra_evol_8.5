<?php

class DatSalidaModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatSalida($datSalida)
    {
        $datSalida->save();
    }

    public function modificardatSalida($datSalida)
    {
        $datSalida->save();
    }

    public function eliminardatSalida($datSalida)
    {
        $datSalida->delete();
    }

    public function adicionar_salida($params)
    {
        $fechaActual = date("d-m-Y H:i:s");
        foreach ($params['salidas'] as $salida) {
            $viejasalida = DatSalida::buscarSalida($params['idactividad'], $salida->idindicador);
            if ($viejasalida->idindicador == null) {
                $nuevasalida = new DatSalida();
                $nuevasalida->idactividad = $params['idactividad'];
                $nuevasalida->idindicador = $salida->idindicador;
                $nuevasalida->cantidad = 1;
                $nuevasalida->idusuario = $params['idusuario'];
                $nuevasalida->fecha = $fechaActual;
                $nuevasalida->save();
            }
        }
        return true;
    }

    public function modificar_salida($params)
    {
        $fechaActual = date("d-m-Y H:i:s");
        foreach ($params['salidas'] as $salida) {
            $viejasalida = DatSalida::buscarSalida($params['idactividad'], $salida->idindicador);
            $viejasalida->cantidad = $salida->cantidad;
            $viejasalida->fecha = $fechaActual;
            $viejasalida->idusuario = $params['idusuario'];
            $viejasalida->save();
        }
        return true;
    }

    public function eliminarvarias_salidas($params)
    {
        $query = Doctrine_Query::create();
        $query->delete('DatSalida')
            ->from('DatSalida')
            ->addWhere('idactividad = ?', $params['idactividad'])
            ->whereIn('idindicador', $params['salidas']);
        $query->execute();
        return true;
    }

    public function listarSalidas($params){
        return DatSalida::listarSalidas($params);
    }

}


