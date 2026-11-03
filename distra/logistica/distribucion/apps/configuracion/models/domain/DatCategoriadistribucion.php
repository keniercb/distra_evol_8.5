<?php

/**
 * @class      DatCategoriadistribucion
 *
 * @package    Inventario
 * @subpackage Configuracion
 * @author     Manuel Yhon Figueroa
 * @copyright  XETID
 * @version    2.0
 */
class DatCategoriadistribucion extends BaseDatCategoriadistribucion
{

    public function setUp()
    {
        $this->hasMany('DatCuadrobasico', array('local' => 'idcategoria', 'foreign' => 'idcategoria'));
        parent:: setUp();
    }

    /**
     * Funcion para obtener las Categorias de distribucion
     *
     * @author Manuel Yhon Figueroa
     * @return Retorna categorias de ditribucion
     */
    public function ObtenerCategorias($idestructura)
    {
        $query = Doctrine_Query::create();
        $query->select("dcd.idcategoria, dcd.denominacion as text, dcb.idestructura")
            ->from('DatCategoriadistribucion dcd')
            ->innerJoin('dcd.DatCuadrobasico dcb')
            ->where('dcb.idestructura = ?', array($idestructura));
        return $query->fetchArray();
    }

    public function ObtenerCategoriasEstructuras($datosDoc, $idestructura)
    {
        $query = Doctrine_Query::create();
        $query->select("dcd.idcategoria, dcd.denominacion as denominacion, dcb.idestructura")
            ->from('DatCategoriadistribucion dcd')
            ->innerJoin('dcd.DatCuadrobasico dcb')
            ->where(
                "dcb.idestructura <> ? and lower(dcd.denominacion) ILIKE '%" . $datosDoc['criterio'] . "%'",
                array($idestructura)
            );
        return $query->fetchArray();
    }

    public function existeDenominacionCategoria($datosDoc)
    {
        $query = Doctrine_Query::create();
        $query->select("count(dcd.idcategoria) as cantidad, dcd.idcategoria as idcategoria")
            ->from('DatCategoriadistribucion dcd')
            ->where("lower(denominacion) ILIKE '%$datosDoc->denominacion%'")
            ->groupBy('dcd.idcategoria');

        return $query->fetchArray();
    }
}