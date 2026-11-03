<?php

/**
 * @class      ConfiguraciondistribucionModel
 * @package    Inventario
 * @subpackage Configuracion
 * @author     Antonio Diaz Soutuyo
 * @copyright  XETID
 * @version    2.0
 */
class ConfiguraciondistribucionModel extends BaseModel
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function __construct($datos = array())
    {
        parent::__construct($datos);
    }

    /**
     * @method salvarconfiguracion
     * @author Antonio Diaz Soutuyo
     * @return Retorna true si se salvo la configuracion de inventario
     * correctamente

     */
    public function salvarConfiguracion($datos = array())
    {
        if ($datos['pedido']) {
            $cfgPedidos = new Confpedidos();
            $datos['vigenciapedido'] = $datos['vigenciapedido'] ? $datos['vigenciapedido'] : 7;
            if ($datos['conContrato'] == 'true') {
                $datos['tipopedido'] = 1;
            } else {
                $datos['tipopedido'] = 0;
            }
            if ($cfgPedidos->existeConfiguracion($datos['idestructuracomun'])) {
                $cfgPedidos->assignIdentifier($datos['idestructuracomun']);
            }
            $cfgPedidos->synchronizeWithArray($datos);
            $cfgPedidos->save();
        } else {
            $cfgDistribucion = new Confdistribucion();
            $cfgPlanconsumo = new Confplanconsumo();
            if (!$datos['porpedidos'] && !$datos['sinpedidos']) {
                $datos['tipodistribucion'] = 0;
            } else {
                if ($datos['porpedidos'] && !$datos['sinpedidos']) {
                    $datos['tipodistribucion'] = 1;
                } else {
                    if (!$datos['porpedidos'] && $datos['sinpedidos']) {
                        $datos['tipodistribucion'] = 2;
                    } else {
                        $datos['tipodistribucion'] = 3;
                    }
                }
            }
            if (!$datos['prioridad'] && !$datos['equitativa'] && !$datos['mixta']) {
                $datos['formadistribucion'] = 0;
            } else {
                if ($datos['prioridad']) {
                    $datos['formadistribucion'] = 1;
                } else {
                    if ($datos['equitativa']) {
                        $datos['formadistribucion'] = 2;
                    } else {
                        $datos['formadistribucion'] = 3;
                    }
                }
            }
            if (!$datos['completarmaximoPP'] && !$datos['completarmaximoSP']) {
                $datos['completarmaximo'] = 0;
            } else {
                if ($datos['completarmaximoPP'] && !$datos['completarmaximoSP']) {
                    $datos['completarmaximo'] = 1;
                } else {
                    if (!$datos['completarmaximoPP'] && $datos['completarmaximoSP']) {
                        $datos['completarmaximo'] = 2;
                    } else {
                        $datos['completarmaximo'] = 3;
                    }
                }
            }
            $datos['politicacovertura'] = $datos['politicacovertura'] ? 1 : 0;
            $datos['diascriticos'] = $datos['diascriticos'] ? $datos['diascriticos'] : 0;
            //datos de Plan de Consumo
            $datos['insertar'] = $datos['insertar'] ? 1 : 0;
            $datos['modificar'] = $datos['modificar'] ? 1 : 0;
            $datos['importar'] = $datos['importar'] ? 1 : 0;
            if ($datos['treinta'] == 'on') {
                $datos['duracionplan'] = 30;
            }
            if ($datos['tresseiscinco'] == 'on') {
                $datos['duracionplan'] = 365;
            }
            if ($datos['otraduracion'] == 'on') {
                $datos['duracionplan'] = $datos['otros'];
            }
            if ($cfgDistribucion->existeConfiguracion($datos['idestructuracomun'])) {
                $cfgDistribucion->assignIdentifier($datos['idestructuracomun']);
            }
            if ($cfgPlanconsumo->existeConfiguracion($datos['idestructuracomun'])) {
                $cfgPlanconsumo->assignIdentifier($datos['idestructuracomun']);
            }
            $cfgDistribucion->synchronizeWithArray($datos);
            $cfgPlanconsumo->synchronizeWithArray($datos);
            $cfgDistribucion->save();
            $cfgPlanconsumo->save();
        }
        return true;
    }

    /**
     * @method devolverConfiguracion
     * @author Antonio Diaz Soutuyo
     * @return Retorna la configuracion si existe
     */
    public function devolverConfiguracion($identidad = null)
    {
        $identidad = (is_null($identidad) || $identidad == 0) ? $this->global->Estructura->idestructura : $identidad;
        $confdist = new Confdistribucion();
        $confplan = new Confplanconsumo();
        $confpedido = new Confpedidos();
        $dql = Doctrine_Query::create();
        $dqlDist = $confdist->devolverConfiguracion($dql, $identidad);
        $confDist = $dqlDist->fetchArray();
        $dqlPlan = $confplan->devolverConfiguracion($identidad);
        $confPlan = $dqlPlan->fetchArray();
        $dqlPedido = $confpedido->devolverConfiguracion($identidad);
        $confPed = $dqlPedido->fetchArray();
        $return = array();
        if(count($confDist) > 0){
            $return = array_merge($return, $confDist[0]);
        }
        if (count($confPlan) > 0) {
            $return = array_merge($return, $confPlan[0]);
        }
        if (count($confPed) > 0) {
            $return = array_merge($return, $confPed[0]);
        }
        return array($return);
    }

    public function devolverTodosClientes($datosDoc)
    {
        $filtro = array();
        if ($datosDoc['criterio']) {
            $filtro['nombre'] = $datosDoc['criterio'];
            $filtro['codigo'] = $datosDoc['criterio'];
        }
        $datos = $this->configuracionHelper->getClientesProveedorByParams(
            null, $this->global->Estructura->idestructura, true, false, false, $filtro,
            $datosDoc['start'],
            $datosDoc['limit']
        );
        if ($datos['cantidad'] > 0) {
            foreach ($datos['datos'] as $index => $objCliente) {
                foreach ($datosDoc['idseleccionados'] as $idCliente) {
                    if ($objCliente['idclientesproveedores'] == $idCliente) {
                        unset($datos['datos'][$index]);
                    }
                }
            }
        }
        return array('cantidad' => count($datos['datos']), 'datos' => array_values($datos['datos']));
    }

    public function devolverProductos($datosDoc)
    {
        if ($datosDoc['idcategoria']) {
            $response = Doctrine::getTable('DatCuadrobasico')
                ->findByDql(
                'idcategoria = ?', array($datosDoc['idcategoria'])
            );
            $datosCuadrobasico = $response->toArray();
            $cuadrobasicoproducto = new DatCuadrobasicoproducto();
            $datosProducto = $cuadrobasicoproducto->getProductosCuadrobasico(
                $datosDoc, $datosCuadrobasico[0]['idcuadrobasico']
            );
        }
        return $datosProducto;
    }

    public function devolverClientes($datosDoc)
    {
        if ($datosDoc['idcategoria']) {
            $response = Doctrine::getTable('DatCuadrobasico')
                ->findByDql(
                'idcategoria = ?', array($datosDoc['idcategoria'])
            );
            $datosCuadrobasico = $response->toArray();
            $cuadrobasicocliente = new DatCuadrobasicocliente();
            $datosCliente = $cuadrobasicocliente->getClientesCuadrobasico(
                $datosDoc, $datosCuadrobasico[0]['idcuadrobasico']
            );
            if ($datosDoc['criterio']) {
                $busqueda = array();
                $filtro['nombre'] = $datosDoc['criterio'];
                $filtro['codigo'] = $datosDoc['criterio'];
            }
            foreach ($datosCliente['datos'] as &$data) {
                $clientes = $this->configuracionHelper->getClientesProveedorByParams(
                    $data['idcliente'], $this->global->Estructura->idestructura, true, false, false, $filtro, false,
                    false
                );
                $data['nombre'] = $clientes['datos'][0]['nombre'];
                $data['codigo'] = $clientes['datos'][0]['codigo'];
                if (isset($busqueda)) {
                    if (count($clientes['datos']) > 0) {
                        $busqueda[] = $data;
                    }
                }
            }
        }
        if (isset($busqueda)) {
            return array('cantidad' => count($busqueda), 'datos' => $busqueda);
        } else {
            return array('cantidad' => $datosCliente['cantidad'], 'datos' => $datosCliente['datos']);
        }
    }

    public function devolverCategoriasEstructuras($datosDoc)
    {
        $datCategoriadistribucion = new DatCategoriadistribucion();
        $datosCategoria = $datCategoriadistribucion->ObtenerCategoriasEstructuras(
            $datosDoc, $this->global->Estructura->idestructura
        );
        return array('cantidad' => count($datosCategoria), 'datos' => $datosCategoria);
    }

    public function cargarCategorias()
    {
        $datCategoriadistribucion = new DatCategoriadistribucion();
        return $datCategoriadistribucion->ObtenerCategorias($this->global->Estructura->idestructura);
    }

    public function adicionarCategoria($datosDoc)
    {
        $categoriadistribucion = new DatCategoriadistribucion();
        $existe = $categoriadistribucion->existeDenominacionCategoria($datosDoc);
        if ($existe == null) {
            $categoriadistribucion->denominacion = $datosDoc->denominacion;
            $categoriadistribucion->save();
        }
        $idcategoria = ($existe == null) ? $categoriadistribucion->idcategoria : $existe[0]['idcategoria'];
        $idestructura = $this->global->Estructura->idestructura;
        $res = Doctrine::getTable('DatCuadrobasico')
            ->findByDql(
            'idcategoria = ? and idestructura = ?', array($idcategoria, $idestructura)
        );
        if (count($res->toArray()) == 0) {
            $cuadrobasico = new DatCuadrobasico();
            $cuadrobasico->idcategoria = $idcategoria;
            $cuadrobasico->idestructura = $idestructura;
            $cuadrobasico->save();
            return true;
        }
        return false;
    }

    public function eliminarCategoria($datosDoc)
    {
        if ($datosDoc->idcategoria) {
            $response = Doctrine::getTable('DatCuadrobasico')
                ->findByDql(
                'idcategoria = ?', array($datosDoc->idcategoria)
            );
            if (count($response->toArray()) == 1) {
                Doctrine_Query::create()
                    ->delete()
                    ->from('DatCategoriadistribucion')
                    ->where('idcategoria = ?', array($datosDoc->idcategoria))
                    ->execute();
            } else {
                Doctrine_Query::create()
                    ->delete()
                    ->from('DatCuadrobasico')
                    ->where(
                        'idcategoria = ? and idestructura = ?',
                        array($datosDoc->idcategoria, $this->global->Estructura->idestructura)
                    )
                    ->execute();
            }
            return true;
        }
        return false;
    }

    public function adicionarProducto($datosDoc)
    {
        $collcuadrobasicoproducto = new Doctrine_Collection('DatCuadrobasicoproducto');
        if (is_array($datosDoc['productos']) && count($datosDoc['productos']) > 0) {
            $response = Doctrine::getTable('DatCuadrobasico')
                ->findByDql(
                'idcategoria = ?', array($datosDoc['idcategoria'])
            );
            $datosCuadrobasico = $response->toArray();
            foreach ($datosDoc['productos'] as $datos) {
                $cuadrobasicoproducto = new DatCuadrobasicoproducto();
                if (!$cuadrobasicoproducto->existeCuadroBasicoProducto(
                    $datosCuadrobasico[0]['idcuadrobasico'], $datos['idindicador']
                )
                ) {
                    $cuadrobasicoproducto->synchronizeWithArray(
                        array('idcuadrobasico' => $datosCuadrobasico[0]['idcuadrobasico'],
                            'idproducto' => $datos['idindicador'])
                    );
                    $collcuadrobasicoproducto->add($cuadrobasicoproducto);
                }
            }
        }
        if ($collcuadrobasicoproducto->count()) {
            $collcuadrobasicoproducto->save();
            return true;
        }
        return false;
    }

    public function adicionarCliente($datosDoc)
    {
        $collcuadrobasicocliente = new Doctrine_Collection('DatCuadrobasicocliente');
        if (is_array($datosDoc['clientes']) && count($datosDoc['clientes']) > 0) {
            $response = Doctrine::getTable('DatCuadrobasico')
                ->findByDql(
                'idcategoria = ?', array($datosDoc['idcategoria'])
            );
            $datosCuadrobasico = $response->toArray();
            foreach ($datosDoc['clientes'] as $datos) {
                $cuadrobasicocliente = new DatCuadrobasicocliente();
                if (!$cuadrobasicocliente->existeCuadroBasicoCliente(
                    $datosCuadrobasico[0]['idcuadrobasico'], $datos['idcliente']
                )
                ) {
                    $cuadrobasicocliente->synchronizeWithArray(
                        array('idcuadrobasico' => $datosCuadrobasico[0]['idcuadrobasico'],
                            'idcliente' => $datos['idcliente'])
                    );
                    $collcuadrobasicocliente->add($cuadrobasicocliente);
                }
            }
        }
        if ($collcuadrobasicocliente->count()) {
            $collcuadrobasicocliente->save();
            return true;
        }
        return false;
    }

    public function eliminarProducto($datosDoc)
    {
        if ($datosDoc['datos']) {
            foreach ($datosDoc['datos'] as $dat) {
                Doctrine_Query::create()
                    ->delete('idcuadrobasicoproducto')
                    ->from('DatCuadrobasicoproducto')
                    ->where("idcuadrobasicoproducto = ?", array($dat['idcuadrobasicoproducto']))
                    ->execute();
            }
            return true;
        }
        return false;
    }

    public function eliminarCliente($datosDoc)
    {
        if ($datosDoc['datos']) {
            foreach ($datosDoc['datos'] as $dat) {
                Doctrine_Query::create()
                    ->delete('idcuadrobasicocliente')
                    ->from('DatCuadrobasicocliente')
                    ->where("idcuadrobasicocliente = ?", array($dat['idcuadrobasicocliente']))
                    ->execute();
            }
            return true;
        }
        return false;
    }

    public function heredarCategoria($datosDoc)
    {
        $categoriadistribucion = new DatCategoriadistribucion();
        foreach ($datosDoc as $dat) {
            $existe = $categoriadistribucion->existeDenominacionCategoria($dat);
            if ($existe == null) {
                $categoriadistribucion->denominacion = $dat->denominacion;
                $categoriadistribucion->save();
            }
        }
        $idcategoria = ($existe == null) ? $categoriadistribucion->idcategoria : $existe[0]['idcategoria'];
        $idestructura = $this->global->Estructura->idestructura;
        $res = Doctrine::getTable('DatCuadrobasico')
            ->findByDql(
            'idcategoria = ? and idestructura = ?', array($idcategoria, $idestructura)
        );
        if (count($res->toArray()) == 0) {
            $cuadrobasico = new DatCuadrobasico();
            $cuadrobasico->idcategoria = $idcategoria;
            $cuadrobasico->idestructura = $idestructura;
            $cuadrobasico->save();
            return true;
        }
        return false;
    }
}
