<?php

/**
 * Nomenclador de linea de producto de la entidad
 *
 * @author     Alien Fernandez Fuentes
 * @package    Nomencladores
 * @subpackage Nomencladores de Quimefa
 * @copyright  UCID-ERP Cuba
 * @version    1.0
 */
class DatLineaProductoEntidad extends BaseDatLineaProductoEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomLineaProducto',
            array('local' => 'idlineaproducto', 'foreign' => 'idlineaproducto')
        );
        //$this->hasMany ( 'DatMunicion', array ('local' => 'idpartida', 
        //'foreign' => 'idpartida' ) );
    }

    public function Productos($idestructura)
    {
        $query = Doctrine_Query::create();
        return $query->select('dpe.*,nlp.*')
            ->from('DatLineaProductoEntidad dpe')
            ->innerJoin('dpe.NomLineaProducto nlp')
            ->where('dpe.idestructura = ?', array($idestructura))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
    }


}

//fin clase
