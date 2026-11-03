<?php

/**
 * @class     TrazasDocumentoModel
 * Clase encargada de almacenar las trazas de las
 * acciones que se ejecuten sobre los documentos
 * @namespace Logistica\Utiles\Documento\Controllers
 * @author    Divisi�on de Gesti�on de Entidades
 * @copyright XETID
 * @version   1.0
 */
class TrazasDocumentoModel extends ZendExt_Model
{

    private $idusuario;
    private $estadosPedidos = [
        1 => 'Elaboración',
        2 => 'Preparado',
        3 => 'Aprobado',
        4 => 'Contabilizado',
        5 => 'Eliminado',
        6 => 'Anulado',
        7 => 'Cancelado',
        8 => 'Cancelado-Duplicado',
        9 => 'Cerrado',
        10 => 'Propuesto a Cancelar',
        11 => 'Revisado',
        12 => 'Conciliado',
        13 => 'Pre-elaborado',
        14 => 'Aprobado con prórroga',
        15 => 'Prorrogar',
        -1 => 'Sin estado'
    ];

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->idusuario = $this->global->Perfil->idusuario;
    }

    /**
     * Acci�n para guardar una traza
     * @params $iddocumento Identificador de documento
     * @params $method acci�n que se ejecuta sobre el documento
     *
     * @return Valor booleano(true o false)
     */
    public function guardarTraza($method, $iddoc, $estado = false)
    {
        $estado = ($estado)?$estado:EstadoDocumentoModel::ESTADO_ELABORACION;
        $bitacora = new HisBitacora();
        $datosBit = array();

        $contable = $this->obtenerFechaContable($iddoc);
        $datosBit['operacion'] = $method;
        $datosBit['iddocumento'] = $iddoc;
        $datosBit['idusuario'] = $this->idusuario;
        $datosBit['fecha'] = date("Y-m-d");
        $datosBit['hora'] = date("h:i:s");
        $datosBit['fechacontable'] = $contable['fechacontable'];
        $datosBit['estado'] = $estado;
        $datosBit['denomestado'] = $this->estadosPedidos[$estado];
        $bitacora->synchronizeWithArray($datosBit);
        $bitacora->save();

        return true;
    }

    public function obtenerFechaContable($iddocumento)
    {
        $query = new Doctrine_Query();
        $query->select('doc.fechacontable as fechacontable, 
                        doc.estado as estado, 
                        doc.idestructuracomun as idestructuracomun')
            ->from('DatDocumento doc')
            ->where("doc.iddocumento = {$iddocumento}");
        $fechaContable = $query->fetchArray();
        $datos = array_pop($fechaContable);
        $idSubsistema = $this->global->Subsistema->idsubsistema;
        $idestructuracomun = $this->global->Estructura->idestructura;
        $fechaDep = is_numeric($datos['idestructuracomun']) ? LogisticaFechasHelper::__init()->getFechaDeposito($datos['idestructuracomun']) : false;
        $fechaDep = ($idSubsistema == LogisticaGlobal::SUBSISTEMA_FAC && (new VariablesGlobalesModel())->obtenerValor('FECHA_FACT_TPV') != null) ? false : $fechaDep;
        $fecha = ServiciosConfiguracionGeneralHelper::__init()->getFechaContableSubsistemaObj($idestructuracomun, $idSubsistema);
        $datos['fechacontable'] = ($fechaDep != false) ? $fechaDep : $fecha->fecha;
        return $datos;
    }

    public function devolverTrazas($parametros)
    {
        $idoc = Zend_Json::decode($parametros['iddocumento']);
        $query = new Doctrine_Query();
        $query->select(
            'bit.iddocumento, bit.fechacontable, bit.idusuario, bit.operacion,'
            . 'bit.fecha, bit.hora, doc.nrodoc, doc.iddoc'
        )
            ->from('HisBitacora bit')
            ->innerJoin('bit.DatDocumento doc')
            ->whereIn('bit.iddocumento', $idoc);

        return array(
            'cantidad' => $query->count(),
            'datos'    => LogisticaDoctrineHelper::__init()->addQueryLimits($query, $parametros)->fetchArray()
        );
    }

}
