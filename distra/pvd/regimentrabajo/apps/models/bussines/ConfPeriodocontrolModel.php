<?php

class ConfPeriodocontrolModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /*
     * Obtener un listado de los datos
    */
    public function obtenerListadoPeriodoControl($inicio = 0, $limite = 15, $fdesde, $fhasta)
    {
        $array = ConfPeriodocontrol::obtenerListadoPeriodoControl($inicio, $limite, $fdesde, $fhasta);
        foreach ($array as $key => $value) {
            $periodo = $value['fdesde'] . ' ' . '-' . ' ' . $value['fhasta'];
            $result[$key]['idperiodocontrol'] = $value['idperiodocontrol'];
            $result[$key]['descripcion'] = $value['descripcion'];
            $result[$key]['periodo'] = $periodo;
            $result[$key]['fdesde'] = $value['fdesde'];
            $result[$key]['fhasta'] = $value['fhasta'];
        }
        return $result;
    }

    /*
    * Obtener la cantidad total
    */
    public function obtenerCantidadTotalPeriodoControl()
    {
        return ConfPeriodocontrol::obtenerCantidadTotalPeriodoControl();
    }

    /**
     * Insertar
     */
    public function InsertarPeriodoControl($descripcion, $fdesde, $fhasta)
    {
        $objPeriodoControl = new ConfPeriodocontrol();
        $objPeriodoControl->descripcion = $descripcion;
        $objPeriodoControl->fdesde = $fdesde;
        $objPeriodoControl->fhasta = $fhasta;

        //Guardando los datos.
        $objPeriodoControl->save();
    }

    /**
     * Modificar
     */
    public function ModificarPeriodoControl($idperiodocontrol, $descripcion, $fdesde, $fhasta)
    {
        $objPeriodoControl = Doctrine:: getTable('ConfPeriodocontrol')->find($idperiodocontrol);
        $objPeriodoControl->descripcion = $descripcion;
        $objPeriodoControl->fdesde = $fdesde;
        $objPeriodoControl->fhasta = $fhasta;
        //Guardando los datos.
        $objPeriodoControl->save();
    }

    /**
     * Eliminar
     */
    public function EliminarPeriodoControl($idperiodocontrol)
    {
        $obj = Doctrine:: getTable('ConfPeriodocontrol')->find($idperiodocontrol);
        if ($obj) {
            $obj->delete();
            return true;
        }
        return false;
    }

    public function Getrangofechasdesde($fdesde, $fhasta)
    {
        return ConfPeriodocontrol::Getrangofechasdesde($fdesde, $fhasta);
    }

    public function Getrangofechashasta($fdesde, $fhasta)
    {
        return ConfPeriodocontrol::Getrangofechashasta($fdesde, $fhasta);
    }

    public function Getrangofechasdesde1($fdesde)
    {
        return ConfPeriodocontrol::Getrangofechasdesde1($fdesde);
    }

    public function Getrangofechashasta1($fhasta)
    {
        return ConfPeriodocontrol::Getrangofechashasta1($fhasta);
    }


}

