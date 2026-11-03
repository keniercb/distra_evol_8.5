<?php

/**
 *
 */
class DocDepreciacionModel extends DocumentoLogisticaModel
{
    private $_mComunAFT;
    private $_configuracionHelper;
    /**
     *
     */
    public function __construct()
    {
        parent::__construct(array('alias' => 'MMAFT', 'noexception' => true, 'subsistema' => LogisticaGlobal::SUBSISTEMA_AFT));
        $this->_mComunAFT = ComunAFTModel::getInstance();
        $this->_configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
    }

    /**
     *
     */
    public function aprobarDocDepreciacion($idDocumento)
    {
//        $sRegNumActivo = new RegNumActivoService();
        //  Replicar los movimientos en el registro numérico antes de aprobar el documento
//        $sRegNumActivo->actualizarRegNumByIdDocumento($idDocumento, true);
        //$this->actualizarAprobadoPoryFecha($idDocumento);
        parent::aprobarDocumento($idDocumento);
        
        return 1;
    }

    public function actualizarAprobadoPoryFecha($iddocumento, $cancelar = false)
    {

        $idestructuras =  $this->_mComunAFT->getIdEstructurasHijas($this->global->Estructura->idestructura,
            false, true, false);
        $fecha = $this->_configuracionHelper->getFechaContableSubsistemaObj($this->global->Estructura->idestructura,
            LogisticaGlobal::SUBSISTEMA_AFT);

        $fecha = ($fecha->fecha) ? $fecha->fecha : date('d/m/Y');


        $docActualizar = Doctrine_Query::create()->update('DatDocumento')->set('aprobadopor', $this->idusuario)
            ->set('fechacontable', '?', $fecha);
        if ($cancelar) {
            $docActualizar->set('idnodo', 'null')
                ->set('controlfirma', 0);
        } else {
            $datosDoc = Doctrine::getTable('DatDocumento')->find($iddocumento)->toArray();
            $docActualizar->set('nrodoc',
                $this->devolverUltimoNumeroDoc($datosDoc['iddoc'], null,
                    $datosDoc['idejercicio'], 'nrodoc'));
        }      
        $docActualizar->where('iddocumento = ?', array($iddocumento))
            ->execute();
        return $docActualizar;
    }

    public function cargarDocumentosDepreciacion()
    {
        
    }

}
