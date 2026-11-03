<?php

/**
 * Clase controladora para gestionar el nomenclador de documentos primarios.
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage Documento/Controllers
 * @copyright  XETID.
 * @version    1.0-0
 */
class PropiedadnomdocumentoController extends ZendExt_Controller_Secure
{
/**
 * Obtiene un nomenclador de documento primario
 * @return void Echo con el nomenclador
 * @throws Exception
 */
    function loadAction()
    {
        try {
            $params['iddocumentos'] = $this->_request->getPost('iddocumentos');
            $result = ConfDocprim::load($params);
            echo(json_encode($result));
        } catch (Exception $exception) {
            throw $exception;
        }
    }
/**
 * Adiciona un nomenclador de documento primario
 * @return void Echo con mensaje de confirmación,-1 adicionó correctamente,-4 no adicionó
 */
    public function newAction()
    {
        $doc = new ConfDocprim();
        $doc->iddocumentos = $this->_request->getPost('iddocumentos');
        $doc->nombre = $this->_request->getPost('nombre');
        $doc->valor = $this->_request->getPost('valor');
        try {
            $doc->save();
            return json_encode(array(
                'success'=> true,
            ));
        } catch (Exception $exception) {
            return json_encode(array(
                'success'=> false,
            ));
        }
    }
/**
 * Modifica un nomenclador de documento primario
 * @return void Echo con mensaje de confirmación
 * @throws ZendExt_Exception
 */
    public function editAction()
    {
            $iddocprim = $this->_request->getPost('iddocprim');
            $objConfDocprim = Doctrine::getTable('ConfDocprim')->find($iddocprim);
            if($objConfDocprim){
                $objConfDocprim->nombre = $this->_request->getPost('nombre');
                $objConfDocprim->valor = $this->_request->getPost('valor');
                try {
                    $objConfDocprim->save();
                    return json_encode(array(
                        'success'=> true,
                    ));
                } catch (Exception $exception) {
                    return json_encode(array(
                        'success'=> false,
                    ));
                }
            } 
            return json_encode(array(
                'success'=> false,
            ));
    }
/**
 * Elimina un nomenclador de documento primario
 * @return void Echo con mensaje de confirmación
 * @throws Exception
 */
    public function removeAction()
    {
        $iddocprim = $this->_request->getPost('iddocprim');
        $objConfDocprim = Doctrine::getTable('ConfDocprim')->find($iddocprim);
        if($objConfDocprim){
            try {
                $objConfDocprim->delete();
                return json_encode(array(
                    'success' => true,
                ));
            } catch (Exception $exception) {
                return json_encode(array(
                    'success' => false,
                ));
            }
        } 
        return json_encode(array(
            'success' => false,
        ));
    }
}
