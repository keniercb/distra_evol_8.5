<?php

/**
 * @name NomeventoalimentacionController - Clase controladora del nomenclador de eventos de alimentacion.
 * @package   pvd.personaext
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomeventoalimentacionController extends ZendExt_Controller_Secure
{
    private $request; //Respuesta para enviar a la vista

    /**
     * Constructor de la clase
     */
    function init()
    {
        parent::init();
    }

    /**
     * Constructor de la clase
     */
    function nomeventoalimentacionAction()
    {
        $this->render();
    }

    /**
     * @method obtenerEventoAlimentacion - Devuelve la lista de eventos de alimetacion.
     * @throws Exception
     * @author Orestes Rodríguez Lorenzo.
     */
    function obtenerEventoAlimentacionAction()
    {
        //Obteniendo los parametros enviados desde la vista
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $query = $this->_request->getPost('query');
        //Creando objeto
        $objModel = new NomEventoalimentacionModel();
        //Verificando si el filtro contiene datos
        if ($query != '') {
            $result = $objModel->obtenerEventoAlimentacion($query, $limit, $start);
        } else {
            $result = $objModel->obtenerEventoAlimentacion(null, $limit, $start);
        }
        //Conformando la respuesta
        $this->request->data = $result->data;
        $this->request->quantity = $result->quantity;
        $this->returnRequest();
    }

    /**
     * @method returnRequest - Envia a la vista las respuestas conformadas.
     * @return json
     * @author Orestes Rodríguez Lorenzo.
     */
    function returnRequest()
    {
        echo json_encode($this->request);
    }

    /**
     * @method adicionarEventoAlimentacion - Tramita las funciones para adicionar un evento de alimentacion.
     * @author Orestes Rodríguez Lorenzo.
     */
    function adicionarEventoAlimentacionAction()
    {
        $values = json_decode($this->_request->getPost('values'));
        try {
            if ($values->denominacion != '') {
                $obj->denominacion = $values->denominacion;
            } else {
                throw new Exception("El campo denominacion no puede estar vacio.");
            }
            if ($values->abreviatura != '') {
                $obj->abreviatura = $values->abreviatura;
            } else {
                $obj->abreviatura = null;
            }
            if ($values->descripcion != '') {
                $obj->descripcion = $values->descripcion;
            } else {
                $obj->descripcion = null;
            }
            if ($values->fdesde != '') {
                $fi = explode('/', $values->fdesde);
                $obj->fdesde = $fi[2] . $fi[1] . $fi[0];
            } else {
                throw new Exception("El campo fecha de creacion no puede estar vacio.");
            }
            if ($values->fhasta != '') {
                $ff = explode('/', $values->fhasta);
                $obj->fhasta = $ff[2] . $ff[1] . $ff[0];
            } else {
                $obj->fhasta = null;
            }
            $objModel = new NomEventoalimentacionModel();
            if ($objModel->adicionarEventoAlimentacion($obj)) {
                $this->request->success = true;
                $this->request->mensaje = "El evento de alimentacion ha sido adicionado satisfactoriamente.";
                $this->returnRequest();
            } else {
                $this->request->success = false;
                $this->request->mensaje = "El evento de alimentacion que quiere adicionar ya existe.";
                $this->returnRequest();
            }
        } catch (Exception $e) {
            $this->request->success = false;
            $this->request->mensaje = $e->getMessage();
            $this->request->file = $e->getFile();
            $this->request->linea = $e->getLine();
            $this->returnRequest();
        }
    }

    /**
     * @method modificarEventoAlimentacion - Tramita las funciones para modificar un evento de alimentacion
     * @author Orestes Rodríguez Lorenzo.
     */
    function modificarEventoAlimentacionAction()
    {
        $idnomenclador = $this->_request->getPost('idnomenclador');
        $values = json_decode($this->_request->getPost('values'));
        try {
            $objModel = new NomEventoalimentacionModel();
            $result = $objModel->modificarEventoAlimentacion(
                $idnomenclador, $values->denominacion, $values->abreviatura, $values->descripcion, $values->fdesde,
                $values->fhasta
            );
            if ($result) {
                $this->request->success = true;
                $this->request->mensaje = "El evento de alimentacion ha sido modifcado satisfactoriamente.";
                $this->returnRequest();
            } else {
                $this->request->success = false;
                $this->returnRequest();
            }
        } catch (Exception $e) {
            $this->request->success = false;
            $this->request->mensaje = $e->getMessage();
            $this->request->file = $e->getFile();
            $this->request->linea = $e->getLine();
            $this->returnRequest();
        }
    }

    /**
     * @method eliminarEventoAlimentacion - Tramita las funciones para eliminar un evento de alimentacion
     * @author Orestes Rodríguez Lorenzo.
     */
    function eliminarEventoAlimentacionAction()
    {
        try {
            $arrIds = json_decode($this->_request->getPost('idnomenclador'));
            if (!empty($arrIds) && is_array($arrIds)) {
                //$obj->idnomenclador = $arrIds;
            } else {
                throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
            }
            $objModel = new NomEventoalimentacionModel();
            foreach ($arrIds as $value) {
                $result = $objModel->eliminarEventoAlimentacion($value);
            }
            if ($result) {
                /* $this->request->success = true;
                 $this->request->mensaje = "El documento ha sido eliminado satisfactoriamente.";
                 $this->returnRequest();*/
                if ($result['exception'] == 1) {
                    $this->request->success = false;
                    $this->request->codigo = 23503;
                    $this->request->mensaje = "El evento de alimentación no se podido eliminar porque esta en uso.";
                    $this->returnRequest();
                } else {
                    $this->request->success = true;
                    $this->request->mensaje = "El evento de alimentación ha sido eliminado satisfactoriamente.";
                    $this->returnRequest();
                }
            } else {
                $this->request->success = false;
                $this->request->mensaje = "El evento de alimentación no se puede eliminar.";
                $this->returnRequest();
            }
        } catch (Exception $e) {
            $this->request->success = false;
            $this->request->mensaje = $e->getMessage();
            $this->request->file = $e->getFile();
            $this->request->linea = $e->getLine();
            $this->returnRequest();
        }
        /* try {
             $arrIds = json_decode($this->_request->getPost('idnomenclador'));
             if (!empty($arrIds) && is_array($arrIds)) {
                 $obj->idnomenclador = $arrIds;
             } else {
                 throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
             }
             $objModel = new NomEventoalimentacionModel();
             foreach ($arrIds as $value) {
                 $result = $objModel->eliminarEventoAlimentacion($value);
             }
             if ($result) {
                 $this->request->success = true;
                 $this->request->mensaje = "El evento de alimentacion ha sido eliminado satisfactoriamente.";
                 $this->returnRequest();
             }
         } catch (Exception $e) {
             $this->request->success = false;
             $this->request->mensaje = $e->getMessage();
             $this->request->file = $e->getFile();
             $this->request->linea = $e->getLine();
             $this->returnRequest();
         }*/
    }

    /**
     * @method mostrarReporte - Tramita las funciones para mostrar un reporte de los elementos nomenclados
     * @throws Doctrine_Exception
     * @throws Exception
     * @author Orestes Rodríguez Lorenzo.
     */
    function mostrarReporteAction()
    {
        $formato = $this->_request->getParam('formato');
        $titulo = $this->_request->getParam('titulo');
        $usuario = json_decode($this->_request->getParam('usuario'));
        $fecha = json_decode($this->_request->getParam('fecha'));
        //$params = json_decode($this->_request->getParam('params'));
        $header = json_decode($this->_request->getParam('header'));
        $tiporeporte = $this->_request->getParam('tiporeporte');
        if ($usuario == '1') {
            $usuario = $this->global->Perfil->usuario;
        }
        if ($fecha == '1') {
            $fecha = date("F j, Y, g:i a");
        }
        $nomecladores = NomEventoalimentacion::obtenerEventoAlimentacion();
        $datos = array();
        foreach ($nomecladores as $key => $value) {
            $datos[$key]['numero'] = $key + 1;
            $datos[$key]['denominacion'] = $value['denominacion'];
            $datos[$key]['fdesde'] = $value['fdesde'];
            $datos[$key]['fhasta'] = $value['fhasta'];
            $datos[$key]['descripcion'] = $value['descripcion'];
        }
        if ($tiporeporte == 'listado') {
            ZendExt_IoC_Inter::getInstance()->comun->ExportarReporte(
                $formato, $titulo, $datos, $header, $usuario, $fecha, null
            );
        }
    }
}