<?php
class ConfiguracionFTService extends ZendExt_Model
{
    /**
     * obtenerIdsConfig Servicio que devuelve los identificadores de las ueb
     * configuradas para una estructura. En caso de que no existan confi-
     * guraciones devuelve los identificadores de las entidades que
     * pertenecen al dominio
     * @param $identidad Identificador de la estructura.
     * @return array|bool
     * @see ConfEntidadModel::obtenerIdsConfig()
     * @author Ing. Orestes Rodríguez Lorenzo 06/10/2017
     */
    public function obtenerIdsConfig($identidad)
    {
        $objModel = new ConfEntidadModel();
        return $objModel->obtenerIdsConfig($identidad);
    }
}