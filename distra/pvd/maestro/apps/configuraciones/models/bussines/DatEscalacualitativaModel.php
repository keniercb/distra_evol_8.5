<?php
class DatEscalacualitativaModel extends ZendExt_Model
{

    public function addEscala($idescala, $idvalorcualitativo, $peso)
    {
        try {
            $obj = new DatEscalacualitativa();
            $obj->idescala = $idescala;
            $obj->idvalorcualitativo = $idvalorcualitativo;
            $obj->peso = (empty($peso))?null:$peso;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function updatePeso($idescalacualitativa, $peso)
    {
        try {
            $obj = DatEscalacualitativa::getById($idescalacualitativa);
            $obj->peso = (empty($peso))?null:$peso;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteEscala($idescalacualitativa)
    {
        try {
            $obj = DatEscalacualitativa::getById($idescalacualitativa);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function getValoresCualitativos($idescala, $filtro)
    {
        try {
            return DatEscalacualitativa::getValoresCualitativos($idescala, $filtro);
        } catch (Exception $e) {
            return false;
        }
    }
}