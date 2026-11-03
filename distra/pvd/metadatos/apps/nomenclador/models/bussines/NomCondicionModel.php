<?php

/**
 * Class NomCondicionModel
 */
class NomCondicionModel extends ZendExt_Model
{
    /**
     *
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Descripción del método: Inserta una nueva condicion
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param numeric $idNomCargo
     * @param array   $arrayIdGrupoComplejidad
     *
     * @return bool : bool,si permite insertar una nueva condicion
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertar($idNomCargo, $arrayIdGrupoComplejidad)
    {
        $this->eliminar($idNomCargo);
        if ($arrayIdGrupoComplejidad) {
            $grupos = explode(',', $arrayIdGrupoComplejidad);
            foreach ($grupos as $grupo) {
                $instance = new NomCondicion();
                $instance->idnomcargo = $idNomCargo;
                $instance->idgrupocomplejidad = $grupo;
                $instance->save();
            }
        }

        return true;
    }

    /**
     * Descripción del método: Elimina todas las intancias de los cargos en las condiciones
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $idNomCargo
     *
     * @return bool : bool,si permite eliminar todas las instancias de un cargo especifico
     * @copyright Copyright (c) 2013 xetid
     */
    private function eliminar($idNomCargo)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->delete('NomCondicion')->where('idnomcargo = ?', $idNomCargo)->setHydrationMode(
                           Doctrine::HYDRATE_ARRAY
        )->execute();

        return $resultado;
    }
}