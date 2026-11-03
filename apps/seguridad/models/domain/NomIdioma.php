<?php

/**
 * Clase dominio de NomIdioma.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0-0
 */
class NomIdioma extends BaseNomIdioma
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'SegUsuario',
            array('local' => 'ididioma', 'foreign' => 'ididioma')
        );
    }

    static public function cargarnomidioma($limit, $start)
    {
        $query = new Doctrine_Query();
        $result = $query->select('i.ididioma,i.denominacion,i.abreviatura')
            ->from('NomIdioma i')
            ->limit($limit)
            ->offset($start)
            ->execute();
        return $result;
    }

    static public function obtenercantnomidioma()
    {
        $query = new Doctrine_Query();
        $cant = $query->from('NomIdioma')->count();
        return $cant;
    }

    static public function cargarcomboidioma()
    {
        $query = new Doctrine_Query();
        $result = $query->select('i.ididioma,i.denominacion')
            ->from('NomIdioma i')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    static public function comprobaridioma($campo, $valor, $ididioma)
    {
        if ($ididioma) {
            $where = "$campo = ? AND ididioma <> ?";
            $filtro = array($valor, $ididioma);
        } else {
            $where = "$campo = ?";
            $filtro = array($valor);
        }
        $query = Doctrine_Query::create();
        $cantidad = $query->from('NomIdioma')
            ->where($where, $filtro)
            ->execute();
        return count($cantidad);
    }

}