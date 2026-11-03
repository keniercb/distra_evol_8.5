<?php

/**
 * @class     DesbloqueoDocumentoModel
 * Clase que se encarga de las acciones
 * para bloquear y desbloquear un documento.
 * @namespace Logistica\Utiles\Documento\Models
 * @author    Divisiçon de Gestiçon de Entidades
 * @copyright XETID
 * @version   1.0
 */
class BloqueoDocumentoAFTModel extends BloqueoDocumentoModel
{

    /**
     * Instancia de la clase DocumentoLogisticaModel para acceder a los
     * metodos generales de documento
     *
     * @var type
     */
    private $parent, $idusuario, $idestructuracomun;

    public function __construct(DocumentoLogisticaModel $parent)
    {
        parent::__construct($parent);
        $this->parent = $parent;
        $this->idusuario = $this->global->Perfil->idusuario;
        $this->idestructuracomun = $this->global->Estructura->idestructura;
    }


    /**
     * Acción para cargar los documentos que se encuentran bloqueados
     * en la entidad
     * @params $parametros Arreglo que contiene el limit y el start
     *
     * @return $result Arreglo de documentos bloqueados
     */
    public function devolverDocBloqueados($parametros)
    {
        if(!$parametros['iddoc']){
            $iddocs = array();
            $iddocs = array_merge(
                $iddocs,
                $this->configuracionHelper->getDocumentosPorSubsistema(LogisticaGlobal::SUBSISTEMA_AFT)
            );
            $parametros['iddoc'] = $this->objectHelper->extractValueFromArrayColumn($iddocs,'iddoc');
        }
        $query = $this->parent->devolverDocumentos($parametros);
        $query->innerJoin('d.DatBloqueo sb')->addSelect('sb.idbloqueo as idbloqueo');
        if (!$parametros['administrador']) {
            $query->andWhere('idusuario = ?', array($this->global->Perfil->idusuario));
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $parametros)->fetchArray()
        );
    }

}
