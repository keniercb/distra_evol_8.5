<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class NomDominio extends BaseNomDominio
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomDominio', array('local' => 'idpadre', 'foreign' => 'iddominio'));
    }

    /**
     * Generada por Doctrine Generate, obtiene la cantidad de  elementos de la tabla
     *
     * @param $iddominiopadre , id del domino padre
     * @param     : $nombredominio, nombre del dominio
     *
     * @return    : mixed Retorna un arreglo con las instancias de la tabla
     * @author    : Generada por Doctrine Generate
     */
    static public function cantNomDominioDadoNombre($iddominiopadre, $nombredominio)
    {
        $query = new Doctrine_Query();
        $datos = $query->select('count(iddominio) as cant')->from('NomDominio')->where(
                       "denominacion ilike '%{$nombredominio}%'"
        )->andwhere("idpadre = ?", $iddominiopadre)->execute();

        return $datos[0]->cant;
    }

    /**
     *  Verifica si el grado especificado esta siendo usado
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $nombredominio , nombre del dominio
     * @param $iddominio     , id del elemento a saber si esta en uso
     *
     * @return int : mixed, Retorna true o false en correspondencia si esta en uso o no
     */
    static public function existeNombreDominio($nombredominio, $iddominio)
    {
        $query = new Doctrine_Query();
        if ($iddominio) {
            $object = Doctrine::getTable('NomDominio')->find($iddominio);
            strtolower($nombredominio);
            strtolower($denom = $object->denominacion);
            if ($denom != $nombredominio) {
                $filtro = array($nombredominio, $iddominio);
                $sqlWhere = "lower(denominacion) = ? and iddominio <> ?";
            } else {
                return 0;
            }
        } else {
            $sqlWhere = "lower(denominacion) = ?";
            $filtro = $nombredominio;
        }
        $datos = $query->select('count(iddominio) as cant')->from('NomDominio')->where($sqlWhere, $filtro)->execute();

        return $datos[0]->cant;
    }

    /**
     *  Busca una o varias instancia atendiendo a su nombredominio e iddominiopadre
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $iddominiopadre
     * @param $limit         , rango de los elementos que se muestran en la interfaz
     * @param $start         ,  rango de los elementos que se muestran en la interfaz
     * @param $nombredominio , nombre del dominio
     *
     * @return mixed : mixed, Permite buscar uno o varios NomDominio atendiendo a los criterios de busqueda
     */
    static public function buscarDominioPorNombre($iddominiopadre, $limit, $start, $nombredominio)
    {
        $query = new Doctrine_Query();
        $datos = $query->select("d.iddominio, d.denominacion, d.seguridad, d.descripcion")->from('NomDominio d')->where(
                       "d.denominacion ilike '%{$nombredominio}%'"
        )->andWhere("d.idpadre = ?", $iddominiopadre)
        ->orderBy("d.iddominio asc")
        ->limit($limit)->offset($start)->fetchArray();
        return $datos;
    }
}
