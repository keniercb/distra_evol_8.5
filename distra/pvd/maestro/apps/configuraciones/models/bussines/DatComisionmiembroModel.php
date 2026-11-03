<?php
class DatComisionmiembroModel extends ZendExt_Model
{

        public function getMiembrosByidcomision($idcomision, $filtro, $inicio, $limit)
    {
        try {
            $datos = DatComisionmiembro::getMiembrosByComision($idcomision, $filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = DatComisionmiembro::cantPersonasByIdcargoIdnecesidad($idcomision, $filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function add($idcomision, $idpersona, $idcargocomision, $fdesde, $fhasta)
    {
        try {
            $existe = DatComisionmiembro::existeMiembro($idpersona, $idcomision);
            if (count($existe) == 0) {
                $obj = new DatComisionmiembro();
                $obj->idcomision = $idcomision;
                $obj->idpersona = $idpersona;
                $obj->idcargocomision = (empty($idcargocomision))?null:$idcargocomision;
                $obj->fdesde = $fdesde;
                $obj->fhasta = $fhasta;
                $obj->save();
                return true;
            } else {
                return 2;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function update($idcomisionmiembro, $idcargocomision, $fdesde, $fhasta)
    {
        try {
            $obj = DatComisionmiembro::getById($idcomisionmiembro);
            if (isset($idcargocomision)) {
                $obj->idcargocomision = $idcargocomision;
            }
            if (isset($fdesde)) {
                $obj->fdesde = $fdesde;
            }
            if (isset($fhasta)) {
                $obj->fhasta = $fhasta;
            }
            $obj->save();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function delete($idcomisionmiembro)
    {
        try {
            $obj = DatComisionmiembro::getById($idcomisionmiembro);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}