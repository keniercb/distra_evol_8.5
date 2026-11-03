<?php
class DatEscalanumericaModel extends ZendExt_Model
{

    public function addEscala($idescala, $valorinicial, $valorfinal, $paso)
    {
        try {
            DatEscalanumerica::eliminarByEscala($idescala);
            for ($valorinicial; $valorinicial <= $valorfinal; $valorinicial += $paso) {
                $obj = new DatEscalanumerica();
                $obj->idescala = $idescala;
                $obj->valor = $valorinicial;
                $obj->save();
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteEscala($idescalacualitativa)
    {
        try {
            $obj = DatEscalanumerica::getById($idescalacualitativa);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}