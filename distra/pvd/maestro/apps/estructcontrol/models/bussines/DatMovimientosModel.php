<?php 
class DatMovimientosModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function add($idcontrolador, $idpersona, $accion, $idcargo)
    {//print_r($idcargo);die;
        $existe = DatMovimientos::getMovByIdcontroladorpersonaaccion($idcontrolador, $idpersona, null, $idcargo);

        if (count($existe) == 0 || $existe[0]['accion'] != $accion) {
            $obj = new DatMovimientos();
            $obj->idcontrolador = $idcontrolador;
            $obj->idpersona = $idpersona;
            $obj->idcargo = $idcargo;
            $obj->accion = $accion;
            $obj->save();
            if ($accion == 1 && count($existe) > 0 && $existe[0]['accion'] == 0) {
                $obmov = DatMovimientos::getById($existe[0]['idmovimiento']);
                $obmov->delete();
            }
            return true;
        } else {
            return false;
        }
    }

    public function cambiarControlador($idcontroladornew, $idcontroladorviejo, $idpersona, $idcargo)
    {
        try {
            $mov = DatMovimientos::getMovByIdcontroladorpersonaaccion($idcontroladorviejo, $idpersona, 1,$idcargo);
            if (count($mov) > 0) {
                $resp = DatMovimientos::getMovByIdcontroladorpersonaaccion($idcontroladornew, $idpersona, 1,$idcargo);
                if (count($resp) == 0) {
                    $obj = DatMovimientos::getById($mov[0]['idmovimiento']);
                    $obj->idcontrolador = $idcontroladornew;
                    $obj->save();
                    return true;
                }
                else
                    return false;
            }
        } catch(Exception $e) {
            return false;
        }
    }

    public function delete($idmovimiento)
    {
        $obmov = DatMovimientos::getById($idmovimiento);
        $obmov->delete();
    }

    public function addmodFueraPlantilla($idcontrolador,$n,$accion)
    {
        $existeMov = Doctrine::getTable('DatMovimientos')->findOneBy('idpersona',$n);
        if(!empty($existeMov->idpersona))
        {
            $existeMov->idcontrolador = $idcontrolador;
            $existeMov->accion = $accion;
            $existeMov->save();
        }
        else
        {
            $obj = new DatMovimientos();
            $obj->idcontrolador = $idcontrolador;
            $obj->idpersona = $n;
            $obj->accion = $accion;
            $obj->save();
        }
        return true;
    }
}