<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class NomCondicion extends BaseNomCondicion
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomCargo', array('local' => 'idnomcargo', 'foreign' => 'idnomcargo'));
        $this->hasOne(
             'NomGrupocomplejidad', array('local' => 'idgrupocomplejidad', 'foreign' => 'idgrupocomplejidad')
        );
    }

    /**
     * Descripción del método: Obtiene las instancias de la tabla NomCondicion que sean de un cargo
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param    int $idNomCargo , id de la tabla nom_cargo
     *
     * @return \Doctrine_Collection : mixed Retorna un arreglo con los elementos encontrados
     * @copyright Copyright (c)2013 xetid
     */
    static function buscar($idNomCargo)
    {
        $query = Doctrine_Query::create();
        $sql = "
            SELECT c.idgrupocomplejidad AS id, g.denominacion AS text
            FROM mod_estructuracomp.nom_condicion c
            LEFT JOIN mod_estructuracomp.nom_grupocomplejidad g ON c.idgrupocomplejidad = g.idgrupocomplejidad
            WHERE (c.idnomcargo = $idNomCargo)
        ";
        $conn = $query->getConnection();
        $datos = $conn->fetchAll($sql);
        foreach ($datos as $index => $grupo) {
            if ($index == 0) {
                $resultado['idcondicion'] = $grupo['id'];
                $resultado['condicion'] = $grupo['text'];
            } else {
                $resultado['idcondicion'] = $resultado['idcondicion'] . ',' . $grupo['id'];
                $resultado['condicion'] = $resultado['condicion'] . ',' . $grupo['text'];
            }
        }

        return $resultado;
    }
}