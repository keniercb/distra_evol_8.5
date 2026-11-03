<?php

class DocumentoActivoService extends ZendExt_Model
{

    protected $_docModel;
    private $idsubsistema;

    public function __construct($idsubsistema = LogisticaGlobal::SUBSISTEMA_AFT)
    {
        parent::ZendExt_Model();
        $this->idsubsistema = $idsubsistema;
        $this->_docModel = new DocumentoActivoModel($this->idsubsistema);
    }

    public function getDocActivosPendientes($parametros = array())
    {
        return $this->_docModel->getDocumentosActivos($parametros);
    }

    /*
     * Devuelve los documentos dado el arreglo de filtros
     * $parametros = array(
      'codigooperacion' => 'OPER_APERTURA',
      'idestado' => 2
      );
     * */

    public function obtenerDocumentos($parametros)
    {   
        return $this->_docModel->getDocumentos($parametros);
    }

    /*
     * Aprueba Documento
     * */

    public function aprobarDocumento($iddocumento, $idoperacion, $identidad, $observacion = "")
    {
        $objGesDocModelo = DocumentoActivoFactory::getInstance($idoperacion, $this->idsubsistema);
        $estado = $objGesDocModelo->aprobarDocumento(
            $iddocumento, $idoperacion, $observacion, $identidad
        );
        $historialRNEstadosModel = new HisRegNumericoEstatusModel();
        $historialRNEstadosModel->guardarHistorialRegNumEstatus($iddocumento);


        $arr = array();
        if ($estado) {
            $arr['success'] = true;
            $arr['estado'] = 'Aprobado';
            $arr['idestado'] = 3;
        } else {
            $arr['failure'] = true;
            $arr['Cod'] = 3;
        }
        return $arr;
    }

    public function aprobarAperturasCierre($idestructura) {
        $sql1 = "
            UPDATE 
                mod_logistica.dat_documento
            SET 
                nrodoc = numeroref,
                observaciones = 'Documento aprobado desde el cierre de la apertura',
                aprobadopor = idusuario,
                estado = 3
            WHERE 
                iddocumento in (
                    select d.iddocumento
                    from mod_logistica.dat_documento d
                    inner join mod_datosmaestros.dat_documentoprim dprim on dprim.iddoc = d.iddoc
                    inner join mod_datosmaestros.dat_estructurasubsist estsub on estsub.idestructurasubsist = dprim.idestructurasubsist
                    where 
                        estsub.idestructuracomun = $idestructura and estsub.idsubsistema = 11
                    )
            ";

        $sql2 = "
            UPDATE mod_logactivofijotangible.dat_regnumericoactivo  
            SET idestadoperacion = 1 
            WHERE idregnumerico in (
                select rn.idregnumerico
                from mod_logactivofijotangible.dat_registronumerico rn
                inner join mod_logistica.dat_producto p on p.idproducto = rn.idproducto
                where p.idestructuracomun = $idestructura
            );
        ";

        $conn1 = Zend_Registry::get('conexion');
        $conn1->execute($sql1);
        
        $conn2 = Zend_Registry::get('conexion');
        $conn2->execute($sql2);
    }

    /*
     * 
     * @param $idusuario
     * @param $arrDatosDocumetos - Arreglo asociativo con los datos adicionales del documento segun el tipo de operacion
     * @param $idregistronumerico
     * */
    public function crearDocumentoEnvRepAutomatico($idusuario, $arrDatosDocumetos, $idregistronumerico)
    {
        $codigoOperacion = "OPER_REPGENERAL";
        $docEnvReparar = new DocEnviadoRepararModel();
        return $docEnvReparar->crearDocumentoEnvRepAutomatico(
            $codigoOperacion, $idusuario, $arrDatosDocumetos, $idregistronumerico
        );
    }
    
    public function addDocDeEnviadoReparar($parametros){        
        $docEnvReparar = new DocEnviadoRepararModel();
        return $docEnvReparar->addDocDeEnviadoReparar($parametros);
    }

    public function eliminarDocEnvRepAutomatico($iddocumento){
        $docEnvReparar = new DocEnviadoRepararModel();
        return $docEnvReparar->eliminarDocEnvRepAutomatico($iddocumento);
    }
    
    /*
     * Servicio para cargar las operaciones de venta y alquiler para la facturacion
     * 
     * */
    
    public function getOperVentaAlquiler(){
        return $this->_docModel->cargarTipoDocVentaAlquiler();
    }
    
    
    /*
     * Servicio que devuelve los documentos de baja venta aprobados
     * */
    public function getDocsBajaVentaDadoIdOperacion($idoperacion){
        $docBajaVentaModel = new DocBajaVentaModel();
        return $docBajaVentaModel->getDocVentaAlquiler($idoperacion);
    }


    /*
         * Servicio que devuelve los medios con sus registros numericos dado  un arreglo de documentos
         * */
    public function getMediosDocumentos($documentos)
    {
        return $this->_docModel->getMediosRegistrosDocumento($documentos);
    }
    /*Crea un documento a partir de una operacion especifica
     * codigooperacion
     * 
     * 
     *   */
    public function getAddDocPorOperacion($parametros){
        $obj = new DocEntregaTemporalModel();
        return $obj->addDocDeEntregaTemporal($parametros);
    }
    
    public function generarDocumento($parametros){
        return $this->_docModel->generarDocumento($parametros);
    }
}
