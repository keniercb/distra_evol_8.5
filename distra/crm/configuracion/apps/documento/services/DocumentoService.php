<?php

/**
 * Clase servicio de documentos primarios.
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Servicios
 * @subpackage Configuración/Documento
 * @copyright  XETID.
 * @version    1.0-0
 */
class DocumentoService extends ZendExt_Model
{

    /**
     * Constructor de clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->documentos = new DatDocumentoprimModel();
    }

    /**
     * Obtiene los tipos de documentos primarios
     * @return array Tipos de documentos primarios
     */
    public function tipoDocumentos()
    {
        $tipodoc = DatDocumentoprim::TipoDocumentos();
        if (!$tipodoc) {
            return array();
        }
        foreach ($tipodoc as $i => $doc) {
            $tipodoc[$i]['denominacion'] = $doc['NomDocprim']['denominacion'];
            unset($tipodoc[$i]['NomDocprim']);
        }
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($tipodoc);
    }

    /**
     * Obtiene los tipos de documentos primarios por alias
     * @param mixed $alias Alias
     * @param mixed $subsistema Subsistema
     * @return Object Tipos de documentos primarios
     */
    public function tipoDocumentosByAlias($alias, $subsistema = 0, $idestructura = 0)
    {
        if ($subsistema == 0) {
            $subsistema = $this->global->Subsistema->idsubsistema;
        }
        $idestructurasubsist = $this->integrator->datosmaestros->encuentraIdestructurasubsist($subsistema, $idestructura);
        $doc = DatDocumentoprim::BuscarPorAlias($idestructurasubsist, $alias);
        if ($doc[0]['iddoc']) {
            $doc[0]['denominacion'] = $doc[0]['NomDocprim']['denominacion'];
            $doc[0]['abreviatura'] = $doc[0]['NomDocprim']['abreviatura'];
            $doc[0]['concepto'] = $doc[0]['NomDocprim']['concepto'];
            $doc[0]['codigo'] = $doc[0]['NomDocprim']['codigo'];
            unset($doc[0]['NomDocprim']);
        }
        if (!$doc) {
            return new stdClass();
        }
        return ZendExt_ClassStandard::Object($doc);
    }

    /**
     * Obtiene los tipos de documentos primarios por alias e identificador de estructura
     * @param mixed $alias Alias
     * @param mixed $idestructura Identificador de estructura
     * @param mixed $subsistema Subsistema
     * @return Object Tipos de documentos primarios
     */
    public function tipoDocumentoByAliasByIdestructutra($alias, $idestructura, $subsistema = 0)
    {
        if ($subsistema == 0) {
            $subsistema = $this->global->Subsistema->idsubsistema;
        }
        $idestructurasubsist = $this->integrator->datosmaestros->encuentraIdestructurasubsistByIdestructura(
                $subsistema, $idestructura
        );
        $doc = DatDocumentoprim::BuscarPorAlias($idestructurasubsist, $alias);
        if ($doc[0]['iddoc']) {
            $doc[0]['denominacion'] = $doc[0]['NomDocprim']['denominacion'];
            $doc[0]['abreviatura'] = $doc[0]['NomDocprim']['abreviatura'];
            $doc[0]['concepto'] = $doc[0]['NomDocprim']['concepto'];
            $doc[0]['codigo'] = $doc[0]['NomDocprim']['codigo'];
            unset($doc[0]['NomDocprim']);
        }
        if (!$doc) {
            return new stdClass();
        }
        return ZendExt_ClassStandard::Object($doc);
    }

    /**
     * Obtiene identificador de documento por su alias
     * @param mixed $aliascat Alias
     * @param mixed $subsistema Subsistema
     * @return mixed Identificador de documento
     */
    public function idDocumentoPorAlia($aliascat, $subsistema = 0, $idestructura = 0)
    {
        if ($subsistema == 0) {
            $subsistema = $this->global->Subsistema->idsubsistema;
        }
        $idestructurasubsist = $this->integrator->datosmaestros->encuentraIdestructurasubsist($subsistema, $idestructura);
        $doc = DatDocumentoprim::BuscarIdDocumentoPorAlia($aliascat, $idestructurasubsist);
        return $doc[0]['iddoc'];
    }

