<?php

class PartidasModel extends DocumentoLogisticaModel
{
    private $movimientoModel,
        /**
         * @var LogisticaProductoModel
         */
        $productoModel,
        /**
         * @var MaestroProductoModel
         */
        $maestroProductos,
        /**
         * @var UbicacionModel
         */
        $modelUbic,
        /**
         * @var DocumentoLogisticaModel
         */
        $serviciosConfiguracion,
        $documento;
    /**
     * Constructor de la clase.
     */
    public function __construct($datos = array())
    {
        parent::__construct();
        $this->movimientoModel = new LogisticaMovimientoModel;
        $this->productoModel = new LogisticaProductoModel;
        $this->maestroProductos = new MaestroProductoModel;
        $this->modelUbic = new UbicacionModel();
        $this->idSubsistema = LogisticaGlobal::SUBSISTEMA_INV;
        $this->serviciosConfiguracion = ServiciosConfiguracionGeneralHelper::__init();
        /*$this->documento = new DocumentoLogisticaModel();
        $this->idestructuracomun = $datos['idestructura'] ?
            $datos['idestructura'] : $this->global->Estructura->idestructura;*/
    }

    public function cargarDocumentos($datosDoc, $dql = false)
    {
        $documentos = array();
        $objDocPrimR = $this->documentosHelper->devuelveIddocByIdEstructura(
            'recepcionLog', $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_INV
        );
        $objDocPrimA = $this->documentosHelper->devuelveIddocByIdEstructura(
            'aperturaLog', $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_INV
        );
        array_push($documentos, $objDocPrimR->iddoc, $objDocPrimA->iddoc);
        $datosDoc['iddoc'] = $documentos;
        $query = parent::devolverDocumentos($datosDoc);
        $query->addSelect('coalesce((SELECT sum(m2.importecontable) FROM DatMovimientos m2 '
        . "WHERE m2.iddocumento = d.iddocumento) + (CASE WHEN d.estado = 1 THEN COALESCE((SELECT SUM(COALESCE(dci.valormn,0)) FROM DatConceptoimporterecep dci WHERE dci.iddocumento = d.iddocumento),0) ELSE 0 END), 0) AS importecontable ")
            ->addWhere("d.estado in (3,4)");

        $datosBusqueda = $this->doctrineHelper->addQueryLimits($query, $datosDoc)->fetchArray();
        foreach ($datosBusqueda as $index => $value) {
            $tipodoc = $this->serviciosConfiguracion->getTipoDocumentoById($value['iddoc']);
            $datosBusqueda[$index]['tipodocumento'] = ($tipodoc->denominacion) ? $tipodoc->denominacion : $tipodoc->abreviatura;
        }
        return array('cantidad' => $query->count(), 'datos' => $this->cargarClientesDocumentos($datosBusqueda));
    }


    /**
     * Devuelve los datos generales de los productos.
     * @param array $params
     * @return array
     */
    public function cargarProductosPartidas($params, $dql = false)
    {
        $query = $this->devolverProductosNroSeriePartida($params, true);
        $query/*->addSelect('dd.numeroref AS numeroref, dd.fechacontable AS fechacontable, dd.estado AS estadodoc, dd.iddocumento AS iddocumento, dd.iddoc AS iddoc')*/
            ->innerJoin('mov.DatDocumento dd')->addWhere("dd.estado in (3,4)");
        /*$productos = $this->maestroProductos->addSelectionData($this->doctrineHelper->addQueryLimits($query, $params)->fetchArray());
        foreach ($productos as &$prod) {
            $tipodoc = $this->serviciosConfiguracion->getTipoDocumentoById($prod['iddoc']);
            $prod['tipodocumento'] = ($tipodoc->denominacion) ? $tipodoc->denominacion : $tipodoc->abreviatura;
        }*/
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->maestroProductos->addSelectionData($this->doctrineHelper->addQueryLimits($query, $params)->fetchArray())
        );
    }

    public function devolverProductosNroSeriePartida($params, $dql = false)
    {
        $params['asentado'] = true;
        if ($params['idubicacion'] && !$params['idarea']) {
            $eu = Doctrine::getTable('DatEstructuraubicacion')->find($params['idubicacion']);
            $params['idarea'] = $eu->idarea;
            $params['idubicacion'] = array($params['idubicacion']);
        }

        //print_r($params);die;
        //$query = $this->productoModel->cargarProductos($params, true);
        $query = $this->getProductoModel()->devolverMovimientos($params, true);
        //$this->movimientoModel->getJoinDatMovimiento($query, 'p', 'mov');
        //$query->addWhere('ih.tipocontrol in (3, 4)');
        //$this->modelUbic->addSqlCantUbicaciones($query, 'p');
        //$this->modelUbic->addSqlProductosUbicacion($query, 'p', 'ubic');
        if ($dql) {
            return $query;
        }
        return $this->concatenarDeposito(
            array('cantidad' => $query->count(),
                'datos' => $this->doctrineHelper->addQueryLimits($query, $params)->fetchArray()
            ));
    }
}
