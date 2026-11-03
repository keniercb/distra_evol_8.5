<?php

class DocumentoModel extends DocumentoLogisticaModel
{

    private $estructura , $estructuraHelper;
    private $em;
    private $domain;

    public function __construct($datos = array())
    {
        parent::__construct($datos);
        $this->estructuraHelper = ServiciosEstructuraComposicionHelper::__init();
        $this->estructura = $this->global->Estructura;
    }
    /**
     * Devuelve los documentos dado los criterios de búsqueda especificados.
     * @author Yadrian Aguila
     * @return Array
     */
    public function cargarEncabezado($params)
    {
        $doc = Doctrine::getTable('DatDocumento')->find($params['iddocumento']);
        $docPrim = $this->configuracionHelper->tipoDocumentoByAliasByIdestructutra($this->aliasDocumento, $this->idestructuracomun, $this->idSubsistema);
        $padre = array(
            'numero' => is_null($doc->nrodoc) ? $doc->numeroref : $doc->nrodoc,
            'fecha' => $doc->fechacontable,
            'estado' => $doc->estado,
            'idoperacion' => $doc->idoperacion,
            'observaciones' => $doc->observaciones,
            'denominacion' => $docPrim->denominacion,            
            'tipo' => $docPrim->sigla,
            'entidad' => $this->global->Estructura->denominacion
        );
        
        return array('datos' => $padre );
    }

    /**
     * Funcion para eliminar un documento. Si es el ultimo documento de la entidad lo elimina,
     * sino anula el documento.
     *
     * @param Integer $iddocumento Identificador del documento a eliminar
     */
    public function eliminarDocumento($params)
    {
        $iddocumento = $params['iddocumento'];
        $doc = Doctrine::getTable('DatDocumento')->find($iddocumento);
        $nro = $this->devolverUltimoNumeroDoc($doc->iddoc, $doc->idestructuracomun, $doc->idejercicio);
        if ($doc->numeroref == $nro - 1) {
            Doctrine_Query::create()->delete('DatDocumento')->where('iddocumento = ?', array($iddocumento))->execute();
        } else {
            $this->trazaDocumento->guardarTraza('Documento eliminado', $iddocumento, EstadoDocumentoModel::ESTADO_ELIMINADO);
            $this->estadoModel->setEstadoDocumento($iddocumento, EstadoDocumentoModel::ESTADO_ELIMINADO);
        }
        return true;
    }
    /**
     * Adiciona las mercancia asociados a un documento.
     * @author Yadrian Aguila
     * @return Array
     */
    public function adicionarMovimientos($iddocumento,$datos)
    {
        return $this->getProductoModel()->adicionarMovimientos($iddocumento,$datos);
    }

    /**
     * Devuelve los movimientos de un documento según los criterios de búsqueda especificados.
     * @author Yadrian Aguila
     * @return Array
     */
    public function cargarProductosDocumento($params)
    {
        $query = $this->getProductoModel()->cargarMovimiento($params);
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $params)->fetchArray()
        );
    }

    /**
     * Elimina los movimientos de un documento dado su identificador.
     * @author Yadrian Aguila
     * @return (lo que retorna)
     */
    public function eliminarMovimientos($iddocumento,$idmovimientos)
    {
        return $this->getProductoModel()->eliminarMovimientos($iddocumento,$idmovimientos);
    }
}