    /**
     * Obtiene tipos de documentos por su categoría
     * @param mixed $aliascat Alias
     * @param mixed $entidad Entidad
     * @param mixed $subsistema Subsistema
     * @param mixed $whereIn Par\xE1metro de consulta SQL
     * @param mixed $whereNotIn Par\xE1metro de consulta SQL
     * @return array Documentos primarios
     */
    public function tipoDocumentosPorCategoria($aliascat, $entidad = 0, $subsistema = 0, $whereIn = 0, $whereNotIn = 0)
    {
        if ($subsistema == 0) {
            $subsistema = $this->global->Subsistema->idsubsistema;
        }
        $idestructurasubsist = $this->integrator->datosmaestros->encuentraIdestructurasubsist($subsistema, $entidad);
        $xml = ZendExt_FastResponse::getXML("categoriadoc");
        $aliasdoc = $xml->$aliascat;
        $cadal = array();
        $i = 0;
        if ($aliasdoc) {
            foreach ($aliasdoc->children() as $doc) {
                $cadal[] = (string) $doc['alias'];
            }
        }
        $doc = DatDocumentoprim::BuscarCategoriaPorAlias($cadal, $idestructurasubsist, $whereIn, $whereNotIn);
        foreach ($doc as $i => $docc) {
            $doc[$i]['denominacion'] = $docc['NomDocprim']['denominacion'];
            $doc[$i]['abreviatura'] = $docc['NomDocprim']['abreviatura'];
            $doc[$i]['concepto'] = $docc['NomDocprim']['concepto'];
            $doc[$i]['codigo'] = $docc['NomDocprim']['codigo'];
            unset($doc[$i]['NomDocprim']);
        }
        if (!$doc) {
            return array();
        }
        $classstandard = new ZendExt_ClassStandard();
        $result = $classstandard->ArrayObject($doc);
        return $result;
    }

    /**
     * Obtiene tipos de documentos por su categoría e identificador de estructura
     * @param mixed $aliascat Alias
     * @param mixed $entidad Entidad
     * @param mixed $subsistema Subsistema
     * @return array Documentos primarios
     */
    public function tipoDocumentoPorCategoriaByIdestructutra($aliascat, $entidad = 0, $subsistema = 0)
    {
        if ($subsistema == 0) {
            $subsistema = $this->global->Subsistema->idsubsistema;
        }
        $idestructurasubsist = $this->integrator->datosmaestros->encuentraIdestructurasubsistByIdestructura(
                $subsistema, $entidad
        );
        $xml = ZendExt_FastResponse::getXML("categoriadoc");
        $aliasdoc = $xml->$aliascat;
        $cadal = array();
        $i = 0;
        if ($aliasdoc) {
            foreach ($aliasdoc->children() as $doc) {
                $cadal[] = (string) $doc['alias'];
            }
        }
        $doc = DatDocumentoprim::BuscarCategoriaPorAlias($cadal, $idestructurasubsist);
        foreach ($doc as $i => $docc) {
            $doc[$i]['denominacion'] = $docc['NomDocprim']['denominacion'];
            $doc[$i]['abreviatura'] = $docc['NomDocprim']['abreviatura'];
            $doc[$i]['concepto'] = $docc['NomDocprim']['concepto'];
            $doc[$i]['codigo'] = $docc['NomDocprim']['codigo'];
            unset($doc[$i]['NomDocprim']);
        }
        if (!$doc) {
            return array();
        }
        $classstandard = new ZendExt_ClassStandard();
        $result = $classstandard->ArrayObject($doc);
        return $result;
    }

    /**
     * Obtiene tipos de documentos por su identificador
     * @param mixed $iddocumento Identificador de documento
     * @return stdClass Documentos primarios
     */
    public function tipoDocumentosById($iddocumento)
    {
        $doc = DatDocumentoprim::BuscarPorId($iddocumento);
        $tipoDoc = new stdClass();
        if ($doc[0]['iddoc']) {
            $doc[0] = $doc[0]->toArray();
            $tipoDoc = new stdClass();
            $tipoDoc->iddoc = $doc[0]['iddoc'];
            $tipoDoc->version = $doc[0]['version'];
            $tipoDoc->iddocumentos = $doc[0]['iddocumentos'];
            $tipoDoc->idestructurasubsist = $doc[0]['idestructurasubsist'];
            $tipoDoc->sigla = $doc[0]['sigla'];
            $tipoDoc->denominacion = $doc[0]['NomDocprim']['denominacion'];
            $tipoDoc->abreviatura = $doc[0]['NomDocprim']['abreviatura'];
            $tipoDoc->concepto = $doc[0]['NomDocprim']['concepto'];
            $tipoDoc->codigo = $doc[0]['NomDocprim']['codigo'];
        }
        return $tipoDoc;
    }

