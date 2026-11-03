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
class BloqueoFacturaModel extends BaseModel
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
        parent::__construct();
        $this->parent = $parent;
        $this->idusuario = $this->global->Perfil->idusuario;
        $this->idestructuracomun = $this->global->Estructura->idestructura;
    }

    /**
     * Acción para bloquear un documento
     * @params $iddocumento Identificador de documento
     *
     * @return Valor booleano(true o false)
     */
    public function bloquearDocumento($iddocumento)
    {
        if ($iddocumento == -1) {
            return true;
        }
        $bloqueado = $this->comprobarBloqueo($iddocumento);

        if ($bloqueado == 1) {
            $docBloqueado = new DatBloqueo();
            $datosBloq['idestructuracomun'] = $this->idestructuracomun;
            $datosBloq['iddocumento'] = $iddocumento;
            $datosBloq['idusuario'] = $this->idusuario;
            $datosBloq['fecha'] = date("y-m-d");
            $docBloqueado->synchronizeWithArray($datosBloq);
            $docBloqueado->save();

            return true;
        } else {
            if ($bloqueado == 2) {
                return true;
            } else {
                return false;
            }
        }
    }

    /**
     * Acción para comprobar si un documento está bloqueado
     * @params $iddocumento Identificador de documento
     *
     * @return Valor entero (1-3)
     */
    public function comprobarBloqueo($iddocumento)
    {
        $query = new Doctrine_Query();
        $query->select('bloq.idbloqueo as idbloqueo')
            ->from('DatBloqueo bloq')
            ->where("bloq.iddocumento = {$iddocumento}");
        $bloqueado = $query->count();
        if ($bloqueado == 0) {
            return 1;
        } else {
            $query->andWhere("bloq.idusuario = {$this->idusuario}");
            $mismoUser = $query->fetchArray();
            if ($mismoUser != null) {
                return 2;
            } else {
                return 3;
            }
        }
    }

    /**
     * Acción para desbloquear los documentos seleccionados por el usuario
     * @params $arrayIdbloqueos Arreglo de identificadores de documentos
     *
     * @return true
     */
    public function desbloquearDocumetos($arrayIdbloqueos, $alias = null)
    {
        $query = new Doctrine_Query();
        $query->delete()->from('DatBloqueo bloq');
        if (count($arrayIdbloqueos)) {
            $query->whereIn('bloq.idbloqueo', $arrayIdbloqueos)
                ->orWhereIn('bloq.iddocumento', $arrayIdbloqueos)->execute();
            $this->doctrineHelper->getConnection()->execute(
                "update mod_logistica.dat_documento set uuidflag = null 
                     where iddocumento in (".implode(',',$arrayIdbloqueos).")"
            );
        } else {
            $params = array();
            $iddoc = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura($alias,
                $this->global->Estructura->idestructura);
            if ($iddoc->iddoc) {
                $params['iddoc'] = $iddoc->iddoc;
            }
            $docs = $this->devolverDocBloqueados($params);
            $bloqueos = LogisticaObjectHelper::__init()->extractValueFromArrayColumn($docs['datos'], 'idbloqueo');
            if (count($bloqueos)) {
                $this->desbloquearDocumetos($bloqueos);
            }
            $this->doctrineHelper->getConnection()->execute(
                "update mod_logistica.dat_documento set uuidflag = null 
                     where uuidflag is not null"
                );
        }
        return true;
    }

    /**
     * Acción para obtener los identificadores de los documentos bloqueados
     * @params $arrayIdbloqueos Arreglo de identificadores de documentos
     *
     * @return true
     */
    public function obtenerIdDocs($arrayIdbloqueos)
    {
        $query = new Doctrine_Query();
        $query->select('bloq.iddocumento as iddocumento')
            ->from('DatBloqueo bloq')
            ->whereIn('bloq.idbloqueo', $arrayIdbloqueos);
        $ids = $query->fetchArray();
        $result = array();
        foreach ($ids as $row) {
            $result[] = $row['iddocumento'];
        }
        return $result;
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
        /*if(!$parametros['iddoc']){
            $iddocs = array();
            $iddocs = array_merge($iddocs, $this->configuracionHelper->getDocumentosPorSubsistema(10));
            $iddocs = array_merge($iddocs,$this->configuracionHelper->getDocumentosPorSubsistema(11));
            $iddocs = array_merge($iddocs,$this->configuracionHelper->getDocumentosPorSubsistema(13));
            $parametros['iddoc'] = $this->objectHelper->extractValueFromArrayColumn($iddocs,'iddoc');
        }*/
        $sql = "select dd.iddocumento as idbloqueo,df.nrofactura as nrodoc, ndp.denominacion as tipodocumento, us.nombreusuario as usuario,
                dd.fechacontable as fechacontable, COUNT(*) OVER() as total, dd.idusuario, dd.iddoc
                from mod_logistica.dat_documento dd
                inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
                inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos  
                inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
                inner join mod_seguridad.seg_usuario us on us.idusuario = dd.idusuario
                where dd.idestructuracomun = {$this->idestructuracomun} and dd.uuidflag is not null 
                offset {$parametros['start']} limit {$parametros['limit']}";
        $respuesta = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'cantidad' => (count($respuesta) ? $respuesta[0]['total'] : 0),
            'datos' => $respuesta
        );
    }

}
