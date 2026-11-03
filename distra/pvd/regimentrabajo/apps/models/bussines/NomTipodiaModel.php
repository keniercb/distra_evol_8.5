<?php

class NomTipodiaModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(NomTipodia $NomTipodia)
    {
        $NomTipodia->save();
    }

    public function Actualizar(NomTipodia $NomTipodia)
    {
        $NomTipodia->save();
    }

    public function Eliminar($idtipodia)
    {
        $obj = Doctrine:: getTable('NomTipodia')->find($idtipodia);
        try {
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function GetByLimit($limit, $start)
    {
        $tipodia = new NomTipodia();
        return $tipodia->GetPorLimite($limit, $start);
    }

    public function GetAll()
    {
        $tipodia = new NomTipodia();
        return $tipodia->GetTodos();
    }

    public function GetByLimitFind($criterio, $limit, $start)
    {
        $tipodia = new NomTipodia();
        return $tipodia->GetByLimitFind($criterio, $limit, $start);
    }

    public function GetAllFind($criterio)
    {
        $tipodia = new NomTipodia();
        return $tipodia->GetAllFind($criterio);
    }

    public function Existe($denominacion)
    {
        $tipodia = Doctrine::getTable('NomTipodia')->findBy('denominacion', $denominacion);
        return $tipodia;
    }

}

