<?php
class FuncCargoService extends ZendExt_Model
{
    public function obtenerFuncionesCargo($idestructura)
    {
        return FuncionCargoModel::getFuncionCargo(1000000, 0, $idestructura);
    }
}
