<?php
class DatImputableModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getImputablesByInterrupcion($interrupcion, $filtro, $inicio, $limite)
    {
        try {
            $obj = new DatImputable();
            $inst = ZendExt_IoC::getInstance();
            $datos = $obj->getImputableByIdInterrupcion($interrupcion, $filtro, $inicio, $limite);
            $cantidad = $obj->cantImputableIdInterrupcion($interrupcion, $filtro);
            if ($cantidad == 0) {
                $datos = Array();
            }
            foreach ($datos as $r => $interr) {
                $carg = $inst->metadatos->obtenerDatosCargo($interr['idcargo']);
                $datos[$r]['cargo'] = $carg[0]['denominacion'];
                $area = $inst->metadatos->DameEstructura($interr['idarea']);
                $datos[$r]['area'] = $area[0]->denominacion;
            }
            $result->datos = $datos;
            $result->cantidad = $cantidad;
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addImputable($idinterrupcion, $idpersona)
    {
        try {
            $existe = DatImputable::existeImputable($idpersona, $idinterrupcion);
            if (count($existe) == 0) {
                $obj = new DatImputable();
                $obj->idpersona = $idpersona;
                $obj->idinterrupcion = $idinterrupcion;
                $obj->save();
                return true;
            } else {
                return 2;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteImputable($idimputable)
    {
        try {
            $obj = DatImputable::getById($idimputable);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}