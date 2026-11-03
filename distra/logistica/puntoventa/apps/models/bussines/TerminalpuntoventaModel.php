<?php

class TerminalpuntoventaModel extends ComunpuntoventaModel
{
    private $_serviciosRecursosHumanos,$config;
    
    public function __construct($datos = array())
    {
        parent::__construct($datos);
        $this->_serviciosRecursosHumanos = ServiciosRecursosHumanosHelper::__init();
    }

    public function cargarCajas($params)
    {
        return $this->getCajaAreaAll($params);
    }

    public function iniciarSesion($params)
    {
        if($this->validarCierre($params)){
            //throw new LogisticaException('LOG_LB_PUNTOVENTA_006', null, null, $params['fechaapertura']);
        }    
        $params['horaapertura'] = date("H:i:s");
        $sesion = Doctrine::getTable('DatSeccion')->findByDql("idusuario = {$params['idusuario']}
        and idcaja = {$params['idcaja']} and fechacierre is null")[0];

        if($sesion->idseccion == null){
            $sesion = new DatSeccion();
            $sesion->synchronizeWithArray($params);
            $sesion->save();
        } else {
            $sqlVentas = "select count(distinct d.iddocumento) as cantidad
                          from mod_logistica.dat_documento d 
                          inner join mod_logpuntoventa.dat_ventas v on v.idventas = d.iddocumento
                          inner join mod_logpuntoventa.dat_areaventa da on da.idareaventa = v.idareaventa 
                          inner join mod_logpuntoventa.dat_seccion ds on ds.idcaja = v.idcaja 
                          inner join mod_logpuntoventa.dat_caja dc on dc.idcaja = v.idcaja 
                          inner join mod_logpuntoventa.nom_tipocaja nc on nc.idtipocaja = dc.idtipocaja 
                          inner join mod_estructuracomp.v_dametodasestructuras t on t.idestructura = d.idestructuracomun 
                          where d.idusuario = {$params['idusuario']} and d.fechacontable <= '{$sesion->fechaapertura}' and v.idcierreventa is null 
                          and dc.activo = 1 and dc.idcaja = {$params['idcaja']} 
                          ";
            $result = $this->doctrineHelper->executeQuery($sqlVentas)->fetchAll(PDO::FETCH_ASSOC);
            if ($result[0]['cantidad'] == 0) {
                $sesion->synchronizeWithArray($params);
                $sesion->save();
            }
        }
        $areaVenta = $this->cargaInicial($sesion);
        $areaVenta['datos'][0]['efectivo'] = $params['efectivo'];
        $areaVenta['datos'] = $areaVenta['datos'][0];
        return $areaVenta;
    }

    /*private function obtenerAreaVentaSegunCaja($idcaja)
    {
        $query = Doctrine_Query::create()
         ->select('dav.idestructuraop as idestructuraop,dav.idareaventa as idareaventa,dav.diashabiles as diashabiles,
                   dav.idcliente,dav.idmodopago,dav.idnomoperaciones,dav.idtipoprecio')
         ->from('DatCaja dc')->innerJoin('dc.DatAreaventa dav')->where(
                'dc.idtipocaja = ? AND dav.idestructuracomun = ?',
                array($idcaja, $this->global->estructura->idestructura)
            )->fetchArray();
        return $query[0];
    }*/

    public function cerrarSesion($params = [])
    {
        if ($params['idseccion'] && !is_array($params['idseccion'])) {
            $sesion = new DatSeccion();
            $sesion->assignIdentifier($params['idseccion']);
            $sesion->fechacierre = $params['fechacierre'];
            $sesion->horacierre = date("H:i:s");
        } elseif($params['idseccion'] && is_array($params['idseccion'])){
            $sesion = new Doctrine_Collection('DatSeccion');
            foreach ($params['idseccion'] as $item) {
                $sesionAbierta = new DatSeccion();
                $sesionAbierta->assignIdentifier($item['idseccion']);
                $sesionAbierta->fechacierre = $params['fechacierre'];
                $sesionAbierta->horacierre = date("H:i:s");
                $sesion->add($sesionAbierta);
            }
        }elseif($params['addWhere']!= ''){
            $hora = date("H:i:s");
            $sql = "UPDATE mod_logpuntoventa.dat_seccion 
                    SET fechacierre = '{$params['fechacierre']}',horacierre = '{$hora}'
                    WHERE idseccion in (select s.idseccion from mod_logpuntoventa.dat_seccion s
                    inner join mod_logpuntoventa.dat_caja c on c.idcaja = s.idcaja
                    inner join mod_logpuntoventa.dat_areaventa dav on dav.idareaventa = c.idareaventa
                    where s.idusuario = {$this->idusuario} and s.fechacierre is null {$params['addWhere']})";
                    $sesion = $this->doctrineHelper->getConnection()->execute($sql);
                    return array('success' => true);

        }
        else {
            $usuarios = implode(',', $params);
            $sesion = Doctrine::getTable('DatSeccion')->findByDql("idusuario IN ({$usuarios}) and fechacierre is null");
            foreach ($sesion as &$sesionAbierta) {
                $sesionAbierta['fechacierre'] = $params['fechacierre'];
                $sesionAbierta['horacierre'] = date("H:i:s");
            }
        }
        $sesion->save();
        return array('success' => true);
    }

    public function cargaInicial($datos = null)
    {
        $addWhere = "";
        $idusuario = $this->global->Perfil->idusuario;
        $idestructuracomun = $this->global->estructura->idestructura;
        $addWhere .= ($datos['idcaja'])?" AND m2.idcaja = {$datos['idcaja']}":"";
        $addWhere .= ($datos['idseccion'])?" AND m.idseccion = {$datos['idseccion']}":"";
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT m.idseccion, m.efectivo, m2.idcaja, m4.idestructuraop, m4.idareaventa, 
                m4.diashabiles,m4.idcliente,m4.idmodopago,m4.idnomoperaciones,m4.idtipoprecio,
                m4.idmoneda,nm.codigoiso as monedaventa,upper(m4.nombre) as nombretienda,
                upper(m3.denominacion) as nombrecaja,m4.noobligatorio,m4.opcionimprimir,
                m4.nocierrediario,m4.nodatosposventa,m4.nocierreperiodo,de.denominacion as deposito,
                m2.consumerkey, m2.consumersecret,m.fechaapertura,m4.idcondicionpago,
                m2.idmodeloimpresion,m2.modeloimpresion
                FROM mod_logpuntoventa.dat_seccion m
                INNER JOIN mod_logpuntoventa.dat_caja m2 ON m.idcaja = m2.idcaja
                INNER JOIN mod_logpuntoventa.nom_tipocaja m3 ON m2.idtipocaja = m3.idtipocaja
                INNER JOIN mod_logpuntoventa.dat_areaventa m4 ON m2.idareaventa = m4.idareaventa
                INNER JOIN mod_estructuracomp.v_dametodasestructuras de on de.idestructura = m4.idestructuraop
                LEFT JOIN mod_datosmaestros.nom_moneda nm ON nm.idmoneda = m4.idmoneda
                WHERE (m.idusuario = {$idusuario} AND m.fechacierre is null
                AND m4.idestructuracomun = {$idestructuracomun} AND m2.activo = 1 $addWhere)
                limit 1";

        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $this->config = $datos[0];
        $count = count($datos);
        //echo '<pre>';
        //echo $this->_fechacontable;
        //print_r($this->global->FechaContable);
        //print_r($this->config);
        $fechacontable = $this->global->FechaContable->fecha;
        if($this->global->FechaContable->fechasist != $fechacontable && (/*$count > 0 &&*/ !$this->config['nocierreperiodo'])){
            //throw new LogisticaException('LOG_LB_PUNTOVENTA_002');
        }

        if($count > 0 && !$this->config['nocierrediario'] && $this->config['fechaapertura'] != $this->global->FechaContable->fechasist){
            throw new LogisticaException('LOG_LB_PUNTOVENTA_003');
        }
        
        if($count > 0){
            $datos[0]['tasacambio'] = $this->getTasasCambio();
        }
        return ['success' => $count > 0 ? true : false,'datos' => $datos];
    }

    private function obtenerDatosDpt(&$params){
        $params['municipio'] = 'Habana del este';
        $conn = Doctrine_Manager::connection();
        $sql = "select iddpt from mod_datosmaestros.nom_dpt where denominacion ilike '{$params['provincia']}%'
                union 
                select iddpt from mod_datosmaestros.nom_dpt where denominacion ilike '{$params['municipio']}%'";
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        $params['idprovincia'] = ($datos[0])?$datos[0]:null;
        $params['idmunicipio'] = ($datos[1])?$datos[1]:null;
    }

    public function addDatosPersona($params){
        $this->obtenerDatosDpt($params);
        if(!$params['idpersona'] && $params['numeroidentidad']){
            $ventaCliente = Doctrine::getTable('DatVentacliente')->findByDql("numeroidentidad = ? and tipo = 0",array($params['numeroidentidad']));
            
            if($ventaCliente[0]->idventacliente){
                return $ventaCliente[0]->idventacliente;
            }else{
                $ventacliente = new DatVentacliente();
                $ventacliente->synchronizeWithArray($params);
                $ventacliente->save();
                return $ventacliente['idventacliente'];
            }            
        }else{
            return $params['idpersona'];
        }
    }

    private function registrarDatosOrden($params, &$venta)
    {
        $datosOrden = new DatVentaorden();
        $datosOrden->synchronizeWithArray($params['datosorden']);
        $venta->DatVentaorden->add($datosOrden);
    }

    public function adicionarVenta($params, $obDoc = false)
    {
        $venta = new DatVenta();
        if ($params['diashabiles']) {
            $params['fechaexpiracion'] = $this->createFecha($params);
        }
        $params['numeroidentidad'] = strtoupper($params['numeroidentidad']);
        /*if(!$params['idpersona'] && $params['numeroidentidad']){       
            $ventaCliente = Doctrine::getTable('DatVentacliente')->findByDql("numeroidentidad = ? and tipo = 0",array($params['numeroidentidad']));
            
            if($ventaCliente[0]->idventacliente){
                $params['idpersona'] = $ventaCliente[0]->idventacliente;
            }else{
                $ventacliente = new DatVentacliente();
                $ventacliente->synchronizeWithArray($params);
                $ventacliente->save();
                $params['idpersona'] = $ventacliente['idventacliente'];
            }            
        }  */
        $params['idpersona'] = $this->addDatosPersona($params);
        if($params['entrega']){
            $params['identrega'] = $this->addDatosPersona($params['entrega']);
        }

        $params['idmoneda'] = $params['movimientos'][0]['idmoneda'];

        if (isset($params['tipoconceptoventa'])) {
            if ($params['tipoconceptoventa'] == 1) {
                $params['calculoconcepto'] = round($params['importe']*$params['valorconcepto']/100,2);
            }else if ($params['tipoconceptoventa'] == 0) {
                $params['calculoconcepto'] = $params['valorconcepto'];
            }
        }

        $venta->synchronizeWithArray($params);
        if($params['datosorden']){
            $this->registrarDatosOrden($params, $venta);
        }
        $this->registrarVentaProductos($params, $venta);

        //if (empty($params['idpersona'])) {
        $venta->set('estado', '2');
        /*} else {
            $venta->set('estado', '1');      
        }*/

        /*if($params['idoperacion']){
            $params['idventas'] = $venta->idventas;
            $params['idsubsistema'] = LogisticaGlobal::SUBSISTEMA_INV;
            $facturaService = new FacturacionService();
            $datos = $facturaService->adicionarFactura($params);
            $venta->nroventa = ($datos['numero'])?$datos['numero']:$datos['numeroref'];
            $venta->fechaventa = $datos['fechacontable'];
        }else{
            $this->updateExistenciaByProduct($params);
        }*/

        $venta->save();
        $farmaciaSql = "select nv.valor from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'farmacia'";
        $isFarmacia = LogisticaDoctrineHelper::__init()->getConnection()->execute($farmaciaSql)->fetchAll(PDO::FETCH_ASSOC);
        if (count($isFarmacia) > 0 && $isFarmacia[0]['valor'] == 1) {
            $usuario = $this->global->Perfil->usuario;
            $sqlInsert = "INSERT INTO 
                  mod_logfarmacia.dat_entregaproducto
                (
                  fechaentrega,
                  cantidadentregada,
                  entregadapor,
                  idproductotarjetamedicamento
                )
                (select d.fechacontable, pp.cantidad, '{$usuario}',q.idproductotarjetamedicamento
                from mod_logpuntoventa.dat_ventas dv
                     inner join mod_logpuntoventa.dat_ventacliente vtc on vtc.idventacliente = dv.idpersona
                     inner join mod_logistica.dat_documento d on d.iddocumento = dv.idventas
                     inner join mod_logpuntoventa.dat_areaventa av on av.idareaventa = dv.idareaventa
                     inner join mod_logistica.dat_movimiento pp on pp.iddocumento = d.iddocumento
                     inner join mod_logistica.dat_producto dp on dp.idproducto = pp.idproducto
                     inner join (select vc.idventacliente, ptm.idproductotarjetamedicamento, ptm.idindicador, dd.idestructuracomun
                                 from mod_logfarmacia.dat_productotarjetamedicamento ptm
                                inner join mod_logfarmacia.dat_tarjetamedicamento tm on tm.idtarjetamedicamento = ptm.idtarjetamedicamento
                                inner join mod_logistica.dat_documento dd on dd.iddocumento = tm.idtarjetamedicamento
                                inner join mod_logpuntoventa.dat_ventacliente vc on vc.idventacliente = tm.idpaciente
                                where  dd.estado = 3) q on q.idventacliente = vtc.idventacliente and q.idestructuracomun = av.idestructuracomun and q.idindicador = dp.idindicador
                where dv.idventas = {$venta->idventas}
                )";
            $resp = Doctrine_Manager::connection()->fetchAll(
                $sqlInsert
            );
        }

        $comprobante = false;
        if ($obDoc && $this->getOperacionComprobante($params['idoperacion']) == 1) {
            $comp = $obDoc->generarComprobante(array($params['iddocumento']), LogisticaGlobal::SUBSISTEMA_FAC);
            $comprobante = $comp[0];
        }
        //print_r($venta->toArray());die;
        if(!$params['noreturn']){
            return array(
                'datos' => array('idusuario' => $this->global->Perfil->idusuario, 'idventas' => $venta['idventas'],
                    'idestructura' => $this->global->Estructura->idestructura, 'nroventa' => $venta['nrofactura'],
                    'vendedor' => $params['vendedor'],'idmodeloimpresion' => $venta['idmodeloimpresion'],
                    'comprobante' => ($comprobante) ? $comprobante : null)
            );
        }

    }

    private function registrarVentaProductos($params, &$venta)
    {
        $collMoneda = new Doctrine_Collection('DatMovmoneda');
        $this->updateEfectivoEnCaja($params);
        foreach ($params['movimientos'] as $mov) {
            $producto = $params['productos'][$mov['idproducto']];
            $movMoneda = new DatMovmoneda();
            $movMoneda->idmoneda = $producto['idmoneda'];
            $movMoneda->idmovimiento = $mov['idmovimiento'];
            $movMoneda->precio = $producto['precio'];
            $movMoneda->importe = $producto['importetotal'];
            $collMoneda->add($movMoneda);
            $ventaProducto = new DatVentaproducto();
            $ventaProducto->synchronizeWithArray($producto);
            $venta->DatVentaproducto->add($ventaProducto);
        }
        $collMoneda->save();        
    }

    /*public function createFecha($params)
    {
        $fecha = split('-', $params['fechaventa']);
        $fechaexpiracion = date_create("$fecha[2]/$fecha[1]/$fecha[0]");
        date_add($fechaexpiracion, date_interval_create_from_date_string("{$params['diashabiles']} days"));
        $fechaexpfin = date_format($fechaexpiracion, 'd/m/Y');
        return $fechaexpfin;
    }*/

    /*public function findLastNroventa()
    {
        return Doctrine_Query::create()->from('DatVenta')->count();
    }*/

    /*public function updateExistenciaByProduct($params)
    {
        $collection = new Doctrine_Collection('DatProductoLogistica');
        foreach ($params['productos'] as $prod) {
            $dProdLog = new DatProductoLogistica();
            $dProdLog->assignIdentifier($prod['idproducto']);
            $dProdLog->cantidad -= $prod['cantidad'];
            //$dProdLog->disponible -= $prod['cantidad'];
            $collection->add($dProdLog);
        }
        $collection->save();
    }*/

    public function updateEfectivoEnCaja($params)
    {
        $sesion = new DatSeccion();
        $sesion->assignIdentifier($params['idseccion']);
        $sesion->set('efectivo', $sesion->efectivo + ($params['efectivo'] - $params['cambio']));
        $sesion->save();
    }

    /**
     * Servicio para cambiar el estado a la venta
     * @param array $params
     */
    /*public function cambiarEstadoVenta($params)
    {
        $venta = new DatVenta();
        $venta->assignIdentifier($params['idventas']);
        $venta->set('estado', $params['estado']);
        $venta->save();
    }*/

    /**
     * @method devuelve las personas de la entidad
     * @param $idEntidad
     * @return mixed
     */
    public function cargarPersonas($params = array())
    {
        /* try{
            $fuc = new FUCModel();
            $params['identidad_numero'] = '85070105829';//$params['query'];
            $res = json_decode($fuc->buscarPersonaFUC($params));
            print_r($res);die;
        } catch (Exception $ex) {
            throw DBALException::driverExceptionDuringQuery($this->_driver, $ex, $statement);
        } */
        
        $cliente = Doctrine_Query::create()
         ->from('DatVentacliente')
         ->where("numeroidentidad ILIKE '{$params['query']}%' and tipo = 0");

        return array("datos" => $cliente->offset($params['start'])->limit($params['limit'])->fetchArray(), 
                "cantidad" => count($cliente->fetchArray()));
    }

    public function insertarDatosPosVenta($params)
    {
        if($params['idmodopago'] == -1){
            $venta = new DatVenta();
            $venta->assignIdentifier($params['idventas']);
            $venta->efectivo = $params['efectivo'];
            $venta->cambio = $params['cambio'];
            $venta->idpago = $params['idmodopago'];
            $venta->save();
        }elseif($params['idmodopago'] == -2){
            $ventaTarjeta = new DatVentatarjeta();
            $ventaTarjeta->synchronizeWithArray($params);
            $ventaTarjeta->save();
        }elseif($params['idmodopago'] == -4 || $params['idmodopago'] == -5){
            $params['tipocliente'] = 1;
            $this->adicionarClientes($params['idventas'], array($params), true);
        }
        
    }

    /*public function validarAperturaCaja($fechacontable){
        $idestructuracomun = $this->global->estructura->idestructura;
        $sql = "select ds.fechaapertura from mod_logpuntoventa.dat_seccion ds
        inner join mod_logpuntoventa.dat_caja dc on dc.idcaja = ds.idcaja
        inner join mod_logpuntoventa.dat_areaventa da on da.idareaventa = dc.idareaventa
        where ds.idusuario = {$this->idusuario} and ds.fechacierre is null
        and da.idestructuracomun = {$idestructuracomun} and (select count(dv.idventas) from mod_logpuntoventa.dat_ventas dv
        inner join mod_logistica.dat_documento dd on dd.iddocumento = dv.idventas
        where dd.fechacontable = ds.fechaapertura and dd.idusuario = {$this->idusuario}
        and dv.idcierreventa is null) > 0";

        $fecha = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return ($fecha[0] == '')?false:($fecha[0]!= $fechacontable)?true:false;
    }*/
    public function registrarEfectivo($params)
    {
        $params['hora'] = date("H:i:s");
        $ventaTarjeta = new DatRegistroefectivo();
        $ventaTarjeta->synchronizeWithArray($params);
        $ventaTarjeta->save();             
    }
	
	public function validarCierre($params) {
        $sql = "select count(ds.idseccion) from mod_logpuntoventa.dat_seccion ds where ds.idusuario = {$this->idusuario} 
                and ds.fechaapertura = '{$params['fechaapertura']}' and ds.idcaja = {$params['idcaja']} and ds.fechacierre is not null";
        //echo $sql;die;
        $cierre = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return false;
        return ($cierre[0] > 0);
    }      
    
    public function datosPagoQREnzona(/*$params*/){
        $addWhere = "";
        $idusuario = $this->global->Perfil->idusuario;
        $idestructuracomun = $this->global->estructura->idestructura;
        
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT m2.consumerkey, m2.consumersecret
                FROM mod_logpuntoventa.dat_seccion m 
                INNER JOIN mod_logpuntoventa.dat_caja m2 ON m.idcaja = m2.idcaja 
                INNER JOIN mod_logpuntoventa.dat_areaventa m4 ON m2.idareaventa = m4.idareaventa
                WHERE (m.idusuario = {$idusuario} AND m.fechacierre is null 
                AND m4.idestructuracomun = {$idestructuracomun} AND m2.activo = 1 $addWhere)
                limit 1";
        return $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function actualizarDatosVenta($params) {
        $respuesta = Doctrine_Manager::connection()->fetchAll(
                    "update mod_logpuntoventa.dat_ventas 
                set idoperacion = '{$params['idoperacion']}',
                 transaccion = '{$params['transaccion']}'
                where idventas = {$params['iddocumento']}"
                );
        return true;
    }

    public function getOperacionComprobante($idoperacion) {
        $aux = Doctrine::getTable('DatOperacionsubsistema')->findBySql(
            'idnomoperaciones = ? and idestructura = ?', array($idoperacion, $this->global->estructura->idestructura)
        );
        return $aux[0]['comprobante'];
    }

    public function cargarPersonasArea($idareaventa, $params) {
        $limit = "";
        if (isset($parametros['start']) && isset($parametros['limit'])) {
            $limit .= " offset {$params['start']} limit {$params['limit']} ";
        }
        $datos = Doctrine_Manager::connection()->fetchAll(
            "select ps.idserviciopersona, ps.idservicio, ps.idpersona, 
            per.nombre || ' ' || coalesce(per.snombre, '') || ' ' || per.papel || ' ' || per.sapel as nombrepersona, COUNT(*) OVER() as total
            from mod_logpuntoventa.dat_serviciopersona ps 
            inner join mod_persona.dat_persona per on per.idpersona = ps.idpersona 
            where ps.idservicio = {$params['idservicio']} {$limit}"
        );

        return array('datos' => $datos, 'total' => count($datos) ? $datos[0]['count'] : 0);
    }
}
