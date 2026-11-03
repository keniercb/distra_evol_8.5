<?php

class FacturaValidator extends DocumentoValidator
{

    public function __construct()
    {
        parent::__construct();
    }

    public function initModel()
    {
        //$this->model = new GestionarFacturaModel(array('noexception' => true));
       $this->model = new GestionarFacturaModel(array( 'isPrincipal' => false, 'alias' => 'facturaLog', 'subsistema' =>
            LogisticaGlobal::SUBSISTEMA_FAC, 'noexception' => true));
    }

    public function validarConfirmarUbicacion()
    {
        $iddocumento = Zend_Json::decode($this->params['documentos']);
        return $this->model->ubicacionConDatosCorrectos($iddocumento);
    }

    public function validarMonedasRegistradas()
    {
        $monedas = LogisticaGlobal::__init()->getMonedaEntidad();
        if (is_null($monedas->idmoneda)) {
            return false;
        }
        return true;
    }
    
    /**
     * Verifica que todos los conteos fisico (ajuste de inventario) esten contabilizados.
     * @return boolean
     */
    public function validarConteoFisico()
    {
        $iddocumento = implode(',', Zend_Json::decode($this->params['id']));
        return $this->model->conteoFisico($iddocumento);
    }

    public function validarConfiguracion(){
        $conf = $this->model->cargarConfiguracion(
            array('idestructuracomun' => $this->global->Estructura->idestructura)
        );
        if ($conf['idestructuracomun'])
            return true;
        return false;
    }

    public function validarPreciosCeros(){
        $documentos = json_decode($this->params['documentos']);
        $confOper = LogisticaDoctrineHelper::__init()->getConnection()->execute(
            "select o.preciocero from mod_logfacturacion.dat_operacionsubsistema o
              inner join mod_logistica.dat_documento d on d.idoperacion = o.idnomoperaciones
              where d.iddocumento = {$documentos[0]} and d.idestructuracomun = o.idestructura"
        )->fetchAll(PDO::FETCH_COLUMN);

        if (count($confOper) && $confOper[0] != 1) {
            $documentosText = implode(',', $documentos);
            $excluirNC = LogisticaDoctrineHelper::__init()->getConnection()->execute(
                "select d.iddocumento from mod_logistica.dat_documento d
                inner join mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc
                inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = dp.iddocumentos
                where d.iddocumento in ({$documentosText}) and ndp.abreviatura <> 'creditoLog'"
            )->fetchAll(PDO::FETCH_COLUMN);
            if (count($excluirNC)) {
                $documentosText = implode(',', $excluirNC);

                $prodCero = LogisticaDoctrineHelper::__init()->getConnection()->execute(
                    "select distinct dmm.idmovimiento from mod_logistica.dat_movmoneda dmm
                inner join mod_logistica.dat_movimiento dm on dm.idmovimiento = dmm.idmovimiento
                where dm.iddocumento in ({$documentosText}) and dmm.precio = 0 and dmm.idmoneda is not null
                union 
                select distinct dmm.idelementofactura from mod_logfacturacion.dat_desgloselemento dmm
                inner join mod_logfacturacion.dat_elementosfactura dm on dm.idelementofactura = dmm.idelementofactura
                where dm.idfactura in ({$documentosText}) and dmm.preciotarifa = 0 and dmm.idmoneda is not null"
                )->fetchAll(PDO::FETCH_COLUMN);
                if (count($prodCero)) {
                    return false;
                }
            }
        }
        return true;
    }

    public function validarNotaCredito(){
        $iddocNC = $this->model->getIddocNotaCredito();
        //$iddocND = $this->model->getIddocNotaDebito();

        $documentos = json_decode($this->params['documentos']);
        foreach ($documentos as $doc) {
            $iddoc = Doctrine::getTable('DatDocumento')->find($doc)->iddoc;
            if ($iddocNC && $iddoc == $iddocNC) {
                $cantidadMayor = LogisticaDoctrineHelper::__init()->getConnection()->execute(
                    "select dm.idmovimiento as idmovimiento from mod_logistica.dat_movimiento dm
                    inner join mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = dm.idmovimiento
                    where dm.iddocumento = {$doc} and dm.cantidad > dpf.cantidadfactura"
                )->fetchAll(PDO::FETCH_COLUMN);
                if (count($cantidadMayor)) {
                    return false;
                }
            }
        }
        return true;
    }

}
