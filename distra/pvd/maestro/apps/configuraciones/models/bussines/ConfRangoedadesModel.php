<?php


class ConfRangoedadesModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    public function getRangos($idestructura)
    {
        $obj = new ConfRangoedades();
        $datos = $obj->getRangos($idestructura);
        return $datos;
    }

    public function addRango($denominacion, $valorinicial, $valorfinal, $idestructura, $orden)
    {
        $obj = new ConfRangoedades();
        $obj->denominacion = $denominacion;
        $obj->valorinicial = ($valorinicial)?$valorinicial:null;
        $obj->valorfinal = ($valorfinal)?$valorfinal:null;
        $obj->idestructura = $idestructura;
        $obj->orden = ($orden)?$orden:null;
        $obj->save();
    }

    public function delRango($configuraciones)
    {
        foreach ($configuraciones as $v) {
            $query = new Doctrine_Query ();
            try {
                $query->delete()->from('ConfRangoedades')->where("idrangoedades = '$v'")->execute();
            } catch (Exception $e) {
                if ($e->GetCode() == 23503) {
                    return false;
                }
            }
        }
        return true;

    }

    public function updRango($idrangoedades, $denominacion, $valorinicial, $valorfinal, $orden)
    {
        try {
            $obj = ConfRangoedades::getById($idrangoedades);
            $obj->denominacion = $denominacion;
            $obj->valorinicial = ($valorinicial)?$valorinicial:null;
            $obj->valorfinal = ($valorfinal)?$valorfinal:null;
            $obj->orden = ($orden)?$orden:null;
            $obj->save();
            return true;
        } catch (Exception $exc) {
            echo false;
        }
    }


}
