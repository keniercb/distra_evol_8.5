<?php

/**
 * @class      UtilesubicacionService
 * Aqui se encuentran todos los servicios de ubicacion *
 * @package    Inventario
 * @subpackage Ubicacion
 * @author     Antonio Diaz Soutuyo
 * @copyright  XETID
 * @version    2.0
 */
class UtilesubicacionService extends ZendExt_Model
{

    private $datAreaProd, $ubicacionModel, $datEstructUbic;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->datAreaProd = new DatAreaproducto();
        $this->ubicacionModel = new UbicacionModel();
        $this->datEstructUbic = new DatEstructuraubicacion();
    }

    public function getJsUbicacion()
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirPhtml = $dirApps
            . '/logistica/utiles/ubicacion/views/scripts/estructuraubicacion/estructuraubicacion.phtml';
        $js .= file_get_contents($dirPhtml);
        return $js;
    }

    public function getJsReporte()
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirPhtml = $dirApps . '/logistica/utiles/reporte/views/script/reporte/reporte.phtml';
        $js .= file_get_contents($dirPhtml);
        return $js;
    }

    public function cargarAreasXTipotransferencia($idtipotransferencia, $iddeposito)
    {
        return $this->datEstructUbic->cargarAreasXTipotransferencia($idtipotransferencia, $iddeposito);
    }

    public function devolverArea($idarea)
    {
        $area = $this->datEstructUbic->dameAreaByEstructura($idarea);
        if (!$area) {
            return false;
        }
        return $area;
    }

    /**
     * Devuelve las areas de un deposito.
     * @param numeric $iddeposito
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function devolverAreasPorDeposito($iddeposito, $dql = false)
    {
        $areas = $this->datEstructUbic->getAreasPorDeposito($iddeposito, $dql);
        if (!$areas) {
            return false;
        }
        return $areas;
    }

    /**
     * Devuelce las ubicaciones de un area.
     * @param array $filtro
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function dameUbicacionesPorArea($filtro, $dql = false)
    {
        $areas = $this->datEstructUbic->getUbicacionesPorArea($filtro, $dql);
        if (!$areas) {
            return false;
        }
        return $areas;
    }

    public function devolverNaturalezaPorTipoArea($idarea)
    {
        $area = new DatArea();
        return $area->dadevolverNaturalezaPorTipoArea($idarea);
    }

    /**
     * 
     * @param Doctrine_Query $query
     * @param array $filtro
     * @return Doctrine_Query
     */
    public function innerJoinDatAreaProducto($query, $filtro)
    {
        return $this->ubicacionModel->innerJoinDatAreaProducto($query, $filtro);
    }

    public function devolverProductosXidArea($filtro)
    {
        $serviciConfigu = ServiciosConfiguracionGeneralHelper::__init();
        $query = $this->datAreaProd->devolverProductosXidArea($filtro['idarea']);
        $serviciConfigu->dameQueryJoinNomIndicadores($query, 'p', 'i', 'ih', 'left', $filtro);
        return $serviciConfigu->innerJoinNomNaturaleza($query, 'i', 'n', true)->fetchArray();
    }

    /**
     * Devuelve las ubicaciones y areas de los productos especificados.
     * @param array $filtro
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function cargarUbicacionesProducto($filtro, $dql)
    {
        return $this->ubicacionModel->cargarUbicacionesProducto($filtro, $dql);
    }

    /**
     * Devuelve las ubicaciones de los lotes
     * @param array $filtro
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function cargarUbicacionesXTipoProducto($filtro, $dql = false)
    {
        return $this->ubicacionModel->cargarUbicacionesLote($filtro, $dql);
    }

    public function sumarCantidades($parametros)
    {
        $ubicProducto = new DatUbicacionproducto();
        return $ubicProducto->sumarCantidades($parametros['idproducto'], $parametros['idubicacion']);
    }

    public function obtenerConfiguracionUbicacion($idestructura)
    {
        $datcofubicacion = new Datconfigubicacion();
        return $datcofubicacion->cargarDatos($idestructura);
    }

    public function modificarCantidadExistente($idproducto, $idubicacion, $cantidad, $operacion)
    {
        $datUbicacionProducto = new DatUbicacionproducto();
        return $datUbicacionProducto->modificarCantidadExistente($idproducto, $idubicacion, $cantidad, $operacion);
    }

    public function ubicarProductosDocOrigen($parametros)
    {
        $datMovUbicacionModel = new DatMovubicacionModel();
        return $datMovUbicacionModel->ubicarProductosDocOrigen($parametros);
    }

    public function ubicarProducto($parametros)
    {
        return $this->ubicacionModel->ubicarProducto($parametros);
    }

    public function ubicarProductoLotes($parametros)
    {
        return $this->ubicacionModel->ubicarProductoLotes($parametros);
    }

    public function obtenerArea($idestructuraubicacion)
    {
        $dd = $this->ubicacionModel->obtenerArea($idestructuraubicacion);
        return $dd;
    }

    public function Tryinyecccion()
    {
        $ubicProducto = new DatMovubicacion();
        $ubicProducto->Tryinyecccion();
    }

    public function desubicarProductoLote($parametros)
    {
        return $this->ubicacionModel->desubicarProductoLote($parametros);
    }

    public function getQueryUbicacionLote($query, $alias)
    {
        return $this->ubicacionModel->getQueryUbicacionLote($query, $alias);
    }

    public function rebajarCantProductosByUbicacion($pDatos)
    {
        return $this->ubicacionModel->rebajarCantProductosByUbicacion($pDatos);
    }

    public function restablecerCantProductosByUbicacion($pDatos)
    {
        return $this->ubicacionModel->restablecerCantProductosByUbicacion($pDatos);
    }

    /**
     * Devuelve un arreglo de ubicaciones del lote en forma de arbol.
     * @param array $filtro
     * @return array
     */
    public function cargarUbicacionesLoteArbol($filtro)
    {
        return $this->ubicacionModel->cargarUbicacionesLoteArbol($filtro);
    }
    
    /**
     * Devuelve las ubicaciones de los lotes.
     * @param array $filtro
     * @param boolean $dql [Opcional] Determina si se devuelve la consulta.
     * @return array|Doctrine_Query
     */
    public function cargarUbicacionesLote($filtro, $dql)
    {
        return $this->ubicacionModel->cargarUbicacionesLote($filtro, $dql);
    }

    /**
     * Devuelve si los datos estan correctos con los movimiento de un producto.
     *
     * @param type $datosMovimiento
     *
     * @return boolean
     */
    public function comprobarUbicacionMov($datosMovimiento)
    {
        return $this->ubicacionModel->comprobarUbicacionMov($datosMovimiento);
    }
    
    /**
     * Rebaja las cantidades ubicadas del producto.
     * @param array $parametros
     * @return boolean
     */
    public function desubicarProducto($parametros)
    {
        return $this->ubicacionModel->desubicarProducto($parametros);
    }
    
    public function getJsNomencladores()
    {        
        return '<script type="text/javascript"
        src="/logistica/utiles/ubicacion/views/js/nomencladores/tipoubicacion.component.js"></script>';
    }

    public function getDatosArbolDenominacion($idestructura, $signoP, $signoS)
    {
        return $this->datEstructUbic->getDatosArbolDenominacion($idestructura, $signoP, $signoS);
    }

    /**
     * Deevuelve los datos de la ubicación si es unica o false en caso contrario.
     * @param numeric $idproducto
     * @return array|boolean
     */
    public function getUbicacionUnica($idproducto)
    {
        return $this->ubicacionModel->getUbicacionUnica($idproducto);
    }
    
    /**
     * Adiciona o modifica el registro de la cantidad comprometida por ubicacion asociada a un producto de un documento.
     * @param array $datos
     * @return boolean
     */
    public function adicionarUbicacionComprometida($datos)
    {
        $this->ubicacionModel->adicionarUbicacionComprometida($datos);
    }

    /**
     * Elimina los registros de cantidades comprometidas por ubicacion asociadas a los productos
     * seleccionados de un documento.
     * @param numeric $iddocumento [Opcional]
     * @param array|numeric $idproducto [Opcional]
     * @param array|numeric $idubicacioncomprometida [Opcional]
     * @return boolean
     */
    public function eliminarUbicacionComprometida($iddocumento, $idproducto, $idubicacioncomprometida)
    {
        $this->ubicacionModel->eliminarUbicacionComprometida($iddocumento, $idproducto, $idubicacioncomprometida);
    }

    /**
     * Cambia el estado de los registros de cantidades comprometidas por ubicacion asociados a los productos
     * de un documento.
     * @param numeric $iddocumento
     * @param numeric $estado
     * @return boolean
     */
    public function cambiarEstado($iddocumento, $estado)
    {
        $this->ubicacionModel->cambiarEstado($iddocumento, $estado);
    }

}
