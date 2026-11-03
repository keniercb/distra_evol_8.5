<?php

class PedidosRealizadosModel extends ZendExt_Model
{
    private $_pedidoSevice, $_aftApertutado, $_ordenTrabajoService;

    public function __construct($aft)
    {
        parent::__construct();
        $this->_pedidoSevice = new PedidoService();
        $this->_ordenTrabajoService = new OrdenTrabajoTalleresService();
        $this->seguridadHelper = ServiciosSeguridadHelper::__init();
        $this->configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        $this->_aftApertutado = $aft;
        if ($aft) {
            $this->servicioActivo = new RegNumActivoService();
        }
    }

    public function cargarPedidos($params)
    {
        $dqlPedido = $this->_pedidoSevice->cargarPedidoByOrdenTrabajo($params);
        $dqlOrden = $this->_ordenTrabajoService->getJoinOrdenTrabajoConPedido($dqlPedido, 't', 'ddl');
        $parametros = array();
        if ($params['fechainicio']) {
            $dqlOrden->addWhere('d.fechacontable >= ?', $params['fechainicio']);
        }
        if ($params['fechafin']) {
            $dqlOrden->addWhere('d.fechacontable <= ?', $params['fechafin']);
        }
        $dqlOrden->where('d.estado = 3');
        if ($params['idestructuracomun']) {
            $idestructuracomuns = explode(',', $params['idestructuracomun']);
            $dqlOrden->whereIn('d.idestructuracomun', $idestructuracomuns);
        } else {
            $dqlOrden->whereIn('d.idestructuracomun', $this->global->Estructura->idestructura);
        }
        if ($params['limit']) {
            if (is_numeric($params['limit']) && is_numeric($params['start'])) {
                $dqlOrden->offset($params['start'])->limit($params['limit']);
            }
        }
        $datos = $dqlOrden->fetcharray();
        if ($this->_aftApertutado) {
            foreach ($datos as $index => $row) {
                $parametros['idregnumerico'] = $row['idproducto'];
                $result = $this->servicioActivo->getRegNumericoDat($parametros)[0];
                if (array_key_exists('nromotor1', $result)) {
                    $datos[$index]['nromotor1'] = $result['nromotor1'];
                }
                if (array_key_exists('vin', $result)) {
                    $datos[$index]['vin'] = $result['vin'];
                }
                if (array_key_exists('numchasis', $result)) {
                    $datos[$index]['numchasis'] = $result['numchasis'];
                }
            }
        }
        return array('cantidad' => $dqlOrden->count(), 'datos' => $datos);
    }


    public function cargarProductos($params)
    {
        $params['dpl'] = true;
        $params['idestructuracomun'] =
            ($params['idestructuracomun']) ? $params['idestructuracomun'] : $this->global->Estructura->idestructura;
        $result = $this->_pedidoSevice->devolverProductosByPedido($params)['datos'];
        foreach ($result as $index => $row) {
            $result[$index]['um'] = $this->configuracionHelper->obtenerUnidadMedidaPorId(
                (int)$row['idumedida']
            )[0]['abreviaturaunidadmedida'];
            $result[$index]['total'] = $row['cantidad'] * $row['precio'];
        }
        return array('cantidad' => count($result), 'datos' => $result);
    }
}