    /**
     * Obtiene los documentos como resultado de un "InnerJoin" entre "DatDocumentoprim" y "NomDocprim"
     * @param mixed $query Consulta SQL
     * @param mixed $alias Alias
     * @return mixed Resultado de la consulta
     */
    public function innerJoinDocumentoPrim($query, $alias)
    {
        return $query->addSelect(
                        'ndp.denominacion as tipodoc,ndp.abreviatura as abreviatura,ndp.concepto as concepto,
             ndp.codigo as codigodoc,dp.iddoc as iddocp'
                )->innerJoin("$alias.DatDocumentoprim dp")->innerJoin("dp.NomDocprim ndp");
    }

    /**
     * Obtiene los documentos por subsistema y entidad
     * @param mixed $subsistema Subsistema
     * @param mixed $idestructura Identificador de estructura
     * @param array $filter Condiciones
     * @return array Documentos
     */
    public function documentosPorSubsistemaEntidad($subsistema = 0, $idestructura = 0, $filter = array())
    {
        if ($subsistema == 0) {
            $subsistema = $this->global->Subsistema->idsubsistema;
        }
        $idestructurasubsist = $this->integrator->datosmaestros->encuentraIdestructurasubsistByIdestructura(
                $subsistema, $idestructura
        );
        if (!empty($filter)) {
            $filter2 = $filter;
        }
        $filter2['subsistemas'] = $idestructurasubsist;
        $docs = DatDocumentoprim::buscar($filter2);
        $final = array();
        $i = 0;
        foreach ($docs['datos'] as $doc) {
            $final[$i]['iddoc'] = $doc['iddoc'];
            $final[$i]['denominacion'] = $doc['NomDocprim']['denominacion'];
            $final[$i]['codigo'] = $doc['NomDocprim']['codigo'];
            $final[$i]['iddocumentos'] = $doc['NomDocprim']['iddocumentos'];
            $final[$i]['sigla'] = $doc['sigla'];
            $final[$i++]['concepto'] = $doc['NomDocprim']['concepto'];
        }
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($final);
    }

    /**
     * Adiciona documentos primarios
     * @param mixed $subsistema Subsistema
     * @param mixed $docs Documentos
     * @return void
     */
    public function insertarDocumentosAEntidad($subsistema, $docs, $idestructura = 0)
    {
        $estrucsubsis = $this->integrator->datosmaestros->encuentraIdestructurasubsist($subsistema, $idestructura);
        if (count($docs)) {
            $docprimModel = new DatDocumentoprimModel();
            foreach ($docs as $id) {
                $docprim = new DatDocumentoprim();
                $docprim->idestructurasubsist = $estrucsubsis;
                $docprim->iddocumentos = $id;
                $docprim->version = 0;
                $docprimModel->insertarDatDocumentoprim($docprim);
            }
        }
    }

    /**
     * Obtiene nomencladores de documentos
     * @return mixed Nomencladores
     */
    public function obtenerNomdocs()
    {
        return NomDocprim::buscar();
    }

    /**
     * Obtiene un documento primario por su identificador
     * @param mixed $iddocprim Identificador de documento primario
     * @return Object Documento
     */
    public function obtenerDocumentoPrimPorId($iddocprim)
    {
        $doc = DatDocumentoprim::BuscarDocumentoPrimPorId($iddocprim);
        $standard = new ZendExt_ClassStandard();
        return $standard->Object($doc);
    }
    /**
     * Obtiene un documento primario por su identificador
     * @param mixed $agIddocumento Identificador de documento primario
     * @return Object Documento
     */
    public function obtenerNomDocPrimPorId($agIddocumento)
    {
        $doc = NomDocprim::buscarnomdoc(array('iddocumentos' => $agIddocumento));
        return (count($doc)) ? $doc['datos'] : array();
    }

