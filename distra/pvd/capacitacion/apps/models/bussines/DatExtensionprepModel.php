<?php 
class DatExtensionprepModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getExtensiones($idreciengraduado)
    {
        try {
            $obj = new DatExtensionprep();
            $datos = $obj->getExtensiones($idreciengraduado);
            foreach ($datos as $p => $ext) {
                $fecha = explode('/', $ext['fextension']);
                $meses = $fecha[1] + $ext['tiempo'];
                $resto = $meses % 12;
                $result = floor($meses/12);
                $fecha[2] = $fecha[2] + $result;
                $fecha[1] = $resto;
                $datos[$p]['fhasta'] = implode('/', $fecha);
            }
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function add($idreciengraduado, $tiempo, $fextension)
    {
        try {
            $obj = new DatExtensionprep();
            $obj->idreciengraduado = $idreciengraduado;
            $obj->tiempo  = $tiempo;
            $obj->fextension = $fextension;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function delete($idextensionprep)
    {
        try {
            $obj = DatExtensionprep::getById($idextensionprep);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}