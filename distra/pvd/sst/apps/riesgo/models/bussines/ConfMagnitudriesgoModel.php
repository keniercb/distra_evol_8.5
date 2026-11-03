<?php 
class ConfMagnitudriesgoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getMagnitud($filtro,$limit, $start)
    {
        try {

            $obj = new ConfMagnitudriesgo();
            $datos = $obj->getConfMagnitudriesgo($start, $limit) ;

            $resp->datos = $datos;
            $resp->cantidad = $obj->cantConf();
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addMagnitud($denominacion, $idexpresionmatematica)
    {
        try {
                $obj = new ConfMagnitudriesgo();
                if ($denominacion != null && $denominacion != '') {
                    $obj->denominacion = $denominacion;
                } else {
                    return false;
                }
                if($idexpresionmatematica!=null && $idexpresionmatematica!=''){
                    $obj->idexpresionmatematica = $idexpresionmatematica;
                }else{
                    return false;
                }
                $ordenmax = ConfMagnitudriesgo::maxOrden();
                $obj->orden = $ordenmax+1;
                $obj->save();
                return true;
        } catch (Exception $e) {
            return 2;
        }
    }

    public function modMagnitud($idconfmagnitudriesgo, $denominacion, $idexpresionmatematica)
    {
        $obj = ConfMagnitudriesgo::getById($idconfmagnitudriesgo);
        if ($denominacion != null && $denominacion != '') {
            $obj->denominacion = $denominacion;
        } else {
            return false;
        }
        if($idexpresionmatematica!=null && $idexpresionmatematica!=''){
            $obj->idexpresionmatematica = $idexpresionmatematica;
        }else{
            return false;
        }

        $obj->save();
         return true;


    }

    public function delMagnitud($idmagnitudriesgo)
    {
        try {
            $obj = ConfMagnitudriesgo::getById($idmagnitudriesgo);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function actualizarOrden($magnitudes)
    {
        try {
            foreach ($magnitudes as $i => $val) {
                $obj = ConfMagnitudriesgo::getById($val->idmagnitudriesgo);
                $obj->orden = $val->orden;
                $obj->save();
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}