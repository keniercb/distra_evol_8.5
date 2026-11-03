<?php

/**
 * Class NomRelacionModel
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class NomPropiedadModel extends ZendExt_Model
{
    /**
     *
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->instance = new NomPropiedad();
    }

    /**
     * Descripción del método:  Busca el próximo identificador de la tabla.
     *
     * @author    : Ing. Pedro Alberto Jiménez
     * @return array, próximo identificador.
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscarIdProximo()
    {
        $query = Doctrine_Query::create();
        $result = $query->select('max(a.idpropiedad) as maximo')->from('NomPropiedad a')->execute()->toArray();
        $proximo = isset($result[0]['maximo']) ? $result[0]['maximo'] + 1 : 1;
        return $proximo;
    }

    /**
     * Descripción del método:  Devuelve la información asociada a una propiedad.
     *
     * @author    : Ing. Pedro Alberto Jiménez
     *
     * @param     $idpropiedad
     *
     * @return array, identificador y denominación de esta propiedad.
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscarPropiedad($idpropiedad)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "select p.denominacion as text, cp.idconceptopropiedad, p.idpropiedad as id
                from mod_estructuracomp.nom_propiedad p
                inner join nom_conceptopropiedad cp on(cp.idpropiedad = p.idpropiedad)
                where cp.idconceptopropiedad in($idpropiedad) ";
        $data = $conn->fetchAll($sql);
        return $data;
    }
}