<?php

/**
 * @author Kenier Cumba Bueno
 */
class EstadoDocumentoModel extends ZendExt_Model
{

    const ESTADO_ELABORACION = 1,
        ESTADO_PENDIENTE = 2,
        ESTADO_APROBADO = 3,
        ESTADO_CONTABILIZADO = 4,
        ESTADO_ELIMINADO = 5,
        ESTADO_ANULADO = 6,
        ESTADO_CANCELADO = 7,
        ESTADO_CANCELADO_DUPLICADO = 8,
        ESTADO_CERRADO = 9,
        ESTADO_PROPUESTO_CANCELAR = 10,
        ESTADO_REVISADO = 11,
        ESTADO_CONCILIADO = 12,
        ESTADO_PREELABORADO = 13,
        ESTADO_APROBADOPRORROGA = 14,
        ESTADO_PRORROGAR = 15,
        ESTADO_PARALIZADO = 16,
        SIN_ESTADO = -1;

    public function __construct()
    {
        parent::ZendExt_Model();
    }

    public function setEstadoDocumento($iddocumento, $newEstado)
    {
        if ($this->checkIsEstadoActual($iddocumento, $this->getEstadoAnterior($newEstado))){
            Doctrine_Query::create()->update('DatDocumento d')
                ->set('d.estado', $newEstado)
                ->where("d.iddocumento = ?", array($iddocumento))
                ->execute();

            return true;
        }
        throw new ZendExt_Exception('LOG_LB_DOC_004');
    }

    /**
     * Funcion que devuelve el estado anterior a un estado de documento especifico
     */
    private function getEstadoAnterior($pIdEstado)
    {
        switch ($pIdEstado) {
            case self::ESTADO_PENDIENTE:
                return array(self::ESTADO_ELABORACION, self::ESTADO_PROPUESTO_CANCELAR);
            case self::ESTADO_ELIMINADO:
                return array(self::ESTADO_ELABORACION, self::ESTADO_PROPUESTO_CANCELAR, self::ESTADO_CONTABILIZADO);
            case self::ESTADO_APROBADO:
                return array(self::ESTADO_PENDIENTE, self::ESTADO_PROPUESTO_CANCELAR,
                    self::ESTADO_REVISADO);
            case self::ESTADO_CONTABILIZADO:
                return array(self::ESTADO_PENDIENTE, self::ESTADO_APROBADO);
            case self::ESTADO_CANCELADO:
                return array(self::ESTADO_APROBADO, self::ESTADO_CONTABILIZADO);
            case self::ESTADO_REVISADO:
                return array(self::ESTADO_PENDIENTE);
            case self::ESTADO_ELABORACION:
                return array(self::ESTADO_PENDIENTE, self::ESTADO_PREELABORADO);
            case self::ESTADO_PROPUESTO_CANCELAR:
                return array(self::ESTADO_APROBADO, self::ESTADO_CONTABILIZADO);
            case self::ESTADO_CANCELADO_DUPLICADO:
                return array(self::ESTADO_CONTABILIZADO,self::ESTADO_PREELABORADO);
            case self::ESTADO_CERRADO:
                return array(self::ESTADO_APROBADO);
            case self::ESTADO_CONCILIADO:
                return array(self::ESTADO_APROBADO);
            case self::ESTADO_PREELABORADO:
                return array(self::ESTADO_ELABORACION);
            case self::ESTADO_APROBADOPRORROGA:
                return array(self::ESTADO_APROBADO, self::ESTADO_PRORROGAR);
            case self::ESTADO_PRORROGAR:
                return array(self::ESTADO_APROBADOPRORROGA);
            case self::ESTADO_ANULADO://Javier
                return array(self::ESTADO_PENDIENTE, self::ESTADO_CERRADO, self::ESTADO_APROBADO);
            case self::ESTADO_PARALIZADO://Dayanis
                    return array(self::ESTADO_APROBADO);    
            default:
                return self::SIN_ESTADO;
        }
    }
    

    /**
     * Funcion que verifica si el estado actual de un documento coincide con el estado anterior
     * a un estado especifico
     *
     * @param type $iddocumento
     * @param type $pIdEstado
     */
    private function checkIsEstadoActual($iddocumento, $pIdEstado)
    {
        $pIdEstado = implode(',', $pIdEstado);
        $result = Doctrine_Query::create()->select("(d.estado IN ({$pIdEstado})) as coincide")
                ->from('DatDocumento d')->where('d.iddocumento = ?', array($iddocumento))->fetchArray();
        return $result[0]['coincide'];
    }

    /**
     * Funcion que devuelve el estado actual en que se encuentra un documento
     *
     * @param type $iddocumento
     *
     * @return type
     */
    public function getEstadoActual($iddocumento)
    {
        $documento = Doctrine::getTable('DatDocumento')->find($iddocumento);
        return $documento->estado;
    }

}