    /**
     * Obtiene un identificador de documento primario por el identificador de nomenclador de documento
     * @param mixed $identidad Identificador de entidad
     * @param mixed $idsubsistema Identificador de subsistema
     * @param mixed $iddocnom Identificador de nomenclador de documento
     * @return mixed Identificador
     */
    public function obtenerIdDocPorIdDocNom($identidad, $idsubsistema, $iddocnom)
    {
        $estructurasubsist = $this->integrator->datosmaestros->buscarInstancia($identidad, $idsubsistema);
        $id = DatDocumentoprim::ObtenerIdDocPorIdDocNom($estructurasubsist->idestructurasubsist, $iddocnom);
        return $id;
    }

    /**
     * Obtiene documentos primarios por subsistema
     * @param mixed $subsistema Subsistema
     * @param mixed $filter Condiciones
     * @return array Documentos
     */
    public function documentosPorSubsistema($subsistema = 0, $filter = array(), $idestructura = 0)
    {
        if ($subsistema == 0) {
            $subsistema = $this->global->Subsistema->idsubsistema;
        }
        $idestructurasubsist = $this->integrator->datosmaestros->encuentraIdestructurasubsist($subsistema, $idestructura);
        if (!$filter) {
            $filter = array();
        }
        $filter['idestructurasubsist'] = $idestructurasubsist;
        $docs = DatDocumentoprim::buscar($filter);
        $final = array();
        $i = 0;
        foreach ($docs['datos'] as $doc) {
            $final[$i]['iddoc'] = $doc['iddoc'];
            $final[$i]['denominacion'] = $doc['NomDocprim']['denominacion'];
            $final[$i]['codigo'] = $doc['NomDocprim']['codigo'];
            $final[$i]['iddocumentos'] = $doc['NomDocprim']['iddocumentos'];
            $final[$i++]['concepto'] = $doc['NomDocprim']['concepto'];
        }
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($final);
    }

    /**
     * Obtiene un subsistema por el identificador de un documento primario
     * @param mixed $iddoc Identificador de documento primario
     * @return mixed Identificador de subsistema
     */
    public function obtenerSubsistPorIdDoc($iddoc)
    {
        $datDocumentoprim = DatDocumentoprim::BuscarPorId($iddoc);
        $idestructurasubsist = $datDocumentoprim[0]['idestructurasubsist'];
        $ids = $this->integrator->datosmaestros->buscarSubsistemaEntidad($idestructurasubsist);
        return $ids->idsubsistema;
    }

    /**
     * Obtiene la cantidad de documentos primarios
     * @return mixed Cantidad de documentos primarios
     */
    public function cantidadDocumentoPrimarioIn()
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $idEstructura = $global->Estructura->idestructura;
        return $this->integrator->datosmaestros->cantidadDocumentoPrimarioIn($idEstructura);
    }

    /**
     * Obtiene documentos primarios por par\xE1metros
     * @param mixed $idsubsistema Identificador de subsistema
     * @param mixed $idEstructura Identificador de estructura
     * @return mixed Documentos primarios
     */
    public function getDocPrimByParams($idsubsistema, $idEstructura)
    {
        $idestructurasubsist = $this->integrator->datosmaestros->encuentraIdestructurasubsistByIdestructura(
                $idsubsistema, $idEstructura
        );
        $docs = DatDocumentoprim::GetDocsPrim($idestructurasubsist);
        return $docs;
    }

    /**
     * Obtener los datos de un documento primario del nomenclador dado su c&oacute;digo.
     * @param numerosletras $argCodigoNomDocPrim C&oacute;digo del documento nomenclado.
     * @return array Datos del documento.
     */
    public function obtenerDocumentoPorCodigo($argCodigoNomDocPrim){
        $result = NomDocprim::buscardocparam(array('codigo' => $argCodigoNomDocPrim));
        return $result['datos'];
    }

    /**
     * Obtiene documentos primarios por par\xE1metros
     * @param mixed $params arreglo de parametros
     * @return mixed Documentos primarios
     */
    public function getDocumentsByParams($params)
    {
        $result = NomDocprim::buscardocparam($params);
        return $result['datos'];
    }

}
