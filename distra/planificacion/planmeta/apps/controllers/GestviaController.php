<?php

class GestviaController extends ZendExt_Controller_Secure
{

    /**
     * funcion init()
     * Para inicializar el modulo
     * */
    function init()
    {
        parent::init();
    }

    public function gestviaAction()
    {
        $this->render();
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        //$this->view->jsayuda = $jsayuda;
        $this->render();
    }

    public function cargarviaadquisicionAction()
    {

        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos['field'] == 'denominacion') {
                    $parametros ['denominacion'] = $datos ['data'] ['value'];
                } else {
                    if ($datos['field'] == 'descripcion') {
                        $parametros['descripcion'] = $datos ['data'] ['value'];
                    }
                }
            }
        }
        $start = $this->_request->getParam('start');
        $limit = $this->_request->getParam('limit');
        $response = NomViaadquisicion::listarVA($parametros, $start, $limit);
        $total = NomViaadquisicion::total($parametros);
        echo json_encode(array('data' => $response, 'total' => $total));
    }

    public function cargardatosviaadquisicionAction()
    {
        $idvia = $this->_request->getParam('idselected');
        $response = NomViaadquisicion::ObtenerViaAporId($idvia);
        echo json_encode($response);
    }

    public function insertupdateviaadquisicionAction()
    {
        $idvia = $this->_request->getParam('idviaadquisicion');
        $denominacion = $this->_request->getParam('denominacion');
        $descripcion = $this->_request->getParam('descripcion');
        $color = $this->_request->getParam('color');
        $viaPrimero = new NomViaadquisicion();
        if ($idvia) {
            $existe = NomViaadquisicion::existeDenominacionModificar(
                $denominacion, $idvia
            );
            if (empty($existe[0])) {
                $viaPrimero = Doctrine::getTable('NomViaadquisicion')->find($idvia);
                $viaPrimero->color = $color;
                $viaPrimero->denominacion = $denominacion;
                $viaPrimero->descripcion = $descripcion;
                $viaPrimero->uriviaadquisicion = strtolower(
                    str_replace(' ', '', $denominacion)
                );
                $idvia = NomViaadquisicionModel::insertarnom_viaadquisicion(
                    $viaPrimero
                );
                $idvia = 'mod';
            } else {
                $idvia = -3;
            }
        } else {

            $luzverde = NomViaadquisicion::obtenerPordenom($denominacion);
            if (empty($luzverde[0])) {
                $viaPrimero->color = $color;
                $viaPrimero->denominacion = $denominacion;
                $viaPrimero->descripcion = $descripcion;
                $viaPrimero->uriviaadquisicion = strtolower(
                    str_replace(' ', '', $denominacion)
                );
                $idvia = NomViaadquisicionModel::insertarnom_viaadquisicion(
                    $viaPrimero
                );
                $idvia = 'add';
            } else {
                $idvia = -1;
            }
        }
        echo json_encode(array('cod' => $idvia));
    }

    function eliminarviaadquisicionAction()
    {
        $idsviaadquisicions = json_decode(
            stripslashes($this->_request->getParam('todelete'))
        );
        $res = NomViaadquisicionModel::eliminarViaadquisicions(
            $idsviaadquisicions
        );
        echo json_encode(array('cod' => $res));
    }

}