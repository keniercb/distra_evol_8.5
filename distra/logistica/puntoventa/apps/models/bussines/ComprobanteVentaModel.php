<?php

/**
 * Esta clase gestiona la Facturacion del sistema
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class ComprobanteVentaModel extends DocumentoLogisticaModel
{

    private $logisticaDoc;
    private $iddocDev;
    private $serviceLote;
    private $ubicacionServ;
    private $arrayTipoDocumentos;
    private $fechacontable;
    private $userIdValidate;

    /**
     * @throws LogisticaException
     */
    public function __construct($datos = array())
    {
        parent::__construct($datos);
        $this->initTipoDocumentos();
        $this->logisticaDoc = LogisticaDocumentosHelper::__init();
        $objIddoc = $this->logisticaDoc->devuelveIddocByIdEstructura(
            'compventaLog', $this->global->estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $this->iddoc = $objIddoc->iddoc;
        $objIddocDev = $this->logisticaDoc->devuelveIddocByIdEstructura(
            'compdevLog', $this->global->estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $this->iddocDev = $objIddocDev->iddoc;
        $this->fechacontable = $this->global->FechaContable->fecha;
        $this->userIdValidate = !is_null((new VariablesGlobalesModel())->obtenerValor('CLOSE_USER_STORE'));
    }

    private function validarLimitesCantidad($parametros){
        /* $parametros['strProductos'] = "1000610613,1000572337,1000572342,1000563252,1000607793";
        $parametros['numeroidentidad'] = 99031906761; */

        if($parametros['numeroidentidad'] || $parametros['idpersona']){
            $addWhere = ($parametros['numeroidentidad'])?" and vc.numeroidentidad = '{$parametros['numeroidentidad']}' "
                :" and v.idpersona = {$parametros['idpersona']}";
                $conn = Zend_Registry::get('conexion');
                $query = "select distinct q.* from (
                        select distinct vp.idproducto,sum((vp.cantidad - COALESCE(vp.cantidaddev,0))) as cantidad,
                        nv.limitecantidad,nt.cantidaddias,coalesce(n.numeropieza,n.codigo)||' - '||n.denominacion as producto,
                        nat.denominacion as naturaleza,vc.numeroidentidad
                        from mod_logpuntoventa.dat_ventaproducto vp
                        inner join mod_logistica.dat_producto p on p.idproducto = vp.idproducto
                        inner join mod_datosmaestros.nom_indicador n on n.idindicador = p.idindicador
                        inner join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = n.idnaturaleza
                        inner join mod_logpuntoventa.dat_naturalezaventa nv on nv.idnaturaleza = n.idnaturaleza
                        inner join mod_logpuntoventa.nom_tiempo nt on nt.idtiempo = nv.idtiempolimite
                        inner join mod_logpuntoventa.dat_ventas v on v.idventas = vp.idventas
                        inner join mod_logpuntoventa.dat_ventacliente vc on vc.idventacliente = v.idpersona
                        inner join mod_logistica.dat_documento d on d.iddocumento = v.idventas
                        where nt.estado = 1 
                        and d.fechacontable >= CAST(now() as date) - CAST(''||nt.cantidaddias||' days' as interval)
                        and vp.idproducto in ({$parametros['strProductos']})
                        $addWhere
                        group by vp.idproducto,nv.limitecantidad,nt.cantidaddias,n.numeropieza,n.codigo,
                        n.denominacion,nat.denominacion,vc.numeroidentidad) q
                        where q.cantidad >= q.limitecantidad";
                        //(1000610613,1000572337,1000572342,1000563252,1000607793)
                        
                $result = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
                $jsonResult = json_encode($result);                
                
                $conn = Zend_Registry::get('conexion');
                $query = "INSERT INTO mod_logpuntoventa.his_incidencia(
                                idestructuracomun,fecha,informacion
                            )
                            VALUES ({$this->global->estructura->idestructura},
                            '{$this->fechacontable}','".$jsonResult."')";
                $conn->execute($query);
                return array('datos' => $result, 'total' => count($result), 'novender' => true,'success' => false);
        }
        return array('total' => 0);
        
    }

    public function adicionarVenta($parametros)
    {
        if (count($parametros['productos'])) {
            $parametros['strProductos'] = implode(',',array_keys($parametros['productos']));
            $validar = $this->validarLimitesCantidad($parametros);

        }

        if($validar['total'] > 0){
            return $validar;
        }else{
            if ($parametros['idseccion']) {
                if ($this->validarCierre($parametros)) {
                    throw new LogisticaException('LOG_LB_PUNTOVENTA_006', null, null, $this->fechacontable);
                }
            }
            $parametros['idestructuracomun'] = $parametros['iddeposito'];
            $parametros['fechaexterna'] = $this->fechacontable;
            $parametros['iddoc'] = $this->iddoc;
            if ($parametros['nroventa']) {
                $parametros['numeroref'] = $parametros['nrodoc'] = $parametros['nroventa'];
            }
            $entrada = false;
            //$parametros['idcomprobante'] = -1;
            if ($parametros['tipodevolucion']) {
                unset($parametros['idcomprobante']);
                $venta = Doctrine::getTable('DatDocumento')->find($parametros['idventas']);
                if ($venta->idusuario != $this->idusuario || $venta->fechacontable != $this->fechacontable) {
                    unset($parametros['idcomprobante']);
                }
                $parametros['iddoc'] = $this->iddocDev;
                $parametros['observaciones'] = $parametros['motivo'];
                $entrada = true;
                foreach ($parametros['productos'] as &$p) {
                    $p['entrada'] = true;
                    $datosPSql = "select ni.numeropieza as codreferencia from mod_datosmaestros.nom_indicador ni
                                  inner join mod_logistica.dat_producto dp on dp.idindicador = ni.idindicador 
                                  where dp.idproducto = {$p['idproducto']}";
                    $datosProd = LogisticaDoctrineHelper::__init()->getConnection()->execute($datosPSql)->fetchAll(PDO::FETCH_ASSOC);
                    $datosPrecio = Doctrine::getTable('DatMovimientos')
                        ->findByDql('iddocumento = ? and idproducto = ?', array($parametros['idventas'], $p['idproducto']));
                    $p['preciocontable'] = $datosPrecio[0]->preciocontable + $datosPrecio[0]->precioalternativo;
                    $p['precioalternativo'] = 0/*$datosPrecio[0]->precioalternativo*/
                    ;
                    $p['codreferencia'] = $datosProd[0]['codreferencia'];
                    $p['devolver'] = $p['cantidad'];
                    $p['precio'] = $p['precioventa'];
                }
                foreach ($parametros['servicios'] as &$p) {
                    $datosPSql = "select ni.numeropieza as codreferencia from mod_datosmaestros.nom_indicador ni
                                  inner join mod_logpuntoventa.dat_ventaservicio dp on dp.idindicador = ni.idindicador 
                                  where dp.idventaservicio = {$p['idventaproducto']}";
                    $datosProd = LogisticaDoctrineHelper::__init()->getConnection()->execute($datosPSql)->fetchAll(PDO::FETCH_ASSOC);
                    $p['codreferencia'] = $datosProd[0]['codreferencia'];
                    $p['idindicador'] = $datosProd[0]['idindicador'];
                    $p['devolver'] = $p['cantidad'];
                    $p['precio'] = $p['precioventa'];
                }
            }
            $signo = ($entrada) ? LogisticaMovimientoModel::SIGNO_MOV_SUMA : LogisticaMovimientoModel::SIGNO_MOV_RESTA;
            $documento = $this->adicionarDocumento($parametros);
            $documento->save();
            $parametros['iddocumento'] = $documento->iddocumento;
            $parametros['signo'] = $signo;
            $this->adicionarClientes(
                $documento->iddocumento, array(array('idcliente' => $parametros['idcliente'], 'tipocliente' => 1)), false
            );
            if ($parametros['idcondicionpago']) {
                $objDocCl = Doctrine::getTable('DatDocumentoCliente')->findByDql('iddocumento = ?', array($documento->iddocumento));
                $objDocCl[0]->idcondicionpago = $parametros['idcondicionpago'];
                $objDocCl->save();
            } else {
                $objDocV = Doctrine::getTable('DatDocumentoCliente')->findByDql('iddocumento = ?', array($parametros['idventas']));
                $idcondicionV = $objDocV[0]->idcondicionpago;
                if ($idcondicionV) {
                    $objDocCl = Doctrine::getTable('DatDocumentoCliente')->findByDql('iddocumento = ?', array($documento->iddocumento));
                    $objDocCl[0]->idcondicionpago = $idcondicionV;
                    $objDocCl->save();
                }
            }

            if(count($parametros['pagos'])){
                $paymentValues = [];
                foreach ($parametros['pagos'] as $pago) {
                    $paymentValues[] = "({$documento->iddocumento},{$pago['idformapago']},{$pago['importe']})";
                }
                $paymentValues = implode(',', $paymentValues);
                $insert = "insert into mod_logpuntoventa.dat_desglosepago(iddocumento, idformapago, importe) values {$paymentValues}";
                LogisticaDoctrineHelper::__init()->getConnection()->execute($insert);
            }
            
            //$nroventa = $documento->numeroref;
            $movimientos = $this->producto->adicionarMovimientos($documento->iddocumento, $parametros['productos'], $signo, true);
            $servicios = $this->adicionarServicios($documento->iddocumento, $parametros['servicios']);
            if (count($servicios)) {
                $servicios->save();
            }
            //$this->serviceLote->extraerCantidades($movimientos['movimientos']);
    
            $this->confirmarDocumento($documento->iddocumento);
            $cronologia = $this->contabilizarDocumento($documento->iddocumento, false, $this->fechacontable);
            $parametros['cronologia'] = $cronologia;
            $this->producto->aprobarMovimientos($documento->iddocumento, $cronologia, $entrada);//probando cronologia
            $cantComp = new CantidadesComprometidasModel();
            $cantComp->cambiarEstado(2, $documento->iddocumento);
            //$signo = ($entrada) ? LogisticaMovimientoModel::SIGNO_MOV_SUMA : LogisticaMovimientoModel::SIGNO_MOV_RESTA;
            //$this->serviceLote->actualizarExistenciaLote($documento->iddocumento, $entrada, $nroventa, false, $signo);
            /*if (!$entrada)
                $this->ubicacionServ->cambiarEstado($documento->iddocumento, 2);*/
            $documento = Doctrine::getTable('DatDocumento')->find($documento->iddocumento);
            if (!$entrada) {
                $deposito = $this->estructuraHelper->obtenerEstructurasNoFormales(
                    false, $this->idestructura, array(), false, false, array($documento->idestructuracomun), -1
                );
                $estructuraOp = $deposito[0]['DatEstructuraop'];
                $depositoCodigo = $estructuraOp[0]['codigo'];
                $nroFactura = $documento->nrodoc . '.' . $depositoCodigo . '.' . $documento->anno;
                $parametros['idventas'] = $documento->iddocumento;
                $parametros['nroventa'] = $documento->nrodoc;
                $parametros['fechaventa'] = $documento->fechacontable;
                $parametros['movimientos'] = $movimientos['movimientos'];
                $puntoventa = new TerminalpuntoventaModel();
                $vendedor = $this->global->Perfil;
                $parametros['vendedor'] = (strlen($vendedor->nombre) > 2) ? $vendedor->nombre . ' ' . $vendedor->apellidos : $this->global->Perfil->usuario;
                $parametros['nrofactura'] = $nroFactura;
                return $puntoventa->adicionarVenta($parametros, $this);
            } else {
                $parametros['iddevolucion'] = $documento->iddocumento;
                $parametros['nrodev'] = $documento->nrodoc;
                $parametros['fechadevolucion'] = $documento->fechacontable;
                $parametros['movimientos'] = $movimientos['movimientos'];
                $devModel = new DevolucionpuntoventaModel();
                return $devModel->devolverVenta($parametros);
            }
        }
        


    }

    public function adicionarServicios($iddocumento, $servicios) {
        $values = [];
        $collecionS = new Doctrine_Collection('DatVentaservicio');
        foreach ($servicios as $serv) {
            $obj = new DatVentaservicio();
            $obj->synchronizeWithArray($serv);
            $obj->idventas = $iddocumento;
            $collecionS->add($obj);
        }
        return $collecionS;
    }

    public function getIdTarjetaProducto($idproducto, $registro, $conn, $cIndice = false)
    {
        $comparacion = (!$cIndice) ? "di.numero = '{$registro}'" : "t.nrocasoindice = '{$registro}'";
        $sql = "select p.idproductotarjetamedicamento from mod_logfarmacia.dat_productotarjetamedicamento p
                inner join mod_logfarmacia.dat_tarjetamedicamento t on t.idtarjetamedicamento = p.idtarjetamedicamento
                inner join mod_persona.dat_persona per on per.idpersona = t.idpaciente
                LEFT JOIN mod_persona.dat_docidentidad di ON (di.idpersona = per.idpersona and di.principal =1)
                where {$comparacion} and p.idcuadrobasico = (
                    select cb.idcuadrobasico from mod_logfarmacia.conf_cuadrobasico cb 
                    inner join mod_datosmaestros.dat_codificador dc on dc.idcodificador = cb.idcodificador
                    inner join mod_logistica.dat_producto dp on dp.idcodificador = dc.idcodificador
                    where dp.idproducto = {$idproducto} and cb.idestructura = {$this->global->estructura->idestructura}
                )";
        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        if (count($result) > 0)
            return $result[0]['idproductotarjetamedicamento'];
        else
            return -1;
    }

    private function actualizarUbicacion($iddocumento, $ubicar = false)
    {
        $query = Doctrine_Query::create()
            ->select(
                'mu.idmovubicacion, mu.idestructuraubicacion AS idubicacion, mu.cantidad, m.idproducto AS idproducto, '
                . 'up.idubicacionproducto AS idubicacionproducto, ap.idareaproducto AS idareaproducto'
            )
            ->from('DatMovubicacion mu')
            ->innerJoin('mu.DatMovimientos m')
            ->innerJoin('mu.DatEstructuraubicacion eu')
            ->innerJoin('eu.DatArea a')
            ->innerJoin('a.DatAreaproducto ap')
            ->innerJoin('eu.DatUbicacionproducto up')
            ->innerJoin(
                'a.DatEstructuraubicacion eu2 ON (eu2.idarea = a.idarea AND eu2.idestructuraubicacion = eu2.idpadre)'
            )
            ->where(
                'm.iddocumento = ? AND m.idproducto = up.idproducto AND m.idproducto = ap.idproducto '
                . 'AND eu.idarbol = eu2.idarbol', $iddocumento
            )
            ->orderBy('m.idproducto');
        $ubicaciones = $query->fetchArray();
        if ($ubicar) {
            foreach ($ubicaciones as $value) {
                $this->ubicacionServ->ubicarProducto($value);
            }
        } else {
            $this->ubicacionServ->desubicarProducto($ubicaciones);
        }
        return true;
    }

    private function devolverAreasVentasPorEstructura()
    {
        $conn = Zend_Registry::get('conexion');
        $sql = "SELECT idestructuraop FROM mod_logpuntoventa.dat_areaventa
                WHERE idestructuracomun = {$this->global->estructura->idestructura}";
        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return ($result) ? $result : -1;
    }

    public function getDocumentos($parametros = array())
    {
        $parametros['idestructura'] = $this->devolverAreasVentasPorEstructura();
        $relations[] = array('cardinalidad' => 'one', 'relation' => 'DatVenta',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idventas'));
        $this->doctrineHelper->tryInyectRelactions(new DatDocumento(), $relations);
        $relations[] = array('cardinalidad' => 'one', 'relation' => 'DatCierreventa',
            'properties' => array('local' => 'idcierreventa', 'foreign' => 'idcierreventa'));
        $relations[] = array('cardinalidad' => 'many', 'relation' => 'DatDevolucion',
            'properties' => array('local' => 'idventas', 'foreign' => 'idventas'));
        $this->doctrineHelper->tryInyectRelactions(new DatVenta(), $relations);
        $relations[] = array('cardinalidad' => 'one', 'relation' => 'NomModopago',
            'properties' => array('local' => 'idpago', 'foreign' => 'idmodopago'));
        $this->doctrineHelper->tryInyectRelactions(new DatVenta(), $relations);
        if (!$parametros['idestructura']) {
            $parametros['idestructura'] = $this->seguridadHelper
                ->obtenerEstructurasNoFormales($this->global->Perfil->certificado, 8);
        }
        $parametros['filtraiddoc'] = true;
        if ($parametros['all']) {
            $parametros['iddoc'] = array($this->iddoc, $this->iddocDev);
        } else {
            $parametros['iddoc'] = array($this->iddoc/*, $this->iddocDev*/);
        }
        $query = $this->devolverDocumentos($parametros);
        $query->addSelect('d.idcomprobante');
        
        $query->innerJoin('d.DatVenta ddv');
        $query->innerJoin('ddv.DatAreaventa dav');
        $query->addSelect('(SELECT ic.tipo FROM DatInfoConexion ic 
         INNER JOIN ic.DatAreaventa av1 WHERE av1.idareaventa = ddv.idareaventa AND ic.idinfoconexion = av1.idinfoconexion) as tipotienda');
        $query->addSelect("COALESCE(ddv.nrofactura, cast(d.nrodoc as VARCHAR)) as nrofactura,ddv.idcierreventa as cierreventa ,ddv.tipoventa as tipoventa, 
            ddv.idpago as idpago, ddv.importe as importe, ddv.importedevuelto as importedevuelto,
            ddv.vendedor as vendedor,ddv.idpersona as idpersona,
            coalesce(dc.numeroidentidad||' - '||dc.nombre,'-') as clientereal,
            (SELECT COUNT(p.idventaproducto)
            FROM DatVentaproducto p WHERE p.idventas = d.iddocumento) as productos,
            (SELECT COALESCE(SUM(vp.cantidaddev),0) 
            FROM DatVentaproducto vp WHERE vp.idventas = d.iddocumento) as devueltos,
            ord.nroorden as nroorden,ord.tiendavirtual as tiendavirtual,
            coalesce(ord.envio,0) as totalenvio,coalesce(ord.estadoorden,5) as estadoorden,
            ddv.idmodeloimpresion as idmodeloimpresion, (dcv.fecha||' '||dcv.hora) as fechacierre,
            (case when ddv.idmodeloimpresion = 2 then 'Ticket de venta' else 'Factura comercial' end) as modeloimpresion,
            ddv.tipoconceptoventa as tipoconceptoventa, ddv.conceptoventa as conceptoventa, 
            ddv.valorconcepto as valorconcepto, ddv.calculoconcepto as calculoconcepto,
            round((CASE WHEN ddv.conceptoventa = '-' THEN ddv.importe-coalesce(ddv.calculoconcepto,0) 
                  WHEN ddv.conceptoventa = '+' THEN ddv.importe+coalesce(ddv.calculoconcepto,0) ELSE ddv.importe END),2) as importeventa,
                  dav.idnomoperaciondev as idoperaciondev");
        $query->leftJoin('ddv.DatCierreventa dcv');
        $query->leftJoin('ddv.DatVentacliente dc');
        $query->leftJoin('ddv.DatVentaorden ord');
        $query->innerJoin('ddv.NomModopago mp');
        $query->addSelect('mp.denominacion as modopago');
        if ($parametros['devolucion']) {
            $query->leftJoin('ddv.DatDevolucion v');
            $query->addWhere("(SELECT COUNT(p1.idventaproducto)
            FROM DatVentaproducto p1 WHERE p1.idventas = d.iddocumento and p1.cantidad > p1.cantidaddev) > 0");
        }
        if ($parametros['buscar']) {
            $buscar = strtoupper($parametros['buscar']);
            $query->addWhere("(cast(ddv.nroventa as varchar) = '{$buscar}' or UPPER(ord.nroorden) like '{$buscar}'
            or UPPER(dc.numeroidentidad) ilike '%{$buscar}%' or UPPER(dc.nombre) ilike '%{$buscar}%' or UPPER(ord.nroorden) ilike '%{$buscar}%' 
            or UPPER(ddv.nrofactura) ilike '%{$buscar}%')");
        }
        if ($parametros['idareaventa'] && $parametros['idareaventa'] != -1) {
            $query->addWhere("ddv.idareaventa = ?", array($parametros['idareaventa']));
        }
        if ($parametros['idmodopago']) {
            $query->addWhere("ddv.idpago = ?", array($parametros['idmodopago']));
        }
        if ($parametros['idventacliente']) {
            $query->addWhere("dc.idventacliente = ?", array($parametros['idventacliente']));
        }
        if ($parametros['ciudad']) {
            $query->addWhere("dc.provincia = ?", array($parametros['ciudad']));
        }
        if ($parametros['municipio']) {
            $query->addWhere("dc.municipio = ?", array($parametros['municipio']));
        }
        if ($parametros['idmetodo']) {
            if ($parametros['idmetodo'] == 2) {
                $query->addWhere("ord.envio > 0");
            } else {
                $query->addWhere("(ord.envio is null or ord.envio = 0)");
            }
        }
        if ($parametros['idestructuraop']) {
            $query->addWhere("d.idestructuracomun = ?", array($parametros['idestructuraop']));
        }
        if ($parametros['idproducto']) {
            $query->andWhereIn("d.iddocumento ", $this->getDocByIdProd($parametros['idproducto']));
        }
        $query->orderBy('ddv.idventas desc, ddv.idpersona');
        $ventas = $this->doctrineHelper->addQueryLimits($query, $parametros)->fetchArray();
        $this->cargarClientesDocumentos($ventas);
        foreach ($ventas as &$value) {
            if ($value['idestructuracomun']) {
                $deposito = $this->estructuraHelper->obtenerEstructurasNoFormales(
                    false, $this->idestructura, array(), false, false, array($value['idestructuracomun']), -1
                );
                $estructuraOp = $deposito[0]['DatEstructuraop'];
                $depositoCodigo = $estructuraOp[0]['codigo'] . ' - ' . $estructuraOp[0]['text'];
                $value['areaventa'] = $depositoCodigo;
            }
            $value['fechacontable'] = $value['fechacontable'] . ' ' . $value['hora'];
            $pagos = $this->devolverPagos(array('iddocumento'=>$value['iddocumento']));
            if (count($pagos['datos'])) {
                $value['tienedesglose'] = 1;
            } else {
                $value['tienedesglose'] = 0;
            }
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $ventas
        );
    }

    public function devolverMovimientos($parametros)
    {
        if (isset($parametros['servicio'])) {
            $limit = "";
            if (isset($parametros['start']) && isset($parametros['limit'])) {
                $limit .= " offset {$parametros['start']} limit {$parametros['limit']} ";
            }
            $respuesta = $this->doctrineHelper->getConnection()->execute(
                "SELECT coalesce(ni.numeropieza,ni.codigo)||'-'||ni.denominacion as descripcionventa,
                  nu.abreviaturaunidadmedida as umedida, vs.cantidad, vs.cantidaddev, vs.precio as precioventa, vs.importetotal as importeventa,
                  ni.idindicador, COUNT(*) OVER() as total, per.nombre || ' ' || coalesce(per.snombre, '') || ' ' || per.papel || ' ' || per.sapel as operario
                  from mod_logpuntoventa.dat_ventaservicio vs
                  inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = vs.idindicador
                  INNER JOIN mod_datosmaestros.nom_unidadmedida nu on nu.idunidadmedida = ni.idumedida
                  left join mod_persona.dat_persona per on per.idpersona = vs.idpersona
                  where vs.idventas = {$parametros['iddocumento']} 
			order by coalesce(ni.numeropieza,ni.codigo) {$limit}"
            )->fetchAll(PDO::FETCH_ASSOC);
            return array('datos'=>$respuesta, 'total'=> (count($respuesta) ? $respuesta[0]['total'] : 0));
        } else {
            $query = $this->getProductoModel()->devolverMovimientos($parametros, true);

            $query->addSelect(
                '(SELECT v.cantidaddev FROM DatVentaproducto v ' .
                'WHERE v.idproducto = mov.idproducto and v.idventas = mov.iddocumento) as cantidaddev'
            );
            $query->addSelect(
                '(SELECT pv.precio FROM DatVentaproducto pv ' .
                'WHERE pv.idproducto = mov.idproducto and pv.idventas = mov.iddocumento) as precioventa'
            );
            $query->addSelect(
                '(SELECT vp.importetotal FROM DatVentaproducto vp ' .
                'WHERE vp.idproducto = mov.idproducto and vp.idventas = mov.iddocumento) as importeventa'
            );
            $query->addSelect("(COALESCE(i.numeropieza,i.codigo)||' - '||COALESCE(ih.descripcionventa,i.denominacion)) as descripcionventa");

            return $this->getProductoModel()->concatenarDeposito(
                array('cantidad' => $query->count(), 'datos' => $this->doctrineHelper->addQueryLimits($query, $parametros)
                    ->fetchArray())
            );
        }
    }

    public function getInfo($array = array())
    {
        $cacheOperacion = $cacheDocumento = $cacheUsuario = $caheCliente = array();
        foreach ($array as $pos => &$documento) {
            //$this->getOperacion($cacheOperacion,$documento['idoperacion']);
            $this->getDocumento($cacheDocumento, $documento['iddoc']);
            $documento['iddoc'] = $cacheDocumento[$documento['iddoc']]->denominacion;
            $this->getUsuario($cacheUsuario, $documento['idusuario']);
            $this->getUsuario($cacheUsuario, $documento['aprobadopor']);
        }
        return $array;
    }

    public function getDocumento(&$cacheDocumento, $documento)
    {
        if (!array_key_exists($documento, $cacheDocumento)) {
            $cacheDocumento[$documento] = $this->configuracionHelper->getTipoDocumentoById($documento);
        }
    }

    public function getUsuario($cacheUsuario, $usuario)
    {
        if (!array_key_exists($usuario, $cacheUsuario)) {
            $cacheUsuario[$usuario] = [];
        }
    }

    public function getMonedas()
    {
        return LogisticaGlobal::__init()->getMonedaEntidad();
    }

    public function devolverDepositos()
    {
        $idsDeposit = $this->seguridadHelper->obtenerEstructurasNoFormales($this->global->Perfil->certificado, 8);
        $depositos = $this->estructuraHelper->obtenerEstructurasNoFormales(false, false, false, null, null, $idsDeposit, -1);
        $datos = array();
        foreach ($depositos as $index => $r) {
            $uxiliar = ($r['DatEstructuraop'][0]['codigo']) ? $r['DatEstructuraop'][0]['codigo'] . '-' : '';
            $datos[$index]['iddeposito'] = $r['idfila'];
            $datos[$index]['id'] = $r['idfila'];
            $datos[$index]['deposito'] = $uxiliar . $r['text'];
            $datos[$index]['text'] = $r['text'];
            $datos[$index]['leaf'] = true;
        }
        return $datos;
    }

    public function devolverTipoDocumentos()
    {
        $result = array();
        foreach (array_keys($this->arrayTipoDocumentos) as $alias) {
            $doc = $this->configuracionHelper->getDocumentsByParams(array('abreviatura' => $alias));
            if ($doc[0]) {
                array_push($result,
                    array(
                        'alias' => $alias,
                        'denominacion' => $doc[0]['denominacion']
                    ));
            }
        }
        return $result;
    }

    public function initTipoDocumentos()
    {
        $this->arrayTipoDocumentos = array();
        $this->arrayTipoDocumentos['compventaLog'] = LogisticaGlobal::SUBSISTEMA_FAC;
        $this->arrayTipoDocumentos['compdevLog'] = LogisticaGlobal::SUBSISTEMA_FAC;
    }

    public function getCierre($parametros = array())
    {
        /**
         * --d.idusuario = {$this->idusuario} and
         **/
        $idEstructura = $this->global->Estructura->idestructura;
        $andUser = $this->userIdValidate ? "d.idusuario = {$this->idusuario} and " : "";
        $addWhere = ($parametros['idestructuraop']) ? " and d.idestructuracomun = {$parametros['idestructuraop']} " : " and da.idestructuracomun = {$idEstructura} ";
        $sql = "select distinct mp.denominacion as modopago,coalesce(sum(v.importe),0) - coalesce(sum(v.importedevuelto),0) as importe, 
                (select sum(ds.efectivo) from mod_logpuntoventa.dat_seccion ds where ds.idusuario = {$this->idusuario}) as efectivo,0 as total,
			    (select min(ds.fechaapertura) from mod_logpuntoventa.dat_seccion ds where ds.idusuario = {$this->idusuario})as fechaapertura,
				nc.denominacion||' - '||t.denominacion as caja,nc.denominacion,mp.idmodopago
                from mod_logistica.dat_documento d 
                inner join mod_logpuntoventa.dat_ventas v on v.idventas = d.iddocumento
                inner join mod_logpuntoventa.dat_areaventa da on da.idareaventa = v.idareaventa
                inner join mod_logpuntoventa.nom_modopago mp on mp.idmodopago = v.idpago 
                --inner join mod_logpuntoventa.dat_seccion ds on ds.idcaja = v.idcaja 
                inner join mod_logpuntoventa.dat_caja dc on dc.idcaja = v.idcaja
                inner join mod_logpuntoventa.nom_tipocaja nc on nc.idtipocaja = dc.idtipocaja 
                inner join mod_estructuracomp.v_dametodasestructuras t on t.idestructura = d.idestructuracomun
                where  {$andUser} d.fechacontable <= '{$this->fechacontable}' and v.idcierreventa is null and dc.activo = 1 $addWhere
                group by nc.denominacion,t.denominacion,mp.idmodopago,mp.denominacion
                having (coalesce(sum(v.importe),0) - coalesce(sum(v.importedevuelto),0)) > 0
                order by nc.denominacion,mp.idmodopago desc";

        $result = $this->doctrineHelper->executeQuery($sql)->fetchAll(PDO::FETCH_ASSOC);

        return array(
            'cantidad' => 0,
            'datos' => $result
        );
    }

    public function guardarCierre($params)
    {
        /**
         * --doc.idusuario = {$this->idusuario}) and
         **/
        $idEstructura = $this->global->Estructura->idestructura;
        $hora = date("H:i:s");
        $conn = $this->doctrineHelper->getConnection();
        $closeSession = true;
        $andUser = $this->userIdValidate ? "dd.idusuario = {$this->idusuario} and " : "";
        if (count($params['documentos']) >= 1) {
            $idStoreDocs = implode($params['documentos'], ',');
            $sql = "INSERT INTO mod_logpuntoventa.dat_cierreventa(fecha,hora,identidad,idusuario,total)
               VALUES ('{$this->fechacontable}','{$hora}',{$idEstructura},{$this->idusuario},{$params['importe']}
               )  RETURNING idcierreventa ";
            $idcierreventa = $conn->fetchArray($sql);
            $closeSession = false;
        } else {
            $addWhere = ($params['idestructuraop']) ? " and da.idestructuraop = {$params['idestructuraop']} " : " and da.idestructuracomun = {$idEstructura} ";
            $select = "select dd.idusuario,coalesce(sum(v.importe),0) - coalesce(sum(v.importedevuelto),0) as importe";
            $from = " from mod_logistica.dat_documento dd 
            inner join mod_logpuntoventa.dat_ventas v on v.idventas = dd.iddocumento
            inner join mod_logpuntoventa.dat_areaventa da on da.idareaventa = v.idareaventa
            inner join mod_logpuntoventa.nom_modopago mp on mp.idmodopago = v.idpago 
            --inner join mod_logpuntoventa.dat_seccion ds on ds.idcaja = v.idcaja 
            inner join mod_logpuntoventa.dat_caja dc on dc.idcaja = v.idcaja
            inner join mod_logpuntoventa.nom_tipocaja nc on nc.idtipocaja = dc.idtipocaja 
            inner join mod_estructuracomp.v_dametodasestructuras t on t.idestructura = dd.idestructuracomun";

            $where = " where  {$andUser} dd.fechacontable <= '{$this->fechacontable}' and v.idcierreventa is null and dc.activo = 1 $addWhere ";

            $groupby = " group by dd.idusuario";
            $having = " having (coalesce(sum(v.importe),0) - coalesce(sum(v.importedevuelto),0)) > 0";
            $total = $conn->execute($select . $from . $where . $groupby . $having)->fetchAll(PDO::FETCH_ASSOC);
            $importe = $total[0]['importe'];
            $sql = "INSERT INTO mod_logpuntoventa.dat_cierreventa(fecha,hora,identidad,idusuario,total)
               VALUES ('{$this->fechacontable}','{$hora}',{$idEstructura},{$this->idusuario},{$importe}
               )  RETURNING idcierreventa ";
            $idcierreventa = $conn->fetchArray($sql);
            $select = "select dd.iddocumento";
            $addWhere = ($params['idestructuraop']) ? " and dav.idestructuraop = {$params['idestructuraop']} " : " and dav.idestructuracomun = {$idEstructura} ";
            $ventas = $select . $from . $where . " union
            select dd.iddocumento from mod_logistica.dat_documento dd
            inner join mod_logpuntoventa.dat_devolucion dev on dd.iddocumento = dev.iddevolucion
            inner join mod_logpuntoventa.dat_ventas dv on dv.idventas = dev.idventas
            inner join mod_logpuntoventa.dat_areaventa dav on dav.idareaventa = dv.idareaventa
            where dv.idventas in (select doc.iddocumento from mod_logistica.dat_documento doc
            inner join mod_logpuntoventa.dat_ventas vt on vt.idventas = doc.iddocumento
            where {$andUser} dd.fechacontable <= '{$this->fechacontable}' and dev.idcierreventa is null $addWhere)";
            $idStoreDocs = implode($conn->execute($ventas)->fetchAll(PDO::FETCH_COLUMN), ',');
        }
        $updateVentas = "UPDATE mod_logpuntoventa.dat_ventas SET idcierreventa = {$idcierreventa[0]}
                    WHERE idventas in ($idStoreDocs)";
        $conn->execute($updateVentas);
        $updateDevoluciones = "UPDATE mod_logpuntoventa.dat_devolucion SET idcierreventa = {$idcierreventa[0]}
                         WHERE iddevolucion in ($idStoreDocs)";
        $conn->execute($updateDevoluciones);
        $updateDoc = "UPDATE mod_logistica.dat_documento SET idcomprobante = null
                    WHERE iddocumento in ($idStoreDocs) and idcomprobante = -1";
        $conn->execute($updateDoc);
        $model = new TerminalpuntoventaModel();
        return ($closeSession) ? $model->cerrarSesion(array('usuarios' => $total, 'fechacierre' => $this->fechacontable, 'addWhere' => $addWhere)) : array('success' => true);
    }

    public function guardarObservacion($parametros)
    {
        $documento = Doctrine::getTable('DatDocumento')->find($parametros['iddocumento']);
        if ($documento->observaciones != '') {
            $regHistorico = new DatDocObservaciones();
            $regHistorico->iddocumento = $documento->iddocumento;
            $regHistorico->fecha = $this->global->FechaContable->fecha;
            $regHistorico->observaciones = $documento->observaciones;
            $regHistorico->save();
        }
        $documento->observaciones = $parametros['observaciones'];
        $documento->save();
        return true;
    }

    public function getModoPago()
    {
        $params = array('modelo' => 'NomModopago', 'idnom' => 'idmodopago');
        $objNomService = new NomencladoresLogService();
        return $objNomService->buscarEntidad($params);
    }

    public function getVendedores($params)
    {
        $sqlPersona = "select distinct dd.idusuario, p.nombre from mod_logistica.dat_documento dd " .
            "inner join mod_logpuntoventa.dat_ventas dv on dd.iddocumento = dv.idventas " .
            "inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc " .
            "inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos " .
            "inner join mod_datosmaestros.dat_estructurasubsist ess on ess.idestructurasubsist = ddp.idestructurasubsist " .
            "inner join mod_seguridad.seg_usuario u on u.idusuario = dd.idusuario " .
            "inner join mod_persona.dat_persona p on p.idpersona = u.idpersona " .
            "where ess.idestructuracomun = {$this->global->estructura->idestructura} and ndp.abreviatura in ('compventaLog', 'compdevLog')";
        $result = $this->doctrineHelper->getConnection()->execute($sqlPersona)->fetchAll(PDO::FETCH_ASSOC);
        /*$params['start'] = ($params['start']) ? $params['start'] : 0;
        $params['limit'] = ($params['limit']) ? $params['limit'] : 30;*/
        return array("datos" => $result);
    }

    public function getClientes($params)
    {
        $params['start'] = ($params['start']) ? $params['start'] : 0;
        $params['limit'] = ($params['limit']) ? $params['limit'] : 30;
        $filtro = $addSelect = $orderBy = $innerJoin = "";
        if ($params['query']) {
            $filtro[] = " (dvc.numeroidentidad ilike '%{$params['query']}%' or dvc.nombre ilike '%{$params['query']}%') ";
        }
        $addSelect = "
                    select distinct dvc.numeroidentidad, dvc.nombre as nombreyap,dvc.telefono,dvc.direccion,dvc.correo,
                    dvc.numeroidentidad || ' - ' || dvc.nombre as nombre, dvc.idventacliente, count(*) over() as total 
                ";
        if(!$params['isRecup']){
            if (!$params['modificar'] ) {
                
                $innerJoin = "inner join mod_logpuntoventa.dat_ventas dv on dv.idpersona = dvc.idventacliente " .
                    "inner join mod_logistica.dat_documento dd on dd.iddocumento = dv.idventas " .
                    "inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc " .
                    "inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos " .
                    "inner join mod_datosmaestros.dat_estructurasubsist ess on ess.idestructurasubsist = ddp.idestructurasubsist ";
                $filtro[] = " ess.idestructuracomun = {$this->global->estructura->idestructura} ";
            } else {
                $addSelect = "
                    select distinct on ((dvc.numeroidentidad || ' - ' || dvc.nombre))
                    first_value(dvc.idventacliente) over (partition by (dvc.numeroidentidad || ' - ' || dvc.nombre) order by dvc.idventacliente asc) as idventacliente,
                    (dvc.numeroidentidad || ' - ' || dvc.nombre) as nombre,
                    dvc.numeroidentidad,
                    dvc.nombre as nombreyap,
                    dvc.telefono,
                    dvc.direccion,
                    dvc.correo,
                    (v.vendedor|| ' - ' ||t.denominacion) as vendedor,
                    count(*) over() as total 
                ";

                $innerJoin = "
                inner join mod_logpuntoventa.dat_ventas v on v.idpersona = dvc.idventacliente
                inner join mod_logpuntoventa.dat_areaventa da on da.idareaventa = v.idareaventa
                inner join mod_estructuracomp.v_dametodasestructuras t on t.idestructura = da.idestructuracomun ";

                $orderBy = " order by (dvc.numeroidentidad || ' - ' || dvc.nombre)";
            }
        }
        

        if (is_array($filtro)) {
            $where = "where " . implode($filtro, 'and');
        }

        $sqlPersona =
            $addSelect .
            "from mod_logpuntoventa.dat_ventacliente dvc " .
            $innerJoin . $where . $orderBy .
            " offset {$params['start']} limit {$params['limit']}";

        $result = $this->doctrineHelper->getConnection()->execute($sqlPersona)->fetchAll(PDO::FETCH_ASSOC);

        return array("datos" => $result, 'cantidad' => $result[0]['total']);
    }

    public function getProductosVenta($params)
    {
        $params['start'] = ($params['start']) ? $params['start'] : 0;
        $params['limit'] = ($params['limit']) ? $params['limit'] : 30;
        $filtro = "";
        if ($params['query']) {
            $filtro .= " and (ni.denominacion ilike '%{$params['query']}%' or ni.numeropieza ilike '%{$params['query']}%' or ni.codigo ilike '%{$params['query']}%') ";
        }
        $sqlPersona = "select dp.idproducto, ni.numeropieza|| ' ' ||ni.denominacion as denominacion, count(*) over() as total " .
            "from mod_logistica.dat_producto dp " .
            "inner join mod_estructuracomp.v_dametodasestructuras deop on deop.idestructura = dp.idestructura " .
            "left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador " .
            "left join mod_logpuntoventa.dat_productoareaventa pv on pv.idproducto = dp.idproducto " .
            "left join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador= ni.idindicador " .
            "where dp.cronologia > 0 and dp.idestructura in ( " .
            "select da.idestructuraop from mod_logpuntoventa.dat_areaventa da where da.idestructuracomun = {$this->global->estructura->idestructura} " .
            ") {$filtro}" .
            " offset {$params['start']} limit {$params['limit']}";
        $result = $this->doctrineHelper->getConnection()->execute($sqlPersona)->fetchAll(PDO::FETCH_ASSOC);
        return array("datos" => $result, 'cantidad' => $result[0]['total']);
    }

    public function getDocByIdProd($idproducto)
    {
        $sqlPersona = "select distinct dd.iddocumento from mod_logistica.dat_movimiento dm " .
            "inner join mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento " .
            "inner join mod_logpuntoventa.dat_ventas dv on dd.iddocumento = dv.idventas " .
            "inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc " .
            "inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos " .
            "inner join mod_datosmaestros.dat_estructurasubsist ess on ess.idestructurasubsist = ddp.idestructurasubsist " .
            "where ess.idestructuracomun = {$this->global->estructura->idestructura} and ndp.abreviatura in ('compventaLog', 'compdevLog') " .
            "and dm.idproducto = {$idproducto}";
        $result = $this->doctrineHelper->getConnection()->execute($sqlPersona)->fetchAll(PDO::FETCH_COLUMN);
        return (count($result) ? $result : array(-1));
    }

    public function guardarDatosClientes($params)
    {
        $existe = Doctrine::getTable('DatVentacliente')->findByDql('numeroidentidad = ? and idventacliente <> ?', array($params['numeroidentidad'], $params['idventacliente']));
        if (count($existe)) {
            $idanterior = $params['idventacliente'];
            $params['idventacliente'] = $existe[0]->idventacliente;
        }
        $ventaCliente = Doctrine::getTable('DatVentacliente')->find($params['idventacliente']);
        $ventaCliente->synchronizeWithArray($params);
        $ventaCliente->save();
        if (isset($idanterior)) {
            $conn = $this->doctrineHelper->getConnection();
            $updateVentas = "UPDATE mod_logpuntoventa.dat_ventas SET idpersona = {$params['idventacliente']}
                         WHERE idpersona = {$idanterior}";
            $deleteOld = "delete from mod_logpuntoventa.dat_ventacliente WHERE idventacliente = {$idanterior}";
            $execute = $conn->execute($updateVentas);
            $executedel = $conn->execute($deleteOld);
        }
        //me falta salvar el historico de cambios
    }

    public function getCiudad()
    {
        $sql = "SELECT distinct provincia as ciudad FROM mod_logpuntoventa.dat_ventacliente 
                where provincia is not null order by provincia asc";
        $datos['datos'] = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function getMunicipio()
    {
        $sql = "SELECT distinct municipio as municipio FROM mod_logpuntoventa.dat_ventacliente 
                where municipio is not null order by municipio asc";
        $datos['datos'] = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function validarCierre($params)
    {
        $sql = "select count(ds.idseccion) from mod_logpuntoventa.dat_seccion ds where ds.idseccion = {$params['idseccion']} and ds.fechacierre is not null";
        $cierre = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return ($cierre[0] > 0);
    }

    public function exportarEntregados($params)
    {
        $estados = array('2' => 'Listo para recoger', '4' => 'Entregado');
        $fecha = date('d/m/Y');
        $arrayUpdate = array();
        $arrayEntregados = array();
        $sql = "select vo.nroorden, vo.idorden, dd.estado from mod_logpuntoventa.dat_ventas dv
                inner join mod_logistica.dat_documento dd on dd.iddocumento = dv.idventas
                inner join mod_logpuntoventa.dat_ventaorden vo on vo.idventas = dv.idventas
                inner join mod_logpuntoventa.dat_areaventa av on av.idareaventa = vo.idareaventaorigen
                inner join mod_logpuntoventa.dat_infoconexion inf on inf.idinfoconexion = av.idinfoconexion
                where dd.estado in (2,4) and vo.fechaexportado is null and vo.idusuarioexport is null
                and dv.idareaventa = {$params['idareaventa']} and (
                  case when dd.estado = 2 then (coalesce(vo.exportado,0) = -1) else (coalesce(vo.exportado,0) = 0) end
                )";
        $datos = Doctrine_Manager::connection()->fetchAll($sql);

        $xml = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\" ?>";
        $xml .= "<CierreDiario xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">";
        $xml .= "<Orders>";
        foreach ($datos as $orden) {
            $estado = ($orden['estado'] == 2 ? 3 : 6);
            $xml .= "<order pedido=\"{$orden['nroorden']}\" idestado=\"{$estado}\" estado=\"{$estados[$orden['estado']]}\">";
            $xml .= "</order>";
            if ($orden['estado'] == 4) {
                array_push($arrayEntregados, $orden['idorden']);
            } else {
                array_push($arrayUpdate, $orden['idorden']);
            }
        }
        $xml .= "</Orders>";
        $xml .= "</CierreDiario>";
        if (count($arrayEntregados)) {
            $sqlUpdate = "update mod_logpuntoventa.dat_ventaorden 
                      set fechaexportado = '{$fecha}', idusuarioexport = {$this->global->Perfil->idusuario},
                      exportado = (select max(vo1.exportado) from mod_logpuntoventa.dat_ventaorden vo1)+1 
                      where idventas in (".implode(',', $arrayEntregados).")";
            Doctrine_Manager::connection()->fetchAll($sqlUpdate);
        }
        if (count($arrayUpdate)) {
            $sqlUpdate2 = "update mod_logpuntoventa.dat_ventaorden 
                      set exportado = 0 
                      where idventas in (".implode(',', $arrayUpdate).")";
            Doctrine_Manager::connection()->fetchAll($sqlUpdate2);
        }
        return $xml;
    }

    public function getDocumentosGenerados($params)
    {
        $params['start'] = ($params['start']) ? $params['start'] : 0;
        $params['limit'] = ($params['limit']) ? $params['limit'] : 30;
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "SELECT distinct pd.iddocumento, (pt.nropedido || '-' ||pt.beneficiario) as nropedido, dd.nrodoc, dd.numeroref, ndp.denominacion as tipodoc, est.denominacion as entidad,
            pd.tipo, count(*) over() as total 
            from mod_logpuntoventa.dat_pedidodocumento pd
            inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pd.idpedido
            inner join mod_logistica.dat_documento dd on dd.iddocumento = pd.iddocumento
            inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
            inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
            inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
            inner join mod_estructuracomp.v_dametodasestructuras est on est.idestructura = des.idestructuracomun
            where pt.nropedido ilike '%{$params['criterio']}%' or pt.cibeneficiario ilike '%{$params['criterio']}%' 
            order by nropedido, pd.tipo
            offset {$params['start']} limit {$params['limit']}"
        )->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $respuesta, 'cantidad' => (count($respuesta)) ? $respuesta[0]['total'] : 0);
    }

    public function devolverPagos($params) {
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "SELECT dp.idformapago as idpago, dp.iddocumento, np.denominacion, dp.importe  from mod_logpuntoventa.dat_desglosepago dp
            inner join  mod_logpuntoventa.nom_modopago np on np.idmodopago = dp.idformapago
            where dp.iddocumento = {$params['iddocumento']}"
        )->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $respuesta, 'cantidad' => count($respuesta));
    }
}
