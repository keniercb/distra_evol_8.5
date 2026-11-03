<?php

/**
 * @class DocumentosalidaModel
 * (Descripcion de la clase, objetivo)
 * @package Inventario
 * @subpackage Salida
 * @author Dainier Aguila Medina
 * @copyright XETID
 * @version 1.0
 */
class DocumentosalidaModel extends SalidaModel
{

    private $ubicacionServ, $solEntregaServ, $menuServ, $ordeTrabajoServ, $ordeProduccionServ, $loteServ, $noSerieServ, $maestroProductos,
        $idalternativa, $configuracionService;

    public function __construct($datosDoc = array())
    {
        parent::__construct($datosDoc);
        $this->trazaDocumento = new TrazasDocumentoModel();
        $this->ubicacionServ = new UtilesubicacionService();
        $this->solEntregaServ = new SolicitudentregaService();
        if (LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_TALLERES)) {
            $this->ordeTrabajoServ = new OrdenTrabajoTalleresService();
        }
        if ($this->existComponent('log.inv.alimento')) {
            $this->menuServ = new MenualimentoService();
        }/*
        if ($this->existComponent('log.tall.ordentrabajo') &&
            LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_TALLERES)
        ) {
            $this->ordeTrabajoServ = new OrdenTrabajoTalleresService();
        }*/
        if (LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_PRODUCCION)) {
            $this->ordeProduccionServ = new ProduccionService();
        }
        /*if ($this->existComponent('log.produccion.ordenproduccion')) {
            $this->ordeProduccionServ = new ProduccionService();
        }*/

        $this->noSerieServ = new NoSerieService();
        $this->loteServ = new LoteService();
        $this->maestroProductos = new MaestroProductoModel;
        $this->tryInyector();
        $monedas = $this->configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
        foreach ($monedas['datos'] as $value) {
            if ($value['dualidad'] == 1) {
                $this->idalternativa = $value['idmoneda'];
            }
        }
        $this->configuracionService = new ConfiguracioninventarioService();

    }

    /**
     * Devuelve los documentos de salida.
     * @param array $datosDoc Arreglo con los parametros para filtrar los documentos
     * @param boolean [Opcional] $dql Bandera que indica si se devuelve la consulta Doctrine_Query
     * @return array|Doctrine_Query
     */
    public function devolverDocumentos($datosDoc = array(), $dql = false, $idestructuraOpcional = false, $idoperacionOpcional = false)
    {
        if (!$idestructuraOpcional)
            $idestructuraOpcional = $this->idestructuracomun;

        $iddocVale = $this->configuracionHelper->tipoDocumentoByAliasByIdestructutra(
            'valeLog', $idestructuraOpcional, LogisticaGlobal::SUBSISTEMA_INV
        );
        $iddocTrans = $this->configuracionHelper->tipoDocumentoByAliasByIdestructutra(
            'transferenciaLog', $idestructuraOpcional, LogisticaGlobal::SUBSISTEMA_INV
        );

        $datosDoc['iddoc'] = array($iddocTrans->iddoc, $iddocVale->iddoc);
        if ($datosDoc['tipo'] == 1) {
            $datosDoc['iddoc'] = array($iddocTrans->iddoc);
        } elseif ($datosDoc['tipo'] == 2) {
            $datosDoc['iddoc'] = array($iddocVale->iddoc);
        }
        $query = parent::devolverDocumentos($datosDoc);
        $query->addSelect('d.idcomprobante as idcomprobante');
        $query->addSelect('(SELECT SUM(dm.importecontable) FROM DatMovimientos dm WHERE dm.iddocumento = d.iddocumento) as importecontable');
        $query->addSelect('(SELECT SUM(dm1.importealternativo) FROM DatMovimientos dm1 WHERE dm1.iddocumento = d.iddocumento) as importealternativo');
        if($idoperacionOpcional){
            if(!is_array($idoperacionOpcional)){
                $idoperacionOpcional = array($idoperacionOpcional);
            }
            $query->whereIn('d.idoperacion', $idoperacionOpcional);
            //$query->addWhere('d.idoperacion = ?', array($idoperacionOpcional));
        }
        $this->cargarTransportador($query, 'd');
        $entrega = new DatEntrega();
        $entrega->getJoinDatEntrega($query, $datosDoc);
        if ($dql) {
            return $query;
        }
        return array(
            'cantidad' => $query->count(), 'datos' => $this->cargarClientesDocumentos(
                $this->logisticaDoctrine->addQueryLimits($query, $datosDoc)->fetchArray()
            )
        );
    }

    /**
     *
     * @param array $datosDoc
     * @return array
     */
    public function devolverDocumentosByIdCC($datosDoc = array())
    {
        $tipoDoc = $this->devolverTipoDocumento($datosDoc);
        $docs = $datosDoc->fetchArray();
        foreach ($docs as $key => $value) {
            foreach ($tipoDoc as $item) {
                if ($value['iddoc'] == $item->iddoc) {
                    $docs[$key]['Nomoperacion'] = $tipoDoc->denominacion;
                }
            }
        }
        return $docs;
    }

    /**
     * Adiciona o modifica un documento de salida (Vale de devolución o Transferencia).
     * @param array $datosDoc Datos del documento
     * @return array
     */
    public function adicionarDocumento($datosDoc = array())
    {
        if ($datosDoc['iddocumento']) {
            $retornar = false;
            $objDoc = Doctrine::getTable('DatDocumento')->find($datosDoc['iddocumento']);
            unset($datosDoc['idestructuracomun']);
            $documento = parent::adicionarDocumento($datosDoc);
            $documento->save();
            $collMov = new Doctrine_Collection('DatMovimientos');
            foreach ($datosDoc['productos'] as $p) {
                $objMov = Doctrine::getTable('DatMovimientos')->find($p['idmovimiento']);
                $objMov->idelementogasto = $p['idelementogasto'];
                $objMov->idelementogastoalt = $p['idelementogastoalt'];
                if ($objDoc->estado == EstadoDocumentoModel::ESTADO_ELABORACION) {
                    $objMov->cantidad = $p['cantidad'];
                    $objMov->importecontable = round($objMov->preciocontable * $p['cantidad'],2);
                    if ($p['numerochip']) {
                        $objMov->numerochip = $p['numerochip'];
                    }
                    if ($p['fecha']) {
                        $objMov->fecha = $p['fecha'];
                    }
                } else {
                    $retornar = true;
                }
                $collMov->add($objMov);

            }
            $collMov->save();
            if ($retornar) {
                return array(
                    'success' => true
                );
            }
            if (!isset($datosDoc['origen'])) {
                $datosDoc['origen'] = $this->getOrigenByDocumento($datosDoc['iddocumento']);
            }
        }
        $datosDoc['iduebdestino'] = ($datosDoc['iduebdestino'] != "") ? $datosDoc['iduebdestino'] : null;

        if ($datosDoc['idgenerado']) {
            $clientes = $this->devolverClientesByDoc(
                $datosDoc['idgenerado'], $datosDoc['idclientes'], $datosDoc['origen']
            );
        } else {
            $clientes = $this->devolverClientesByDoc($datosDoc['iddocumento']);
        }
        if ($datosDoc['origen'] == 1) {
            return $this->adicionarOrdenDespacho($datosDoc, $clientes);
        } else if ($datosDoc['origen'] == 3) {
            return $this->adicionarMenuAlimento($datosDoc, $clientes);
        } else if ($datosDoc['origen'] == 4) {
            return $this->adicionarOrdenTrabajo($datosDoc, ($datosDoc['idclientes']) ? $datosDoc['idclientes'] : $clientes);
        } elseif ($datosDoc['origen'] == 5) {
            return $this->adicionarOrdenProduccion($datosDoc, $datosDoc['idclientes']);
        }
        $cantDoc = 0;
        foreach ($clientes as $value) {
            $idPadres = $this->devolverPadresByDoc(
                $datosDoc['iddocumento'], $value['idcliente'], $datosDoc['idgenerado'], $datosDoc['origen']
            );
            $alias = 'valeLog';
            $this->setIdTipoDocumento($alias);
            $documento = $this->inicializarDatEntrega($datosDoc, $value['tipocliente']);
            $cantDoc++;
            $arrProd = array_merge((array)$datosDoc['productos'], (array)$datosDoc['lotes']);
            $arrIdProd = $this->objectHelper->extractValueFromArrayColumn($arrProd, 'idproducto');
            if (!$datosDoc['iddocumento'] || count($arrIdProd) > 0) {
                $result = $this->adicionarMovimientos($documento->iddocumento, $datosDoc, $idPadres, $arrIdProd);
                if (!$result['creado']) {
                    $cantDoc--;
                    Doctrine_Query::create()->delete('DatDocumento')->where('iddocumento = ?', $documento->iddocumento)
                        ->execute();
                    continue;
                }
                $this->crearDocumentoCliente($documento->iddocumento, $value['idcliente'], $value['tipocliente']);
                if (!$datosDoc['iddocumento'] || ($datosDoc['iddocumento'] && $datosDoc['origen'] != 2)) {
                    $this->crearDocumentoPadre($documento->iddocumento, $idPadres);
                }
                $this->actualizarCumplimiento($result['productosSol']);
                $this->adicionarDatMoventrega(
                    $documento->iddocumento, $datosDoc['origen'], $result['productosSol'], $result['movimientos']
                );
            }
            $idcliente = $value['idcliente'];
        }
        return array(
            'success' => ($cantDoc > 0), 'iddocumento' => $cantDoc == 1 ? $documento->iddocumento : null,
            'iddoc' => $cantDoc == 1 ? $documento->iddoc : null,
            'nrodoc' => $cantDoc == 1 ? $documento->nrodoc : null,
            'numeroref' => $cantDoc == 1 ? $documento->numeroref : null,
            'fechacontable' => $cantDoc == 1 ? $documento->fechacontable : null,
            'idcliente' => $cantDoc == 1 ? $idcliente : null, 'tipocliente' => $cantDoc == 1 ? 2 : null
        );
    }

    private function getOrigenByDocumento($iddocumento) {
        $sql = "select ndp.abreviatura from mod_logistica.dat_documento dd 
                inner join mod_datosmaestros.dat_documentoprim dp on dp.iddoc = dd.iddoc
                inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = dp.iddocumentos
               inner join mod_logistica.dat_documentopadre ddp on ddp.idpadre = dd.iddocumento 
               where ddp.iddocumento = {$iddocumento} ";
        $data = $this->doctrineHelper->getConnection()->fetchAssoc($sql);
        switch ($data[0]['abreviatura']) {
            case 'entregaLog':
                return 1;
            case 'solEntrega':
                return 2;
            case 'menuAlim':
                return 3;
            case 'ordenServicioLOG':
                return 4;
            case 'produccionLog':
                return 5;
            default:
                return false;
        }
    }

    public function adicionarOrdenDespacho($datos, $clientes)
    {
        if ($datos['iddocumento']) {
            $docObj = Doctrine::getTable('DatDocumento')->find($datos['iddocumento']);
            $datos['idestructuracomun'] = $docObj->idestructuracomun;
        }
        $cantDoc = 0;
        $idestructura = $datos['idestructuracomun'];

        foreach ($clientes as $cl) {
            $datos['idestructuracomun'] = $datos['iddocumento'] ? $datos['idestructuracomun'] : null;
            $datos['depositodoc'] = $idestructura;
            $idPadres = $this->devolverPadresByDoc(
                $datos['iddocumento'], $cl['idcliente'], $datos['idgenerado'], 1
            );
            $alias = $cl['tipocliente'] == 2 ? 'valeLog' : 'transferenciaLog';
            $idComprobate = null;
            if ($cl['tipocliente'] != 2) {
                $queryDist = Doctrine_Query::create()
                    ->select('idestructura')
                    ->from('DatDocumentoCliente')->where('iddocumento = ?', $idPadres[0])
                    ->fetchArray();
                if ($queryDist[0]['idestructura'] == $datos['idEntidadComun']) {
                    //$idComprobate = -1;
                }
            }

            $this->setIdTipoDocumento($alias);

            $arrProd = array_merge((array)$datos['productos'], (array)$datos['lotes']);
            $arrIdProd = $this->objectHelper->extractValueFromArrayColumn($arrProd, 'idproducto');
            $productos = $this->devolverDatProdorden($idPadres, $cl['idcliente'], $datos, $arrIdProd, false, true);
//            $productos[] = $this->devolverDatProdorden(
//                $idPadres, $cl['idcliente'], $datos, null, false, true, false, true
//            );
            //print_r($productos);die;
            foreach ($productos as $k => $p) {
                $documento = $this->inicializarDatEntrega($datos, $cl['tipocliente'], $k);

                //if($cl['tipocliente'] == 3){
                $documento->idcomprobante = $idComprobate;
                //}
                $documento->save();
                $cantDoc++;
                if (!$depositos || $depositos[count($depositos) - 1]['idcliente'] != $k) {
                    $depositos[] = array('idcliente' => $k, 'tipocliente' => 3);
                }
                if (!$datos['iddocumento']) {
                    $prodTemp = $this->unificarProductos($p);
                    $mov = $this->getProductoModel()->adicionarMovimientos(
                        $documento->iddocumento, $prodTemp, LogisticaMovimientoModel::SIGNO_MOV_RESTA
                    );
                    if (count($mov['movimientos']) > 0) {
                        $this->loteServ->extraerCantidades($mov['movimientos'], true);
                        $this->crearDocumentoCliente($documento->iddocumento, $cl['idcliente'], $cl['tipocliente']);
                        $this->crearDocumentoPadre($documento->iddocumento, $idPadres);
                        $id = $documento->iddocumento;
                    } else {
                        $cantDoc--;
                        Doctrine_Query::create()->delete('DatDocumento')
                            ->where('iddocumento = ?', $documento->iddocumento)->execute();
                        continue;
                    }
                } else {
                    $id = $documento->iddocumento;
                    $this->getProductoModel()->modificarMovimientos($datos['productos']);
                    if ($datos['lotes'] && count($datos['lotes']) > 0) {
                        $this->loteServ->adicionarLote(
                            $datos['lotes'],
                            array('collection' => true, 'signo' => '-', 'actualizarMov' => true, 'afectaLote' => true)
                        );
                    }
                }
                if (!$datos['iddocumento'] || $datos['productos'] || $datos['lotes']) {
                    $dpo = new ProdordenModel();
                    $prod = array('productos' => $p, 'idcliente' => $cl['idcliente']);
                    $dpo->actualizarCumplimientoByParams($prod);
                    $this->adicionarDatMoventrega($documento->iddocumento, 1, $p, $mov['movimientos']);
                }
            }
            $idcliente = $cl['idcliente'];
            $tipocliente = $cl['tipocliente'];
        }
        $nomCliente =  $this->configuracionHelper->devolverClienteById($cl['idcliente']);
        if (count($nomCliente) && $nomCliente[0]['idestructura'] && count($datos['idgenerado']) == 1) {
            $docOrigen = Doctrine::getTable('DatDocumento')->find($datos['idgenerado'][0]);
            $documento->observaciones = $docOrigen->observaciones;
            $documento->save();
        }
        if ($cantDoc > 0) {
            $this->cargarClientesDocumentos($depositos);
            foreach ($depositos as $k => $dep) {
                if ($k > 0 && $k == count($depositos) - 1) {
                    $depos .= ' y ';
                } elseif ($k > 0) {
                    $depos .= ', ';
                }
                $depos .= $dep['cliente'];
            }
        }
//        if ($cantDoc == 1) {
//            $padres = $this->devolverPadresByCantMov($id);
//            $this->crearDocumentoPadre($documento->iddocumento, $padres);
//            $nroDoc = $this->objectHelper->extractValueFromArrayColumn($padres, 'nrodoc');
//        }
        return array(
            'success' => ($cantDoc > 0),
            'iddocumento' => ($cantDoc == 1 && $idestructura == $depositos[0]['idcliente']) ? $id : null,
            'iddoc' => $cantDoc == 1 ? $documento->iddoc : null,
            'nrodoc' => $cantDoc == 1 ? $documento->nrodoc : null, 'depositos' => $depos,
            'numeroref' => $cantDoc == 1 ? $documento->numeroref : null,
            'fechacontable' => $cantDoc == 1 ? $documento->fechacontable : null,
            'idcliente' => $cantDoc == 1 ? $idcliente : null, 'tipocliente' => $cantDoc == 1 ? $tipocliente : null,
            'idcomprobante' => $idComprobate,
//            'nroDocPadre' => implode(', ', $nroDoc)
        );
    }

    /**
     * Adiciona los menu de alimento.
     * @param array $datos
     * @param array $clientes
     * @return array
     */
    public function adicionarMenuAlimento($datos, $clientes)
    {
        $cantDoc = 0;
        foreach ($clientes as $value) {
            $idPadres = $this->devolverPadresByDoc(
                $datos['iddocumento'], $value['idcliente'], $datos['idgenerado'], 3
            );
            if (!$datos['iddocumento']) {
                $mov = $this->devolverProductosMenu($datos, $idPadres, $value['idcliente']);
                $productos = $this->getProductoModel()->obtenerProductosEnDepositos(
                    $mov, $this->global->Estructura->idestructura
                );
                foreach ($productos as $key => $item) {
                    $datos['idestructuracomun'] = $key;
                    $documento = $this->inicializarDatEntrega($datos, $value['tipocliente']);

                    $cantDoc++;
                    $mov = $this->getProductoModel()->adicionarMovimientos(
                        $documento->iddocumento, $item, LogisticaMovimientoModel::SIGNO_MOV_RESTA, true, true
                    );

                    if (count($mov['movimientos']) > 0) {
                        if (!$depositos || $depositos[count($depositos) - 1]['idcliente'] != $key) {
                            $depositos[] = array('idcliente' => $key, 'tipocliente' => 3);
                        }
                        $id = $documento->iddocumento;
                        $this->resetearEquipoPartida($id, true);
                        $this->loteServ->extraerCantidades($mov['movimientos']);
                        $this->loteServ->actualizarExistenciaLote($id);
                        $this->crearDocumentoCliente($id, $value['idcliente'], $value['tipocliente']);
                        $this->crearDocumentoPadre($id, $idPadres);
                        $this->adicionarDatMoventrega($id, 3);
                    } else {
                        $cantDoc--;
                        Doctrine_Query::create()->delete('DatDocumento')
                            ->where('iddocumento = ?', $documento->iddocumento)->execute();
                        continue;
                    }
                }
            } else {
                $documento = $this->inicializarDatEntrega($datos);
                $id = $documento->iddocumento;
                $cantDoc++;
                $this->getProductoModel()->modificarMovimientos($datos['productos'], true);
                if ($datos['lotes'] && count($datos['lotes']) > 0) {
                    $params = array(
                        'collection' => true, 'signo' => '-', 'actualizarMov' => true, 'afectaLote' => true
                    );
                    $this->loteServ->adicionarLote($datos['lotes'], $params);
                }
                $this->adicionarDatMoventrega($id, 3);
            }
            $idcliente = $value['idcliente'];
        }
        $depos = '';
        if ($cantDoc > 0) {
            $this->cargarClientesDocumentos($depositos);
            foreach ($depositos as $k => $dep) {
                if ($k > 0 && $k == count($depositos) - 1) {
                    $depos .= ' y ';
                } elseif ($k > 0) {
                    $depos .= ', ';
                }
                $depos .= $dep['cliente'];
            }
        }
        return array(
            'success' => ($cantDoc > 0), 'iddocumento' => ($cantDoc == 1 ? $id : null),
            'iddoc' => $cantDoc == 1 ? $documento->iddoc : null,
            'nrodoc' => $cantDoc == 1 ? $documento->nrodoc : null, 'depositos' => $depos,
            'numeroref' => $cantDoc == 1 ? $documento->numeroref : null,
            'fechacontable' => $cantDoc == 1 ? $documento->fechacontable : null, 'depositos' => $depos,
            'idcliente' => $cantDoc == 1 ? $idcliente : null, 'tipocliente' => $cantDoc == 1 ? 2 : null
        );
    }

    /**
     * Adiciona o actualiza una o varias órdenes de trabajo.
     * @param array $datos
     * @param array $clientes
     * @return array
     */
    private function adicionarOrdenTrabajo($datos, $clientes)
    {
        $cantDoc = 0;
        $actividades = $datos['idactividades'];
        foreach ($clientes as &$value) {
            if (count($actividades)) {
                foreach ($actividades as $act) {
                    if (!isset($value['idcliente'])) {
                        $value = array('idcliente' => $value, 'tipocliente' => 2);
                    }
                    $idPadres = $this->devolverPadresByDoc(
                        $datos['iddocumento'], $value['idcliente'], $datos['idgenerado'], 4
                    );
                    if (!$datos['iddocumento']) {
                        $mov = $this->ordeTrabajoServ->devolverMaterialesOrden($idPadres, true, array('aprobado' => 1, 'vales' => 1,
                            'iddeposito' => $datos['idestructuracomun'], 'idcentrocosto' => $value['idcliente'],
                            'idordenactividad' => $act))->fetchArray();
                        if (count($mov)) {
                            $productos = $this->getProductoModel()->obtenerProductosEnDepositos(
                                $mov, $this->global->Estructura->idestructura, $datos['idestructuracomun']
                            );

                            foreach ($productos as $key => $item) {
                                $idPadres = (is_array($idPadres))?implode(',',$idPadres):$idPadres;
                                foreach ($item as &$prod) {
                                    $cantidades = $this->devolverCantidadesEntregadasOrden($idPadres, $prod['idproducto'],$act);
                                    $cantAux = $prod['cantidad'];
                                    if (count($cantidades)) {
                                        $cantResta = $cantidades[0]['cantidadoriginal'] - $cantidades[0]['entregado'];
                                        $cantAux = $cantResta + $cantidades[0]['devuelto'];
                                    }
                                    $prod['cantidad'] = ($prod['cantidad'] <= $cantAux) ? $prod['cantidad'] : $cantAux;
                                }
                                $datos['idestructuracomun'] = $key;
                                $documento = $this->inicializarDatEntrega($datos, $value['tipocliente']);
                                $cantDoc++;
                                $mov = $this->getProductoModel()->adicionarMovimientos(
                                    $documento->iddocumento, $item, LogisticaMovimientoModel::SIGNO_MOV_RESTA, true, true
                                );
                                if (count($mov['movimientos']) > 0) {
                                    if (!$depositos || $depositos[count($depositos) - 1]['idcliente'] != $key) {
                                        $depositos[] = array('idcliente' => $key, 'tipocliente' => 3);
                                    }
                                    $id = $documento->iddocumento;
                                    $this->resetearEquipoPartida($id, true);
                                    $this->loteServ->extraerCantidades($mov['movimientos']);
                                    $this->loteServ->actualizarExistenciaLote($id);
                                    $this->crearDocumentoCliente($id, $value['idcliente'], $value['tipocliente']);
                                    $this->crearDocumentoPadre($id, $idPadres);
                                    $this->adicionarDatMoventrega($id, $datos['origen'],false,false,false,$act);
                                } else {
                                    $cantDoc--;
                                    Doctrine_Query::create()->delete('DatDocumento')
                                        ->where('iddocumento = ?', $documento->iddocumento)->execute();
                                    continue;
                                }
                            }
                        }
                    } else {
                        $documento = $this->inicializarDatEntrega($datos);
                        $id = $documento->iddocumento;
                        $cantDoc++;
                        $this->getProductoModel()->modificarMovimientos($datos['productos'], true, true);
                        if ($datos['lotes'] && count($datos['lotes']) > 0) {
                            $params = array(
                                'collection' => true, 'signo' => '-', 'actualizarMov' => true, 'afectaLote' => true
                            );
                            $this->loteServ->adicionarLote($datos['lotes'], $params);
                        }
                        $this->adicionarDatMoventrega($id, $datos['origen'],false,false,false,$act);
                    }
                }
            } else {
                if (!isset($value['idcliente'])) {
                    $value = array('idcliente' => $value, 'tipocliente' => 2);
                }
                $idPadres = $this->devolverPadresByDoc(
                    $datos['iddocumento'], $value['idcliente'], $datos['idgenerado'], 4
                );
                if (!$datos['iddocumento']) {
                    $mov = $this->ordeTrabajoServ->devolverMaterialesOrden($idPadres, true, array('aprobado' => 1, 'vales' => 1,
                        'iddeposito' => $datos['idestructuracomun'], 'idcentrocosto' => $value['idcliente']))->fetchArray();
                    if (count($mov)) {
                        $productos = $this->getProductoModel()->obtenerProductosEnDepositos(
                            $mov, $this->global->Estructura->idestructura, $datos['idestructuracomun']
                        );

                        foreach ($productos as $key => $item) {
                            $idPadres = (is_array($idPadres))?implode(',',$idPadres):$idPadres;
                            foreach ($item as &$prod) {
                                $cantidades = $this->devolverCantidadesEntregadasOrden($idPadres, $prod['idproducto']);
                                $cantAux = $prod['cantidad'];
                                if (count($cantidades)) {
                                    $cantResta = $cantidades[0]['cantidadoriginal'] - $cantidades[0]['entregado'];
                                    $cantAux = $cantResta + $cantidades[0]['devuelto'];
                                }
                                $prod['cantidad'] = ($prod['cantidad'] <= $cantAux) ? $prod['cantidad'] : $cantAux;
                            }
                            $datos['idestructuracomun'] = $key;
                            $documento = $this->inicializarDatEntrega($datos, $value['tipocliente']);
                            $cantDoc++;
                            $mov = $this->getProductoModel()->adicionarMovimientos(
                                $documento->iddocumento, $item, LogisticaMovimientoModel::SIGNO_MOV_RESTA, true, true
                            );
                            if (count($mov['movimientos']) > 0) {
                                if (!$depositos || $depositos[count($depositos) - 1]['idcliente'] != $key) {
                                    $depositos[] = array('idcliente' => $key, 'tipocliente' => 3);
                                }
                                $id = $documento->iddocumento;
                                $this->resetearEquipoPartida($id, true);
                                $this->loteServ->extraerCantidades($mov['movimientos']);
                                $this->loteServ->actualizarExistenciaLote($id);
                                $this->crearDocumentoCliente($id, $value['idcliente'], $value['tipocliente']);
                                $this->crearDocumentoPadre($id, $idPadres);
                                $this->adicionarDatMoventrega($id, $datos['origen']);
                            } else {
                                $cantDoc--;
                                Doctrine_Query::create()->delete('DatDocumento')
                                    ->where('iddocumento = ?', $documento->iddocumento)->execute();
                                continue;
                            }
                        }
                    }
                } else {
                    $documento = $this->inicializarDatEntrega($datos);
                    $id = $documento->iddocumento;
                    $cantDoc++;
                    $this->getProductoModel()->modificarMovimientos($datos['productos'], true, true);
                    if ($datos['lotes'] && count($datos['lotes']) > 0) {
                        $params = array(
                            'collection' => true, 'signo' => '-', 'actualizarMov' => true, 'afectaLote' => true
                        );
                        $this->loteServ->adicionarLote($datos['lotes'], $params);
                    }
                    $this->adicionarDatMoventrega($id, $datos['origen']);
                }
            }
            $idcliente = $value['idcliente'];
        }
        if ($cantDoc > 0) {
            $this->cargarClientesDocumentos($depositos);
            foreach ($depositos as $k => $dep) {
                if ($k > 0 && $k == count($depositos) - 1) {
                    $depos .= ' y ';
                } elseif ($k > 0) {
                    $depos .= ', ';
                }
                $depos .= $dep['cliente'];
            }
        }
        return array(
            'success' => ($cantDoc > 0), 'iddocumento' => ($cantDoc == 1 ? $id : null),
            'iddoc' => $cantDoc == 1 ? $documento->iddoc : null,
            'nrodoc' => $cantDoc == 1 ? $documento->nrodoc : null, 'depositos' => $depos,
            'numeroref' => $cantDoc == 1 ? $documento->numeroref : null,
            'fechacontable' => $cantDoc == 1 ? $documento->fechacontable : null,
            'idcliente' => $cantDoc == 1 ? $idcliente : null, 'tipocliente' => $cantDoc == 1 ? 2 : null
        );
    }

    /**
     * Adiciona o actualiza una o varias órdenes de produccion.
     * @param array $datos
     * @param array $clientes
     * @return array
     */
    private function adicionarOrdenProduccion($datos,$clientes)
    {
        $cantDoc = 0;
        foreach ($clientes as $idcl) {
            $value['idcliente'] = $idcl;
            $value['tipocliente'] = 2;
            /*$idPadres = $this->devolverPadresByDoc(
                $datos['iddocumento'], $value['idcliente'], $datos['idgenerado'], $datos['origen']
            );*/
            $alias = 'valeLog';
            $this->setIdTipoDocumento($alias);

            if (!$datos['iddocumento']) {
                $documento = $this->inicializarDatEntrega($datos, 2);
                $cantDoc++;
                $productos = $this->ordeProduccionServ->devolverMaterialesOrden(array('iddocumento'=>$datos['idgenerado'][0]))['datos'];
                foreach ($productos as $key => $item) {
                    $mov = $this->getProductoModel()->adicionarMovimientos(
                        $documento->iddocumento, array($item), LogisticaMovimientoModel::SIGNO_MOV_RESTA, true, true
                    );
                    if (count($mov['movimientos']) > 0) {
                        $id = $documento->iddocumento;
                        $this->crearDocumentoCliente($id, $value['idcliente'], $value['tipocliente']);
                        $this->crearDocumentoPadre($id, $datos['idgenerado']);
                        $this->adicionarDatMoventrega($id, 5);
                    } else {
                        $cantDoc--;
                        Doctrine_Query::create()->delete('DatDocumento')
                            ->where('iddocumento = ?', $documento->iddocumento)->execute();
                        continue;
                    }
                }
            } else {
                $documento = $this->inicializarDatEntrega($datos);
                $id = $documento->iddocumento;
                $cantDoc++;
                $this->getProductoModel()->modificarMovimientos($datos['productos'], true, true);
                $this->adicionarDatMoventrega($id, 5);
            }
            $idcliente = $datos['idcliente'];
        }

        return array(
            'success' => ($cantDoc > 0), 'iddocumento' => $cantDoc == 1 ? $documento->iddocumento : null,
            'iddoc' => $cantDoc == 1 ? $documento->iddoc : null,
            'nrodoc' => $cantDoc == 1 ? $documento->nrodoc : null,
            'numeroref' => $cantDoc == 1 ? $documento->numeroref : null,
            'fechacontable' => $cantDoc == 1 ? $documento->fechacontable : null,
            'idcliente' => $cantDoc == 1 ? $idcliente : null, 'tipocliente' => $cantDoc == 1 ? 2 : null
        );
    }

    /**
     * Inicializa los datos para adicionar o actualizar DatEntrega.
     * @param array $datos
     * @param numeric $tipocliente [Opcional]
     * @param numeric $idestructura [Opcional]
     * @return DatDocumento
     */
    private function inicializarDatEntrega($datos, $tipocliente, $idestructura = false)
    {
        if ($idestructura) {
            $datos['idestructuracomun'] = $idestructura;
        }
        $documento = parent::adicionarDocumento($datos);
        $entrega = new DatEntrega();
        if (!isset($datos['origen']) || !is_numeric($datos['origen'])){
            unset($datos['origen']);
        }
        if ($datos['iddocumento']) {
            $entrega->assignIdentifier($datos['iddocumento']);
        }
        $entrega->synchronizeWithArray($datos);
        if ($tipocliente) {
            $entrega->iddestino = $tipocliente;
        }
        $documento->DatEntrega = $entrega;
        $datos['cartaporte'] = $datos['cartaporte'] ? $datos['cartaporte'] : null;
        $this->adicionarTransportador($documento, $datos);
        $documento->save();
        return $documento;
    }

    /**
     * Confirma el documento.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function confirmarDocumento($iddocumento)
    {
        //$this->logisticaDoctrine->executeQuery("SELECT * FROM mod_logubicacion.fn_arreglardesubicados();");
        $query = Doctrine_Query::create()
            ->select(
                'm.idmovimiento, m.idproducto, m.iddocumento, -1 AS idestructuraubicacion, -1 AS idubicacion, '
                . '(m.cantidad - coalesce(sum(mu.cantidad), 0)) AS cantidad'
            )
            ->from('DatMovimientos m')
            ->leftJoin('m.DatMovlote ml')->leftJoin('m.DatMovnroserie mns')
            ->leftJoin('m.DatMovubicacion mu')
            ->where('m.iddocumento = ? AND ml.idmovimiento IS NULL AND mns.idmovimiento IS NULL', $iddocumento)
            ->groupBy('m.idmovimiento, m.idproducto')
            ->having('(m.cantidad - coalesce(sum(mu.cantidad), 0)) > 0');
        if ($this->existComponent('log.inv.municiones')) {
            $query->leftJoin('m.DatMovproductomunic mpm')->addWhere('mpm.idmovproductomunic IS NULL');
        }
        /*$movimientos = $query->fetchArray();
        $collection = new Doctrine_Collection('DatMovubicacion');
        foreach ($movimientos as $value) {
            $ubicacion = $this->ubicacionServ->getUbicacionUnica($value['idproducto']);

            if ($ubicacion) {
                $value['idestructuraubicacion'] = $value['idubicacion'] = $ubicacion['idubicacion'];
            }
            $value['iddocumento'] = $iddocumento;
            $this->ubicacionServ->adicionarUbicacionComprometida($value);
            $record = new DatMovubicacion();
            $record->synchronizeWithArray($value);
            $collection->add($record);
        }
        if ($collection->count() > 0) {
            $collection->save();
        }*/
        return parent::confirmarDocumento($iddocumento);
    }

    /**
     * Anula el documento.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function anularEstadoDocumento($iddocumento)
    {
        $uc = Doctrine_Query::create()
            ->select('uc.idubicacioncomprometida')
            ->from('DatUbicacionComprometida uc')
            ->innerJoin('uc.DatMovimientos m')
            ->where(
                'm.iddocumento = ? AND uc.iddocumento = m.iddocumento AND uc.idproducto = m.idproducto '
                . 'AND (SELECT count(up.idubicacionproducto) FROM DatUbicacionproducto up '
                . 'WHERE up.idproducto = m.idproducto AND up.cantidad > 0) = 1', $iddocumento
            )
            ->fetchArray();
        $mu = Doctrine_Query::create()
            ->select('mu.idmovubicacion')
            ->from('DatMovubicacion mu')
            ->innerJoin('mu.DatMovimientos m')
            ->where(
                'm.iddocumento = ? AND (SELECT count(up.idubicacionproducto) FROM DatUbicacionproducto up '
                . 'WHERE up.idproducto = m.idproducto AND up.cantidad > 0) = 1', $iddocumento
            )
            ->fetchArray();
        $idubicacioncomprometida = $this->objectHelper->extractValueFromArrayColumn($mu, 'idubicacioncomprometida');
        $idubicacioncomprometida[] = -1;
        $idmovubicacion = $this->objectHelper->extractValueFromArrayColumn($uc, 'idmovubicacion');
        $idmovubicacion[] = -1;
        $this->ubicacionServ->eliminarUbicacionComprometida(null, null, $idubicacioncomprometida);
        Doctrine_Query::create()->delete('DatMovubicacion')->whereIn('idmovubicacion', $idmovubicacion)->execute();
        return parent::anularEstadoDocumento($iddocumento);
    }

    /**
     * Contabiliza un documento dado un iddocumento.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function contabilizarDocumento($iddocumento)
    {
        $config = $this->configuracionService->devolverConfiguracion($this->global->Estructura->idestructura);
        $collMov = new Doctrine_Collection('DatMovimientos');
        $doc = Doctrine_Query::create()->select('e.origen AS origen, p.idestructura AS idestructura, m.idmovimiento as idmovimiento')
            ->from('DatMovimientos m')->innerJoin('m.DatProductoLogistica p')->innerJoin('m.DatDocumento d')
            ->innerJoin('d.DatEntrega e')->where('m.iddocumento = ?', $iddocumento)
            ->fetchArray();
        $idPadres = $this->devolverPadresByDoc($iddocumento, null, null, $doc[0]['origen']);
        $clientes = $this->devolverClientesByDoc($iddocumento);
        foreach ($doc as $mov) {
            $mov = $this->producto->getMovimientoModel()->updatePrecioMovimientoSalida($mov['idmovimiento']);
            if ($mov['record']) {
                $collMov->add($mov['record']);
            }
        }
        if (count($collMov)) {
            $collMov->save();
        }
        if ($doc[0]['origen'] == 1) {
            foreach ($clientes as $value) {
                $dpo = new ProdordenModel();
                $prodOrden = $this->devolverDatProdorden(
                    $idPadres, $value['idcliente'],
                    array('iddocumento' => $iddocumento, 'idestructuracomun' => $doc[0]['idestructura']), null, false,
                    false, true
                );
                $productos = array('productos' => $prodOrden, 'idcliente' => $value['idcliente']);
                $dpo->actualizarCumplimientoByParams($productos);
            }
//            $cliente = Doctrine::getTable('DatDocumentoCliente')->findByDql('iddocumento = ?', array($iddocumento))
//                ->getFirst();
//            if ($cliente->tipocliente == 3) {
//                $transfAlmacen = new TransferenciasAlmacenesModel(array('noexception' => true));
//                $transfAlmacen->contabilizarTransferencia($iddocumento, $cliente->idcliente);
//            }
        } else {
            $prodSol = $this->devolverMovSolEntrega(array('iddocumento' => $iddocumento), $idPadres, null, false, true);
            $this->actualizarCumplimiento($prodSol);
        }
        if ($this->existComponent('log.inv.municiones')) {
            $municionesService = new MunicionesService();
            $municionesService->aprobarPartida($iddocumento);
        }
        $this->loteServ->actualizarExistenciaLote($iddocumento, false);
        $this->actualizarUbicacion($iddocumento);
        $cronologia = parent::contabilizarDocumento($iddocumento);
        $this->noSerieServ->actualizarEstadoNumeroSerie($iddocumento);
        $this->getProductoModel()->aprobarMovimientos($iddocumento, $cronologia);
        $comprometida = new CantidadesComprometidasModel();
        $comprometida->cambiarEstado(2, $iddocumento);
        $this->ubicacionServ->cambiarEstado($iddocumento, 2);

        if ($doc[0]['origen'] == 4) {
            /*$conn = Zend_Registry::get('conexion');
            $array = [];
            foreach ($idPadres as $padre) {
                $array[$padre] = $padre;
                $sql = "select d.nrodoc as nrodoc, m.cantidad AS cantidad, p.idindicador AS idindicador from mod_logistica.dat_movimiento m " .
                    "inner join mod_logistica.dat_producto p on p.idproducto = m.idproducto " .
                    "inner join mod_logistica.dat_documento d on d.iddocumento = m.iddocumento where m.iddocumento = {$iddocumento} ";
                $movimientos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                $array[$padre] = $movimientos;
            }*/
            $this->ordeTrabajoServ->updateDatosMateriasles($idPadres);
        }

        if ($config['comprobante']) {
            $comp = $this->generarComprobante($iddocumento, LogisticaGlobal::SUBSISTEMA_INV);
            $resultado['comprobante'] = $comp[0];
        }
        return array(
            'success' => true,
            'comprobante' => (isset($resultado) ? $resultado['comprobante'] : false)
        );
    }

    /**
     * Elimina un documento.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function eliminarDocumento($iddocumento)
    {
        $idPadres = $this->devolverPadresByDoc($iddocumento);
        $clientes = $this->devolverClientesByDoc($iddocumento);
        $doc = Doctrine_Query::create()->select('e.origen AS origen, p.idestructura AS idestructura')
            ->from('DatMovimientos m')->innerJoin('m.DatProductoLogistica p')->innerJoin('m.DatDocumento d')
            ->innerJoin('d.DatEntrega e')->where('m.iddocumento = ?', $iddocumento)->fetchArray();
        if ($doc[0]['origen'] == 1) {
            foreach ($clientes as $value) {
                $dpo = new ProdordenModel();
                $prodOrden = $this->devolverDatProdorden(
                    $idPadres, $value['idcliente'],
                    array('iddocumento' => $iddocumento, 'idestructuracomun' => $doc[0]['idestructura']), null, true
                );
                $productos = array('productos' => $prodOrden, 'idcliente' => $value['idcliente']);
                $dpo->actualizarCumplimientoByParams($productos);
            }
        } elseif ($doc[0]['origen'] == 2) {
            $prodSol = $this->devolverMovSolEntrega(array('iddocumento' => $iddocumento), $idPadres, null, true);
            $this->actualizarCumplimiento($prodSol, $eliminar=true);
        }
        $this->loteServ->eliminarLotesDocumento($iddocumento);
        $this->noSerieServ->eliminarNrosCancelados($iddocumento, null, true);
        $this->getProductoModel()->eliminarMovimientos($iddocumento, null, $doc[0]['origen'] != 1, false, true);
        $this->ubicacionServ->eliminarUbicacionComprometida($iddocumento);
        return parent::eliminarDocumento($iddocumento);
    }

    /**
     * Cancela el documento.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function cancelarDocumento($iddocumento)
    {
        $objIddocOrden = $this->documentosHelper->devuelveIddocByIdEstructura(
            'ordenServicioLOG', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_TALLERES
        );
        $objIddocProduccion = $this->documentosHelper->devuelveIddocByIdEstructura(
            'produccionLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_PRODUCCION
        );
        $iddocPadre = $this->getIddocDocumentoPadre($iddocumento);
        $iddocSolEntPadre = $this->getIddocDocumentoSolEntregaPadre($iddocumento);

        if (!$this->existComponent('log.produccion.ordenproduccion') || $objIddocProduccion->iddoc == '' || $objIddocProduccion->iddoc == null) {
            throw new ZendExt_Exception('LOG_LB_SAL_007');
        }
        if ($objIddocOrden->iddoc && $iddocPadre == $objIddocOrden->iddoc) {
            throw new LogisticaException('LOG_LB_SAL_005', null, null, $this->global->Estructura->idestructura);
        } else if ($objIddocProduccion->iddoc && $iddocSolEntPadre == $objIddocProduccion->iddoc) {
            throw new LogisticaException('LOG_LB_SAL_006');
        } else {
            $this->loteServ->actualizarExistenciaLote($iddocumento, false, 1, true);
            $datos = parent::cancelarDocumento($iddocumento);
            if ($this->existComponent('log.inv.municiones')) {
                $municionesService = new MunicionesService();
                $municionesService->aprobarPartida($iddocumento, true);
            }
            $this->noSerieServ->actualizarEstadoNumeroSerie($iddocumento, true);
            $this->actualizarUbicacion($iddocumento, true);
            $this->producto->cancelarMovimientos($datos['iddocumento'], $datos['cronologia'], false);


            $doc = Doctrine_Query::create()->select('e.origen AS origen, p.idestructura AS idestructura')
                ->from('DatMovimientos m')->innerJoin('m.DatProductoLogistica p')->innerJoin('m.DatDocumento d')
                ->innerJoin('d.DatEntrega e')->where('m.iddocumento = ?', $iddocumento)->fetchArray();
            if ($doc[0]['origen'] == 4) {
                $idPadres = $this->devolverPadresByDoc($iddocumento, null, null, $doc[0]['origen']);
                /*$conn = Zend_Registry::get('conexion');
                $array = [];
                foreach ($idPadres as $padre) {
                    $array[$padre] = $padre;
                    $sql = "select d.nrodoc as nrodoc, m.cantidad AS cantidad, p.idindicador AS idindicador from mod_logistica.dat_movimiento m " .
                        "inner join mod_logistica.dat_producto p on p.idproducto = m.idproducto " .
                        "inner join mod_logistica.dat_documento d on d.iddocumento = m.iddocumento where m.iddocumento = {$iddocumento} ";
                    $movimientos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                    $array[$padre] = $movimientos;
                }
                $this->ordeTrabajoServ->actulizarNrosVale($array, true);*/
                $this->ordeTrabajoServ->updateDatosMateriasles($idPadres);
            }
            return true;
        }
    }

    public function getIddocDocumentoPadre($iddocumento) {
        $sql = "select dd.iddoc from mod_logistica.dat_documento dd 
               inner join mod_logistica.dat_documentopadre ddp on ddp.idpadre = dd.iddocumento 
               where ddp.iddocumento = {$iddocumento} ";
        $data = $this->doctrineHelper->getConnection()->fetchAssoc($sql);
        return (count($data) ? $data[0]['iddoc'] : -1);
    }

    public function getIddocDocumentoSolEntregaPadre($iddocumento) {
        $sql = "select dd.iddoc from mod_logistica.dat_documento dd 
               inner join mod_logistica.dat_documentopadre ddp on ddp.idpadre = dd.iddocumento 
               inner join mod_logistica.dat_documento doc on doc.iddocumento = ddp.iddocumento
               inner join mod_logistica.dat_documentopadre docp on docp.idpadre = doc.iddocumento 
                inner join mod_logistica.dat_documento ddoc on ddoc.iddocumento = docp.iddocumento
               where docp.iddocumento = {$iddocumento} ";
        $data = $this->doctrineHelper->getConnection()->fetchAssoc($sql);
        return (count($data) ? $data[0]['iddoc'] : -1);
    }
    /**
     *
     * @param type $idDocumento
     */
    public function checkPuedeCancelar($idDocumento)
    {
        return true;
    }

    /**
     * Devuelve los movimientos asociados a un documento.
     * @param Doctrine_Query $query
     * @param numeric $iddocumento
     * @return array
     */
    public function devolverMovimientos($query, $iddocumento)
    {
        $maestroP = new MaestroProductoModel();
        $partida = '';
        /*if ($this->existComponent('log.inv.municiones')) {
            $query->leftJoin('p.DatProductomunic pm');
            $partida = ' OR pm.idproductomunic IS NOT NULL';
        }*/

        $query->innerJoin('mov.DatDocumentoCliente _dc')->leftJoin('p.DatNroserie ns')->addSelect(
            "(CASE WHEN ns.idnroserie IS NOT NULL {$partida} THEN coalesce((SELECT sum(me.pendiente) FROM DatMoventrega me "
            . 'INNER JOIN me.DatMovimientos m ON m.idmovimiento = me.idmovimiento INNER JOIN m.DatDocumentoCliente dc4 '
            . 'ON dc4.iddocumento = m.iddocumento INNER JOIN me.DatMoventrega me2 '
            . 'ON me2.iddocorigen = me.iddocorigen WHERE m.idproducto = mov.idproducto AND _dc.idcliente = dc4.idcliente '
            . 'AND m.iddocumento IN (SELECT dp4.iddocumento FROM DatDocumentoPadre dp4 WHERE dp4.idpadre IN (SELECT dp5.idpadre '
            . 'FROM DatDocumentoPadre dp5 WHERE dp5.iddocumento = mov.iddocumento) '
            . 'AND dp4.iddocumento <> mov.iddocumento) AND me2.idmovimiento = mov.idmovimiento), 0) '
            . 'ELSE coalesce((SELECT sum(m2.cantidad) FROM DatMovimientos m2 INNER JOIN m2.DatDocumento dd2 ON (m2.iddocumento = dd2.iddocumento AND dd2.estado IN (1,2,4)) INNER JOIN m2.DatDocumentoCliente dc2 '
            . 'ON dc2.iddocumento = m2.iddocumento WHERE m2.idproducto = mov.idproducto AND _dc.idcliente = dc2.idcliente '
            . 'AND m2.iddocumento IN (SELECT dp2.iddocumento FROM DatDocumentoPadre dp2 '
            . 'WHERE dp2.idpadre IN (SELECT dp3.idpadre FROM DatDocumentoPadre dp3 '
            . 'WHERE dp3.iddocumento = mov.iddocumento) AND dp2.iddocumento <> mov.iddocumento)), 0) END) AS resto, '
            . '(SELECT (count(up.idubicacion) = 1) FROM DatUbicacionproducto up WHERE up.idproducto = mov.idproducto '
            . 'AND up.cantidad > 0) AS ubicacionunica, (SELECT mu.idmovubicacion FROM DatMovubicacion mu '
            . 'WHERE mu.idmovimiento = mov.idmovimiento AND (SELECT count(mu2.idmovubicacion) '
            . 'FROM DatMovubicacion mu2 WHERE mu2.idmovimiento = mov.idmovimiento) = 1) AS idmovubicacion, '
            . '(SELECT up2.idubicacion FROM DatUbicacionproducto up2 WHERE up2.idproducto = mov.idproducto '
            . 'AND (SELECT count(up3.idubicacion) FROM DatUbicacionproducto up3 '
            . 'WHERE up3.idproducto = mov.idproducto) = 1 limit 1) AS idestructuraubicacion, (SELECT sum(coalesce(dme.ordenado,0)) '
            . 'FROM DatMoventrega dme WHERE dme.idmovimiento = mov.idmovimiento and dme.iddocorigen = ' . $iddocumento . ') as ordenado, '
            . '(COALESCE(mov.idelementogasto,p.idelementogasto)) AS idelemento, p.idelementogastoalt AS idelementoalt'
        );
        return array(
            'cantidad' => $query->count(),
            'datos' => $maestroP->addSelectionData($this->logisticaDoctrine->addQueryLimits($query)->fetchArray())
        );
    }

    /**
     * Devuelve los movimientos de los vales de entrega.
     * @param array $datosDoc
     * @return array
     */
    public function devolverMovValeEntrega($datosDoc)
    {
        $query = $this->getProductoModel()->devolverMovimientos($datosDoc, true);
        $query->addSelect('p.minimo AS minimo, p.maximo AS maximo')
            ->innerJoin('mov.DatEntrega de')
            ->addWhere('de.iddestino = 2');
        if ($datosDoc['criterio']) {
            $query->addWhere("i.denominacion ILIKE '%{$datosDoc['criterio']}%'");
        }
        return array(
            'cantidad' => $query->count(), 'datos' => $this->logisticaDoctrine->addQueryLimits($query)->fetchArray()
        );
    }

    /**
     * Devuelve los productos de un tipo de documento específico.
     * @param array $filtro
     * @param boolean $dql [Opcional] Determina si se devuelve la consulta.
     * @return array
     */
    public function devolverProductosDoc($filtro, $dql = false)
    {
        // vale = centro_costo, transferencia = cliente y depósito.
        $iddocVale = $this->configuracionHelper->tipoDocumentoByAliasByIdestructutra(
            'valeLog', $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_INV
        );
        $iddocTrans = $this->configuracionHelper->tipoDocumentoByAliasByIdestructutra(
            'transferenciaLog', $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_INV
        );
        if ($filtro['tipo'] == 1) {
            $filtro['iddoc'] = array($iddocTrans->iddoc);
        } elseif ($filtro['tipo'] == 2) {
            $filtro['iddoc'] = array($iddocVale->iddoc);
        } else {
            $filtro['iddoc'] = array($iddocTrans->iddoc, $iddocVale->iddoc);
        }
        unset($filtro['tipo']);
        $query = $this->producto->cargarProductos($filtro, true);
        $query->addSelect(
            '(SELECT sum(m2.cantidad) FROM DatMovimientos m2 WHERE m2.idmovimiento = m.idmovimiento) AS cantidad'
        )
            ->innerJoin('p.DatMovimientos m')
            ->innerJoin('m.DatDocumento d')
            ->innerJoin('d.DatEntrega de')
            ->innerJoin('d.DatDocumentoCliente ddc')
            ->addWhere("ddc.idcliente = ? AND d.estado = ?",
                array($filtro['idcliente'], EstadoDocumentoModel::ESTADO_CONTABILIZADO))
            ->andWhereIn('d.iddoc', $filtro['iddoc']);

        if ($dql) {
            return $query;
        }
        return array(
            'datos' => $this->logisticaDoctrine->addQueryLimits($query)->fetchArray(), 'cantidad' => $query->count()
        );
    }

    /**
     * @param $parametros
     * @return array
     */
    public function devolverElementos($parametros)
    {
        if (!$parametros['idcentro'] /*|| !$parametros['idcuenta']*/) {
            $datos = array();
        } else {
            $datos = ServiciosContabilidadFinanzasHelper::__init()->
            obtenerElementosHoja(200530666);
            foreach($datos as &$d){
                $d->descripcion = $d->codigoelementoobjeto.' '.$d->descripcionelementoobjeto;
            }
            /*$datos = $this->contabilidadHelper
                ->obtenerElementosPorCuentaCentro($this->global->Estructura->idestructura, $parametros['idcuenta'], $parametros['idcentro']);
            foreach($datos as &$d){
                $d->descripcion = $d->codigoelementoobjeto.' '.$d->descripcionelementoobjeto;
            }*/
        }
        return array(
            'datos' => $datos
        );
    }

    /**
     * @param numeric $iddocumento
     * @param array $datosDoc
     * @param array $idPadres
     * @param array $arrIdProd
     * @return array
     */
    private function adicionarMovimientos($iddocumento, $datosDoc, $idPadres, $arrIdProd)
    {
        if ($datosDoc['iddocumento']) {
            $padres = $this->devolverPadresByCantMov($iddocumento, true);
            $idPadres = $this->objectHelper->extractValueFromArrayColumn($padres, 'iddocumento');
        }
        $prod = $this->devolverMovSolEntrega($datosDoc, $idPadres, $arrIdProd);
        $datosMov = $this->unificarProductos($prod, $datosDoc['productos']);
        if (!$datosDoc['iddocumento']) {
            $datosMov = $this->getProductoModel()->adicionarMovimientos(
                $iddocumento, $datosMov, LogisticaMovimientoModel::SIGNO_MOV_RESTA, true
            );
            $this->loteServ->extraerCantidades($datosMov['movimientos'], true);
        } else {
            if (count($datosMov)) {
                $this->getProductoModel()->modificarMovimientos($datosMov, true, true);
            }
            if ($datosDoc['lotes'] && count($datosDoc['lotes']) > 0) {
                $params = array('collection' => true, 'signo' => '-', 'actualizarMov' => true, 'afectaLote' => true);
                $this->loteServ->adicionarLote($datosDoc['lotes'], $params);
            }
        }
        return array(
            'creado' => $datosDoc['iddocumento'] || count($datosMov['movimientos']),
            'movimientos' => $datosMov['movimientos'], 'productosSol' => $prod
        );
    }

    /**
     * @param $idmovimientos
     * @return array
     */
    public function eliminarMovimientos($idmovimientos)
    {
        $idmovs = implode(',', $idmovimientos);
        $datos = Doctrine_Query::create()
            ->select(
                "(SELECT d.iddocumento FROM DatDocumento d WHERE d.iddocumento = m.iddocumento) AS iddocumento, "
                . "(SELECT e.origen FROM DatEntrega e WHERE e.iddocumento = m.iddocumento) AS origen, "
                . "(SELECT array_to_string(array_agg(m2.idproducto),',') FROM DatMovimientos m2 "
                . "WHERE m2.idmovimiento IN ({$idmovs})) AS idproductos, p.idestructura AS idestructura"
            )
            ->from('DatMovimientos m')
            ->innerJoin('m.DatProductoLogistica p')
            ->whereIn('idmovimiento', $idmovimientos)
            ->fetchArray();
        $iddocumento = $datos[0]['iddocumento'];
        $idPadres = $this->devolverPadresByDoc($iddocumento);
        $arrIdProd = explode(',', $datos[0]['idproductos']);
        if ($datos[0]['origen'] == 1) {
            $clientes = $this->devolverClientesByDoc($iddocumento);
            foreach ($clientes as $value) {
                $dpo = new ProdordenModel();
                $prodOrden = $this->devolverDatProdorden(
                    $idPadres, $value['idcliente'],
                    array('iddocumento' => $iddocumento, 'idestructuracomun' => $datos[0]['idestructura']), $arrIdProd,
                    true
                );
                $productos = array('productos' => $prodOrden, 'idcliente' => $value['idcliente']);
                $dpo->actualizarCumplimientoByParams($productos);
            }
        } else {
            $prodSol = $this->devolverMovSolEntrega(array('iddocumento' => $iddocumento), $idPadres, $arrIdProd, true);
            $this->actualizarCumplimiento($prodSol);
        }
        $this->loteServ->eliminarLotesDocumento(null, $idmovimientos);
        $this->noSerieServ->eliminarNrosCancelados(null, $idmovimientos, true);
        $this->getProductoModel()->eliminarMovimientos(false, $idmovimientos, $datos[0]['origen'] != 1, false, true);
        if ($datos[0]['origen'] == 1 || $datos[0]['origen'] == 2) {
            $padres = $this->devolverPadresByCantMov($iddocumento);
            //$this->crearDocumentoPadre($iddocumento, $padres);
            $nroDoc = $this->objectHelper->extractValueFromArrayColumn($padres, 'nrodoc');
        }
        $comprometida = new CantidadesComprometidasModel();
        $comprometida->eliminarCantidadComprometida($iddocumento, $arrIdProd);
        $this->ubicacionServ->eliminarUbicacionComprometida($iddocumento, $arrIdProd);
        return array('nroDocPadre' => implode(', ', $nroDoc));
    }

    /**
     * Resetea la cantidad del movimiento.
     * @param type $iddocumento
     * @param type $afecta [Opcional] Determina si afecta el dicponible del producto.
     */
    private function resetearEquipoPartida($iddocumento, $afecta = false)
    {
        $array = Array();
        $productos = $this->getProductoModel()->devolverMovimientos(array('iddocumento' => $iddocumento));
        foreach ($productos['datos'] as $value) {
            if ($value['equipo'] == 1 || $value['municion'] == 1) {
                $value['cantidad'] = 0;
                $array[] = $value;
            }
        }
        $this->getProductoModel()->modificarMovimientos($array, $afecta);
    }

    /**
     * Suma las cantidades de los productos repetidos.
     * @param array $productos
     * @return array
     */
    private function unificarProductos($productos, $prodDoc)
    {
        $array = array();
        foreach ($productos as $value) {
            if ($idproducto != $value['idproducto']) {
                $idproducto = $value['idproducto'];
                $prod = $this->findProductoById($prodDoc, $idproducto);
                if ($prod['idelementogasto']) {
                    $value['idelementogasto'] = $prod['idelementogasto'];
                }
                if ($prod['idelementogastoalt']) {
                    $value['idelementogastoalt'] = $prod['idelementogastoalt'];
                }
                $array[] = $value;
            } else {
                $array[count($array) - 1]['cantidad'] += $value['cantidad'];
            }
        }
        return $array;
    }

    /**
     * Actualiza el cumplimiento de entrega del producto.
     * @param array $productos
     * @return boolean
     */
    public function actualizarCumplimiento($productos, $eliminar = false)
    {
        $collection = new Doctrine_Collection('DatProductocmplto');
        foreach ($productos as $value) {
            $cmpto = new DatProductocmplto();
            $cmpto->assignIdentifier($value['idproductocmplto']);
            if($eliminar && $value['entregado'] == 0){
                $value['pendiente'] = $value['ordenado'];
            }elseif($eliminar && $value['entregado']!=0){
                $value['pendiente'] = $value['ordenado'] - $value['entregado'];
            }
            elseif($eliminar == false){
                $value['pendiente'] = $value['pc_pendiente'] + $value['mov_pendiente'] - $value['cantidad'];
            }
            $value['entregado'] = $cmpto->entregado + $value['entregado'];
            unset($value['cantidad']);
            $cmpto->synchronizeWithArray($value);
            $collection->add($cmpto);
        }
        if ($collection->count() > 0) {
            $collection->save();
        }
        return true;
    }

    /**
     * Devuelve un arreglo con los datos de la tabla DatProdorden.
     * @param array $idPadres Arreglo de id de documentos.
     * @param numeric $idcliente Id del cliente para el que se va a generar el documento.
     * @param array $doc Datos para generar el documento.
     * @param array $arrIdProd [Opcional] Arreglo de id de los productos modificados.
     * @param boolean $restablecer [Opcional]
     * @param boolean $porDeposito [Opcional] Devuelve los productos separados por los depósitos de origen.
     * @param boolean $contabilizar [Opcional]
     * @param boolean $utiles [Opcional] Devuelve solo los productos que son útiles o herramientas.
     * @return array
     */
    public function devolverDatProdorden($idPadres, $idcliente, $doc, $arrIdProd, $restablecer = false,
                                         $porDeposito = false, $contabilizar = false, $utiles = false, $externo = false)
    {



        $externo = $externo ? '1' : '0';
        $iddocumento = $doc['iddocumento'] ? $doc['iddocumento'] : '-1';
        $partida = $this->existComponent('log.inv.municiones') ?
            "WHEN pm.idproductomunic IS NOT NULL AND {$externo} = '0' THEN 0" : '';
        $query = Doctrine_Query::create()
            ->select(
                "dpo.idprodorden, p.idproducto AS idproducto, dpo.cantidad AS ordenado, "
                . "(CASE WHEN ns.idnroserie IS NOT NULL AND {$externo} = '0' THEN 0 {$partida} "
                . "ELSE dpoc.pendiente END) AS pendiente, dpo.idorden AS iddocorigen, p.idestructura AS idestructura, "
                . "dpoc.pendiente AS pendienteViejo, coalesce((SELECT sum(me.pendiente) FROM DatMovimientos dm "
                . "INNER JOIN dm.DatMoventrega me ON me.idmovimiento = dm.idmovimiento "
                . "AND me.iddocorigen = dm.iddocumento WHERE dm.iddocumento = {$iddocumento} "
                . "AND dm.idproducto = dpo.idproducto), 0) AS enprocesoviejo, COALESCE((SELECT sum(me2.pendiente) "
                . "FROM DatMovimientos dm2 INNER JOIN dm2.DatMoventrega me2 ON me2.idmovimiento = dm2.idmovimiento "
                . "AND me2.iddocorigen = dm2.iddocumento WHERE dm2.iddocumento = {$iddocumento} "
                . "AND dm2.idproducto = dpo.idproducto),0) AS cantidad, "
                . "(SELECT dm3.idmovimiento FROM DatMovimientos dm3 WHERE dm3.iddocumento = {$iddocumento} "
                . "AND dm3.idproducto = dpo.idproducto) AS idmovimiento, (SELECT me3.idmoventrega "
                . "FROM DatMovimientos dm4 INNER JOIN dm4.DatMoventrega me3 ON me3.idmovimiento = dm4.idmovimiento "
                . "AND me3.iddocorigen = dpo.idorden WHERE dm4.iddocumento = {$iddocumento} "
                . "AND dm4.idproducto = dpo.idproducto) AS idmoventrega"
            )
            //
            ->from('DatProdorden dpo')->innerJoin('dpo.DatProductoLogistica p')->innerJoin('dpo.DatProdordencmpto dpoc')
            ->innerJoin('dpo.DatDocumento d')->leftJoin('p.DatNroserie ns')
//            ->innerJoin('p.NomIndicador ind')->leftJoin('p.DatLote l')
//            ->where(
//                '((l.idlote IS NOT NULL AND l.disponible > 0) OR l.idlote IS NULL) AND dpo.idcliente = ?
//                AND p.idestructuracomun = ?', array($idcliente, $doc['idestructuracomun'])
//            )
            ->where('dpo.idcliente = ? AND p.idestructuracomun = ?', array($idcliente, $this->idestructuracomun))
            ->whereIn('dpo.idorden', $idPadres)
            ->orderBy('p.idestructura, d.cronologia, p.idproducto');
        if (isset($doc['depositodoc']) && is_numeric($doc['depositodoc'])) {
            $query->addWhere("p.idestructura = ?", array($doc['depositodoc']));
        }
        if ($this->existComponent('log.inv.municiones')) {
            $query->leftJoin('p.DatProductomunic pm');
        }
        if ($doc['idestructuracomun']) {
            $query->addWhere('p.idestructura = ?', array($doc['idestructuracomun']));
        }
//        if ($utiles) {
//            $query->andWhere("ind.idnaturaleza = -5");
//        } else {
//            $query->andWhere("ind.idnaturaleza <> -5");
//        }
        if (is_array($arrIdProd) && count($arrIdProd) > 0) {
            $query->andWhereIn('dpo.idproducto', $arrIdProd);
        }
        if (!$doc['iddocumento']) {
            $query->addWhere('dpoc.pendiente > 0');
        }
        if ($restablecer) {
            $query->addSelect('0 AS enprocesonuevo');
        }
        //print_r($query->getSqlQuery());
        //print_r($query->getParams());die;

        $datos = $query->fetchArray();
        if ($externo == '0') {
            $mov = array_merge((array)$doc['productos'], (array)$doc['lotes']);
            foreach ($datos as $key => $value) {
                $cantAux = $value['cantidad'];
                if (count($mov) > 0) {
                    $prod = $this->findProductoById($mov, $value['idproducto']);
                    if ($idproducto != $value['idproducto']) {
                        $idproducto = $value['idproducto'];
                        $cantidad = $value['cantidad'] + $value['pendiente'] < $prod['cantidad'] ?
                            $value['cantidad'] + $value['pendiente'] : $prod['cantidad'];
                        $resto = abs($cantidad - $prod['cantidad']);
                    } else {
                        $cantidad = $value['cantidad'] + $value['pendiente'] < $resto ?
                            $value['cantidad'] + $value['pendiente'] : $resto;
                        $resto = abs($cantidad - $resto);
                    }
                    $datos[$key]['enprocesonuevo'] = $datos[$key]['cantidad'] = $cantidad;
                    $datos[$key]['preciocontable'] = $prod['preciocontable'];
                } else {
                    $datos[$key]['enprocesoviejo'] = $restablecer ? $datos[$key]['enprocesoviejo'] : 0;
                    $datos[$key]['enprocesonuevo'] = $datos[$key]['cantidad'] = $restablecer ? 0 : $value['pendiente'];
                }
                if ($contabilizar) {
                    $datos[$key]['entregado'] = $cantAux;
                    $datos[$key]['enprocesonuevo'] = $value['enprocesoviejo'] = 0;
                }
                $result[$value['idestructura']][] = $datos[$key];
            }
        }
        if ($porDeposito) {
            return (array)$result;
        }
        return $datos;
    }

    /**
     * Devuelve un arreglo con los movimientos de los documentos de solicitud de entrega con cantidaddes disponibles.
     * @param array $datosDoc Arreglo con los datos del documento.
     * @param array $idPadres Arreglo con los id de los documentos de origen.
     * @param array $arrIdProd [Opcional] Arreglo de idproducto.
     * @param boolean $restarar [Opcional] Reestablece las cantidades.
     * @param boolean $contabilizar [Opcional]
     * @param boolean $externo [Opcional]
     * @return array
     */
    public function devolverMovSolEntrega($datosDoc, $idPadres, $arrIdProd, $restarar = false, $contabilizar = false,
                                          $externo = false)
    {
        $iddocumento = $datosDoc['iddocumento'] ? $datosDoc['iddocumento'] : '0';
        $externo = $externo ? '1' : '0';
        $partida = $this->existComponent('log.inv.municiones') ?
            "WHEN pm.idproductomunic IS NOT NULL AND {$externo} = '0' THEN 0" : '';
        $restarar = $restarar ? '1' : '0';
        $contabilizar = $contabilizar ? '1' : '0';
        if (!is_array($idPadres)) {
            $idPadres = array($idPadres);
        }
        $query = Doctrine_Query::create()
            ->select(
                "pc.idproducto, (CASE WHEN {$restarar} = '1' OR {$contabilizar} = '1' THEN 0 "
                . "WHEN ns.idnroserie IS NOT NULL AND {$externo} = '0' THEN 0 {$partida} "
                . "ELSE coalesce(pc.pendiente, 0) END) AS cantidad, coalesce(pl.precio, 0) AS preciocontable, "
                . "coalesce(pl.precioalternativo, 0) AS precioalternativo, me.idmoventrega AS idmoventrega, "
                . "(CASE WHEN ns.idnroserie IS NOT NULL AND {$externo} = '0' THEN 0 {$partida} ELSE pc.pendiente END) "
                . "AS pendiente, pc.cantidad AS ordenado, (CASE WHEN {$contabilizar} = '1' THEN 0 "
                . "ELSE coalesce(me.pendiente, 0) END) AS mov_pendiente, pc.iddocumento AS iddocorigen, "
                . "coalesce(pc.pendiente, 0) AS pc_pendiente, (CASE WHEN {$contabilizar} = '1' THEN me.pendiente "
                . "ELSE 0 END) AS entregado, (CASE WHEN {$iddocumento} <> '0' THEN (SELECT m2.idmovimiento "
                . "FROM DatMovimientos m2 WHERE m2.iddocumento = {$iddocumento} "
                . "AND pl.idproducto = m2.idproducto) END) AS idmovimiento"
            )
            ->from("DatProductocmplto pc")
            ->innerJoin("pc.DatProductoLogistica pl ON (pl.idproducto = pc.idproducto)")
            ->leftJoin('pl.DatNroserie ns')
            ->leftJoin("pl.DatMovimientos m ON (m.idproducto = pl.idproducto AND m.iddocumento = {$iddocumento})")
            ->leftJoin('m.DatMoventrega me ON (me.idmovimiento = m.idmovimiento AND me.iddocorigen = pc.iddocumento)')
            ->where(
                "((pl.cantidad - coalesce((SELECT sum(cc.cantidad) FROM DatCantidadesComprometidas cc "
                . "WHERE cc.idproducto = pl.idproducto AND cc.estado = 1), 0)) > 0 AND pc.pendiente > 0 AND 0 = ?) "
                . "OR m.iddocumento = $1", array($iddocumento)
            )
            ->andWhereIn("pc.iddocumento", $idPadres)
            ->orderBy("pl.idproducto, pc.iddocumento");
        if (is_array($arrIdProd) && count($arrIdProd) > 0) {
            $query->andWhereIn("pl.idproducto", $arrIdProd);
        }
        if ($this->existComponent('log.inv.municiones')) {
            $query->leftJoin('pl.DatProductomunic pm');
        }
        $productos = $query->fetchArray();
        if ($datosDoc['iddocumento'] && !$restarar && !$contabilizar && $externo == '0') {
            $mov = array_merge((array)$datosDoc['productos'], (array)$datosDoc['lotes']);
            foreach ($productos as $key => $value) {
                $prod = $this->findProductoById($mov, $value['idproducto']);
                if ($idproducto != $value['idproducto']) {
                    $idproducto = $value['idproducto'];
                    $cantidad = $value['cantidad'] + $value['mov_pendiente'] < $prod['cantidad'] ?
                        $value['cantidad'] + $value['mov_pendiente'] : $prod['cantidad'];
                    $resto = abs($cantidad - $prod['cantidad']);
                } else {
                    $cantidad = $value['cantidad'] + $value['mov_pendiente'] < $resto ?
                        $value['cantidad'] + $value['mov_pendiente'] : $resto;
                    $resto = abs($cantidad - $resto);
                }
                $productos[$key]['cantidad'] = $cantidad;
            }
        }
        return $productos;
    }

    /**
     * Devuelve un arreglo con los productos de los menu con cantidaddes disponibles.
     * @param array $datosDoc
     * @param array $idPadres
     * @param numeric $idcliente
     * @return array
     */
    private function devolverProductosMenu($datosDoc, $idPadres, $idcliente)
    {
        $query = $this->menuServ->devolverProductoByCliente(
            array(
                'identidad' => $this->global->Estructura->idestructura, 'iddocumentos' => $idPadres,
                'idcentro' => $idcliente
            ), true
        );
        $productos = $query->addSelect('pm.cantidadtotal AS cantidad')->fetchArray();
        if ($datosDoc['iddocumento']) {
            $mov = array_merge((array)$datosDoc['productos'], (array)$datosDoc['lotes']);
            foreach ($productos as $key => $value) {
                $prod = $this->findProductoById($mov, $value['idproducto']);
                $productos[$key]['cantidad'] = $prod['cantidad'];
            }
        }
        return $productos;
    }

    /**
     * Devuelve las órdenes de despacho.
     * @param array $datosDoc
     * @return array
     */
    public function devolverDocDistribucion($datosDoc)
    {
        $datosDoc['estado'] = EstadoDocumentoModel::ESTADO_APROBADO;
        $datosDoc['ejecucion'] = 1;
        $datosDoc['salida'] = true;
        $datosDoc['salidaporfactura'] = 0;
        $datosDoc['filtraiddoc'] = true;
        $datosDoc['iddeposito'] = $datosDoc['idestructura'];
        unset($datosDoc['idestructura']);
        $distribucionServ = new DistribucionService();
        return $distribucionServ->devolverDocDistribucion($datosDoc);
    }

    /**
     * Devuelve las solicitudes de entrega.
     * @param array $datosDoc
     * @return array
     */
    public function devolverDocSolicitudentrega($datosDoc)
    {
        $datosDoc['estado'] = EstadoDocumentoModel::ESTADO_APROBADO;
        $query = $this->solEntregaServ->devolverDocumentos($datosDoc, true);
        $query->addSelect(
            '(SELECT (CASE WHEN sum(pc.cantidad) = sum(pc.pendiente) THEN 1 ELSE 2 END) '
            . 'FROM DatProductocmplto pc WHERE pc.iddocumento = d.iddocumento '
            . 'GROUP BY pc.iddocumento) AS estadoejecucion, (SELECT count(p.idproducto) '
            . 'FROM DatProductoLogistica p INNER JOIN p.DatMovimientos m2 ON (m2.idproducto = p.idproducto) '
            . 'INNER JOIN m2.DatProductocmplto pc2 ON (pc2.iddocumento = m2.iddocumento '
            . 'AND pc2.idproducto = m2.idproducto) WHERE m2.iddocumento = d.iddocumento '
            . 'AND pc2.pendiente > 0) AS cantproductos'
        )
            ->innerJoin('d.DatProductocmplto dpc ON (dpc.iddocumento = d.iddocumento)')
            ->having('sum(dpc.pendiente) > 0')
            ->groupBy('d.iddocumento, d.nrodoc, ndprim.denominacion, d.fechacontable, ddpadre.fechacontable, ddpadre.nrodoc, ndprim.denominacion');
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->cargarClientesDocumentos(
                $this->logisticaDoctrine->addQueryLimits($query, $datosDoc)->fetchArray()
            )
        );
    }

    /**
     * Devuelve los documentos de menu alimento.
     * @param array $datosDoc
     * @return array
     */
    public function devolverDocMenualimento($datosDoc)
    {
        $idestructura = $datosDoc['idestructura'];
        unset($datosDoc['idestructura']);
        $datosDoc['estado'] = EstadoDocumentoModel::ESTADO_APROBADO;
        $query = $this->menuServ->devolverDocumentos($datosDoc, true);

        $query->leftJoin('d.DatDocumentoPadre dp ON (dp.idpadre = d.iddocumento)')
            ->addWhere(
                'dp.iddocumentopadre IS NULL AND coalesce((SELECT count(pm_3.idproductomenu) FROM DatProductoMenu pm_3 '
                . 'WHERE pm_3.idmenu = d.iddocumento AND pm_3.iddeposito = ?), 0) > 0', $idestructura
            );
        return array(
            'cantidad' => $query->count(), 'datos' => $this->cargarClientesDocumentos(
                $this->logisticaDoctrine->addQueryLimits($query, $datosDoc)->fetchArray()
            )
        );
    }

    /**
     * Devuelve las órdenes de trabajo.
     * @param array $datosDoc
     * @return array
     */
    public function devolverDocOrdenTrabajo($datosDoc)
    {
        $datosDoc['estado'] = EstadoDocumentoModel::ESTADO_PENDIENTE;
        $datosDoc['aprobado'] = true;
        $datosDoc['vales'] = true;
        $datosDoc['iddeposito'] = $datosDoc['idestructura'];
        unset($datosDoc['idestructura']);
        return $this->ordeTrabajoServ->devolverOrdenesTrabajo($datosDoc);
    }

    /**
     * Adicionar o actualiza los DatMoventrega asociados al documento.
     * @param numeric $iddocumento
     * @param integer $origen
     * @param array $productos
     * @param array $movimientos
     * @param boolean $borrar
     * @return boolean
     */
    public function adicionarDatMoventrega($iddocumento, $origen, $productos, $movimientos, $borrar = false, $idordenactividad = false)
    {
        if ($origen == 3 || $origen == 4) {
            $docAux = Doctrine::getTable('DatDocumento')->find($iddocumento);
            $query = Doctrine_Query::create()
                ->select('m.idmovimiento AS idmovimiento, m.idproducto AS idproducto, me.idmoventrega AS idmoventrega');
            if ($this->menuServ && $origen == 3) {
                $alias = 'pm';
                $query->addSelect('pm.idproductomenu, coalesce(pm.cantidadtotal, 0) AS ordenado')
                    ->from('DatProductoMenu pm');
            }
            if ($this->ordeTrabajoServ && $origen == 4) {
                $relations[] = array(
                    'cardinalidad' => 'one', 'relation' => 'DatActividadOrden',
                    'properties' => array('local' => 'idactividad', 'foreign' => 'idactividad')
                );
                $this->doctrineHelper->tryInyectRelactions(new DatMaterial, $relations);

                $alias = 'ord';
                $query->addSelect('ord.cantidadreal, ord.idmaterial, coalesce(ord.cantidad, 0) AS ordenado, (coalesce(ord.cantidad,0)-coalesce(ord.cantidadreal,0)) AS cantidad')
                    ->from('DatMaterial ord');
                if ($idordenactividad) {
                    $query->addSelect('actord.idordenactividad as idordenactividad');
                    $query->innerJoin('ord.DatActividadOrden actord');
                    $query->andWhere('actord.idordenactividad = ?', array($idordenactividad));
                }
                $query->andWhere('ord.cantidadreal < ord.cantidad and ord.aprobado is true and ord.iddeposito = ?', array($docAux->idestructuracomun));
            }
            $query->innerJoin("{$alias}.DatDocumento d")
                ->innerJoin('d.DatDocumentoPadre dp ON (d.iddocumento = dp.idpadre)')
                ->innerJoin("dp.DatMovimientos m ON ({$alias}.idproducto = m.idproducto AND m.iddocumento = {$iddocumento})")
                ->leftJoin('m.DatMoventrega me')
                ->addWhere("dp.iddocumento = ?", $iddocumento);
            $productos = $query->fetchArray();
        }
        $collection = new Doctrine_Collection('DatMoventrega');
        foreach ($productos as $value) {
            $movEnt = new DatMoventrega();
            if ($value['idmoventrega']) {
                $movEnt->assignIdentifier($value['idmoventrega']);
            }
            $value['idmovimiento'] = !$value['idmovimiento'] ?
                $this->findProductoById($movimientos, $value['idproducto'])['idmovimiento'] : $value['idmovimiento'];
            $value['pendiente'] = isset($value['idprodorden']) ? $value['enprocesonuevo'] :
                ($borrar ? $value['borrar'] : $value['cantidad']);
            $value['iddocorigen'] = $iddocumento;
            $movEntExiste = Doctrine::getTable('DatMoventrega')->findByDql(
                'iddocorigen = ? and idmovimiento = ?', array($iddocumento, $value['idmovimiento'])
            )->getFirst();
            if ($movEntExiste) {
                $movEnt->assignIdentifier($movEntExiste->idmoventrega);
                unset($value['idmoventrega']);
            }
            $movEnt->synchronizeWithArray($value);
            $collection->add($movEnt);
        }
        if ($collection->count() > 0) {
            $collection->save();
        }
        return true;
    }

    /**
     * Actualiza el cumplimiento del producto de la órden de despacho especificado.
     * @param array $params
     * @param integer $cantidad
     * @param boolean $borrar
     * @return boolean
     */
    public function actualizarCumplimientoProdOrden($params, $cantidad, $borrar = false)
    {
        $productos = $this->devolverDatProdorden(
            explode(',', $params['idpadres']), $params['idcliente'],
            array('iddocumento' => $params['iddocumento'], 'idestructuracomun' => $params['idestructuracomun']),
            array($params['idproducto']), $borrar, false, false, false, true
        );
        foreach ($productos as $key => $value) {
            if (!$cant) {
                $cant = (((float)$value['pendienteViejo'] == 0.0 && !$borrar) ||
                    ($value['enprocesoviejo'] == 0 && $borrar)) ? 0 :
                    ($value['pendienteViejo'] + $value['enprocesoviejo'] > $cantidad ?
                        $cantidad : ((float)$value['pendienteViejo'] + $value['enprocesoviejo']));
                $resto = abs($cant - $cantidad);
            } elseif ($cant > 0 || $resto > 0) {
                $cant = (((float)$value['pendienteViejo'] == 0.0 && !$borrar) ||
                    ($value['enprocesoviejo'] == 0 && $borrar)) ? 0 :
                    (($value['pendienteViejo'] + $value['enprocesoviejo'] > $resto) ?
                        $resto : ((float)$value['pendienteViejo'] + $value['enprocesoviejo']));
                $resto = abs($cant - $resto);
            }
            $productos[$key]['enprocesonuevo'] = $borrar ? ($value['enprocesoviejo'] - $cant) :
                ($value['enprocesoviejo'] + $cant);
        }
        $datos = array('productos' => $productos, 'idcliente' => $doc[0]['idcliente']);

        $dpo = new ProdordenModel();
        $dpo->actualizarCumplimientoByParams($datos);
        $this->adicionarDatMoventrega(null, 1, $datos['productos']);
//        $padres = $this->devolverPadresByCantMov($iddocumento);
//        $this->crearDocumentoPadre($iddocumento, $padres);
//        return $this->objectHelper->extractValueFromArrayColumn($padres, 'nrodoc');
        return true;
    }

    /**
     * Actualiza el cumplimiento del producto de la solicitud de entrega especificado.
     * @param numeric $params
     * @param integer $cantidad
     * @param boolean $borrar
     * @return boolean
     */
    public function actualizarCumplimientoSolEntrega($params, $cantidad, $borrar = false)
    {
        $productos = $this->devolverMovSolEntrega(
            $params, explode(',', $params['idpadres']), array($params['idproducto']), $borrar, false, true
        );
        foreach ($productos as $key => $value) {
            if (!$inicio) {
                $inicio = true;
                $cant = ((float)$value['cantidad'] == 0.0) && !$borrar ? 0 :
                    ($value['cantidad'] + $value['mov_pendiente'] < $cantidad ?
                        ($value['cantidad'] + $value['mov_pendiente']) : $cantidad);
                $resto = abs($cant - $cantidad);
            } else {
                $cant = ((float)$value['cantidad'] == 0.0) && !$borrar ? 0 :
                    ($value['cantidad'] + $value['mov_pendiente'] < $resto) ?
                        ($value['cantidad'] + $value['mov_pendiente']) : $resto;
                $resto = abs($cant - $resto);
            }
            $productos[$key]['cantidad'] = $borrar ? 0 : $value['mov_pendiente'] + $cant;
            $productos[$key]['mov_pendiente'] = $borrar ? $cant : $value['mov_pendiente'];
            $productos[$key]['borrar'] = $value['mov_pendiente'] - $cant;
        }
        $this->actualizarCumplimiento($productos);
        $this->adicionarDatMoventrega($params['iddocumento'], 2, $productos, null, $borrar);
//        $this->actualizarMovUbicacionLote($iddocumento);
//        $padres = $this->devolverPadresByCantMov($iddocumento);
//        $this->crearDocumentoPadre($iddocumento, $padres);
//        return $this->objectHelper->extractValueFromArrayColumn($padres, 'nrodoc');
        return true;
    }

    /**
     * Actualiza la cantidad por ubicaciones del producto.
     * @param numeric $iddocumento
     * @param boolean $ubicar [Opcional] Determina si se van a ubicar los productos (por defecto es "false").
     * @return boolean
     */
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

    /**
     * Crea un objeto de DatDocumentoCliente.
     * @param numeric $iddocumento
     * @param numeric $idcliente
     * @param integer $tipocliente
     * @return boolean
     */
    private function crearDocumentoCliente($iddocumento, $idcliente, $tipocliente)
    {
        $clientes = Doctrine::getTable('DatDocumentoCliente')
            ->findByDql('iddocumento = ? AND idcliente = ?', array($iddocumento, $idcliente));
        if ($clientes->count() == 0) {
            $cliente = new DatDocumentoCliente();
            $cliente->synchronizeWithArray(
                array('iddocumento' => $iddocumento, 'idcliente' => $idcliente, 'tipocliente' => $tipocliente)
            );
            $cliente->save();
        }
        return true;
    }

    /**
     * Crea un objeto DatDocumentoPadre por cada cliente.
     * @param numeric $iddocumento
     * @param array $idPadres
     * @return boolean
     */
    private function crearDocumentoPadre($iddocumento, $idPadres)
    {
        Doctrine_Query::create()->delete('DatDocumentoPadre')->where('iddocumento = ?', $iddocumento)->execute();
        $collection = new Doctrine_Collection('DatDocumentoPadre');
        $padre = new DatDocumentoPadre();
        if(is_array($idPadres)){
            foreach ($idPadres as $id) {
                $id = is_array($id) ? $id['iddocumento'] : $id;

                $padre->synchronizeWithArray(array('iddocumento' => $iddocumento, 'idpadre' => $id));
                $collection->add($padre);
            }
        }else{
            $padre->synchronizeWithArray(array('iddocumento' => $iddocumento, 'idpadre' => $idPadres));
            $collection->add($padre);
        }
        if ($collection->count() > 0) {
            $collection->save();
        }
        return true;
    }

    /**
     * Devuelve los clientes asociados a uno o varios documentos.
     * @param array|numeric $idPadres Id de uno (#) o varios documentos(array(#,#,#)).
     * @param array $idClientes [Opcional] Arreglo de idcliente.
     * @param integer $origen [Opcional]
     * @return array
     */
    private function devolverClientesByDoc($idPadres, $idClientes, $origen)
    {
        $sql = "SELECT DISTINCT dc.idcliente, dc.tipocliente FROM dat_documentocliente dc WHERE ";
        //if (!$origen || $origen != 4) {
            if (is_array($idPadres) && count($idPadres) > 0) {
                $idPadres = implode(',', $idPadres);
            }
            $sql .= "dc.iddocumento IN ({$idPadres})";
        //}
        if (is_array($idClientes) && count($idClientes) > 0) {
            $idClientes = implode(',', $idClientes);
            $sql .= /*($origen != 4 ? " AND" : "") .*/ " and dc.idcliente IN ({$idClientes})";
        }

        $result = Doctrine_Manager::connection()->fetchAll($sql);
        return $result;
    }

    /**
     * Devuelve un arreglo de id de los documentos que dieron lugar al documento actual.
     * @param numeric $iddocumento
     * @param numeric $idcliente [Opcional]
     * @param array $idPadres [Opcional]
     * @param array $origen [Opcional]
     * @return array
     */
    private function devolverPadresByDoc($iddocumento, $idcliente, $idPadres, $origen)
    {
        $query = Doctrine_Query::create()
            ->select('d.iddocumento')
            ->from('DatDocumento d')
            ->leftJoin('d.DatDocumentoPadre dp ON (dp.idpadre = d.iddocumento)');
        if ($idcliente && $origen != 4) {
            $query->leftJoin('dp.DatDocumento d2 ON (d2.iddocumento = dp.iddocumento)')
                ->leftJoin('d.DatDocumentoCliente dc')
                ->where('dc.idcliente = ?', $idcliente);
        }
        if (is_array($idPadres) && count($idPadres) > 0) {
            $query->whereIn('d.iddocumento', $idPadres);
        }
        if ($iddocumento) {
            $query->addWhere('dp.iddocumento = ?', array($iddocumento));
        }
        $padres = $query->fetchArray();
        $idPadres = $this->objectHelper->extractValueFromArrayColumn($padres, 'iddocumento');
        return $idPadres;
    }

    /**
     * Devuelve los identificadores de los documentos que dieron lugar al documento actual dado la
     * cantidad usada en el mismo.
     * @param numeric $iddocumento
     * @param boolean $todos [Opcional] Determina si carga todos los documentos de origen.
     * @return array
     */
    private function devolverPadresByCantMov($iddocumento, $todos = false)
    {
        $query = Doctrine_Query::create()->select('d.iddocumento, d.nrodoc')
            ->from('DatDocumento d')
            ->innerJoin('d.DatMoventrega me ON (me.iddocorigen = d.iddocumento)')
            ->where(
                'me.idmovimiento IN (SELECT m2.idmovimiento FROM DatMovimientos m2 WHERE m2.iddocumento = ?)',
                $iddocumento
            )
            ->orderBy('d.iddocumento');
        if (!$todos) {
            $query->groupBy('d.iddocumento')->having('coalesce(sum(me.pendiente), 0) > 0');
        }
        return $query->fetchArray();
    }

    /**
     * Devuelve un producto dado su id.
     * @param array $productos Arreglo de productos.
     * @param numeric $idproducto Id del producto a buscar.
     * @return array Arreglo asociativo.
     */
    private function findProductoById($productos, $idproducto)
    {
        foreach ($productos as $item) {
            if ($item['idproducto'] == $idproducto) {
                $prod = $item;
            }
        }
        return $prod;
    }

    /**
     * Devuelve los clientes asociados a los documentos especificados.
     * @param array $filtro
     * @return array
     */
    public function cargarClientes($filtro)
    {
        $clientes = $this->devolverClientesByDoc($filtro['iddocumentos']);
        $idclientes = Array();
        foreach ($clientes as $item) {
            $dpo = $this->devolverDatProdorden($filtro['iddocumentos'], $item['idcliente']);
            if (count($dpo)) {
                $idclientes[] = $item;
            }
        }
        $result = $this->cargarClientesDocumentos($idclientes, $filtro['criterio']);
        return array('cantidad' => count($result), 'datos' => $result);
    }

    /**
     * Devuelve los clientes con la cantidad de trandferencias realizadas.
     * @param array $filtro
     * @return array
     */
    public function devolverClientesTransferencias($filtro)
    {
        $limit = " OFFSET {$filtro['start']} LIMIT {$filtro['limit']}";
        $sql = "SELECT dc.idcliente, dc.tipocliente, count(d.iddocumento) AS cantidad 
            FROM mod_logistica.dat_documentocliente dc 
            INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = dc.iddocumento 
            INNER JOIN mod_logistica.dat_entrega e ON e.iddocumento = d.iddocumento 
            INNER JOIN mod_datosmaestros.nom_clientesproveedor cp ON cp.idclientesproveedores = dc.idcliente 
            WHERE d.idestructuracomun = {$filtro['idestructuracomun']} AND e.origen = 1 AND d.estado = 4 
            AND dc.tipocliente <> 2 GROUP BY dc.idcliente, cp.nombre, dc.tipocliente {$limit}";
        $sqlId = "SELECT d.iddocumento 
            FROM mod_logistica.dat_documentocliente dc 
            INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = dc.iddocumento 
            INNER JOIN mod_logistica.dat_entrega e ON e.iddocumento = d.iddocumento 
            INNER JOIN mod_datosmaestros.nom_clientesproveedor cp ON cp.idclientesproveedores = dc.idcliente 
            WHERE d.idestructuracomun = {$filtro['idestructuracomun']} AND e.origen = 1 AND d.estado = 4 
            AND dc.tipocliente <> 2";
        $resp = Doctrine_Manager::connection()->fetchAll($sql);
        foreach ($resp as $key => $item) {
            $id = Doctrine_Manager::connection()->fetchAll("{$sqlId} AND dc.idcliente = {$item['idcliente']} {$limit}");
            $resp[$key]['iddocumento'] = $this->objectHelper->extractValueFromArrayColumn($id, 'iddocumento');
        }
        return array('cantidad' => count($resp), 'datos' => $this->cargarClientesDocumentos($resp));
    }

    public function devolverTransfereciaQuery(Doctrine_Query $query, $alias, $aliasDocumento = 'd')
    {
        $query->addSelect(
            "{$aliasDocumento}.nrodoc AS nrodoc, {$aliasDocumento}.fechacontable AS fechacontable, "
            . "sum(mov.importecontable) AS importe"
        )
            ->innerJoin("{$alias}.DatDocumento $aliasDocumento")
            ->innerJoin("$aliasDocumento.DatEntrega e")
            ->innerJoin("$aliasDocumento.DatMovimientos mov")
            ->groupBy("$aliasDocumento.nrodoc, $aliasDocumento.fechacontable");
        return $query;
    }

    /**
     * @param array $iddocumentos Arreglo de iddocumento por el cual se realiza la búsqueda.
     * @return array
     */
    public function devolverDatosByDoc($iddocumentos)
    {
//        $query = Doctrine_Query::create()
//            ->select(
//                "i.idindicador, (CASE WHEN count(ns.nroserie) = 0 THEN sum(m.cantidad) ELSE count(ns.nroserie) END) "
//                . "array_to_string(array_agg(m.preciocontable), ',') AS preciocontable, "
//                . "array_to_string(array_agg(m.precioalternativo), ',') AS precioalternativo, "
//                . "string_agg(ns.nroserie, ',') AS nroserie"
//            )
//            ->from('NomIndicador i')
//            ->innerJoin('i.DatProductoLogistica p')
//            ->innerJoin('p.DatMovimientos m')
//            ->leftJoin('m.DatMovnroserie mns')
//            ->leftJoin('mns.DatNroserie ns')
//            ->whereIn('m.iddocumento', $iddocumentos)
//            ->groupBy('m.iddocumento, i.idindicador');
//        return $query->fetchArray();
        $sql = "SELECT i.idindicador, "
            . "(CASE WHEN count(ns.nroserie) = 0 THEN sum(m.cantidad) ELSE count(ns.nroserie) END) AS cantidad, "
            . "array_to_string(array_agg(m.preciocontable), ',') AS preciocontable, "
            . "array_to_string(array_agg(m.precioalternativo), ',') AS precioalternativo, "
            . "string_agg(ns.nroserie, ',') AS nroserie "
            . "FROM mod_datosmaestros.nom_indicador i "
            . "INNER JOIN mod_logistica.dat_producto p ON p.idindicador = i.idindicador "
            . "INNER JOIN mod_logistica.dat_movimiento m ON m.idproducto = p.idproducto "
            . "LEFT JOIN mod_loginventario.dat_movnroserie mns ON mns.idmovimiento = m.idmovimiento "
            . "LEFT JOIN mod_loginventario.dat_nroserie ns ON ns.idnroserie = mns.idnroserie "
            . "WHERE m.iddocumento IN ({$iddocumentos}) "
            . "GROUP BY m.iddocumento, i.idindicador";
        return Doctrine_Manager::connection()->fetchAll($sql);
    }

    /**
     * Devolvuelve los datos del cumplimiento de los productos del documento
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos
     * @return array
     */
    public function cargarProductosEstadoEjecucion($datosDoc)
    {
        if ($datosDoc['externo']) {
            $query = Doctrine_Query::create()
                ->select(
                    'pcto.idproducto, pcto.cantidad, pcto.entregado, pcto.pendiente, pcto.pendiente AS noprocesado, '
                    . '(pcto.cantidad - pcto.entregado - pcto.pendiente) AS enproceso, p.importe AS importe, '
                    . '(pcto.entregado * 100 / pcto.cantidad) AS porciento, dc.idcliente AS idcliente, '
                    . 'dc.tipocliente AS tipocliente'
                )
                ->from('DatProductocmplto pcto')
                ->innerJoin("pcto.DatDocumento d")
                ->innerJoin("d.DatDocumentoCliente dc")
                ->innerJoin("pcto.DatProductoLogistica p")
                ->where('pcto.iddocumento = ?', array($datosDoc['iddocumento']));
            $this->maestroProductos->addQueryNomIndicador($query, 'p', 'i', 'ih');
            $this->configuracionHelper->getQueryJoinUnidadMedida(
                $query, 'p', 'um', 'um.abreviaturaunidadmedida as umedida', 'leftJoin'
            );
            $datosAux = Doctrine_Query::create()
                ->select(
                    'count(CASE WHEN pcto.entregado = pcto.cantidad THEN pcto.idproductocmplto END) AS cantcmplto, '
                    . 'count(CASE WHEN (pcto.entregado <> pcto.cantidad AND pcto.cantidad > pcto.pendiente) '
                    . 'THEN pcto.idproductocmplto END) AS cantcmpltoparcial, '
                    . '(sum(pcto.entregado) * 100 / sum(pcto.cantidad)) AS porciento'
                )
                ->from('DatProductocmplto pcto')
                ->where('pcto.iddocumento = ?', array($datosDoc['iddocumento']))
                ->groupBy('pcto.iddocumento')
                ->fetchArray();
        } else {
            $distribucionServ = new DistribucionService();
            return $distribucionServ->devolverProductosDistribucion($datosDoc);
        }
        return array(
            'cantidad' => $query->count(), 'datos' => $this->cargarClientesDocumentos(
                $this->logisticaDoctrine->addQueryLimits($query, $datosDoc)->fetchArray()
            ), 'cantcumpltotal' => $datosAux[0]['cantcmplto'], 'cantcumplparc' => $datosAux[0]['cantcmpltoparcial'],
            'porcientocumplimiento' => $datosAux[0]['porciento']
        );
    }

    /**
     * Devuelve un arreglo con los lotes y los movlotes.
     * @param array $filtro
     * @return array
     */
    public function cargarMovLote($filtro)
    {
        $query = $this->loteServ->cargarMovLote($filtro, true);
        $query->addSelect(
            'ml.cantidad AS cantidadVieja, ul.cantidad AS cantubicada, (SELECT sum(ml3.cantidad) '
            . 'FROM DatMovlote ml3 WHERE ml3.idmovimiento = ml.idmovimiento) AS total'
        )
            ->addWhere('ml.idubicacion = ul.idubicacion');
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    /**
     * Elimina los movlote dado sus id y el lote correspondiente a cada uno
     * en caso de ser el último de no existir más.
     * @param array $datos Arreglo asociativo que contiene los datos de los movlote.
     * @param array $params
     * @return boolean
     */
    public function eliminarLote($datos, $params)
    {
        $doc = Doctrine_Query::create()->select('e.origen AS origen, p.idestructura AS idestructura')
            ->from('DatMovimientos m')->innerJoin('m.DatProductoLogistica p')->innerJoin('m.DatDocumento d')
            ->innerJoin('d.DatEntrega e')->where('m.iddocumento = ?', $params['iddocumento'])->fetchArray();
        $this->loteServ->eliminarLote($datos, $params);
        $idPadres = $this->devolverPadresByDoc($params['iddocumento']);
        $clientes = $this->devolverClientesByDoc($params['iddocumento']);
        if ($doc[0]['origen'] == 1) {
            foreach ($clientes as $value) {
                $dpo = new ProdordenModel();
                $prodTemp = $this->devolverDatProdorden(
                    $idPadres, $value['idcliente'],
                    array('iddocumento' => $params['iddocumento'], 'idestructuracomun' => $doc[0]['idestructura']),
                    array($datos[0]['idproducto']), true
                );
                $prods = Array();
                foreach ($prodTemp as $item) {
                    $prod = $this->findProductoById($datos, $item['idproducto']);
                    if ($prod) {
                        $item['enprocesonuevo'] = $item['enprocesoviejo'] - $prod['cantidad'];
                        $prods[] = $item;
                    }
                }
                $productos = array('productos' => $prods, 'idcliente' => $value['idcliente']);
                $dpo->actualizarCumplimientoByParams($productos);
            }
        } elseif ($doc[0]['origen'] == 2 || $doc[0]['origen'] == 3) {
            $prodTemp = $this->devolverMovSolEntrega(
                array('iddocumento' => $params['iddocumento']), $idPadres, array($datos[0]['idproducto'])
            );
            $this->actualizarCumplimiento($prodTemp);
        }
        $this->adicionarDatMoventrega($params['iddocumento'], $doc[0]['origen'], $prodTemp);
        return true;
    }

    /**
     * Verifica que los productos con lote del documento tengan cantidades registradas.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function lotesConCantidad($iddocumento)
    {
        $query = $this->loteServ->cargarMovLote(null, true);
        return $query->addWhere('m.iddocumento = ? AND ml.cantidad = 0', array($iddocumento))->count() == 0;
    }

    /**
     * Devuelve los clientes para la búsqueda abanzada.
     * @return array
     */
    public function cargarClientesBusqueda()
    {
        $iddocVale = $this->configuracionHelper->tipoDocumentoByAliasByIdestructutra(
            'valeLog', $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_INV
        );
        $iddocTrans = $this->configuracionHelper->tipoDocumentoByAliasByIdestructutra(
            'transferenciaLog', $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_INV
        );
        $filtro['iddoc'] = array($iddocTrans->iddoc, $iddocVale->iddoc);
        $datos = $this->devolverDocumentos($filtro, true)->fetchArray();
        return $this->cargarClientesDocumentos($datos);
    }

    /**
     * Devuelve las operaciones.
     * @return array
     */
    public function cargarOperaciones($parametros)
    {
        $iddoc = $this->iddoc;
        if ($parametros['alias'] == 'transferenciaLog') {
            $iddocTrans = $this->configuracionHelper->tipoDocumentoByAliasByIdestructutra(
                'transferenciaLog', $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_INV
            );
            $iddoc = $iddocTrans->iddoc;
        }
        return $this->configuracionHelper->obtenerOperaciones(
            $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_INV, $iddoc
        );
    }

    /**
     * Verifica que en la tabla datmovubicacion las cantidades se correspondan
     * con la cantidad de los productos(movimientos).
     * @param int $iddocumento (identificador de documento).
     * @return boolean
     */
    public function ubicacionConDatosCorrectos($iddocumento)
    {
        $datosBusqueda = $this->getProductoModel()->devolverMovimientos(array('iddocumento' => $iddocumento));
        return $this->ubicacionServ->comprobarUbicacionMov($datosBusqueda);
    }

    public function tieneNroSerie($iddocumento)
    {
        $query = Doctrine_Query::create()
            ->from('DatMovnroserie mns')
            ->innerJoin('mns.DatNroserie ns')
            ->innerJoin('mns.DatMovimientos m')
            ->innerJoin('m.DatDocumento d')
            ->where('d.iddocumento = ? AND ns.nroserie IS NULL', $iddocumento);
        return $query->count() == 0;
    }

    /**
     * Verifica si la transferencia tiene los datos del transportador registrados.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function tieneTransportador($iddocumento)
    {
        $query = Doctrine_Query::create()
            ->from('DatEntrega e')
            ->innerJoin('e.DatDocumento d')
            ->leftJoin('d.DatDocumentoCliente dc')
            ->leftJoin('d.DatDocumentotransporte t')
            ->where(
                'dc.tipocliente <> 2 AND e.iddocumento = ? AND (t.matricula IS NULL OR t.nombreconductor IS NULL '
                . 'OR t.ciconductor IS NULL OR t.idorganizacion IS NULL)', $iddocumento
            );
        return $query->count() == 0;
    }

    /**
     * Verifica si el vale de entrega tiene cuenta contable y/o alternativa registrada.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function tieneCuenta($iddocumento)
    {
        $doc = Doctrine_Query::create()
            ->select(
                'd.iddocumento, dc.tipocliente AS tipocliente, (456) AS idcuenta, '
                . 'e.idcuentaalternativa AS idcuentaalternativa'
            )
            ->from('DatDocumento d')
            ->innerJoin('d.DatEntrega e')
            ->innerJoin('d.DatDocumentoCliente dc')
            ->where('d.iddocumento = ?', $iddocumento)
            ->fetchArray();
        if ($doc[0]['tipocliente'] == 2 && (!$doc[0]['idcuenta'] ||
                ($this->idalternativa && !$doc[0]['idcuentaalternativa']))
        ) {
            return false;
        }
        return true;
    }

    /**
     * Verifica si el vale de entrega tiene elemento de gasto registrado.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function tieneElementoGasto($iddocumento)
    {
//        return true;
        $str = $this->idalternativa ? " OR m.idelementogastoalt IS NULL" : "";
        $query = Doctrine_Query::create()
            ->from('DatMovimientos m')
            ->innerJoin('m.DatDocumento d')
            ->innerJoin('d.DatEntrega e')
            ->innerJoin('d.DatDocumentoCliente dc')
            ->where("m.iddocumento = ? AND dc.tipocliente = 2 AND (m.idelementogasto IS NULL {$str})", $iddocumento);
        return $query->count() == 0;
    }

    /**
     * Verifica que todos los conteos fisico (ajuste de inventario) esten contabilizados.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function conteoFisico($iddocumento)
    {
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatMovimientos',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatMovimientos(), $relations);
        $objDocPrim = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            'inventarioLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV
        );
        $inventario = new InventarioModel();
        $query = $inventario->devolverDocumentos(null, true);
        $query->innerJoin('d.DatMovimientos _m')
            ->innerJoin('_m.DatMovimientos _m2 ON _m2.idproducto = _m.idproducto')
            ->innerJoin('_m2.DatDocumento _d2')
            ->addWhere(
                '_m2.iddocumento = ? AND d.idestructuracomun = _d2.idestructuracomun AND d.estado IN (1, 2) '
                . 'AND d.iddoc = ?', array($iddocumento, $objDocPrim->iddoc)
            )
            ->orderBy('d.iddocumento');
        if ($query->count() > 0) {
            return false;
        }
        return true;
    }

    private function tryInyector()
    {
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatEntrega',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatMoventrega',
            'properties' => array('local' => 'iddocorigen', 'foreign' => 'iddocumento')
        );
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatProductocmplto',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatProdorden',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idorden')
        );
        if ($this->ordeTrabajoServ) {
            $relations[] = array(
                'cardinalidad' => 'many', 'relation' => 'DatMaterial',
                'properties' => array('local' => 'iddocumento', 'foreign' => 'idordentrabajo')
            );
            $rel[] = array(
                'cardinalidad' => 'many', 'relation' => 'DatDocumento',
                'properties' => array('local' => 'idordentrabajo', 'foreign' => 'iddocumento')
            );
            $this->logisticaDoctrine->tryInyectRelactions(new DatMaterial(), $rel);
        }
        if ($this->menuServ) {
            $relations[] = array(
                'cardinalidad' => 'many', 'relation' => 'DatProductoMenu',
                'properties' => array('local' => 'iddocumento', 'foreign' => 'idmenu')
            );
            $rel[] = array(
                'cardinalidad' => 'many', 'relation' => 'DatDocumento',
                'properties' => array('local' => 'idmenu', 'foreign' => 'iddocumento')
            );
            $this->logisticaDoctrine->tryInyectRelactions(new DatProductoMenu(), $rel);
        }
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumento(), $relations);
        $relations = array();
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatEntrega',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumentoCliente(), $relations);
        $relations = array();
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatEntrega',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatMoventrega',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatProductocmplto',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatDocumentoPadre',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatDocumentoCliente',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        if ($this->menuServ) {
            $relations[] = array(
                'cardinalidad' => 'one', 'relation' => 'DatProductoMenu',
                'properties' => array('local' => 'idmenu', 'foreign' => 'iddocumento')
            );
        }
        if ($this->existComponent('log.inv.municiones')) {
            $relations[] = array(
                'cardinalidad' => 'one', 'relation' => 'DatMovproductomunic',
                'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
            );
        }
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatMovnroserie',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatLote',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatMovubicacion',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatMovimientos(), $relations);
        $relations = array();
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatMovimientos',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumentoPadre(), $relations);
        $relations = array();
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'NomClienteproveedor',
            'properties' => array('local' => 'idclientesproveedores', 'foreign' => 'idcliente')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumentoCliente(), $relations);
        $relations = array();
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatMovimientos',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatMoventrega',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocorigen')
        );
        if ($this->menuServ) {
            $relations[] = array(
                'cardinalidad' => 'one', 'relation' => 'DatProductoMenu',
                'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
            );
        }
        $this->logisticaDoctrine->tryInyectRelactions(new DatProductocmplto(), $relations);
        $relations = array();
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatProductocmplto',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatLote',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatProdorden',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatNroserie',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        if ($this->existComponent('log.inv.municiones')) {
            $relations[] = array(
                'cardinalidad' => 'many', 'relation' => 'DatProductomunic',
                'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
            );
        }
        $this->logisticaDoctrine->tryInyectRelactions(new DatProductoLogistica(), $relations);
        $relations = array();
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatMovimientos',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatUbicacionComprometida(), $relations);
    }

    private function devolverCantidadesEntregadasOrden($idOrdenTrabajo, $idproducto, $idordenactividad = false){
        $selectAct = $innerAct = $whereAct = "";
        if ($idordenactividad) {
            $innerAct .= " inner join mod_logtaller.dat_ordenactividad ordact on ordact.idactividad = dmat.idactividad ";
            $whereAct .= " and ordact.idordenactividad = {$idordenactividad} ";
        }
        $result = "select sum( m.cantidad) as entregado, 
            coalesce((
                select sum(m2.cantidad)
                from mod_logistica.dat_movimiento m2
                inner join mod_logistica.dat_documento d2 on d2.iddocumento = m2.iddocumento
                where m2.iddocumento in (
                    select iddocumento 
                    from mod_logistica.dat_documentopadre where idpadre in (
                        select iddocumento 
                          from mod_logistica.dat_documentopadre where idpadre in ({$idOrdenTrabajo})
                    )
                )
                and m2.idproducto = m.idproducto
                and d2.estado = 4
            ),0) as devuelto,
            dmat.cantidad as cantidadoriginal
            from mod_logistica.dat_movimiento m
            inner join mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
            inner join mod_logtaller.dat_material dmat on dmat.idordentrabajo in ({$idOrdenTrabajo})
                and dmat.idproducto = m.idproducto  
            {$innerAct}              
            where m.iddocumento in (
                select iddocumento 
                from mod_logistica.dat_documentopadre where idpadre in ({$idOrdenTrabajo})
            )
            and d.estado = 4 and m.idproducto = {$idproducto}{$whereAct}
            group by m.idproducto,dmat.idmaterial";
            return LogisticaDoctrineHelper::__init()->getConnection()->execute($result)->fetchAll(PDO::FETCH_ASSOC);
    }

}
