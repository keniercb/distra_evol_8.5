<?php

class DatBusquedausuarioModel extends ZendExt_Model
{

    public function Actualizar($object)
    {
        $this->conn->beginTransaction();
        try {
            $DatBusquedausuario = Doctrine::getTable('DatBusquedausuario')->find($object['idbusquedausuario']);
            if ($DatBusquedausuario != false) {
                foreach ($object as $k => $v) {
                    $DatBusquedausuario->$k = $v;
                }
                $DatBusquedausuario->save();
                $this->conn->commit();
                return true;
            }
        } catch (Doctrine_Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function getBusquedabyusuario($idusuario, $idbusqueda)
    {
        $existe = DatBusquedausuario::getBusquedabyusuario($idusuario, $idbusqueda);
        if ($existe) {
            return $existe;
        } else {
            return false;
        }
    }

    public function setSearchNotDefault($idusuario)
    {
        $query = new Doctrine_Query ();
        $rows = $query->update('DatBusquedausuario')
            ->set('pordefecto', 0)
            ->where('idusuario = ? and pordefecto = 1', $idusuario)
            ->execute();
        return $rows;
    }

    public function setSearchByDefault($idbusquedausuario)
    {
        $query = new Doctrine_Query ();
        $row = $query->update('DatBusquedausuario')
            ->set('pordefecto', 1)
            ->where('idbusquedausuario = ?', $idbusquedausuario)
            ->execute();
        return $row;
    }

}

?>
