<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class AuxComplemento extends BaseAuxComplemento
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

    /**
     * Descripción del método: Devuelve la cantidad de complementos salariales segun los criterios de busquedas
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $busqueda
     *
     * @return mixed : mixed Retorna la cantidad de Complementos encontrados
     * @copyright Copyright (c)2013 xetid
     */
    public function cantidad($busqueda)
    {
        $valores = MetadatosServices::getInstance()->dameConceptosNomina(null, null, null, $busqueda);

        return count($valores);
    }

    /**
     * Descripción del método: Busca todos los datos de las complementoes visibles existentes
     *
     * @author    : Ing. Osvaldo Gonzalez
     *
     * @param $start
     * @param $limit
     * @param $busqueda
     *
     * @return array Retorna un arreglo con todos los datos de las complementoes
     * @copyright Copyright (c) 2013 xetid
     */
    public static function dameTodos($start, $limit, $busqueda)
    {
        $valores = MetadatosServices::getInstance()->dameConceptosNomina(null, $start, $limit, $busqueda);
        $query = new Doctrine_Query();
        $marcados = $query->select('idcomplemento')->from('AuxComplemento')->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        $marcados = Util::getArrayByField($marcados, 'idcomplemento');
        foreach ($valores as $index => $value) {
            $valores[$index]['checkeado'] = 0;
            if (Util::existeIdNodo($marcados, $value['id'])) {
                $valores[$index]['checkeado'] = 1;
            }
        }

        return $valores;
    }

    /**
     * Descripción del método: devuelve todos los complementos seleccionados
     *
     * @author    : Ing. Osvaldo Gonzalez
     * @return array Retorna un arreglo con todos los complementos seleccionados
     * @copyright Copyright (c) 2013 xetid
     */
    public static function dameComplementos()
    {
        $query = new Doctrine_Query();
        $marcados = $result = $query->from('AuxComplemento')->setHydrationMode(
            Doctrine :: HYDRATE_ARRAY
        )->execute();
        $marcados = Util::getArrayByField($marcados, 'idcomplemento');
        if (count($marcados)) {
            $valores = MetadatosServices::getInstance()->dameConceptosNomina($marcados);

            return $valores;
        }

        return array();
    }

    /**
     * Descripción del método: Obtiene las instancias de la tabla Complemento
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param    int $idComplemento
     *
     * @return \Doctrine_Collection : mixed Retorna un arreglo con los elementos encontrados
     * @copyright Copyright (c)2013 xetid
     */
    static function buscar($idComplemento)
    {
        $valores = MetadatosServices::getInstance()->dameConceptosNomina($idComplemento);
        $query = new Doctrine_Query();
        $marcado
            = $result = $query->from('AuxComplemento')->addWhere("idcomplemento = $idComplemento")->setHydrationMode(
            Doctrine:: HYDRATE_ARRAY
        )->execute();

        return $valores;
    }
}