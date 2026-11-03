<?php

class GestcamposController extends ZendExt_Controller_Secure
{
    private $_relationModel;
    private $_campoModel;
    private $_tablaModel;
    private $_tablaDomain;

    function init()
    {
        parent:: init();
        $this->_relationModel = new ZendExt_Metadata_Models_RelacionModel();
        $this->_campoModel = new ZendExt_Metadata_Models_CampoModel();
        $this->_tablaModel = new ZendExt_Metadata_Models_TablaModel();
        $this->_tablaDomain = new DatTabla();
    }

    function cargarcamposAction()
    {
        $idtabla = $this->_request->getPost('idtabla');
        $data = $this->_campoModel->cargarCampos($idtabla);
        echo json_encode($data);
    }

    function cargarcmbcamposAction()
    {
        $idtabla = $this->_request->getPost('idtabla');

        $data = $this->_campoModel->cargarCampos($idtabla);
        echo json_encode($data);
    }

    function cargartdatosAction()
    {
        $data = new stdClass();
        $data->data = $this->_campoModel->cargarTiposDatos();
        $data->total = sizeof($data->data);

        echo json_encode($data);
    }

    function adicionarcamposAction()
    {
        $denominacion = $this->_request->getPost('denominacion');
        $tipodato = $this->_request->getPost('idtipodato');
        $longitud = $this->_request->getPost('longitud');
        $idtabla = $this->_request->getPost('idtabla');

        try {
            $variable = ($this->_request->getPost('permite_nulo') == 'on') ? 0
                : 1;
            if ($this->_campoModel->adicionarCampo(
                $denominacion, $idtabla, $tipodato,
                $variable, $longitud,
                $this->_request->getParams()
            )
            ) {

                echo json_encode(
                    array('cod' => 1, 'mensaje' => 'El campo ha sido adicionado satisfactoriamente.', 'success' => true)
                );
            }
        } catch (ZendExt_Exception $ex) {
            $this->showMessage('El campo que quiere adicionar ya existe.');
        }
    }

    function eliminarcamposAction()
    {
        $idcampo = $this->_request->getPost('idcampo');
        if ($this->_campoModel->eliminarCampo($idcampo)) {
            $this->showMessage(
                'El campo ha sido eliminado satisfactoriamente.'
            );
        }
    }

    function cargarcampostablaAction()
    {
        echo json_encode(
            array('data' => $this->_campoModel->cargarCamposTabla(
                $this->_request->getPost('idtabla')
            ))
        );
    }

    function obtenercamposparaordenarAction()
    {
        echo json_encode($this->_campoModel->obtenerCamposConRepresentacion($this->_request->getPost('idtabla')));
    }

    function obtenercamposconrepresentacionAction()
    {
        $fields = $this->_campoModel->obtenerCamposConRepresentacion(
            $this->_request->getPost('idtabla')
        );
        $etiquetas = array();
        foreach ($fields as $field) {
            $etiqueta = array();
            $etiqueta['idcampo'] = $field['idcampo'];
            $etiqueta['etiqueta'] = $field['DatComponente']['etiqueta'];
            $etiquetas[] = $etiqueta;
        }
        echo json_encode(
            array("data"  => $etiquetas,
                  "total" => count($etiquetas)
            )
        );

    }

    function ordenarcamposAction()
    {
        $orden = json_decode(stripslashes($this->_request->getPost('orden')));
        $this->_campoModel->ordenarCampos($orden);
    }

}