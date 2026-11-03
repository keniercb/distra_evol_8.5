<?php

/**
 *
 *
 * @author         
 * @package        ERP-PCRM
 * @subpackage     CRM/Clientes/Models/Bussines
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
class CmpgestordocumentalModel extends ZendExt_Model
{
    //private $_solicitud;
    private $_gestordocumental;
    

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_gestordocumental = new GestorDocumentalComunicationInterface();
        $this->idespacio = '145307f4-5b3c-4a0e-a8c1-6347f682df10';
    }

    public function CrearArea($parametros)
    {
        try {
            $a=$this->_gestordocumental->testGD();
            if (!is_a($a, 'Exception')) {
                $idespacio = $this->_gestordocumental->CreateWorkSpace(
                    $this->idespacio, $parametros['idproceso']
                );
                $respuesta= DatEspacioTrabajo::SalvarArea($parametros, $idespacio);
                return $respuesta;
            }
            return "No existe conexión con el gestor documental";
        } catch (Exception $e) {
          print_r($e->getMessage());die;
            throw $e;
        }
    }
    
    public function cargarDocumentos($parametros)
    {
        $respuesta= DatDocEspacioTrabajo::cargarDocumentos($parametros);
        return $respuesta;
    }

    public function adicionarDocumento($parametros)
    {

        $espacio = DatEspacioTrabajo::ExisteArea($parametros);

        if(count($espacio) == 0){
          self::crearArea($parametros);
          $espacio = DatEspacioTrabajo::ExisteArea($parametros);
        }

        try {
            if ($espacio) {
                $a = $this->_gestordocumental->testGD();
                if (!is_a($a, 'Exception')) {
                    $iddocumentogestor = $this->_gestordocumental->saveDocument(
                            $espacio[0]['idareagestor']
                    );
                    $parametros['idespaciotrabajo']=$espacio[0]['idespaciotrabajo'];
                    $respuesta = DatDocEspacioTrabajo::SalvarDocumento($parametros, $iddocumentogestor);
                    return $respuesta;
                }
                return "No existe conexión con el gestor documental";
            }

            
        } catch (Exception $e) {
          print_r($e->getMessage());die;
            throw $e;
        }
    }
    
    public function eliminarDocumento($parametros)
    {
        try {
            $a = $this->_gestordocumental->testGD();
            if (!is_a($a, 'Exception')) {
                $iddocumentogestor = $this->_gestordocumental->delFile(
                        $parametros['iddocumentogestor']
                );
                if ($iddocumentogestor['success'] == true) {
                    $respuesta = DatDocEspacioTrabajo::EliminarDocumento($parametros);
                    return $respuesta;
                }
            }
            return "No existe conexión con el gestor documental";
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function descargarDocumento($parametros)
    {
        try {
                $a = $this->_gestordocumental->testGD();
                if (!is_a($a, 'Exception')) {
                    return $iddocumentogestor = $this->_gestordocumental->getFileReales(
                        $parametros['iddocumentogestor']
                    );
                }
                return "No existe conexión con el gestor documental";        
        } catch (Exception $e) {
            throw $e;
        }
    }
}
